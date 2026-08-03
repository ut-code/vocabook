import { notFound } from "next/navigation";

import { getLanguage, LANGUAGES } from "../../languages";
import { getSection, getSections } from "../../content";
import { MarkdownRenderer } from "../../../components/Markdown";

export async function generateStaticParams() {
  const paramsByLanguage = await Promise.all(
    LANGUAGES.map(async (language) => {
      const sections = await getSections(language.languageSlug);
      return sections.map((section) => ({
        language: language.languageSlug,
        section: section.slug,
      }));
    }),
  );

  return paramsByLanguage.flat();
}

export default async function LearnSectionPage(
  props: PageProps<"/learn/[language]/[section]">,
) {
  const { language: languageSlug, section: rawSectionSlug } =
    await props.params;
  const sectionSlug = decodeURIComponent(rawSectionSlug);
  const language = getLanguage(languageSlug);

  if (!language) {
    notFound();
  }

  const section = await getSection(languageSlug, sectionSlug);

  if (!section) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {language.label} / {section.title}
      </h1>
      {section.source && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {section.source}
        </p>
      )}

      <div className="mt-8 w-full max-w-3xl text-left">
        <MarkdownRenderer content={section.body} />
      </div>
    </main>
  );
}
