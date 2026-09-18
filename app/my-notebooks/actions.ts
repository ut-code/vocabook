"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ExcelParseError, parseExcelWorkbook } from "@/lib/excel";
import { normalizeCardData, type CardData } from "@/lib/card-data";
import { normalizeColumns } from "@/lib/notebook-columns";

export type FormState = { error?: string };

function readCardData(columns: string[], formData: FormData): CardData {
  const head = String(formData.get("head") ?? "").trim();
  const bodyColumns = columns.slice(1);

  // 各列につき、`cell:列名:0`, `cell:列名:1`, ... という連番の入力欄を
  // 存在する分だけ読み取る（CardFieldsForm側は必ず0番から連番でレンダリングする）。
  // 空文字の値は保存しない
  const cells: Record<string, string[]> = {};
  for (const column of bodyColumns) {
    const values: string[] = [];
    let i = 0;
    while (formData.has(`cell:${column}:${i}`)) {
      const value = String(formData.get(`cell:${column}:${i}`) ?? "").trim();
      if (value !== "") values.push(value);
      i += 1;
    }
    if (values.length > 0) cells[column] = values;
  }

  return { head, cells };
}

// Excelファイルから新しい単語帳を作成する
export async function importNotebookFromExcel(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  //　タイトルが欠けている場合をはじく
  if (!title) {
    return { error: "単語帳のタイトルを入力してください。" };
  }
  // ファイルサイズが0の場合をはじく
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Excelファイル（.xlsx）を選択してください。" };
  }

  // Excelを解析（1行目=列名、2行目以降=単語データに変換）。
  // 解析に失敗した場合はエラーメッセージをフォームに戻す（それ以外の例外は再送出）
  let parsed;
  try {
    parsed = await parseExcelWorkbook(await file.arrayBuffer());
  } catch (error) {
    if (error instanceof ExcelParseError) {
      return { error: error.message };
    }
    throw error;
  }

  // Notebook本体とCard群を1回のPrisma呼び出しでまとめて作成する（ネストwrite）。
  // position には行の並び順（Excelの出現順）をそのままインデックスとして採番する
  const notebook = await prisma.notebook.create({
    data: {
      title,
      userId: user.id,
      columns: parsed.columns,
      cards: {
        // data：その行の見出し語・意味などの情報
        // position：Excel内の行の並び順として採番
        create: parsed.rows.map((data, index) => ({ data, position: index })),
      },
    },
  });

  // 単語帳一覧ページのキャッシュを無効化し、新しく作った単語帳を一覧に反映
  revalidatePath("/my-notebooks");
  // 作成された単語帳の詳細ページへ自動的に遷移
  redirect(`/my-notebooks/${notebook.id}`);
}

// 単語帳を削除する（中の単語もまとめて削除される）
export async function deleteNotebook(notebookId: string) {
  const user = await requireUser();

  await prisma.notebook.delete({ where: { id: notebookId, userId: user.id } });
  revalidatePath("/my-notebooks");
  redirect("/my-notebooks");
}

// 単語帳に単語を1件、手動で追加する
export async function createCard(
  notebookId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { columns: true },
  });
  const columns = normalizeColumns(notebook.columns);
  const data = readCardData(columns, formData);

  if (!data.head) {
    return { error: "見出し語を入力してください。" };
  }

  // 新規カードは常に末尾に追加する。既存カードの最大positionを調べ、+1した値を採番する。
  // カードが1件も無ければ _max.position は null になるので -1 を基点として扱う（結果0番になる）
  const last = await prisma.card.aggregate({
    where: { notebookId },
    _max: { position: true },
  });

  await prisma.card.create({
    data: { notebookId, data, position: (last._max.position ?? -1) + 1 },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  return {};
}

// 単語帳内の単語を1件、編集する
export async function updateCard(
  cardId: string,
  notebookId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { columns: true },
  });
  const columns = normalizeColumns(notebook.columns);
  const data = readCardData(columns, formData);

  if (!data.head) {
    return { error: "見出し語を入力してください。" };
  }

  await prisma.card.update({
    where: { id: cardId, notebookId },
    data: { data },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  return {};
}

// 全カードのデータを取得し、変換関数を適用してまとめて保存するヘルパー。
// 列の追加・変更に伴うデータ移行はすべてこの形で行う
async function migrateAllCards(
  notebookId: string,
  newColumns: string[],
  transform: (data: CardData) => CardData,
) {
  const cards = await prisma.card.findMany({ where: { notebookId }, select: { id: true, data: true } });

  await prisma.$transaction([
    prisma.notebook.update({ where: { id: notebookId }, data: { columns: newColumns } }),
    ...cards.map((card) => {
      const data = transform(normalizeCardData(card.data));
      return prisma.card.update({ where: { id: card.id }, data: { data } });
    }),
  ]);
}

// 単語帳の末尾に列（意味・発音などの列）を1つ追加する。
// 新設列は既存カードのどのデータにも存在しないだけなので、移行は不要
// （CardFieldsForm側でキー無し＝空欄として表示される）
export async function addNotebookColumn(
  notebookId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "列名を入力してください。" };
  }

  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { columns: true },
  });
  const columns = normalizeColumns(notebook.columns);

  if (columns.includes(name)) {
    return { error: "同じ名前の列がすでにあります。" };
  }

  await prisma.notebook.update({
    where: { id: notebookId },
    data: { columns: [...columns, name] },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  return {};
}

// 単語帳の列名を変更する。1列目（見出し語）はラベルの変更のみで済むが、
// 2列目以降は既存カードのcellsオブジェクトのキー名も
// 古い列名→新しい列名へ一括で付け替えないと、値が宙に浮いて表示されなくなる
export async function renameNotebookColumn(
  notebookId: string,
  columnIndex: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const newName = String(formData.get("name") ?? "").trim();

  if (!newName) {
    return { error: "列名を入力してください。" };
  }

  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { columns: true },
  });
  const columns = normalizeColumns(notebook.columns);
  const oldName = columns[columnIndex];

  if (oldName === undefined) {
    return { error: "指定された列が見つかりません。" };
  }
  if (newName === oldName) {
    return {};
  }
  if (columns.includes(newName)) {
    return { error: "同じ名前の列がすでにあります。" };
  }

  const newColumns = columns.map((column, index) => (index === columnIndex ? newName : column));

  if (columnIndex === 0) {
    // 見出し語列はラベルの変更のみ（card.data.headはキーではなく固定フィールドのため移行不要）
    await prisma.notebook.update({ where: { id: notebookId }, data: { columns: newColumns } });
  } else {
    await migrateAllCards(notebookId, newColumns, (data) => {
      if (!(oldName in data.cells)) return data;
      const { [oldName]: value, ...rest } = data.cells;
      return { ...data, cells: { ...rest, [newName]: value } };
    });
  }

  revalidatePath(`/my-notebooks/${notebookId}`);
  return {};
}

// 単語帳の列（見出し語列以外）を削除する。見出し語列は構造上削除不可。
// 既存カードのcellsから該当キーも取り除く
export async function deleteNotebookColumn(notebookId: string, columnIndex: number) {
  const user = await requireUser();

  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { columns: true },
  });
  const columns = normalizeColumns(notebook.columns);
  const name = columns[columnIndex];

  // 見出し語列（0番目）は削除不可。存在しない列指定は何もしない
  if (columnIndex <= 0 || name === undefined) {
    return;
  }

  const newColumns = columns.filter((_, index) => index !== columnIndex);

  await migrateAllCards(notebookId, newColumns, (data) => {
    const cells = Object.fromEntries(Object.entries(data.cells).filter(([key]) => key !== name));
    return { ...data, cells };
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
}

// 単語帳内の単語を1件、削除する
export async function deleteCard(cardId: string, notebookId: string) {
  const user = await requireUser();
  await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { id: true },
  });

  await prisma.card.delete({ where: { id: cardId, notebookId } });
  revalidatePath(`/my-notebooks/${notebookId}`);
}

// 単語帳の公開・非公開を切り替える。公開中は /share/[notebookId] からログイン無しで閲覧できる
export async function toggleNotebookPublic(notebookId: string) {
  const user = await requireUser();

  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { isPublic: true },
  });

  await prisma.notebook.update({
    where: { id: notebookId },
    data: { isPublic: !notebook.isPublic },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  revalidatePath(`/share/${notebookId}`);
}

// 単語の★を付け外しする。付けるときだけ starCount を+1し、外してもstarCountは減らさない
export async function toggleStar(cardId: string, notebookId: string) {
  const user = await requireUser();
  await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { id: true },
  });

  const card = await prisma.card.findUniqueOrThrow({
    where: { id: cardId, notebookId },
    select: { starred: true },
  });

  await prisma.card.update({
    where: { id: cardId },
    data: card.starred ? { starred: false } : { starred: true, starCount: { increment: 1 } },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  // 通常の暗記学習（全件）は並び順・件数が変わらないので再検証してよい
  // 復習モード（★のみ）は外した瞬間にカードが抜けて表示中のインデックスがずれるため、セッション中は再検証せず、次回開いたときのDB取得だけに反映させる
  revalidatePath(`/my-notebooks/${notebookId}/study`);
}

// 誤ってクリックした場合などに、★の回数を手動で書き換える
// 0にした場合は「一度も★を付けていない」状態と矛盾しないよう、starredも自動でfalseに戻す
export async function setStarCount(cardId: string, notebookId: string, formData: FormData) {
  const user = await requireUser();
  await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { id: true },
  });

  const raw = Number(formData.get("count"));
  const count = Number.isFinite(raw) ? Math.max(0, Math.trunc(raw)) : 0;

  await prisma.card.update({
    where: { id: cardId, notebookId },
    data: count === 0 ? { starCount: 0, starred: false } : { starCount: count },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  revalidatePath(`/my-notebooks/${notebookId}/study`);
}

// ★の回数・付け外し状態をまとめて未使用の状態（0・未付与）に戻す
export async function resetStar(cardId: string, notebookId: string) {
  const user = await requireUser();
  await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { id: true },
  });

  await prisma.card.update({
    where: { id: cardId, notebookId },
    data: { starCount: 0, starred: false },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  revalidatePath(`/my-notebooks/${notebookId}/study`);
}

// 単語帳内の全カードの★（回数・付け外し状態）を一括でリセットする
export async function resetAllStars(notebookId: string) {
  const user = await requireUser();
  await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { id: true },
  });

  await prisma.card.updateMany({
    where: { notebookId },
    data: { starCount: 0, starred: false },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  revalidatePath(`/my-notebooks/${notebookId}/study`);
}

// 暗記学習モード（/study, /review）でカードが1枚表示されるたびに呼び、表示回数を+1する
// ★の付け外しとは異なりカードの抽出条件（starred）を変えないため、復習モード（/review）を再検証しても表示中のカード構成はズレない
export async function incrementViewCount(cardId: string, notebookId: string) {
  const user = await requireUser();
  await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId, userId: user.id },
    select: { id: true },
  });

  await prisma.card.update({
    where: { id: cardId, notebookId },
    data: { viewCount: { increment: 1 } },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  revalidatePath(`/my-notebooks/${notebookId}/study`);
  revalidatePath(`/my-notebooks/${notebookId}/review`);
}
