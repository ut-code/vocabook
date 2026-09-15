"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { LANGUAGES } from "@/app/learn/languages";
import { EssayPractice } from "@/components/essay/EssayPractice";

// /learn配下のどのページにいても右下に固定表示する、作文セクションへの入り口ボタン。
// 押すと言語選択→作文練習の順でモーダル内に表示する（言語ごとにページを分けず、ここで選ばせる）
export function EssayWidget() {
  const [open, setOpen] = useState(false);
  const [languageSlug, setLanguageSlug] = useState<string | null>(null);

  const close = () => setOpen(false);
  const selectedLanguage = LANGUAGES.find((l) => l.languageSlug === languageSlug);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="作文セクションを開く"
        title="作文"
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-tealblue-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-tealblue-700"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="作文"
            onClick={close}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl dark:bg-zinc-950 sm:rounded-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                {languageSlug ? (
                  <button
                    type="button"
                    onClick={() => setLanguageSlug(null)}
                    className="text-sm text-tealblue-600 hover:underline dark:text-tealblue-400"
                  >
                    ← 言語を選び直す
                  </button>
                ) : (
                  <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">作文</span>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="閉じる"
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {selectedLanguage ? (
                  <EssayPractice
                    key={selectedLanguage.languageSlug}
                    languageSlug={selectedLanguage.languageSlug}
                    languageLabel={selectedLanguage.label}
                  />
                ) : (
                  <LanguagePicker onSelect={setLanguageSlug} />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function LanguagePicker({ onSelect }: { onSelect: (languageSlug: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        どの言語で作文を書きますか？お題を選んで、AIに添削してもらいましょう。
      </p>
      <div className="grid grid-cols-2 gap-3">
        {LANGUAGES.map((language) => (
          <button
            key={language.languageSlug}
            type="button"
            onClick={() => onSelect(language.languageSlug)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center font-medium text-zinc-800 transition-colors hover:border-tealblue-400 hover:bg-tealblue-50/60 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-tealblue-600"
          >
            {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}
