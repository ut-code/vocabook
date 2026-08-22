import Link from "next/link";

import { prisma } from "@/lib/prisma";
import ImportForm from "@/components/my-notebooks/ImportForm";
import DeleteNotebookButton from "@/components/my-notebooks/DeleteNotebookButton";
import StarColorSettings from "@/components/StarColorSettings";

// DBの最新状態を常に表示するため、ビルド時の静的プリレンダリングを避けてリクエスト時にレンダリングする
export const dynamic = "force-dynamic";

export default async function MyNotebooksPage() {
  // 作成日が新しい単語帳を先頭に表示する。
  // _count で各単語帳の単語数だけを取得し、cards本体は取得しない（一覧表示には不要なため軽量化）
  const notebooks = await prisma.notebook.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { cards: true } } },
  });

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          My単語帳
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Excelファイルから自分だけの単語帳を作成できます。
        </p>
        <div className="mt-4 flex justify-center">
          <StarColorSettings />
        </div>
      </div>

      <section className="mt-10 w-full max-w-md">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
          Excelから新規作成
        </h2>
        <ImportForm />
      </section>

      <section className="mt-12 w-full max-w-2xl">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
          作成済みの単語帳
        </h2>
        {/* 単語帳が1件も無ければ空状態のメッセージ、あれば一覧をレンダリング */}
        {notebooks.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            まだ単語帳がありません。上のフォームからExcelファイルを取り込んでみましょう。
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notebooks.map((notebook) => (
              <li
                key={notebook.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-black/[.08] bg-white p-5 transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]"
              >
                <Link href={`/my-notebooks/${notebook.id}`} className="flex-1 text-left">
                  <p className="font-medium text-black dark:text-zinc-50">{notebook.title}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                    {notebook._count.cards}語
                  </p>
                </Link>
                <DeleteNotebookButton notebookId={notebook.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
