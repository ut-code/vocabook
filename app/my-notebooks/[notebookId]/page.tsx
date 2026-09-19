import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import CardRow from "./CardRow";
import CreateCardForm from "./CreateCardForm";
import ColumnsEditor from "@/components/my-notebooks/ColumnsEditor";
import ImportCardsForm from "@/components/my-notebooks/ImportCardsForm";
import ResetAllStarsButton from "@/components/my-notebooks/ResetAllStarsButton";
import ShareNotebookButton from "@/components/my-notebooks/ShareNotebookButton";
import { normalizeCardData } from "@/lib/card-data";
import { normalizeColumns } from "@/lib/notebook-columns";

// DBの最新状態を常に表示するため、ビルド時の静的プリレンダリングを避けてリクエスト時にレンダリングする
export const dynamic = "force-dynamic";

export default async function NotebookPage(props: PageProps<"/my-notebooks/[notebookId]">) {
  const user = await requireUser();
  const { notebookId } = await props.params;

  // 単語帳本体と、その中の単語（Card）一覧を position 昇順（＝Excelの元の並び順）で取得する。
  // userIdも条件に含めることで、他人の単語帳IDを直接踏んでもアクセスできないようにする
  const notebook = await prisma.notebook.findFirst({
    where: { id: notebookId, userId: user.id },
    include: { cards: { orderBy: { position: "asc" } } },
  });

  // 存在しないIDが指定された場合は404ページを表示する
  if (!notebook) {
    notFound();
  }

  // columns は「1列目=見出し語、2列目以降=意味・発音などの列名」という順序付き配列。
  // 各列の値は見出し語につき1件〜複数件を自由に持てる（列ごとの件数は完全に独立）。
  // 列数・列名はNotebookごとに異なるため、テーブルのヘッダーや各行の入力欄は
  // columns をループして動的に組み立てる
  const columns = normalizeColumns(notebook.columns);
  // ★がついている単語の件数。1件以上あれば「復習」への導線を出す
  const starredCount = notebook.cards.filter((card) => card.starred).length;
  // ★の回数が1回でも付いている単語があれば「一括リセット」の導線を出す
  const hasAnyStars = notebook.cards.some((card) => card.starCount > 0);

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
            <div className="mt-3">
              <ShareNotebookButton notebookId={notebook.id} isPublic={notebook.isPublic} />
            </div>
          </div>
          {notebook.cards.length > 0 && (
            <div className="flex items-center gap-3">
              {starredCount > 0 && (
                <Link
                  href={`/my-notebooks/${notebook.id}/review`}
                  className="rounded-full border border-coral-300 px-5 py-2 text-sm font-medium text-coral-700 transition-all hover:-translate-y-0.5 hover:border-coral-500 hover:bg-coral-50 hover:text-coral-800 hover:shadow-md hover:shadow-coral-100 dark:border-coral-900/50 dark:text-coral-300 dark:hover:border-coral-600 dark:hover:bg-coral-950/20 dark:hover:text-coral-200 dark:hover:shadow-none"
                >
                  ★を復習する（{starredCount}語）
                </Link>
              )}
              <Link
                href={`/my-notebooks/${notebook.id}/study`}
                className="rounded-full bg-coral-500 px-5 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-200 dark:hover:shadow-none"
              >
                暗記学習を始める
              </Link>
              {hasAnyStars && <ResetAllStarsButton notebookId={notebook.id} />}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
          <ImportCardsForm notebookId={notebook.id} />
          <ColumnsEditor notebookId={notebook.id} columns={columns} />
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-black/[.08] dark:border-white/[.145]">
          <table className="w-full min-w-max border-collapse text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                {/* 列見出しは columns の並び順そのまま表示する */}
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3" aria-label="操作" />
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
                // 単語1件ずつをCardRowに委譲する。表示・編集・削除の切り替えは
                // 各CardRow内で完結し、このページ自体は再取得（revalidatePath）でのみ更新される
                notebook.cards.map((card) => (
                  <CardRow
                    key={card.id}
                    notebookId={notebook.id}
                    columns={columns}
                    card={{
                      id: card.id,
                      data: normalizeCardData(card.data),
                      starred: card.starred,
                      starCount: card.starCount,
                      viewCount: card.viewCount,
                    }}
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
