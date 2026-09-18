"use client";

import { ACCENT_FONT_STYLE, AccentInput } from "@/components/verbs/AccentInput";
import type { CountOption } from "@/components/listening/useListeningQuiz";
import { useListeningQuiz } from "@/components/listening/useListeningQuiz";
import type { ListeningClozeEntry, ListeningLanguageConfig } from "@/lib/listening/types";

/**
 * 文中の "___" を空欄表示に置き換える。プレースホルダーが無い場合はそのまま返す
 */
function renderSentenceWithBlank(sentence: string, filled: string | null) {
  const parts = sentence.split("___");
  if (parts.length < 2) return sentence;

  return (
    <>
      {parts[0]}
      <span
        className={`mx-1 inline-block min-w-16 border-b-2 px-1 font-black ${
          filled ? "border-teal-500 text-teal-700 dark:border-teal-400 dark:text-teal-300" : "border-zinc-400 dark:border-zinc-600"
        }`}
        style={filled ? ACCENT_FONT_STYLE : undefined}
      >
        {filled ?? "    "}
      </span>
      {parts.slice(1).join("___")}
    </>
  );
}

export function ListeningClozePractice({
  items,
  language,
}: {
  items: ListeningClozeEntry[];
  language: ListeningLanguageConfig;
}) {
  const {
    categories,
    selectedCategory,
    selectedCount,
    handleCategoryChange,
    handleCountChange,
    questions,
    currentIndex,
    currentQuestion,
    userAnswer,
    setUserAnswer,
    isAnswered,
    isCorrect,
    score,
    isFinished,
    speaking,
    playCurrent,
    handleSubmit,
    goNext,
    handleSkip,
    resetQuiz,
  } = useListeningQuiz(items, language);

  if (!items || items.length === 0) {
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
            </div>

            {/* 空欄付きの文表示 */}
            {currentQuestion && (
              <p className="mt-6 text-xl md:text-2xl font-bold leading-relaxed text-zinc-900 dark:text-zinc-50">
                {renderSentenceWithBlank(
                  currentQuestion.sentence,
                  isAnswered ? currentQuestion.answer : null,
                )}
              </p>
            )}
            {currentQuestion?.translation && (
              <p className="mt-3 text-base font-medium text-zinc-600 dark:text-zinc-400">
                ヒント: {currentQuestion.translation}
              </p>
            )}
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
                placeholder="空欄に入る語を、発音を聞いて入力..."
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
