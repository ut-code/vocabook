"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LANGUAGES_DATA } from "@/app/learn/nav-data";

export default function Sidebar() {
  const pathname = usePathname();

  // 1階層目 (学習教材) の開閉状態
  const [isLearnOpen, setIsLearnOpen] = useState(true);

  // 2階層目 (言語) ごとの開閉状態管理
  const [openLanguages, setOpenLanguages] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    LANGUAGES_DATA.forEach((lang) => {
      initial[lang.languageSlug] = pathname.startsWith(`/learn/${lang.languageSlug}`);
    });
    return initial;
  });

  // 初期ロード時のみアクティブな言語を展開（手動開閉操作を尊重する）
  useEffect(() => {
    if (pathname.startsWith("/learn")) {
      LANGUAGES_DATA.forEach((lang) => {
        if (pathname.startsWith(`/learn/${lang.languageSlug}`)) {
          setOpenLanguages((prev) => {
            if (prev[lang.languageSlug] === undefined) {
              return { ...prev, [lang.languageSlug]: true };
            }
            return prev;
          });
        }
      });
    }
  }, []);


  const toggleLanguage = (slug: string) => {
    setOpenLanguages((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 min-h-screen p-4 hidden md:flex flex-col gap-2 shrink-0 overflow-y-auto max-h-screen">
      <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        メニュー
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {/* ホーム */}
        <Link
          href="/"
          className={`px-3 py-2 rounded-md font-medium transition-colors ${
            pathname === "/"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          ホーム
        </Link>

        {/* My単語帳 */}
        <Link
          href="/my-notebooks"
          className={`px-3 py-2 rounded-md font-medium transition-colors ${
            pathname === "/my-notebooks" || pathname.startsWith("/my-notebooks/")
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          My単語帳
        </Link>

        {/* 1階層目: 学習教材 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Link
              href="/learn"
              className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors ${
                pathname === "/learn"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              学習教材
            </Link>
            <button
              type="button"
              onClick={() => setIsLearnOpen((prev) => !prev)}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="学習教材メニュー開閉"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isLearnOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* 2階層目: 各言語 */}
          {isLearnOpen && (
            <div className="ml-3 pl-2 border-l border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
              {LANGUAGES_DATA.map((lang) => {
                const langHref = `/learn/${lang.languageSlug}`;
                const isLangExactActive = pathname === langHref;
                const isLangChildActive = pathname.startsWith(`${langHref}/`);
                const isLangOpen = openLanguages[lang.languageSlug] ?? false;

                return (
                  <div key={lang.languageSlug} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between group">
                      <Link
                        href={langHref}
                        onClick={() => toggleLanguage(lang.languageSlug)}
                        className={`flex-1 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                          isLangExactActive
                            ? "bg-emerald-500/10 text-emerald-600 font-medium dark:text-emerald-400"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        {lang.label}
                      </Link>
                      {lang.sections.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleLanguage(lang.languageSlug)}
                          className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          aria-label={`${lang.label}セクション開閉`}
                        >
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isLangOpen ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* 3階層目: 各言語の解説事項 (セクション) */}
                    {isLangOpen && (
                      <div className="ml-3 pl-2 border-l border-zinc-200 dark:border-zinc-800 flex flex-col gap-0.5">
                        {lang.sections.map((section) => {
                          const sectionHref = `/learn/${lang.languageSlug}/${section.sectionSlug}`;
                          const isSectionActive = pathname === sectionHref;

                          return (
                            <Link
                              key={section.sectionSlug}
                              href={sectionHref}
                              className={`px-2 py-1 rounded text-xs transition-colors truncate ${
                                isSectionActive
                                  ? "bg-emerald-500/15 text-emerald-700 font-semibold dark:text-emerald-300"
                                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                              }`}
                              title={section.title}
                            >
                              {section.sectionSlug}. {section.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}


