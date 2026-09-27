//花沢
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const NAV_LINKS = [
  { href: "https://forms.gle/HnspDy2kNqQxPCWA8", label: "ご意見" },
  { href: "https://utcode.net/", label: "ut.code():" },
  { href: "https://x.com/utokyo_code", label: "公式X" },
];

// フッターの「Vocabook」をヘッダーロゴと統一する見出しフォント
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export default function Footer() {
  return (
    <footer className="border-t border-black/[.08] bg-zinc-300 dark:border-white/[.145] dark:bg-zinc-600">
      <div className="px-[5%] pt-4 pb-1.5">
        {/*
          スマホは右寄せで縦積み、PCは「コピーライト（左）／リンク（右）」の1行に揃える。
          row-reverseを使うことで、DOM順（リンク→コピーライト）を変えずにPCでリンクを右端に置いている
        */}
        <div className="flex flex-col items-end gap-1 sm:flex-row-reverse sm:items-baseline sm:justify-between">
          <nav className="flex flex-wrap justify-end gap-x-5 gap-y-1 text-lg font-semibold tracking-[0.04em] text-zinc-600 sm:gap-x-8 sm:text-2xl dark:text-zinc-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-block transition-transform duration-300 ease-out hover:scale-110 hover:[text-shadow:0_2px_3px_rgba(39,39,42,0.55)] dark:hover:[text-shadow:0_2px_3px_rgba(228,228,231,0.45)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-baseline justify-end gap-1.5 text-sm tracking-wide text-zinc-400 sm:text-xl dark:text-zinc-400">
            <span>© {new Date().getFullYear()}</span>
            <span
              className={`${bebasNeue.variable} leading-none tracking-[0.06em] [font-family:var(--font-bebas-neue)]`}
            >
              Vocabook
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
