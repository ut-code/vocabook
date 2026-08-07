"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ExcelParseError, parseExcelWorkbook } from "@/lib/excel";
import type { CardData } from "@/lib/card-data";

export type FormState = { error?: string };

// フォームは name="head" で見出し語、name="sense:任意のキー:列名" で
// 各意味（複数可）の子項目を送ってくる。Notebook.columns の2列目以降の
// 並び順に沿って { 見出し語, 意味の配列 } に詰め直す
function readCardData(columns: string[], formData: FormData): CardData {
  const head = String(formData.get("head") ?? "").trim();
  const senseColumns = columns.slice(1);

  const senseKeys: string[] = [];
  const seenKeys = new Set<string>();
  for (const key of formData.keys()) {
    const match = /^sense:([^:]+):/.exec(key);
    if (match && !seenKeys.has(match[1])) {
      seenKeys.add(match[1]);
      senseKeys.push(match[1]);
    }
  }

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
  const data = readCardData(columns, formData);

  if (!data.head) {
    return { error: "見出し語を入力してください。" };
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
