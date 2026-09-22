import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { acceptInvite } from "@/app/my-notebooks/[notebookId]/sharing-actions";

// DBの最新状態（招待の失効など）を常に見る必要があるため静的化しない
export const dynamic = "force-dynamic";

// 招待リンクの受け口。GETだけで参加が確定しないよう、ここでは招待内容を表示するだけにし、
// 実際の参加（NotebookShareの作成）は「参加する」ボタンからacceptInviteを呼んだときに行う
export default async function InvitePage(props: PageProps<"/invite/[token]">) {
  const { token } = await props.params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const invite = await prisma.notebookInvite.findUnique({
    where: { token },
    select: {
      notebook: { select: { id: true, title: true, userId: true } },
    },
  });

  if (!invite) {
    return (
      <main className="flex flex-1 flex-col items-center px-6 py-24 text-center">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
            この招待リンクは無効です
          </h1>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
            リンクが失効しているか、URLが正しくない可能性があります。単語帳の作成者に、招待リンクの再発行を依頼してください。
          </p>
          <Link
            href="/my-notebooks"
            className="mt-6 inline-block text-sm text-coral-600 hover:underline dark:text-coral-400"
          >
            My単語帳へ戻る
          </Link>
        </div>
      </main>
    );
  }

  // 既に作成者本人、または共同編集者として参加済みなら、確認なしでそのまま単語帳へ
  if (invite.notebook.userId === user.id) {
    redirect(`/my-notebooks/${invite.notebook.id}`);
  }
  const existingShare = await prisma.notebookShare.findUnique({
    where: { notebookId_userId: { notebookId: invite.notebook.id, userId: user.id } },
    select: { id: true },
  });
  if (existingShare) {
    redirect(`/my-notebooks/${invite.notebook.id}`);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24 text-center">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">単語帳への招待</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          「{invite.notebook.title}」に
          <br />
          <span className="font-medium text-black dark:text-zinc-50">共同編集者</span>
          として参加します。
        </p>

        <form action={acceptInvite.bind(null, token)} className="mt-8">
          <button
            type="submit"
            className="rounded-full bg-coral-500 px-6 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-200 dark:hover:shadow-none"
          >
            参加する
          </button>
        </form>

        <Link
          href="/my-notebooks"
          className="mt-6 inline-block text-sm text-zinc-500 hover:underline dark:text-zinc-500"
        >
          キャンセルしてMy単語帳へ戻る
        </Link>
      </div>
    </main>
  );
}
