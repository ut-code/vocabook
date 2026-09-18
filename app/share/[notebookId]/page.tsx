import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { normalizeCardData } from "@/lib/card-data";
import { normalizeColumns } from "@/lib/notebook-columns";

// 公開中の単語帳をログイン無しで閲覧できるページ。公開状態はDBの最新値を都度見る必要があるため静的化しない
export const dynamic = "force-dynamic";

export default async function SharedNotebookPage(props: PageProps<"/share/[notebookId]">) {
  const { notebookId } = await props.params;

  // isPublicな単語帳のみ取得する。非公開・存在しないIDの場合は404にする
  const notebook = await prisma.notebook.findUnique({
    where: { id: notebookId, isPublic: true },
    include: { cards: { orderBy: { position: "asc" } } },
  });

  if (!notebook) {
    notFound();
  }

  const columns = normalizeColumns(notebook.columns);
  const bodyColumns = columns.slice(1);
  const cards = notebook.cards.map((card) => ({ id: card.id, data: normalizeCardData(card.data) }));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <p className="text-sm text-zinc-500 dark:text-zinc-500">共有された単語帳（閲覧専用）</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {notebook.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{cards.length}語</p>
          </div>
          {cards.length > 0 && (
            <Link
              href={`/share/${notebook.id}/study`}
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
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-500"
                  >
                    まだ単語がありません。
                  </td>
                </tr>
              ) : (
                cards.map((card) => (
                  <tr key={card.id} className="border-t border-black/[.06] dark:border-white/[.1]">
                    <td className="px-4 py-3 align-top text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {card.data.head}
                    </td>
                    {bodyColumns.map((column) => {
                      const values = card.data.cells[column] ?? [];
                      return (
                        <td
                          key={column}
                          className="px-4 py-3 align-top text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          {values.length <= 1 ? (
                            (values[0] ?? "")
                          ) : (
                            <ol className="list-decimal space-y-0.5 pl-4">
                              {values.map((value, i) => (
                                <li key={i}>{value}</li>
                              ))}
                            </ol>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
