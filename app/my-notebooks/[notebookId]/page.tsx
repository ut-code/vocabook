import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CardRow from "./CardRow";
import CreateCardForm from "./CreateCardForm";
import type { CardData } from "@/lib/card-data";

export default async function NotebookPage(props: PageProps<"/my-notebooks/[notebookId]">) {
  const { notebookId } = await props.params;

  const notebook = await prisma.notebook.findUnique({
    where: { id: notebookId },
    include: { cards: { orderBy: { position: "asc" } } },
  });

  if (!notebook) {
    notFound();
  }

  const columns = notebook.columns as string[];

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <Link
          href="/my-notebooks"
          className="text-sm text-zinc-500 transition-colors hover:underline dark:text-zinc-500"
        >
          ← My単語帳一覧
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {notebook.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
              {notebook.cards.length}語
            </p>
          </div>
          {notebook.cards.length > 0 && (
            <Link
              href={`/my-notebooks/${notebook.id}/study`}
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              暗記学習を始める
            </Link>
          )}
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-black/[.08] dark:border-white/[.145]">
          <table className="w-full min-w-max border-collapse text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {notebook.cards.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-500"
                  >
                    まだ単語がありません。下のフォームから追加してください。
                  </td>
                </tr>
              ) : (
                notebook.cards.map((card) => (
                  <CardRow
                    key={card.id}
                    notebookId={notebook.id}
                    columns={columns}
                    card={{ id: card.id, data: card.data as CardData }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
            単語を追加
          </h2>
          <CreateCardForm notebookId={notebook.id} columns={columns} />
        </section>
      </div>
    </main>
  );
}
