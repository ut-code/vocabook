import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/my-notebooks", label: "My単語帳" },
  { href: "/learn", label: "学習教材" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/5 dark:bg-zinc-600/80 backdrop-blur-md border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        <Link href="/" className="flex item-center gap-3">
          <Image
            src="/logo-dummy.png"
            alt="Vocabook ロゴ"
            width={32}
            height={32}
            className="h-10 w-auto object-contain"
          />
          <span className="text-3xl font-semibold tracking-tight self-center hover:text-emerald-500 dark:hover:text-emerald-500">
          Vocabook
          </span>
        </Link>
        <nav className="flex gap-6 text-lg font-medium text-zinc-600 dark:text-zinc-200">
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
      </div>
    </header>
  );
}
