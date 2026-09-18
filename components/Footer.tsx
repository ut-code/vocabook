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
        <div className="flex flex-col gap-0.5">
          <nav className="flex flex-wrap justify-end gap-8 text-2xl font-semibold tracking-[0.04em] text-zinc-600 dark:text-zinc-100">
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

          <div className="flex items-baseline justify-center gap-1.5 text-xl tracking-wide text-zinc-400 dark:text-zinc-400">
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
