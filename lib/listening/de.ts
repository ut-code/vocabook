import type { ListeningLanguageConfig, ListeningWordEntry } from "./types";

const ACCENT_CYCLES: string[][] = [
  ["a", "ä"],
  ["o", "ö"],
  ["u", "ü"],
  ["s", "ß"],
];

const TOOLBAR_CHARS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

export const germanListeningConfig: ListeningLanguageConfig = {
  langTag: "de-DE",
  accentCycles: ACCENT_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
};

// ドイツ語の「紛らわしい音・綴り」を重点的に扱う出題データ
export const germanListeningWords: ListeningWordEntry[] = [
  // ie と ei の聞き分け（発音は異なるが綴りを混同しやすい）
  { id: "de-ie-1", categoryTitle: "ie と ei の聞き分け", answer: "Wien", meaning: "ウィーン（都市名）" },
  { id: "de-ie-2", categoryTitle: "ie と ei の聞き分け", answer: "Wein", meaning: "ワイン（名詞）" },
  { id: "de-ie-3", categoryTitle: "ie と ei の聞き分け", answer: "Bier", meaning: "ビール（名詞）" },
  { id: "de-ie-4", categoryTitle: "ie と ei の聞き分け", answer: "drei", meaning: "3（数詞）" },
  { id: "de-ie-5", categoryTitle: "ie と ei の聞き分け", answer: "Tier", meaning: "動物（名詞）" },
  { id: "de-ie-6", categoryTitle: "ie と ei の聞き分け", answer: "Zeit", meaning: "時間（名詞）" },

  // ウムラウトの聞き分け
  { id: "de-uml-1", categoryTitle: "ウムラウトの聞き分け (a/ä, u/ü)", answer: "schon", meaning: "すでに（副詞）" },
  { id: "de-uml-2", categoryTitle: "ウムラウトの聞き分け (a/ä, u/ü)", answer: "schön", meaning: "美しい（形容詞）" },
  { id: "de-uml-3", categoryTitle: "ウムラウトの聞き分け (a/ä, u/ü)", answer: "Mutter", meaning: "母（名詞・単数）" },
  {
    id: "de-uml-4",
    categoryTitle: "ウムラウトの聞き分け (a/ä, u/ü)",
    answer: "Mütter",
    meaning: "母たち（名詞・複数）",
  },
  { id: "de-uml-5", categoryTitle: "ウムラウトの聞き分け (a/ä, u/ü)", answer: "Bruder", meaning: "兄弟（名詞・単数）" },
  {
    id: "de-uml-6",
    categoryTitle: "ウムラウトの聞き分け (a/ä, u/ü)",
    answer: "Brüder",
    meaning: "兄弟たち（名詞・複数）",
  },

  // 語末子音の無声化による同音異綴語（Auslautverhärtung）
  {
    id: "de-devoice-1",
    categoryTitle: "語末子音の無声化による同音異綴語",
    answer: "Rad",
    meaning: "自転車・車輪（名詞）",
  },
  { id: "de-devoice-2", categoryTitle: "語末子音の無声化による同音異綴語", answer: "Rat", meaning: "助言（名詞）" },
  { id: "de-devoice-3", categoryTitle: "語末子音の無声化による同音異綴語", answer: "Lied", meaning: "歌（名詞）" },
  { id: "de-devoice-4", categoryTitle: "語末子音の無声化による同音異綴語", answer: "Lid", meaning: "まぶた（名詞）" },
  { id: "de-devoice-5", categoryTitle: "語末子音の無声化による同音異綴語", answer: "Bund", meaning: "同盟（名詞）" },
  {
    id: "de-devoice-6",
    categoryTitle: "語末子音の無声化による同音異綴語",
    answer: "bunt",
    meaning: "色とりどりの（形容詞）",
  },

  // s / ss / ß の書き分け（母音の長短で使い分ける）
  { id: "de-s-1", categoryTitle: "s / ss / ß の書き分け", answer: "Masse", meaning: "質量（名詞、短母音+ss）" },
  {
    id: "de-s-2",
    categoryTitle: "s / ss / ß の書き分け",
    answer: "Maße",
    meaning: "寸法（名詞・複数、長母音+ß）",
  },
  {
    id: "de-s-3",
    categoryTitle: "s / ss / ß の書き分け",
    answer: "Straße",
    meaning: "通り（名詞、長母音+ß）",
  },
  { id: "de-s-4", categoryTitle: "s / ss / ß の書き分け", answer: "muss", meaning: "〜ねばならない（müssen の現在形）" },
];
