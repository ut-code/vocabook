"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ACCENT_FONT_STYLE, AccentInput } from "@/components/verbs/AccentInput";
import { speak } from "@/lib/speech";
import type { ListeningLanguageConfig, ListeningWordEntry } from "@/lib/listening/types";

// 出題数の選択肢型定義
export type CountOption = "5" | "10" | "20" | "all";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function filterByCategory(
  words: ListeningWordEntry[],
  category: string,
): ListeningWordEntry[] {
  if (category === "all") return words;
  return words.filter((w) => w.categoryTitle === category);
}

export function ListeningPractice({
  words,
  language,
}: {
  words: ListeningWordEntry[];
  language: ListeningLanguageConfig;
}) {
  // ユーザーが選択した設定状態（カテゴリ・出題数）
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCount, setSelectedCount] = useState<CountOption>("10");

  // カテゴリ一覧の取得
  const categories = Array.from(new Set(words.map((w) => w.categoryTitle)));

  // 問題リストの構築純粋関数
  const buildQuestions = useCallback(
    (list: ListeningWordEntry[], cat: string, count: CountOption) => {
      const filtered = filterByCategory(list, cat);
      const shuffled = shuffleArray(filtered);
      const countNum = count === "all" ? shuffled.length : parseInt(count, 10);
      return shuffled.slice(0, countNum);
    },
    [],
  );

  // 初回マウントフラグ
  const isMountedRef = useRef(false);

  // クライアントハイドレーション一致のための問題状態
  const [questions, setQuestions] = useState<ListeningWordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  /**
   * 出題設定が変更された際、または再挑戦時に問題をリセットする処理
   */
  const resetQuiz = useCallback(
    (cat: string, count: CountOption) => {
      const newQuestions = buildQuestions(words, cat, count);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setIsAnswered(false);
      setUserAnswer("");
      setIsCorrect(null);
    },
    [words, buildQuestions],
  );

  // クライアントサイドでのマウント時に初回問題を生成
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      resetQuiz("all", "10");
    }
  }, [resetQuiz]);

  // アンマウント時に読み上げ中の音声を止める
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const playCurrent = useCallback(
    (word?: ListeningWordEntry) => {
      if (!word) return;
      const started = speak(word.spokenText ?? word.answer, language.langTag, {
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
      if (started) setSpeaking(true);
    },
    [language.langTag],
  );

  // 新しい問題が表示されるたびに自動で発音を再生する
  // （setTimeoutで遅延させ、エフェクト本体内での同期的なsetState呼び出しを避ける）
  useEffect(() => {
    if (isFinished || !currentQuestion) return;
    const timer = setTimeout(() => playCurrent(currentQuestion), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, isFinished]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    resetQuiz(cat, selectedCount);
  };

  const handleCountChange = (count: CountOption) => {
    setSelectedCount(count);
    resetQuiz(selectedCategory, count);
  };

  /**
   * 次の問題に進むか、全問題終了画面へ移行する処理
   */
  const goNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, questions.length]);

  /**
   * 解答の送信および次問題への遷移処理
   */
  const handleSubmit = useCallback(() => {
    if (isAnswered) {
      goNext();
      return;
    }

    if (!userAnswer.trim() || !currentQuestion) return;

    const normalize = language.normalize ?? ((v: string) => v.trim().toLowerCase());
    const correct = normalize(userAnswer) === normalize(currentQuestion.answer);

    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((s) => s + 1);
    }
  }, [isAnswered, goNext, userAnswer, currentQuestion, language]);

  // 結果表示状態でフォーカスが外れていてもEnterキーを押せば次へ進むキーボードリスナー
  useEffect(() => {
    if (!isAnswered || isFinished) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (e.isComposing) return;
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isAnswered, isFinished, goNext]);

  const handleSkip = () => {
    goNext();
  };

  if (!words || words.length === 0) {
    return (
      <div className="my-6 rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          出題データが見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 設定パネル（カテゴリ選択・出題数） */}
      <div className="mb-8 rounded-xl border border-zinc-100 bg-zinc-50/90 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* カテゴリ選択 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              カテゴリ:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-teal-600 text-white shadow-sm dark:bg-teal-500"
                    : "bg-white text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                全問題
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white shadow-sm dark:bg-teal-500"
                      : "bg-white text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 出題数選択 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">出題数:</span>
            <div className="flex flex-wrap gap-1.5">
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
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    selectedCount === opt.value
                      ? "bg-teal-600 text-white shadow-sm dark:bg-teal-500"
                      : "bg-white text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
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
        <div className="py-10 text-center">
          <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">演習終了！</h3>
          <p className="mt-4 text-xl text-zinc-700 dark:text-zinc-300">
            スコア:{" "}
            <span className="font-bold text-teal-600 dark:text-teal-400 text-2xl">{score}</span> /{" "}
            {questions.length} (
            {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%)
          </p>
          <button
            type="button"
            onClick={() => resetQuiz(selectedCategory, selectedCount)}
            className="mt-8 inline-flex items-center rounded-xl bg-teal-600 px-8 py-3.5 text-base font-bold text-white shadow-md transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            もう一度挑戦する
          </button>
        </div>
      ) : (
        /* 演習中画面 */
        <>
          {/* 進捗・現在スコア表示 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm font-bold text-zinc-600 dark:text-zinc-400">
            <span>
              問題{" "}
              <strong className="text-base text-zinc-900 dark:text-zinc-100">
                {currentIndex + 1}
              </strong>{" "}
              / {questions.length}
            </span>
            <span>
              正解数:{" "}
              <strong className="text-base text-teal-600 dark:text-teal-400">{score}</strong>
            </span>
          </div>

          {/* 出題カード表示 */}
          <div className="mt-8 text-center">
            <span className="inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {currentQuestion?.categoryTitle}
            </span>

            {/* 発音再生エリア */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => playCurrent(currentQuestion)}
                className="flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-base font-bold text-white shadow-md transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                {speaking ? "🔊 再生中…" : "🔁 もう一度聞く"}
              </button>
              {currentQuestion?.meaning && (
                <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">
                  ヒント: {currentQuestion.meaning}
                </p>
              )}
            </div>
          </div>

          {/* 解答入力エリア */}
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full max-w-lg">
              <AccentInput
                value={userAnswer}
                onChange={setUserAnswer}
                onSubmit={handleSubmit}
                disabled={isAnswered}
                autoFocus
                placeholder="聞こえた発音の綴りを入力..."
                accentCycles={language.accentCycles}
                toolbarChars={language.toolbarChars}
                className="w-full rounded-2xl border-2 border-zinc-300 bg-white px-5 py-4 text-center text-2xl font-semibold text-zinc-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-teal-400 dark:disabled:bg-zinc-800"
              />
            </div>

            {/* 判定結果バッジ */}
            {isAnswered && (
              <div
                className={`mt-6 w-full max-w-lg rounded-2xl p-5 text-center font-medium shadow-sm transition-all ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-50 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
                }`}
              >
                {isCorrect ? (
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ✨ 正解です！
                  </p>
                ) : (
                  <div>
                    <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                      ❌ 不正解です
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      正解:{" "}
                      <span
                        className="font-bold underline underline-offset-4 decoration-rose-400"
                        style={ACCENT_FONT_STYLE}
                      >
                        {currentQuestion?.answer}
                      </span>
                    </p>
                  </div>
                )}
                {currentQuestion?.note && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {currentQuestion.note}
                  </p>
                )}
              </div>
            )}

            {/* 操作ボタン */}
            <div className="mt-8 flex items-center gap-4">
              {isAnswered ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-2xl bg-teal-600 px-8 py-3.5 text-base font-bold text-white shadow-md transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  {currentIndex + 1 < questions.length ? "次の問題へ" : "結果を見る"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-2xl bg-teal-600 px-8 py-3.5 text-base font-bold text-white shadow-md transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  >
                    回答する
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="rounded-2xl border-2 border-zinc-200 px-6 py-3.5 text-base font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
