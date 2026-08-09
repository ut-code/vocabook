"use client";

import { useRef, useState } from "react";

const inputClassName =
  "rounded border border-black/[.1] bg-transparent px-2 py-1 text-sm outline-none focus:border-black/[.3] dark:border-white/[.15] dark:focus:border-white/[.4]";

// 単語カード1件分の入力欄。見出し語（1列目）は単一、
// 意味（2列目以降）は多義語に対応するため複数持てるようにする。
// name="head" / name="sense:キー:列名" という形式でSubmit時に読み取られる
export default function CardFieldsForm({
  columns,
  defaultHead = "",
  defaultSenses = [],
}: {
  columns: string[];
  defaultHead?: string;
  defaultSenses?: Record<string, string>[];
}) {
  const headColumn = columns[0];
  const senseColumns = columns.slice(1);

  const nextKey = useRef(Math.max(defaultSenses.length, 1));
  const [senses, setSenses] = useState<{ key: number; defaults: Record<string, string> }[]>(() =>
    (defaultSenses.length > 0 ? defaultSenses : [{}]).map((defaults, index) => ({
      key: index,
      defaults,
    })),
  );

  function addSense() {
    setSenses((list) => [...list, { key: nextKey.current++, defaults: {} }]);
  }

  function removeSense(key: number) {
    setSenses((list) => (list.length > 1 ? list.filter((sense) => sense.key !== key) : list));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500 dark:text-zinc-500">{headColumn}</label>
        <input name="head" defaultValue={defaultHead} className={inputClassName} />
      </div>

      {senseColumns.length > 0 && (
        <div className="flex flex-col gap-2">
          {senses.map((sense, index) => (
            <div
              key={sense.key}
              className="flex flex-wrap items-end gap-2 rounded-lg border border-black/[.06] p-2 dark:border-white/[.1]"
            >
              {senses.length > 1 && (
                <span className="text-xs text-zinc-400 dark:text-zinc-600">意味{index + 1}</span>
              )}
              {senseColumns.map((column) => (
                <div key={column} className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500 dark:text-zinc-500">{column}</label>
                  <input
                    name={`sense:${sense.key}:${column}`}
                    defaultValue={sense.defaults[column] ?? ""}
                    className={inputClassName}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => removeSense(sense.key)}
                disabled={senses.length <= 1}
                className="text-xs text-zinc-500 transition-colors hover:underline disabled:opacity-30 dark:text-zinc-500"
              >
                この意味を削除
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSense}
            className="self-start text-xs text-zinc-600 transition-colors hover:underline dark:text-zinc-400"
          >
            ＋ 意味を追加
          </button>
        </div>
      )}
    </div>
  );
}
