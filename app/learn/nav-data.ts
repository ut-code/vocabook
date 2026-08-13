export type LanguageSection = {
  sectionSlug: string;
  title: string;
};

export type LanguageData = {
  languageSlug: string;
  label: string;
  sections: LanguageSection[];
};

export const LANGUAGES_DATA: LanguageData[] = [
  {
    languageSlug: "chinese",
    label: "中国語",
    sections: [{ sectionSlug: "01", title: "名詞の性の語尾による判別" }],
  },
  {
    languageSlug: "french",
    label: "フランス語",
    sections: [
      { sectionSlug: "01", title: "冠詞の一覧と縮約形" },
      { sectionSlug: "02", title: "基本動詞の直説法現在活用" },
      { sectionSlug: "03", title: "基数と序数と概数" },
      { sectionSlug: "04", title: "時刻表現" },
      { sectionSlug: "05", title: "日程表現" },
      { sectionSlug: "06", title: "人称代名詞" },
      { sectionSlug: "07", title: "所有形容詞" },
      { sectionSlug: "08", title: "所有代名詞" },
      { sectionSlug: "09", title: "指示形容詞" },
      { sectionSlug: "10", title: "指示代名詞" },
      { sectionSlug: "11", title: "主な否定表現" },
      { sectionSlug: "12", title: "疑問詞一覧" },
      { sectionSlug: "13", title: "命令形の不規則活用" },
      { sectionSlug: "14", title: "直説法半過去形の活用" },
      { sectionSlug: "15", title: "直説法単純未来形の活用" },
      { sectionSlug: "16", title: "比較級で特殊な変化をする形容詞・副詞" },
      { sectionSlug: "17", title: "現在分詞・過去分詞の作り方" },
      { sectionSlug: "18", title: "条件法現在形の活用" },
      { sectionSlug: "19", title: "接続法現在形の活用" },
      { sectionSlug: "20", title: "不定表現一覧" },
      { sectionSlug: "21", title: "中性代名詞一覧" },
    ],
  },
  {
    languageSlug: "german",
    label: "ドイツ語",
    sections: [{ sectionSlug: "01", title: "名詞の性の語尾による判別" }],
  },
  {
    languageSlug: "spanish",
    label: "スペイン語",
    sections: [{ sectionSlug: "01", title: "名詞の性の語尾による判別" }],
  },
];
