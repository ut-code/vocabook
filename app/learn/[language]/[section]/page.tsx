import { notFound } from "next/navigation";

import { getLanguage, getSection, getSections, LANGUAGES } from "../../data";

export function generateStaticParams() {
  return LANGUAGES.flatMap((language) =>
    getSections(language.languageSlug).map((section) => ({
      language: language.languageSlug,
      section: section.sectionSlug,
    })),
  );
}

export default async function LearnSectionPage(
  props: PageProps<"/learn/[language]/[section]">,
) {
  const { language: languageSlug, section: sectionSlug } = await props.params;
  const language = getLanguage(languageSlug);
  const section = getSection(languageSlug, sectionSlug);

  if (!language || !section) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {language.label} / {section.label}
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        このセクションの学習項目は準備中です。
      </p>
    </main>
  );
}
