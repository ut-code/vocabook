"use client";

import { useState } from "react";
import { ListeningClozePractice } from "@/components/listening/ListeningClozePractice";
import { ListeningPractice } from "@/components/listening/ListeningPractice";
import type {
  ListeningClozeEntry,
  ListeningLanguageConfig,
  ListeningWordEntry,
} from "@/lib/listening/types";

type ListeningMode = "word" | "cloze";

const MODE_OPTIONS: { value: ListeningMode; label: string; description: string }[] = [
  { value: "word", label: "単語の聞き分け", description: "紛らわしい単語の発音を聞いて綴りを答える" },
  { value: "cloze", label: "長文の穴埋め", description: "文の発音を聞いて、空欄に入る語を答える" },
];

/**
 * 「単語の聞き分け」と「長文の穴埋め」、2つの発音識別演習を切り替えるためのラッパー。
 */
export function ListeningSection({
  words,
  clozeItems,
  language,
}: {
  words: ListeningWordEntry[];
  clozeItems: ListeningClozeEntry[];
  language: ListeningLanguageConfig;
}) {
  const [mode, setMode] = useState<ListeningMode>("word");

  return (
    <div>
      {/* 演習モード切り替え */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            className={`flex-1 rounded-2xl border-2 px-5 py-3.5 text-left transition-colors sm:max-w-xs ${
              mode === opt.value
                ? "border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/50"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            }`}
          >
            <span
              className={`block text-base font-bold ${
                mode === opt.value
                  ? "text-teal-700 dark:text-teal-300"
                  : "text-zinc-800 dark:text-zinc-100"
              }`}
            >
              {opt.label}
            </span>
            <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
              {opt.description}
            </span>
          </button>
        ))}
      </div>

      {mode === "word" ? (
        <ListeningPractice words={words} language={language} />
      ) : (
        <ListeningClozePractice items={clozeItems} language={language} />
      )}
    </div>
  );
}
