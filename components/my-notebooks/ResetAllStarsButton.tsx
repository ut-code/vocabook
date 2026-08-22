"use client";

import { resetAllStars } from "@/app/my-notebooks/actions";

// 単語帳内の★（回数・付け外し状態）を一括でリセットするボタン。
// 単語帳まるごとに影響する操作なので、削除ボタンと同様に確認ダイアログを挟む
export default function ResetAllStarsButton({ notebookId }: { notebookId: string }) {
  return (
    <form
      action={resetAllStars.bind(null, notebookId)}
      onSubmit={(event) => {
        if (!window.confirm("この単語帳の★の回数をすべてリセットします。よろしいですか？")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-black/[.08] px-5 py-2 text-sm text-zinc-600 transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:text-zinc-300 dark:hover:border-white/[.25]"
      >
        ★を一括リセット
      </button>
    </form>
  );
}
