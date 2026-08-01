export type Language = {
  languageSlug: string;
  label: string;
};

export const LANGUAGES: Language[] = [
  { languageSlug: "english", label: "英語" },
  { languageSlug: "chinese", label: "中国語" },
  { languageSlug: "french", label: "フランス語" },
  { languageSlug: "spanish", label: "スペイン語" },
];

export type Section = {
  sectionSlug: string;
  label: string;
};

//Record<V,K>という形で、Vはキーの型、Kは値の型を表す。ここでは、キーがstring型で、値がSection型の配列であることを示している。
export const SECTIONS: Record<string, Section[]> = {
  english: [
    { sectionSlug: "basic", label: "基礎単語" },
    { sectionSlug: "daily", label: "日常会話" },
    { sectionSlug: "travel", label: "旅行" },
    { sectionSlug: "business", label: "ビジネス" },
  ],
  chinese: [
    { sectionSlug: "basic", label: "基礎単語" },
    { sectionSlug: "pinyin", label: "ピンイン" },
    { sectionSlug: "daily", label: "日常会話" },
  ],
  french: [
    { sectionSlug: "basic", label: "基礎単語" },
    { sectionSlug: "grammar", label: "文法" },
    { sectionSlug: "daily", label: "日常会話" },
  ],
  spanish: [
    { sectionSlug: "basic", label: "基礎単語" },
    { sectionSlug: "daily", label: "日常会話" },
    { sectionSlug: "travel", label: "旅行" },
  ],
};

// URLパラメータから言語を取得し、一致する言語の配列を返す関数
export function getLanguage(languageSlug: string): Language | undefined {
  return LANGUAGES.find((language) => language.languageSlug === languageSlug);
}

// URLパラメータからセクションを取得し、対応する言語の一致するセクションたちの配列を返す関数
export function getSections(languageSlug: string): Section[] {
  return SECTIONS[languageSlug] ?? [];
}

// URLパラメータから言語とセクションを取得し、一致するセクションの配列を返す関数
export function getSection(
  languageSlug: string,
  sectionSlug: string,
): Section | undefined {
  return getSections(languageSlug).find(
    (section) => section.sectionSlug === sectionSlug,
  );
}
