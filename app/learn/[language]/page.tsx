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
    <main className="flex flex-1 flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {language.label}の学習教材
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        学びたいセクションを選んでください。
      </p>
      <ul className="mt-8 flex flex-col justify-center gap-3">
        {sections.map((section) => (
          <Link
            key={section.sectionSlug}
            href={`/learn/${language.languageSlug}/${section.sectionSlug}`}
            className="flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-6 text-left transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]"
          >
            {section.title}
          </Link>
        ))}
      </ul>
    </main>
  );
}
