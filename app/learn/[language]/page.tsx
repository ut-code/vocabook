import Link from "next/link";
import { notFound } from "next/navigation";

import { getLanguage, LANGUAGES } from "../languages";
import { getSections } from "../content";

// ルート生成の補助関数
export function generateStaticParams() {
  return LANGUAGES.map((language) => ({ language: language.languageSlug }));
}

export default async function LearnLanguagePage(
  // pageファイルのデフォルトコンポーネントには、propsとしてparams及びsearchParamsが自動的に渡される
  // paramsは、URLパスの [...] 部分（動的セグメントと呼ぶ）である
  // searchParamsは、URLの?key=value の部分（クエリパラメータと呼び、まだ使用していない）である
  // PagePropsは、params及びsearchParamsの型を定義するためのグローバルに用いることができる型である
  // <"/learn/[language]">の部分は、PagePropsの型引数であり、params及びsearchParamsの型を自動的に推論するために使用される
  props: PageProps<"/learn/[language]">,
) {
  const { language: languageSlug } = await props.params;
  const language = getLanguage(languageSlug);

  if (!language) {
    notFound();
  }

  const sections = await getSections(language.languageSlug);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-3xl">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          学習教材一覧に戻る
        </Link>
      </div>

      <div className="mt-4 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {language.label}の学習教材
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          学びたいセクションを選んでください。
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((section, index) => (
          <Link
            key={section.sectionSlug}
            href={`/learn/${language.languageSlug}/${section.sectionSlug}`}
            className="group flex items-center justify-between rounded-2xl border border-black/[.08] bg-white p-5 text-left transition-all hover:border-tealblue-400/60 hover:shadow-sm dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-tealblue-600/60"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-tealblue-600 dark:text-tealblue-400">
                Section {index + 1}
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {section.title}
              </span>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-tealblue-50 group-hover:text-tealblue-600 dark:bg-zinc-900 dark:text-zinc-500 dark:group-hover:bg-tealblue-950/60 dark:group-hover:text-tealblue-400">
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
