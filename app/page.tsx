import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black">
      <section className="flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Vocabook
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          自分だけの多次元単語帳を作って共有できる、多言語対応の語学暗記アプリ。
        </p>
      </section>

      <section className="grid w-full max-w-3xl grid-cols-1 gap-6 px-6 pb-24 sm:grid-cols-2">
        <Link
          href="/my-notebooks"
          className="flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-6 text-left transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]"
        >
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            My単語帳
          </h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            意味・発音・例文など複数の軸を持つ、自分だけの単語帳を作成。
            そのまま他の人と共有できます。
          </p>
        </Link>

        <Link
          href="/learn"
          className="flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-6 text-left transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]"
        >
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            学習教材
          </h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            単語帳を自分で作らなくても、多言語対応の暗記教材ですぐに学習を始められます。
          </p>
        </Link>
      </section>
    </main>
  );
}
