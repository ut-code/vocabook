import Link from "next/link";

import { SectionBookmarkButton } from "@/components/learn/SectionBookmarkButton";

interface SectionCardProps {
  href: string;
  index: number;
  title: string;
  language: string;
  sectionSlug: string;
  isLoggedIn: boolean;
  manuallyTagged: boolean;
}

// /learn/[language] のセクション一覧カード。ブックマークは manuallyTagged の有無にかかわらず
// 必ず表示し、塗りつぶし（苦手）か輪郭のみ（通常）かでひと目で状態がわかるようにする。
// カード全体はセクションへのリンクだが、ブックマーク部分だけは独立してクリックでき、
// その場でタグをON/OFFできる（Linkを絶対配置の背面レイヤーにして重ねている）
export function SectionCard({
  href,
  index,
  title,
  language,
  sectionSlug,
  isLoggedIn,
  manuallyTagged,
}: SectionCardProps) {
  return (
    <div className="group relative flex items-center justify-between rounded-2xl border border-black/[.08] bg-white p-5 text-left transition-all hover:border-tealblue-400/60 hover:shadow-sm dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-tealblue-600/60">
      <Link href={href} aria-label={title} className="absolute inset-0 rounded-2xl" />
      <div className="pointer-events-none flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-tealblue-600 dark:text-tealblue-400">
          Section {index + 1}
        </span>
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SectionBookmarkButton
          language={language}
          sectionSlug={sectionSlug}
          isLoggedIn={isLoggedIn}
          initialActive={manuallyTagged}
        />
        <div className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-tealblue-50 group-hover:text-tealblue-600 dark:bg-zinc-900 dark:text-zinc-500 dark:group-hover:bg-tealblue-950/60 dark:group-hover:text-tealblue-400">
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
