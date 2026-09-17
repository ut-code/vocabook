import Link from "next/link";
import { Bebas_Neue, Shippori_Mincho } from "next/font/google";

import Background from "@/components/background";
import BookShape from "@/components/book-shape";
import { MaterialsPreview } from "@/components/home/MaterialsPreview";
import { StudyModePreview } from "@/components/home/StudyModePreview";

// トップページのメインコピー「Vocabook」専用の見出しフォント（映画ポスター風の存在感を演出）
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

// キャッチコピー専用の明朝体（洋画の邦題コピーのような、字間の空いた上品な佇まいを演出）
const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: "500",
});

// ルートページ
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black">
      <section className="relative flex w-full flex-col items-center overflow-hidden px-6 py-24 text-center">
        <Background />
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
          <span
            className={`${shipporiMincho.variable} inline-flex items-center gap-3 text-xs tracking-[0.3em] text-zinc-500 [font-family:var(--font-shippori-mincho)] dark:text-zinc-500`}
          >
            <span className="h-px w-6 bg-zinc-300 dark:bg-zinc-700" />
            多言語対応 語学暗記アプリ
            <span className="h-px w-6 bg-zinc-300 dark:bg-zinc-700" />
          </span>
          {/* 本の形はここ（h1のラッパー）にぶら下げることで、VOCABOOKの実際の文字幅（vw指定で
          可変）に常に追従する。外側のdivに置くとmax-w-3xlで幅が頭打ちになり、
          VOCABOOKの方が広い画面ではみ出してズレていた */}
          <div className="relative">
            <BookShape />
            <h1
              className={`${bebasNeue.variable} relative tracking-[0.06em] text-black [font-family:var(--font-bebas-neue)] dark:text-zinc-50`}
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.12)", fontSize: "18.7vw" }}
            >
              Vocabook
            </h1>
          </div>
          <p
            className={`${shipporiMincho.variable} max-w-xl text-lg leading-9 tracking-[0.15em] text-zinc-600 [font-family:var(--font-shippori-mincho)] dark:text-zinc-400`}
            // VOCABOOKの見出し(h1)はBebas Neueのディセンダー分の余白が下に大きく、
            // gap-6だけだと文字の見た目より間隔が広く見えるため、フォントサイズ(18.7vw)に
            // 比例させて少し引き上げて詰めている
            style={{ marginTop: "calc(-5.2vw)" }}
          >
            自分だけの多次元単語帳を作って共有できる、
            <br />
            多言語対応の語学暗記アプリ。
          </p>
        </div>
      </section>

      <section className="grid w-full max-w-5xl grid-cols-1 gap-8 px-6 pb-28 sm:grid-cols-2">
        <div className="group relative flex flex-col gap-6 rounded-3xl border border-coral-200 bg-white p-8 text-left transition-all hover:-translate-y-1 hover:border-coral-300 hover:shadow-xl hover:shadow-coral-100 sm:p-9 dark:border-coral-900/40 dark:bg-zinc-950 dark:hover:border-coral-700/60 dark:hover:shadow-none">
          <Link
            href="/my-notebooks"
            className="absolute inset-0 z-0 rounded-3xl"
            aria-label="単語帳を作ってみる"
          />

          <div className="pointer-events-none relative z-10">
            <h2 className="text-2xl font-bold text-coral-900 dark:text-coral-100">My単語帳</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              意味・発音・例文など複数の軸を持つ、自分だけの単語帳を作成。
              <br />
              そのまま他の人と共有できます。
            </p>
          </div>

          <span className="pointer-events-none relative z-10 inline-flex w-fit items-center gap-2 rounded-full bg-coral-500 px-6 py-3 text-sm font-bold text-white transition-colors group-hover:bg-coral-600">
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

          <StudyModePreview />
        </div>

        <div className="group relative flex flex-col gap-6 rounded-3xl border border-tealblue-200 bg-white p-8 text-left transition-all hover:-translate-y-1 hover:border-tealblue-300 hover:shadow-xl hover:shadow-tealblue-100 sm:p-9 dark:border-tealblue-900/40 dark:bg-zinc-950 dark:hover:border-tealblue-700/60 dark:hover:shadow-none">
          <Link
            href="/learn"
            className="absolute inset-0 z-0 rounded-3xl"
            aria-label="学習教材を見てみる"
          />

          <div className="pointer-events-none relative z-10">
            <h2 className="text-2xl font-bold text-tealblue-900 dark:text-tealblue-100">
              学習教材
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              単語帳を自分で作らなくても、
              <br />
              多言語対応の暗記教材ですぐに学習を始められます。
            </p>
          </div>

          <span className="pointer-events-none relative z-10 inline-flex w-fit items-center gap-2 rounded-full bg-tealblue-600 px-6 py-3 text-sm font-bold text-white transition-colors group-hover:bg-tealblue-700">
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

          <MaterialsPreview />
        </div>
      </section>
    </main>
  );
}
