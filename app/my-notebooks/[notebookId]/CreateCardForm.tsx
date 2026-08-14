"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createCard, type FormState } from "../actions";
import CardFieldsForm from "@/components/my-notebooks/CardFieldsForm";

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
  // createCard Server Actionを、このnotebook専用にbindしてuseActionStateに渡す
  const [state, formAction] = useActionState(createCard.bind(null, notebookId), initialState);
  // フォームの入力欄はCardFieldsForm内で非制御（defaultValue）で管理されているため、
  // 「値をJSでクリアする」ことができない。そこで<form key={formKey}>のkeyを変えることで
  // Reactにフォーム全体を作り直させ（アンマウント→再マウント）、入力欄を空に戻す
  const [formKey, setFormKey] = useState(0);
  // stateが変化した（=action実行結果が返ってきた）タイミングだけ、
  // 成功時（エラーが無い時）にkeyをインクリメントしてフォームをリセットする。
  // 初回マウント時はprevState === stateなので何もしない
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (!state.error) {
      setFormKey((key) => key + 1);
    }
  }

  return (
    <>
      <form
        key={formKey}
        action={formAction}
        className="flex flex-col gap-3 rounded-2xl border border-dashed border-black/[.15] p-4 dark:border-white/[.2]"
      >
        <CardFieldsForm columns={columns} />
        <div>
          <AddButton />
        </div>
      </form>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
    </>
  );
}
