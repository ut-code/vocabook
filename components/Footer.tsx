//花沢
import Link from "next/link";

const NAV_LINKS = [
  { href: "https://forms.gle/HnspDy2kNqQxPCWA8", label: "ご意見" },
  { href: "https://utcode.net/", label: "ut.code():" },
  { href: "https://x.com/utokyo_code", label: "公式X"},
];


export default function Footer() {
  return (
    <footer className="border-t border-black/[.08] bg-zinc-300 dark:border-white/[.145] dark:bg-zinc-600">
      <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm">
        <div className="flex flex-col gap-4">
          <nav className="flex flex-wrap justify-end gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-emerald-500 dark:hover:text-emerald-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-center font-light text-zinc-400 dark:text-zinc-400">
            <span>© {new Date().getFullYear()} Vocabook</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
