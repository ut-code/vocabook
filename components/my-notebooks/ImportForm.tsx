"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { importNotebookFromExcel, type FormState } from "@/app/my-notebooks/actions";

const initialState: FormState = {};

// フォーム送信中はボタンを disabled にし、ラベルを差し替える
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
    >
      {pending ? "取り込み中…" : "単語帳を作成"}
    </button>
  );
}

export default function ImportForm() {
  // useActionStateは、Server Actionの戻り値（{ error }など）を
  // 前回の実行結果として保持してくれるReactのフック
  const [state, formAction] = useActionState(importNotebookFromExcel, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          単語帳のタイトル
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="例: フランス語 第1章"
          className="rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/[.3] dark:border-white/[.145] dark:focus:border-white/[.4]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="file" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Excelファイル（.xlsx）
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".xlsx"
          required
          className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-200 dark:hover:file:bg-zinc-700"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          1行目を見出し行として自動で読み取ります。列の数や名前は自由です。
        </p>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
