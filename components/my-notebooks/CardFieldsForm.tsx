"use client";

import { useRef, useState } from "react";

const inputClassName =
  "rounded border border-black/[.1] bg-transparent px-2 py-1 text-sm outline-none focus:border-black/[.3] dark:border-white/[.15] dark:focus:border-white/[.4]";

type Slot = { key: number; defaultValue: string };

// 単語カード1件分の入力欄。
// 見出し語（1列目）は単一。それ以外の各列は、列ごとに独立して
// 値を1件〜複数件持てる（例: 発音は1件のまま、意味だけ「＋値を追加」で増やす）。
// name="head" / name="cell:列名:連番" という形式でSubmit時に読み取られる
export default function CardFieldsForm({
  columns,
  defaultHead = "",
  defaultCells = {},
}: {
  columns: string[];
  defaultHead?: string;
  defaultCells?: Record<string, string[]>;
}) {
  const headColumn = columns[0] ?? "";
  const bodyColumns = columns.slice(1);

  const [cellsState, setCellsState] = useState<Record<string, Slot[]>>(() => {
    // 初期スロットのkeyはこの場限りのローカルカウンターで採番する（refはrender中に読めないため）
    let key = 0;
    const initial: Record<string, Slot[]> = {};
    for (const column of bodyColumns) {
      const values = defaultCells[column];
      const list = values && values.length > 0 ? values : [""];
      initial[column] = list.map((value) => ({ key: key++, defaultValue: value }));
    }
    return initial;
  });
  // 初期表示後に追加されるスロットのkey採番。初期スロットの最大key+1から続ける
  const nextKey = useRef(
    Object.values(cellsState).reduce(
      (max, slots) => slots.reduce((m, slot) => Math.max(m, slot.key + 1), max),
      0,
    ),
  );

  function addValue(column: string) {
    setCellsState((state) => ({
      ...state,
      [column]: [...(state[column] ?? []), { key: nextKey.current++, defaultValue: "" }],
    }));
  }

  function removeValue(column: string, key: number) {
    setCellsState((state) => {
      const list = state[column] ?? [];
      if (list.length <= 1) return state;
      return { ...state, [column]: list.filter((slot) => slot.key !== key) };
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500 dark:text-zinc-500">{headColumn}</label>
        <input name="head" defaultValue={defaultHead} className={inputClassName} />
      </div>

      {bodyColumns.map((column) => {
        const slots = cellsState[column] ?? [];
        return (
          <div
            key={column}
            className="flex flex-col gap-1.5 rounded-lg border border-black/[.06] p-2 dark:border-white/[.1]"
          >
            <label className="text-xs text-zinc-500 dark:text-zinc-500">{column}</label>
            {slots.map((slot, index) => (
              <div key={slot.key} className="flex items-center gap-2">
                <input
                  name={`cell:${column}:${index}`}
                  defaultValue={slot.defaultValue}
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => removeValue(column, slot.key)}
                  disabled={slots.length <= 1}
                  className="text-xs text-coral-600 transition-all hover:-translate-y-0.5 hover:text-coral-800 hover:underline disabled:opacity-30 dark:text-coral-400 dark:hover:text-coral-200"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addValue(column)}
              className="self-start text-xs text-coral-600 transition-all hover:-translate-y-0.5 hover:text-coral-800 hover:underline dark:text-coral-400 dark:hover:text-coral-200"
            >
              ＋ 値を追加
            </button>
          </div>
        );
      })}
    </div>
  );
}
