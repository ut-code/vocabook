"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { createCard, type FormState } from "../actions";

const initialState: FormState = {};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
    >
      {pending ? "追加中…" : "追加"}
    </button>
  );
}

export default function CreateCardForm({
  notebookId,
  columns,
}: {
  notebookId: string;
  columns: string[];
}) {
  const [state, formAction] = useActionState(createCard.bind(null, notebookId), initialState);
  // 追加成功時にkeyを変えてフォームごと再マウントし、入力欄を空に戻す
  const [formKey, setFormKey] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      setFormKey((key) => key + 1);
    }
  }, [state]);

  return (
    <>
      <form
        key={formKey}
        action={formAction}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-black/[.15] p-4 dark:border-white/[.2]"
      >
        {columns.map((column) => (
          <div key={column} className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 dark:text-zinc-500">{column}</label>
            <input
              name={`field:${column}`}
              className="rounded border border-black/[.1] bg-transparent px-2 py-1 text-sm outline-none focus:border-black/[.3] dark:border-white/[.15] dark:focus:border-white/[.4]"
            />
          </div>
        ))}
        <AddButton />
      </form>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
    </>
  );
}
