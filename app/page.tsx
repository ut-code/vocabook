import Link from "next/link";

import Background from "@/components/background";

// ルートページ
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black">
      <section className="relative flex w-full flex-col items-center overflow-hidden px-6 py-24 text-center">
        <Background />
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6">
          <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
            <span className="h-px w-6 bg-zinc-300 dark:bg-zinc-700" />
            多言語対応 語学暗記アプリ
            <span className="h-px w-6 bg-zinc-300 dark:bg-zinc-700" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-6xl dark:text-zinc-50">
            Vocabook
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            自分だけの多次元単語帳を作って共有できる、
            <br />
            多言語対応の語学暗記アプリ。
          </p>
        </div>
      </section>

      <section className="grid w-full max-w-5xl grid-cols-1 gap-8 px-6 pb-28 sm:grid-cols-2">
        <Link
          href="/my-notebooks"
          className="group flex flex-col gap-6 rounded-3xl border border-coral-200 bg-white p-8 text-left transition-all hover:-translate-y-1 hover:border-coral-300 hover:shadow-xl hover:shadow-coral-100 sm:p-9 dark:border-coral-900/40 dark:bg-zinc-950 dark:hover:border-coral-700/60 dark:hover:shadow-none"
        >
          <div className="relative overflow-hidden rounded-2xl border border-coral-200/70 bg-coral-50/40 p-5 dark:border-coral-900/30 dark:bg-coral-950/10">
            <span className="absolute right-3 top-3 rounded-full border border-dashed border-coral-300 px-2 py-0.5 text-[10px] text-coral-700/70 dark:border-coral-800 dark:text-coral-500/70">
              仮画像
            </span>
            <p className="text-[11px] tracking-wide text-zinc-400">FR → JA</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">liberté</p>
            <div className="mt-3 flex gap-1.5">
              <span className="rounded-full bg-coral-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                意味
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                発音
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                例文
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">自由</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-coral-900 dark:text-coral-100">My単語帳</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              意味・発音・例文など複数の軸を持つ、自分だけの単語帳を作成。
              <br />
              そのまま他の人と共有できます。
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-coral-500 px-6 py-3 text-sm font-bold text-white transition-colors group-hover:bg-coral-600">
            単語帳を作ってみる
            <span className="vb-arrow-window" aria-hidden="true">
              <span className="vb-arrow-track">
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </span>
        </Link>

        <Link
          href="/learn"
          className="group flex flex-col gap-6 rounded-3xl border border-tealblue-200 bg-white p-8 text-left transition-all hover:-translate-y-1 hover:border-tealblue-300 hover:shadow-xl hover:shadow-tealblue-100 sm:p-9 dark:border-tealblue-900/40 dark:bg-zinc-950 dark:hover:border-tealblue-700/60 dark:hover:shadow-none"
        >
          <div className="relative overflow-hidden rounded-2xl border border-tealblue-200/70 bg-tealblue-50/40 p-5 dark:border-tealblue-900/30 dark:bg-tealblue-950/10">
            <span className="absolute right-3 top-3 rounded-full border border-dashed border-tealblue-300 px-2 py-0.5 text-[10px] text-tealblue-700/70 dark:border-tealblue-800 dark:text-tealblue-400/70">
              仮画像
            </span>
            <p className="text-[11px] tracking-wide text-zinc-400">対応言語</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <span className="rounded-xl border border-black/[.08] bg-white px-3 py-2 text-center text-xs font-medium text-zinc-700 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-300">
                中国語
              </span>
              <span className="rounded-xl border border-black/[.08] bg-white px-3 py-2 text-center text-xs font-medium text-zinc-700 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-300">
                フランス語
              </span>
              <span className="rounded-xl border border-black/[.08] bg-white px-3 py-2 text-center text-xs font-medium text-zinc-700 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-300">
                ドイツ語
              </span>
              <span className="rounded-xl border border-black/[.08] bg-white px-3 py-2 text-center text-xs font-medium text-zinc-700 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-300">
                スペイン語
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-tealblue-900 dark:text-tealblue-100">
              学習教材
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              単語帳を自分で作らなくても、
              <br />
              多言語対応の暗記教材ですぐに学習を始められます。
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-tealblue-600 px-6 py-3 text-sm font-bold text-white transition-colors group-hover:bg-tealblue-700">
            教材を見てみる
            <span className="vb-arrow-window" aria-hidden="true">
              <span className="vb-arrow-track">
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </span>
        </Link>
      </section>
    </main>
  );
}
