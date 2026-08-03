import Link from "next/link";

import { LANGUAGES } from "./languages";

export default function LearnPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        学習教材
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        多言語対応の暗記教材は準備中です。対応予定の言語は以下の通りです。
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-3">
        {LANGUAGES.map((language) => (
          <Link key={language.languageSlug} href={`/learn/${language.languageSlug}`} className="flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-6 text-left transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]">
            {language.label}
          </Link>
        ))}
      </ul>
    </main>
  );
}
