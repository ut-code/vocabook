import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/auth/LogoutButton";

// ヘッダーの中で唯一セッションを参照する部分。ここをSuspenseで囲むことで、
// 他の静的な部分（ナビゲーションなど）まで動的レンダリングに巻き込まれるのを防ぐ
export default async function HeaderAuthStatus() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
          {user.name}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-500 dark:text-zinc-200 dark:hover:text-emerald-500"
      >
        ログイン
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
      >
        新規登録
      </Link>
    </div>
  );
}
