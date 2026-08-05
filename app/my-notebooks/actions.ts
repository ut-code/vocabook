"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ExcelParseError, parseExcelWorkbook } from "@/lib/excel";

export type FormState = { error?: string };

// フォームの各項目は name="field:列名" という形式で送られてくるので、
// Notebook.columns の並び順に沿って { 列名: 値 } のオブジェクトに詰め直す
function readCardFields(columns: string[], formData: FormData): Record<string, string> {
  const data: Record<string, string> = {};
  for (const column of columns) {
    data[column] = String(formData.get(`field:${column}`) ?? "").trim();
  }
  return data;
}

// Excelファイルから新しい単語帳を作成する
export async function importNotebookFromExcel(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  if (!title) {
    return { error: "単語帳のタイトルを入力してください。" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Excelファイル（.xlsx）を選択してください。" };
  }

  let parsed;
  try {
    parsed = await parseExcelWorkbook(await file.arrayBuffer());
  } catch (error) {
    if (error instanceof ExcelParseError) {
      return { error: error.message };
    }
    throw error;
  }

  const notebook = await prisma.notebook.create({
    data: {
      title,
      columns: parsed.columns,
      cards: {
        create: parsed.rows.map((data, index) => ({ data, position: index })),
      },
    },
  });

  revalidatePath("/my-notebooks");
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
  const data = readCardFields(columns, formData);

  if (Object.values(data).every((value) => value === "")) {
    return { error: "少なくとも1つの項目を入力してください。" };
  }

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
  const data = readCardFields(columns, formData);

  if (Object.values(data).every((value) => value === "")) {
    return { error: "少なくとも1つの項目を入力してください。" };
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
