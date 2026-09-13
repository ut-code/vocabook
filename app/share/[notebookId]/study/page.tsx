import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import PublicStudyDeck from "./PublicStudyDeck";
import type { CardData } from "@/lib/card-data";

export const dynamic = "force-dynamic";

export default async function SharedStudyPage(
  props: PageProps<"/share/[notebookId]/study">,
) {
  const { notebookId } = await props.params;

  const notebook = await prisma.notebook.findFirst({
    where: { id: notebookId, isPublic: true },
    include: { cards: { orderBy: { position: "asc" } } },
  });

  if (!notebook) {
    notFound();
  }
  if (notebook.cards.length === 0) {
    redirect(`/share/${notebook.id}`);
  }

  const columns = notebook.columns as string[];
  const cards = notebook.cards.map((card) => ({ id: card.id, data: card.data as CardData }));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {notebook.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
        暗記学習モード（閲覧専用）
      </p>

      <div className="mt-8 w-full">
        <PublicStudyDeck notebookId={notebook.id} columns={columns} cards={cards} />
      </div>
    </main>
  );
}
