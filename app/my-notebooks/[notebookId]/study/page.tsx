import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import StudyDeck from "./StudyDeck";
import type { CardData } from "@/lib/card-data";

export default async function StudyPage(props: PageProps<"/my-notebooks/[notebookId]/study">) {
  const { notebookId } = await props.params;

  const notebook = await prisma.notebook.findUnique({
    where: { id: notebookId },
    include: { cards: { orderBy: { position: "asc" } } },
  });

  if (!notebook) {
    notFound();
  }
  if (notebook.cards.length === 0) {
    redirect(`/my-notebooks/${notebook.id}`);
  }

  const columns = notebook.columns as string[];
  const cards = notebook.cards.map((card) => ({
    id: card.id,
    data: card.data as CardData,
  }));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {notebook.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">暗記学習モード</p>

      <div className="mt-8 w-full">
        <StudyDeck notebookId={notebook.id} columns={columns} cards={cards} />
      </div>
    </main>
  );
}
