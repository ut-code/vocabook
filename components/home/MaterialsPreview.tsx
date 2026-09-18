"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LanguagePreview {
  key: string;
  label: string;
  href: string;
  caption: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

const LANGUAGES: LanguagePreview[] = [
  {
    key: "chinese",
    label: "中国語",
    href: "/learn/chinese",
    caption: "中国語 → 漢字からピンイン",
    src: "/images/materials-preview-chinese-pinyin-card-v3.png",
    width: 1152,
    height: 874,
    alt: "学習教材の例：中国語「漢字からピンイン」の練習画面",
  },
  {
    key: "french",
    label: "フランス語",
    href: "/learn/french",
    caption: "フランス語 → 動詞の活用",
    src: "/images/materials-preview-french-lire-v2.png",
    width: 1152,
    height: 898,
    alt: "学習教材の例：フランス語の動詞活用練習画面",
  },
  {
    key: "german",
    label: "ドイツ語",
    href: "/learn/german",
    caption: "ドイツ語 → 翻訳",
    src: "/images/materials-preview-german-translation.png",
    width: 1464,
    height: 1057,
    alt: "学習教材の例：ドイツ語の翻訳練習画面",
  },
  {
    key: "spanish",
    label: "スペイン語",
    href: "/learn/spanish",
    caption: "スペイン語 → 動詞の活用",
    src: "/images/materials-preview-spanish-aprender-v2.png",
    width: 1152,
    height: 858,
    alt: "学習教材の例：スペイン語の動詞活用練習画面",
  },
];

export function MaterialsPreview() {
  const [activeKey, setActiveKey] = useState<string>(LANGUAGES[0].key);
  const activeLang = LANGUAGES.find((l) => l.key === activeKey) ?? LANGUAGES[0];

  return (
    <>
      <div className="relative z-10 flex flex-col gap-1.5">
        <span className="pointer-events-none text-[11px] tracking-wide text-zinc-400">
          言語を学ぶ
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.key}
              href={lang.href}
              onMouseEnter={() => setActiveKey(lang.key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                activeLang.key === lang.key
                  ? "bg-tealblue-100 text-tealblue-800 dark:bg-tealblue-900/50 dark:text-tealblue-200"
                  : "bg-tealblue-50 text-tealblue-700 hover:bg-tealblue-100 dark:bg-tealblue-950/30 dark:text-tealblue-300 dark:hover:bg-tealblue-950/50"
              }`}
            >
              {lang.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="pointer-events-none relative z-10 overflow-hidden rounded-2xl border border-tealblue-200/70 dark:border-tealblue-900/30">
        <p className="border-b border-tealblue-200/70 bg-tealblue-50/60 px-5 py-2 text-xs font-medium text-tealblue-800 dark:border-tealblue-900/30 dark:bg-tealblue-950/20 dark:text-tealblue-300">
          {activeLang.caption}
        </p>
        <div className="relative aspect-[4/3] w-full bg-white p-4 dark:bg-zinc-900">
          <Image
            key={activeLang.key}
            src={activeLang.src}
            alt={activeLang.alt}
            fill
            className="object-contain opacity-90 saturate-50 transition-all duration-300 group-hover:opacity-100 group-hover:saturate-100"
          />
        </div>
      </div>
    </>
  );
}
