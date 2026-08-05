"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteCard, updateCard, type FormState } from "../actions";

const initialState: FormState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
    >
      {pending ? "保存中…" : "保存"}
    </button>
  );
}

export default function CardRow({
  notebookId,
  columns,
  card,
}: {
  notebookId: string;
  columns: string[];
  card: { id: string; data: Record<string, string> };
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(
    updateCard.bind(null, card.id, notebookId),
    initialState,
  );
  // 初回マウント時のstate変化（=action未実行）で誤って閉じないようにする
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      setEditing(false);
    }
  }, [state]);

  if (!editing) {
    return (
      <tr className="border-t border-black/[.06] dark:border-white/[.1]">
        {columns.map((column) => (
          <td key={column} className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
            {card.data[column] ?? ""}
          </td>
        ))}
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mr-3 text-sm text-zinc-600 transition-colors hover:underline dark:text-zinc-400"
          >
            編集
          </button>
          <form
            action={deleteCard.bind(null, card.id, notebookId)}
            className="inline"
            onSubmit={(event) => {
              if (!window.confirm("この単語を削除しますか？")) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="text-sm text-red-600 transition-colors hover:underline dark:text-red-400"
            >
              削除
            </button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t border-black/[.06] dark:border-white/[.1]">
      <td colSpan={columns.length + 1} className="px-4 py-3">
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          {columns.map((column) => (
            <div key={column} className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 dark:text-zinc-500">{column}</label>
              <input
                name={`field:${column}`}
                defaultValue={card.data[column] ?? ""}
                className="rounded border border-black/[.1] bg-transparent px-2 py-1 text-sm outline-none focus:border-black/[.3] dark:border-white/[.15] dark:focus:border-white/[.4]"
              />
            </div>
          ))}
          <SaveButton />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm text-zinc-500 transition-colors hover:underline dark:text-zinc-500"
          >
            キャンセル
          </button>
        </form>
        {state?.error && (
          <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
      </td>
    </tr>
  );
}
