"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteCard, updateCard, type FormState } from "../actions";
import CardFieldsForm from "@/components/my-notebooks/CardFieldsForm";
import type { CardData } from "@/lib/card-data";

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
  card: { id: string; data: CardData };
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

  const senseColumns = columns.slice(1);

  if (!editing) {
    // 意味が0件でも見出し語だけの行を1行表示する
    const senses = card.data.senses.length > 0 ? card.data.senses : [{}];

    return (
      <>
        {senses.map((sense, index) => (
          <tr
            key={index}
            className={
              index === 0
                ? "border-t border-black/[.06] dark:border-white/[.1]"
                : "border-t border-dashed border-black/[.06] dark:border-white/[.1]"
            }
          >
            {index === 0 && (
              <td
                rowSpan={senses.length}
                className="px-4 py-3 align-top text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                {card.data.head}
              </td>
            )}
            {senseColumns.map((column) => (
              <td key={column} className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                {sense[column] ?? ""}
              </td>
            ))}
            {index === 0 && (
              <td
                rowSpan={senses.length}
                className="px-4 py-3 text-right align-top whitespace-nowrap"
              >
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
            )}
          </tr>
        ))}
      </>
    );
  }

  return (
    <tr className="border-t border-black/[.06] dark:border-white/[.1]">
      <td colSpan={senseColumns.length + 2} className="px-4 py-3">
        <form action={formAction} className="flex flex-col items-start gap-3">
          <CardFieldsForm
            columns={columns}
            defaultHead={card.data.head}
            defaultSenses={card.data.senses}
          />
          <div className="flex items-center gap-3">
            <SaveButton />
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-zinc-500 transition-colors hover:underline dark:text-zinc-500"
            >
              キャンセル
            </button>
          </div>
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
