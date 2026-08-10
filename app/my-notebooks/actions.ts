"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ExcelParseError, parseExcelWorkbook } from "@/lib/excel";
import type { CardData } from "@/lib/card-data";

export type FormState = { error?: string };

function readCardData(columns: string[], formData: FormData): CardData {
  const head = String(formData.get("head") ?? "").trim();
  const senseColumns = columns.slice(1);

  // senseKeys：見つかった意味ブロックの識別キーを、出現順に並べて格納する配列（最終的な戻り値）
  // seenKeys：「もうこのキーは見た」を判定するためのSet
  const senseKeys: string[] = [];
  const seenKeys = new Set<string>();
  // formData に含まれる全ての入力欄の名前を1つずつ見ていく
  for (const key of formData.keys()) {
    const match = /^sense:([^:]+):/.exec(key);
    if (match && !seenKeys.has(match[1])) {
      seenKeys.add(match[1]);
      senseKeys.push(match[1]);
    }
  }

  // ステップ2〜3: キーごとに列名分の値を集めて1つの意味オブジェクトにし、
  // 全列が空文字だったものだけをフィルタで除外する
  const senses = senseKeys
    .map((senseKey) => {
      const sense: Record<string, string> = {};
      for (const column of senseColumns) {
        sense[column] = String(formData.get(`sense:${senseKey}:${column}`) ?? "").trim();
      }
      return sense;
    })
    .filter((sense) => Object.values(sense).some((value) => value !== ""));

  return { head, senses };
}

// Excelファイルから新しい単語帳を作成する
export async function importNotebookFromExcel(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
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
  await prisma.notebook.delete({ where: { id: notebookId } });
  revalidatePath("/my-notebooks");
  redirect("/my-notebooks");
}

// 単語帳に単語を1件、手動で追加する
export async function createCard(
  notebookId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId },
    select: { columns: true },
  });
  const columns = notebook.columns as string[];
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
  const notebook = await prisma.notebook.findUniqueOrThrow({
    where: { id: notebookId },
    select: { columns: true },
  });
  const columns = notebook.columns as string[];
  const data = readCardData(columns, formData);

  if (!data.head) {
    return { error: "見出し語を入力してください。" };
  }

  await prisma.card.update({
    where: { id: cardId },
    data: { data },
  });

  revalidatePath(`/my-notebooks/${notebookId}`);
  return {};
}

// 単語帳内の単語を1件、削除する
export async function deleteCard(cardId: string, notebookId: string) {
  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath(`/my-notebooks/${notebookId}`);
}
