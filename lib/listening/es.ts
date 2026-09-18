import type { ListeningLanguageConfig, ListeningWordEntry } from "./types";

const ACCENT_CYCLES: string[][] = [
  ["a", "á"],
  ["e", "é"],
  ["i", "í"],
  ["o", "ó"],
  ["u", "ú", "ü"],
  ["n", "ñ"],
];

const TOOLBAR_CHARS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"];

export const spanishListeningConfig: ListeningLanguageConfig = {
  langTag: "es-ES",
  accentCycles: ACCENT_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
};

// スペイン語の「紛らわしい音・綴り」を重点的に扱う出題データ
export const spanishListeningWords: ListeningWordEntry[] = [
  // b と v の聞き分け（スペイン語では発音上区別されない）
  { id: "es-bv-1", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "tubo", meaning: "管・チューブ（名詞）" },
  {
    id: "es-bv-2",
    categoryTitle: "b と v の聞き分け（発音は同じ）",
    answer: "tuvo",
    meaning: "持った（tener の点過去・3人称単数）",
  },
  { id: "es-bv-3", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "botar", meaning: "投げる・弾む（動詞）" },
  { id: "es-bv-4", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "votar", meaning: "投票する（動詞）" },
  { id: "es-bv-5", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "baca", meaning: "ルーフラック（名詞）" },
  { id: "es-bv-6", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "vaca", meaning: "牛（名詞）" },
  { id: "es-bv-7", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "bello", meaning: "美しい（形容詞）" },
  { id: "es-bv-8", categoryTitle: "b と v の聞き分け（発音は同じ）", answer: "vello", meaning: "産毛（名詞）" },

  // ll と y の聞き分け（yeísmo: 多くの地域で発音上区別されない）
  {
    id: "es-lly-1",
    categoryTitle: "ll と y の聞き分け（yeísmo・発音は同じ）",
    answer: "cayó",
    meaning: "落ちた（caer の点過去・3人称単数）",
  },
  {
    id: "es-lly-2",
    categoryTitle: "ll と y の聞き分け（yeísmo・発音は同じ）",
    answer: "calló",
    meaning: "黙った（callar の点過去・3人称単数）",
  },
  { id: "es-lly-3", categoryTitle: "ll と y の聞き分け（yeísmo・発音は同じ）", answer: "pollo", meaning: "鶏肉（名詞）" },
  {
    id: "es-lly-4",
    categoryTitle: "ll と y の聞き分け（yeísmo・発音は同じ）",
    answer: "poyo",
    meaning: "石のベンチ（名詞）",
  },
  {
    id: "es-lly-5",
    categoryTitle: "ll と y の聞き分け（yeísmo・発音は同じ）",
    answer: "halla",
    meaning: "見つける（hallar の直説法現在・3人称単数）",
  },
  {
    id: "es-lly-6",
    categoryTitle: "ll と y の聞き分け（yeísmo・発音は同じ）",
    answer: "haya",
    meaning: "あるかもしれない（haber の接続法現在・3人称単数）",
  },

  // アクセント位置による聞き分け（強勢の有無で音が変わる）
  {
    id: "es-acc-1",
    categoryTitle: "アクセント位置の聞き分け（強勢の有無）",
    answer: "esta",
    meaning: "この（指示形容詞）",
  },
  {
    id: "es-acc-2",
    categoryTitle: "アクセント位置の聞き分け（強勢の有無）",
    answer: "está",
    meaning: "いる・ある（estar の直説法現在・3人称単数）",
  },
  { id: "es-acc-3", categoryTitle: "アクセント位置の聞き分け（強勢の有無）", answer: "el", meaning: "その（定冠詞・男性単数）" },
  { id: "es-acc-4", categoryTitle: "アクセント位置の聞き分け（強勢の有無）", answer: "él", meaning: "彼（人称代名詞）" },
  { id: "es-acc-5", categoryTitle: "アクセント位置の聞き分け（強勢の有無）", answer: "si", meaning: "もし〜なら（接続詞）" },
  { id: "es-acc-6", categoryTitle: "アクセント位置の聞き分け（強勢の有無）", answer: "sí", meaning: "はい（副詞）" },
  { id: "es-acc-7", categoryTitle: "アクセント位置の聞き分け（強勢の有無）", answer: "tu", meaning: "君の（所有形容詞）" },
  { id: "es-acc-8", categoryTitle: "アクセント位置の聞き分け（強勢の有無）", answer: "tú", meaning: "君（人称代名詞）" },
];
