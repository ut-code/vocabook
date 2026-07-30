export default async function LearnLanguagePage(
  props: PageProps<"/learn/[language]">,
) {
  const { language } = await props.params;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        学習教材: {language}
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        この言語の教材は準備中です。
      </p>
    </main>
  );
}
