"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ヘッダーの「ログイン」「新規登録」リンク。今いるページをredirectパラメータに載せておき、
// ログイン・登録が終わったら（デフォルトのMy単語帳ではなく）元のページへ戻れるようにする
export default function AuthNavLinks() {
  const pathname = usePathname();
  const redirectQuery = `redirect=${encodeURIComponent(pathname)}`;

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/login?${redirectQuery}`}
        className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-500 dark:text-zinc-200 dark:hover:text-emerald-500"
      >
        ログイン
      </Link>
      <Link
        href={`/signup?${redirectQuery}`}
        className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
      >
        新規登録
      </Link>
    </div>
  );
}
