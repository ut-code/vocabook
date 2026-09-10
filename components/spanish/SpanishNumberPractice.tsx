"use client";

import { useEffect, useRef, useState } from "react";

// 出題データアイテムの型定義
export type SpanishNumberItem = {
  num: string;
  spanish: string;
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

// 逆引きルックアップ用（アクセント文字から基本文字グループのキーを引くためのオブジェクト）
const ACCENT_GROUP_KEY: Record<string, string> = {};
for (const [base, list] of Object.entries(ACCENT_MAP)) {
  for (const char of list) {
    ACCENT_GROUP_KEY[char] = base;
  }
}

/**
 * 上下キー操作により、指定された文字をアクセントバリエーション内で順次サイクル切り替えする関数。
 * @param char 対象の文字
 * @param direction "up" (ArrowUp) の場合は次のバリエーション、"down" (ArrowDown) の場合は前のバリエーションへ
 */
function cycleChar(char: string, direction: "up" | "down"): string {
  const groupKey = ACCENT_GROUP_KEY[char];
  if (!groupKey) return char;
  const list = ACCENT_MAP[groupKey];
  if (!list) return char;
  const currentIndex = list.indexOf(char);
  if (currentIndex === -1) return char;

  // Modulo演算を用いて配列内を巡回する
  const delta = direction === "up" ? 1 : -1;
  const nextIndex = (currentIndex + delta + list.length) % list.length;
  return list[nextIndex];
}

// 画面上にボタンとして配置するスペイン語特殊文字のリスト
const SPECIAL_KEYS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"];

// 出題範囲のプリセット型定義
export type RangePreset = "all" | "0-19" | "20-50" | "50-100";

// 出題数の選択肢型定義
export type CountOption = "5" | "10" | "20" | "all";

/**
 * 選択された出題範囲プリセットに基づき、全問題の中から対象数値をフィルタリングする関数
 */
function filterItemsByRange(items: SpanishNumberItem[], range: RangePreset): SpanishNumberItem[] {
  return items.filter((item) => {
    const val = parseInt(item.num, 10);
    if (isNaN(val)) return true;
    if (range === "0-19") return val >= 0 && val <= 19;
    if (range === "20-50") return val >= 20 && val <= 50;
    if (range === "50-100") return val >= 50 && val <= 100;
    return true;
  });
}

/**
 * Fisher-Yatesシャッフルアルゴリズムを用いて配列をランダムに並び替える関数
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SpanishNumberPractice({ items }: { items: SpanishNumberItem[] }) {
  // ユーザーが選択した出題範囲と問題数の状態設定（初期値: 全範囲 / 10問）
  const [selectedRange, setSelectedRange] = useState<RangePreset>("all");
  const [selectedCount, setSelectedCount] = useState<CountOption>("10");

  // 現在の演習セッション用の問題一覧・現在インデックス・入力・スコア状態
  const [questions, setQuestions] = useState<SpanishNumberItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 入力欄のカーソル位置制御用の参照
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 範囲選択や出題数が変更された際、問題をフィルタリング・シャッフルして再スタートする処理
   */
  const initializeQuiz = (range: RangePreset, count: CountOption) => {
    const filtered = filterItemsByRange(items, range);
    const shuffled = shuffleArray(filtered);
    const countNum = count === "all" ? shuffled.length : parseInt(count, 10);
    const sliced = shuffled.slice(0, countNum);

    setQuestions(sliced);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setIsAnswered(false);
    setUserAnswer("");
    setIsCorrect(null);
  };

  // コンポーネントの初期化時に問題セットを生成
  useEffect(() => {
    if (items.length > 0) {
      initializeQuiz(selectedRange, selectedCount);
    }
  }, [items]);

  // 新しい問題が表示された際、入力欄へ自動フォーカスをあてる
  useEffect(() => {
    if (!isFinished && !isAnswered) {
      inputRef.current?.focus();
    }
  }, [currentIndex, isFinished, isAnswered]);

  const currentQuestion = questions[currentIndex];

  // 出題範囲変更時のハンドラ
  const handleRangeChange = (range: RangePreset) => {
    setSelectedRange(range);
    initializeQuiz(range, selectedCount);
  };

  // 出題数変更時のハンドラ
  const handleCountChange = (count: CountOption) => {
    setSelectedCount(count);
    initializeQuiz(selectedRange, count);
  };

  /**
   * 解答の送信および次問題への遷移処理
   */
  const handleSubmit = () => {
    // 既に解答表示状態のときは次の問題に進む
    if (isAnswered) {
      goNext();
      return;
    }

    if (!userAnswer.trim() || !currentQuestion) return;

    // 前後の空白を除去し、小文字に正規化して正誤判定
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedTarget = currentQuestion.spanish.trim().toLowerCase();
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

  // パス（スキップ）処理
  const handleSkip = () => {
    goNext();
  };

  /**
   * キーボード入力ハンドラ。
   * ↑ / ↓ 矢印キーで文字のアクセント記号切り替えを行い、Enterキーで解答送信する。
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // カーソルのデフォルト移動を禁止
      const input = inputRef.current;
      if (!input || !userAnswer) return;

      const selStart = input.selectionStart ?? userAnswer.length;

      // 1. まずカーソル位置の直前から前方へ向け、変換可能な文字を検索
      let targetIdx = -1;
      for (let i = Math.min(selStart - 1, userAnswer.length - 1); i >= 0; i--) {
        if (ACCENT_GROUP_KEY[userAnswer[i]]) {
          targetIdx = i;
          break;
        }
      }

      // 2. 前方で見つからなかった場合、カーソル位置より後ろを検索
      if (targetIdx === -1) {
        for (let i = selStart; i < userAnswer.length; i++) {
          if (ACCENT_GROUP_KEY[userAnswer[i]]) {
            targetIdx = i;
            break;
          }
        }
      }

      // 変換対象文字が存在する場合、アクセント記号を切り替えて入力文字列を更新
      if (targetIdx !== -1) {
        const charToCycle = userAnswer[targetIdx];
        const newChar = cycleChar(charToCycle, e.key === "ArrowUp" ? "up" : "down");
        const newVal = userAnswer.slice(0, targetIdx) + newChar + userAnswer.slice(targetIdx + 1);
        setUserAnswer(newVal);

        // 状態更新後に元のカーソル位置を復元する
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

    // 現在の選択範囲を置き換える形で特殊文字を挿入
    const newVal = userAnswer.slice(0, selStart) + char + userAnswer.slice(selEnd);
    setUserAnswer(newVal);

    // 挿入後に入力欄へフォーカスを戻し、カーソルを挿入文字の直後に配置
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
        <p className="text-sm text-zinc-500 dark:text-zinc-400">問題データが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 設定パネル（出題範囲 ＆ 問題数 のカスタマイズ） */}
      <div className="mb-6 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 出題範囲選択 */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">出題範囲:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: "全範囲", value: "all" },
                { label: "0〜19", value: "0-19" },
                { label: "20〜50", value: "20-50" },
                { label: "50〜100", value: "50-100" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRangeChange(opt.value as RangePreset)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    selectedRange === opt.value
                      ? "bg-teal-600 text-white dark:bg-teal-500"
                      : "bg-white text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 問題数選択 */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">問題数:</span>
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
            スコア: <span className="font-semibold text-teal-600 dark:text-teal-400">{score}</span> / {questions.length} (
            {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%)
          </p>
          <button
            type="button"
            onClick={() => initializeQuiz(selectedRange, selectedCount)}
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

          {/* 出題表示 */}
          <div className="mt-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              数字に対応するスペルを入力してください
            </span>
            <div className="mt-2 text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {currentQuestion?.num}
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
                placeholder="スペルを入力..."
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
                💡 <strong>↑ / ↓ 矢印キー</strong> で文字にアクセント記号（á, é, í, ó, ú, ñ など）を付与・切替できます。
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
                      正解: <span className="font-semibold">{currentQuestion?.spanish}</span>
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
