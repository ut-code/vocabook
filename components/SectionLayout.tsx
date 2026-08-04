import { getLanguage } from "@/app/learn/languages";

export function SectionLayout({
  languageSlug,
  children,
}: {
  languageSlug: string;
  children: React.ReactNode;
}) {
  const language = getLanguage(languageSlug);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {language?.label}
      </p>
      <div className="mt-8 w-full max-w-3xl text-left">{children}</div>
    </main>
  );
}

// 各言語ディレクトリの layout.tsx はファイル自体が必須
export function createSectionLayout(languageSlug: string) {
  return function LanguageSectionLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <SectionLayout languageSlug={languageSlug}>{children}</SectionLayout>;
  };
}
