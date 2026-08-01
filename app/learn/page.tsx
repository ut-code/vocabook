const LANGUAGES = [
  { slug: "en", label: "英語" },
  { slug: "zh", label: "中国語" },
  { slug: "fr", label: "フランス語" },
  { slug: "es", label: "スペイン語" },
];

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
          <li
            key={language.slug}
            className="rounded-full border border-black/[.08] px-4 py-2 text-sm text-zinc-600 dark:border-white/[.145] dark:text-zinc-400"
          >
            {language.label}
          </li>
        ))}
      </ul>
    </main>
  );
}
