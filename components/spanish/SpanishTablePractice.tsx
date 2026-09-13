"use client";

import { useCallback, useRef, useState } from "react";

// 文法表データの型定義
export type GrammarTableRow = {
  label: string;
  cells: string[];
};

export type GrammarTableData = {
  categoryKey: string;
  categoryTitle: string;
  headers: string[];
  rows: GrammarTableRow[];
};

// 単一セル問の型定義（カード出題モード用）
export type SingleQuestionItem = {
  id: string;
  categoryTitle: string;
  rowLabel: string;
  colHeader: string;
  answer: string;
};

// アルファベット基本文字とアクセント付き特殊文字の対応マップ
const ACCENT_MAP: Record<string, string[]> = {
  a: ["a", "á"],
  e: ["e", "é"],
  i: ["i", "í"],
  o: ["o", "ó"],
  u: ["u", "ú", "ü"],
  n: ["n", "ñ"],
  A: ["A", "Á"],
  E: ["E", "É"],
  I: ["I", "Í"],
  O: ["O", "Ó"],
  U: ["U", "Ú", "Ü"],
  N: ["N", "Ñ"],
};

// 逆引きルックアップ用マップ
const ACCENT_GROUP_KEY: Record<string, string> = {};
for (const [base, list] of Object.entries(ACCENT_MAP)) {
  for (const char of list) {
    ACCENT_GROUP_KEY[char] = base;
  }
}

/**
 * 矢印キー操作によりアクセント記号を順次切り替える関数
 */
function cycleChar(char: string, direction: "up" | "down"): string {
  const groupKey = ACCENT_GROUP_KEY[char];
  if (!groupKey) return char;
  const list = ACCENT_MAP[groupKey];
  if (!list) return char;
  const currentIndex = list.indexOf(char);
  if (currentIndex === -1) return char;

  const delta = direction === "up" ? 1 : -1;
  const nextIndex = (currentIndex + delta + list.length) % list.length;
  return list[nextIndex];
}

const SPECIAL_KEYS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"];

export default function SpanishTablePractice({ tables }: { tables: GrammarTableData[] }) {
  // カテゴリ選択状態（"all" または 各カテゴリのタイトル）
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 入力グリッドの回答データ保持: key = `${tableIndex}-${rowIndex}-${colIndex}` -> value
  const [gridAnswers, setGridAnswers] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);

  // 現在フォーカス中の入力欄のキー
  const [activeInputKey, setActiveInputKey] = useState<string | null>(null);

  // 各入力欄への参照を保持するMap
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // 選択フィルタリング後のテーブル一覧
  const filteredTables = tables.filter(
    (t) => selectedCategory === "all" || t.categoryTitle === selectedCategory,
  );

  /**
   * セルに入力があったときの更新処理
   */
  const handleCellChange = (cellKey: string, value: string) => {
    setGridAnswers((prev) => ({
      ...prev,
      [cellKey]: value,
    }));
  };

  /**
   * 答え合わせ実行処理
   */
  const handleCheckAnswers = () => {
    setIsChecked(true);
  };

  /**
   * 演習のリセット処理
   */
  const handleReset = useCallback(() => {
    setGridAnswers({});
    setIsChecked(false);
  }, []);

  /**
   * カテゴリ切替処理
   */
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    handleReset();
  };

  /**
   * 入力キーボードイベント（↑ / ↓ 矢印キーでアクセント変換）
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    cellKey: string,
    currentValue: string,
  ) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const input = inputRefs.current.get(cellKey);
      if (!input || !currentValue) return;

      const selStart = input.selectionStart ?? currentValue.length;

      let targetIdx = -1;
      for (let i = Math.min(selStart - 1, currentValue.length - 1); i >= 0; i--) {
        if (ACCENT_GROUP_KEY[currentValue[i]]) {
          targetIdx = i;
          break;
        }
      }

      if (targetIdx === -1) {
        for (let i = selStart; i < currentValue.length; i++) {
          if (ACCENT_GROUP_KEY[currentValue[i]]) {
            targetIdx = i;
            break;
          }
        }
      }

      if (targetIdx !== -1) {
        const charToCycle = currentValue[targetIdx];
        const newChar = cycleChar(charToCycle, e.key === "ArrowUp" ? "up" : "down");
        const newVal =
          currentValue.slice(0, targetIdx) + newChar + currentValue.slice(targetIdx + 1);

        handleCellChange(cellKey, newVal);

        requestAnimationFrame(() => {
          const updatedInput = inputRefs.current.get(cellKey);
          if (updatedInput) {
            updatedInput.setSelectionRange(selStart, selStart);
          }
        });
      }
    }
  };

  /**
   * 特殊文字ボタンクリックでアクティブな入力欄へ文字挿入
   */
  const handleInsertSpecialChar = (char: string) => {
    if (!activeInputKey) return;
    const input = inputRefs.current.get(activeInputKey);
    const val = gridAnswers[activeInputKey] || "";
    const selStart = input?.selectionStart ?? val.length;
    const selEnd = input?.selectionEnd ?? val.length;

    const newVal = val.slice(0, selStart) + char + val.slice(selEnd);
    handleCellChange(activeInputKey, newVal);

    requestAnimationFrame(() => {
      if (input) {
        input.focus();
        const newPos = selStart + char.length;
        input.setSelectionRange(newPos, newPos);
      }
    });
  };

  if (!tables || tables.length === 0) {
    return (
      <div className="my-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          文法表データが見つかりませんでした。
        </p>
      </div>
    );
  }

  // 正解数の計算
  let totalCells = 0;
  let correctCount = 0;
  filteredTables.forEach((table, tIdx) => {
    table.rows.forEach((row, rIdx) => {
      row.cells.forEach((expected, cIdx) => {
        totalCells += 1;
        const key = `${tIdx}-${rIdx}-${cIdx}`;
        const userVal = (gridAnswers[key] || "").trim().toLowerCase();
        if (userVal === expected.trim().toLowerCase()) {
          correctCount += 1;
        }
      });
    });
  });

  return (
    <div className="my-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 設定・カテゴリ選択パネル */}
      <div className="mb-6 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              カテゴリ選択:
            </span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-teal-600 text-white dark:bg-teal-500"
                    : "bg-white text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                全カテゴリ
              </button>
              {tables.map((t) => (
                <button
                  key={t.categoryTitle}
                  type="button"
                  onClick={() => handleCategoryChange(t.categoryTitle)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    selectedCategory === t.categoryTitle
                      ? "bg-teal-600 text-white dark:bg-teal-500"
                      : "bg-white text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {t.categoryTitle}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 特殊文字ボタンパレット */}
      <div className="mb-6 rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          特殊文字入力 (フォーカス中のセルに挿入)
        </span>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {SPECIAL_KEYS.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => handleInsertSpecialChar(char)}
              className="h-8 w-8 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {char}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          💡 入力セルで <strong>↑ / ↓ 矢印キー</strong> を押してもアクセント記号（á, é, í, ó, ú, ñ
          など）へ変換できます。
        </p>
      </div>

      {/* 文法表完成グリッド */}
      <div className="flex flex-col gap-8">
        {filteredTables.map((table, tIdx) => (
          <div key={table.categoryTitle} className="overflow-x-auto">
            <h3 className="mb-3 text-base font-bold text-zinc-900 dark:text-zinc-50">
              【{table.categoryTitle}】
            </h3>
            <table className="w-full border-collapse rounded-xl border border-zinc-200 text-left text-sm dark:border-zinc-800">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900">
                  {table.headers.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="border border-zinc-200 p-2.5 font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                    <td className="border border-zinc-200 p-2.5 font-medium text-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                      {row.label}
                    </td>
                    {row.cells.map((expected, cIdx) => {
                      const key = `${tIdx}-${rIdx}-${cIdx}`;
                      const val = gridAnswers[key] || "";
                      const isCellCorrect =
                        isChecked && val.trim().toLowerCase() === expected.trim().toLowerCase();
                      const isCellWrong = isChecked && !isCellCorrect;

                      return (
                        <td key={cIdx} className="border border-zinc-200 p-2 dark:border-zinc-800">
                          <div className="flex flex-col gap-1">
                            <input
                              ref={(el) => {
                                if (el) inputRefs.current.set(key, el);
                                else inputRefs.current.delete(key);
                              }}
                              type="text"
                              value={val}
                              disabled={isChecked}
                              onFocus={() => setActiveInputKey(key)}
                              onChange={(e) => handleCellChange(key, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, key, val)}
                              placeholder="..."
                              className={`w-full rounded-lg border px-2.5 py-1.5 text-sm font-medium outline-none transition-colors dark:bg-zinc-900 dark:text-zinc-50 ${
                                isChecked
                                  ? isCellCorrect
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
                                  : "border-zinc-300 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:focus:border-teal-400"
                              }`}
                            />
                            {isCellWrong && (
                              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                正解: {expected}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* スコア・操作ボタンエリア */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {isChecked && (
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              答え合わせ結果:{" "}
              <span className="text-teal-600 dark:text-teal-400">{correctCount}</span> /{" "}
              {totalCells} 正解 (
              {totalCells > 0 ? Math.round((correctCount / totalCells) * 100) : 0}%)
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          {!isChecked ? (
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              答え合わせ
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              もう一度挑戦する
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
