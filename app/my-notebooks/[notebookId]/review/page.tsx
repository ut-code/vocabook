import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import StudyDeck from "../study/StudyDeck";
import type { CardData } from "@/lib/card-data";

export default async function ReviewPage(props: PageProps<"/my-notebooks/[notebookId]/review">) {
  const { notebookId } = await props.params;

  // 単語帳と、その中の★がついたカードだけをposition昇順で取得する
  const notebook = await prisma.notebook.findUnique({
    where: { id: notebookId },
    include: { cards: { where: { starred: true }, orderBy: { position: "asc" } } },
  });

  if (!notebook) {
    notFound();
  }
  // ★のついた単語が1件も無い状態では復習モードが成立しないため、単語帳のトップページへ差し戻す
  if (notebook.cards.length === 0) {
    redirect(`/my-notebooks/${notebook.id}`);
  }

  // 表示・フリップ・★の付け外しはすべてクライアント側のStudyDeckが担当するため、
  // ここではサーバーでDBから取得したデータをそのまま整形して渡すだけ
  const columns = notebook.columns as string[];
  const cards = notebook.cards.map((card) => ({
    id: card.id,
    data: card.data as CardData,
    starred: card.starred,
    starCount: card.starCount,
    viewCount: card.viewCount,
  }));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {notebook.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
        復習モード（★をつけた単語のみ）
      </p>

      <div className="mt-8 w-full">
        <StudyDeck notebookId={notebook.id} columns={columns} cards={cards} />
      </div>
    </main>
  );
}
