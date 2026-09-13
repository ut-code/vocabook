"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 穴埋め問題アイテムの型定義
export type FillInQuestionItem = {
  id: string;
  categoryTitle: string;
  sentence: string;
  translation: string;
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

export type CountOption = "5" | "10" | "20" | "all";

function filterItemsByCategory(
  items: FillInQuestionItem[],
  category: string,
): FillInQuestionItem[] {
  if (category === "all") return items;
  return items.filter((item) => item.categoryTitle === category);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SpanishFillInPractice({ items }: { items: FillInQuestionItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCount, setSelectedCount] = useState<CountOption>("10");

  // カテゴリ一覧の取得
  const categories = Array.from(new Set(items.map((item) => item.categoryTitle)));

  // 問題リストの構築純粋関数
  const buildQuestions = useCallback(
    (itemsList: FillInQuestionItem[], cat: string, count: CountOption) => {
      const filtered = filterItemsByCategory(itemsList, cat);
      const shuffled = shuffleArray(filtered);
      const countNum = count === "all" ? shuffled.length : parseInt(count, 10);
      return shuffled.slice(0, countNum);
    },
    [],
  );

  // 初期化時に items から直ちに問題セットを生成（useEffect内でのsetState呼び出しによるカスケードレンダリングを回避）
  const [questions, setQuestions] = useState<FillInQuestionItem[]>(() =>
    buildQuestions(items, "all", "10"),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 範囲選択や出題数が変更された際、または再挑戦時に問題をリセットする処理
   */
  const resetQuiz = useCallback(
    (cat: string, count: CountOption) => {
      const newQuestions = buildQuestions(items, cat, count);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setIsAnswered(false);
      setUserAnswer("");
      setIsCorrect(null);
    },
    [items, buildQuestions],
  );

  // 新しい問題が表示された際、入力欄へ自動フォーカスをあてる
  useEffect(() => {
    if (!isFinished && !isAnswered) {
      inputRef.current?.focus();
    }
  }, [currentIndex, isFinished, isAnswered]);

  const currentQuestion = questions[currentIndex];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    resetQuiz(cat, selectedCount);
  };

  const handleCountChange = (count: CountOption) => {
    setSelectedCount(count);
    resetQuiz(selectedCategory, count);
  };

  /**
   * 解答の送信および次問題への遷移処理
   */
  const handleSubmit = () => {
    if (isAnswered) {
      goNext();
      return;
    }

    if (!userAnswer.trim() || !currentQuestion) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedTarget = currentQuestion.answer.trim().toLowerCase();
    const correct = normalizedUser === normalizedTarget;

    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  /**
   * 次の問題に進むか、全問題終了画面へ移行する処理
   */
  const goNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleSkip = () => {
    goNext();
  };

  /**
   * キーボード入力ハンドラ。
   * ↑ / ↓ 矢印キーで文字のアクセント記号切り替えを行い、Enterキーで解答送信する。
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const input = inputRef.current;
      if (!input || !userAnswer) return;

      const selStart = input.selectionStart ?? userAnswer.length;

      let targetIdx = -1;
      for (let i = Math.min(selStart - 1, userAnswer.length - 1); i >= 0; i--) {
        if (ACCENT_GROUP_KEY[userAnswer[i]]) {
          targetIdx = i;
          break;
        }
      }

      if (targetIdx === -1) {
        for (let i = selStart; i < userAnswer.length; i++) {
          if (ACCENT_GROUP_KEY[userAnswer[i]]) {
            targetIdx = i;
            break;
          }
        }
      }

      if (targetIdx !== -1) {
        const charToCycle = userAnswer[targetIdx];
        const newChar = cycleChar(charToCycle, e.key === "ArrowUp" ? "up" : "down");
        const newVal = userAnswer.slice(0, targetIdx) + newChar + userAnswer.slice(targetIdx + 1);
        setUserAnswer(newVal);

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(selStart, selStart);
          }
        });
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * 画面上の特殊文字ボタンをクリックした際、カーソル位置へ文字を挿入する処理
   */
  const handleInsertSpecialChar = (char: string) => {
    const input = inputRef.current;
    const selStart = input?.selectionStart ?? userAnswer.length;
    const selEnd = input?.selectionEnd ?? userAnswer.length;

    const newVal = userAnswer.slice(0, selStart) + char + userAnswer.slice(selEnd);
    setUserAnswer(newVal);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newPos = selStart + char.length;
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  if (!items || items.length === 0) {
    return (
      <div className="my-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          出題データが見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 設定パネル（カテゴリ選択 ＆ 出題数） */}
      <div className="mb-6 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* カテゴリ選択 */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              カテゴリ:
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
                全問題
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white dark:bg-teal-500"
                      : "bg-white text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 出題数選択 */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">出題数:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: "5問", value: "5" },
                { label: "10問", value: "10" },
                { label: "20問", value: "20" },
                { label: "全問", value: "all" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCountChange(opt.value as CountOption)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    selectedCount === opt.value
                      ? "bg-teal-600 text-white dark:bg-teal-500"
                      : "bg-white text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isFinished ? (
        /* 全問題完了時のスコア結果画面 */
        <div className="py-8 text-center">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">演習終了！</h3>
          <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-300">
            スコア: <span className="font-semibold text-teal-600 dark:text-teal-400">{score}</span>{" "}
            / {questions.length} (
            {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%)
          </p>
          <button
            type="button"
            onClick={() => resetQuiz(selectedCategory, selectedCount)}
            className="mt-6 inline-flex items-center rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            もう一度挑戦する
          </button>
        </div>
      ) : (
        /* 演習中画面 */
        <>
          {/* 進捗と現在スコア表示 */}
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>
              問題 {currentIndex + 1} / {questions.length}
            </span>
            <span>正解数: {score}</span>
          </div>

          {/* 出題カード表示 */}
          <div className="mt-6 text-center">
            <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              {currentQuestion?.categoryTitle}
            </span>
            <div className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {currentQuestion?.sentence}
            </div>
            <div className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {currentQuestion?.translation}
            </div>
          </div>

          {/* 解答入力エリア */}
          <div className="mt-6 flex flex-col items-center">
            <div className="w-full max-w-md">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                disabled={isAnswered}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="空欄に入る適切な語形を入力..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-center text-lg font-medium text-zinc-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-teal-400 dark:disabled:bg-zinc-800"
              />

              {/* 特殊文字ボタンキーボード */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                {SPECIAL_KEYS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleInsertSpecialChar(char)}
                    disabled={isAnswered}
                    className="h-9 w-9 rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    {char}
                  </button>
                ))}
              </div>

              <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                💡 <strong>↑ / ↓ 矢印キー</strong> で文字にアクセント記号（á, é, í, ó, ú, ñ
                など）を付与・切替できます。
              </p>
            </div>

            {/* 判定結果バッジ */}
            {isAnswered && (
              <div
                className={`mt-4 w-full max-w-md rounded-xl p-4 text-center font-medium ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                }`}
              >
                {isCorrect ? (
                  <p className="text-base font-bold">正解です！</p>
                ) : (
                  <div>
                    <p className="text-base font-bold">不正解です</p>
                    <p className="mt-1 text-sm">
                      正解: <span className="font-semibold">{currentQuestion?.answer}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 操作ボタン */}
            <div className="mt-6 flex items-center gap-3">
              {isAnswered ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  {currentIndex + 1 < questions.length ? "次の問題へ" : "結果を見る"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  >
                    回答する
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    パス
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
