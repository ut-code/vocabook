"use client";

import { useActionState, useState } from "react";
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
  // このカードが「表示モード」か「インライン編集モード」かを切り替えるフラグ
  const [editing, setEditing] = useState(false);
  // updateCard Server Action を、このカード専用（cardId・notebookId固定）にバインドしておく。
  // useActionStateはフォームのaction属性に渡すための関数(formAction)と、
  // 直近の実行結果(state = { error? })をセットで返す
  const [state, formAction] = useActionState(
    updateCard.bind(null, card.id, notebookId),
    initialState,
  );
  // stateが変化した（=action実行結果が返ってきた）タイミングだけ、成功時に編集モードを閉じる。
  // 初回マウント時はprevState === stateなので何もしない
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (!state.error) {
      setEditing(false);
    }
  }

  const senseColumns = columns.slice(1);

  if (!editing) {
    // 意味が0件でも見出し語だけの行を1行表示する（表側の "senses" が空配列にならないようフォールバック）
    const senses = card.data.senses.length > 0 ? card.data.senses : [{}];

    // 1つの見出し語（1枚のカード）が複数の意味を持つ場合、
    // <tr>をsenses件数ぶん並べて表現する。見出し語セルと操作セル（編集/削除）は
    // rowSpan={senses.length} で縦に結合し、1行目にだけレンダリングする。
    // 2行目以降は意味の列だけを持つ行になり、破線の罫線（border-dashed）で
    // 「同じ見出し語グループの続き」であることを視覚的に示す
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
            {/* 意味側の列は、senseColumns（columnsの2列目以降）の順番通りに1セルずつ描画する */}
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
                {/* deleteCardをこのカード専用にbindし、form actionとして直接渡す。
                    確認ダイアログで「キャンセル」された場合はpreventDefaultで送信自体を止める */}
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

  // 編集モードでは、表示モード時の複数<tr>を1つの<tr>にまとめ、
  // colSpan（見出し語1列 + 意味の列数 + 操作列1列）で全カラムぶんを1セルに潰して
  // その中にフォームを丸ごと展開する
  return (
    <tr className="border-t border-black/[.06] dark:border-white/[.1]">
      <td colSpan={senseColumns.length + 2} className="px-4 py-3">
        {/* action={formAction} に渡すことで、Server Actionの結果がuseActionStateのstateに反映される */}
        <form action={formAction} className="flex flex-col items-start gap-3">
          {/* defaultHead/defaultSensesで現在の値を初期表示し、そこから編集する */}
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
