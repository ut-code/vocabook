import type { ListeningClozeEntry, ListeningLanguageConfig, ListeningWordEntry } from "./types";

const ACCENT_CYCLES: string[][] = [
  ["e", "é", "è", "ê", "ë"],
  ["a", "à", "â"],
  ["i", "î", "ï"],
  ["o", "ô"],
  ["u", "ù", "û", "ü"],
  ["c", "ç"],
  ["y", "ÿ"],
];

const TOOLBAR_CHARS = ["é", "è", "ê", "ë", "à", "â", "î", "ï", "ô", "ù", "û", "ç"];

export const frenchListeningConfig: ListeningLanguageConfig = {
  langTag: "fr-FR",
  accentCycles: ACCENT_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
};

// フランス語の「紛らわしい音・綴り」を重点的に扱う出題データ
// （真の同音異義語は音だけでは綴りを一意に決められないため、意味のヒントを必ず添える）
export const frenchListeningWords: ListeningWordEntry[] = [
  // 同音異義語 /vɛʁ/
  { id: "fr-ver-1", categoryTitle: "同音異綴語 (/vɛʁ/)", answer: "verre", meaning: "グラス・ガラス（名詞）" },
  { id: "fr-ver-2", categoryTitle: "同音異綴語 (/vɛʁ/)", answer: "vert", meaning: "緑色の（形容詞・男性形）" },
  { id: "fr-ver-3", categoryTitle: "同音異綴語 (/vɛʁ/)", answer: "vers", meaning: "〜の方へ（前置詞）" },
  { id: "fr-ver-4", categoryTitle: "同音異綴語 (/vɛʁ/)", answer: "ver", meaning: "虫（名詞）" },

  // 同音異義語 /sɑ̃/
  { id: "fr-san-1", categoryTitle: "同音異綴語 (/sɑ̃/)", answer: "cent", meaning: "100（数詞）" },
  { id: "fr-san-2", categoryTitle: "同音異綴語 (/sɑ̃/)", answer: "sang", meaning: "血（名詞）" },
  { id: "fr-san-3", categoryTitle: "同音異綴語 (/sɑ̃/)", answer: "sans", meaning: "〜なしで（前置詞）" },

  // 同音異義語 /sɛ̃/
  { id: "fr-sein-1", categoryTitle: "同音異綴語 (/sɛ̃/)", answer: "sain", meaning: "健康な（形容詞）" },
  { id: "fr-sein-2", categoryTitle: "同音異綴語 (/sɛ̃/)", answer: "saint", meaning: "聖なる（形容詞）" },
  { id: "fr-sein-3", categoryTitle: "同音異綴語 (/sɛ̃/)", answer: "sein", meaning: "胸（名詞）" },

  // 同音異義語 /o/
  { id: "fr-o-1", categoryTitle: "同音異綴語 (/o/)", answer: "eau", meaning: "水（名詞）" },
  { id: "fr-o-2", categoryTitle: "同音異綴語 (/o/)", answer: "au", meaning: "〜に、へ（前置詞+定冠詞の縮約形）" },
  { id: "fr-o-3", categoryTitle: "同音異綴語 (/o/)", answer: "os", meaning: "骨（名詞・単数形）" },

  // 動詞語尾の同音異義語 /ɛ/
  {
    id: "fr-e-1",
    categoryTitle: "動詞語尾の同音異綴語 (/ɛ/)",
    answer: "est",
    meaning: "〜である（être の3人称単数現在）",
  },
  {
    id: "fr-e-2",
    categoryTitle: "動詞語尾の同音異綴語 (/ɛ/)",
    answer: "es",
    meaning: "〜である（être の2人称単数現在）",
  },
  {
    id: "fr-e-3",
    categoryTitle: "動詞語尾の同音異綴語 (/ɛ/)",
    answer: "ait",
    meaning: "〜だった（半過去の3人称単数語尾）",
  },
  {
    id: "fr-e-4",
    categoryTitle: "動詞語尾の同音異綴語 (/ɛ/)",
    answer: "aient",
    meaning: "〜だった（半過去の3人称複数語尾）",
  },
];

// フランス語の「長文の穴埋め」出題データ
// 文の発音全体を聞いて、空欄（"___"）に入る語を答える
export const frenchListeningClozeItems: ListeningClozeEntry[] = [
  {
    id: "fr-cloze-1",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Le feu est passé au ___.",
    spokenText: "Le feu est passé au vert.",
    answer: "vert",
    translation: "信号が青（緑）になりました。",
  },
  {
    id: "fr-cloze-2",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Nous marchons ___ la gare.",
    spokenText: "Nous marchons vers la gare.",
    answer: "vers",
    translation: "私たちは駅の方へ歩いています。",
  },
  {
    id: "fr-cloze-3",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Il y a un ___ dans la pomme.",
    spokenText: "Il y a un ver dans la pomme.",
    answer: "ver",
    translation: "リンゴの中に虫がいます。",
  },
  {
    id: "fr-cloze-4",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Il y a ___ personnes dans la salle.",
    spokenText: "Il y a cent personnes dans la salle.",
    answer: "cent",
    translation: "部屋には100人がいます。",
  },
  {
    id: "fr-cloze-5",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Le médecin a vu du ___ sur le pansement.",
    spokenText: "Le médecin a vu du sang sur le pansement.",
    answer: "sang",
    translation: "医者は包帯に血がついているのを見ました。",
  },
  {
    id: "fr-cloze-6",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Elle est sortie ___ parapluie sous la pluie.",
    spokenText: "Elle est sortie sans parapluie sous la pluie.",
    answer: "sans",
    translation: "彼女は雨の中、傘なしで出かけました。",
  },
  {
    id: "fr-cloze-7",
    categoryTitle: "同音異綴語を文脈で聞き分ける",
    sentence: "Boire de l'alcool n'est pas ___ pour la santé.",
    spokenText: "Boire de l'alcool n'est pas sain pour la santé.",
    answer: "sain",
    translation: "お酒を飲むことは健康に良くありません。",
  },
  {
    id: "fr-cloze-8",
    categoryTitle: "動詞語尾を文脈で聞き分ける",
    sentence: "Ils ___ déjà mangé quand je suis arrivé.",
    spokenText: "Ils avaient déjà mangé quand je suis arrivé.",
    answer: "avaient",
    translation: "私が着いたとき、彼らはすでに食べ終えていました。",
  },
];
