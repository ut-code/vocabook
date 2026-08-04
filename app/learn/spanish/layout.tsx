import { getLanguage } from "@/app/learn/languages";

const language = getLanguage("spanish");

// スペイン語セクション専用レイアウト（各言語ディレクトリの layout.tsx はファイル自体が必須）
export default function SpanishSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {language?.label}
      </p>
      <div className="spanish-contentmt-8 w-full max-w-3xl text-left">{children}</div>
    </main>
  );
}
