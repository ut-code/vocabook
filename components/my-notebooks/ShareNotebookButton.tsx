"use client";

import { useOptimistic, useState, useTransition } from "react";

import { toggleNotebookPublic } from "@/app/my-notebooks/actions";

// 単語帳の公開/非公開を切り替え、公開中は共有リンクをコピーできるボタン
export default function ShareNotebookButton({
  notebookId,
  isPublic,
}: {
  notebookId: string;
  isPublic: boolean;
}) {
  const [optimisticPublic, setOptimisticPublic] = useOptimistic(isPublic);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/share/${notebookId}` : "";

  function handleToggle() {
    startTransition(async () => {
      setOptimisticPublic(!optimisticPublic);
      await toggleNotebookPublic(notebookId);
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="rounded-full border border-black/[.08] px-5 py-2 text-sm font-medium transition-colors hover:border-black/[.15] disabled:opacity-50 dark:border-white/[.145] dark:hover:border-white/[.25]"
      >
        {optimisticPublic ? "公開中（クリックで非公開に）" : "リンクで共有する"}
      </button>
      {optimisticPublic && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="w-64 rounded-full border border-black/[.08] bg-white px-4 py-2 text-xs text-zinc-600 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-400"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-black/[.08] px-4 py-2 text-xs font-medium transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:hover:border-white/[.25]"
          >
            {copied ? "コピーしました" : "コピー"}
          </button>
        </div>
      )}
    </div>
  );
}
