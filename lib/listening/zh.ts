import { canonicalPinyin, TONE_CYCLES, TOOLBAR_CHARS } from "@/lib/pinyin";
import type { ListeningClozeEntry, ListeningLanguageConfig, ListeningWordEntry } from "./types";

export const chineseListeningConfig: ListeningLanguageConfig = {
  langTag: "zh-CN",
  accentCycles: TONE_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
  normalize: canonicalPinyin,
};

// 中国語の「紛らわしい音」を重点的に扱う出題データ。
// 漢字（spokenText）を読み上げ、正しいピンイン（声調含む）を答える。
// 漢字そのものはピンインの答えを直接示してしまうため、答え合わせ前には表示しない。
export const chineseListeningWords: ListeningWordEntry[] = [
  // 声調の聞き分け
  {
    id: "zh-tone-1",
    categoryTitle: "声調の聞き分け (mā/má/mǎ/mà)",
    answer: "mǎi",
    meaning: "「買う」という意味の動詞",
    spokenText: "买",
    note: "漢字表記: 买",
  },
  {
    id: "zh-tone-2",
    categoryTitle: "声調の聞き分け (mā/má/mǎ/mà)",
    answer: "mài",
    meaning: "「売る」という意味の動詞",
    spokenText: "卖",
    note: "漢字表記: 卖",
  },
  {
    id: "zh-tone-3",
    categoryTitle: "声調の聞き分け (mā/má/mǎ/mà)",
    answer: "mā",
    meaning: "「お母さん」という意味の名詞",
    spokenText: "妈",
    note: "漢字表記: 妈",
  },
  {
    id: "zh-tone-4",
    categoryTitle: "声調の聞き分け (mā/má/mǎ/mà)",
    answer: "mǎ",
    meaning: "「馬」という意味の名詞",
    spokenText: "马",
    note: "漢字表記: 马",
  },
  {
    id: "zh-tone-5",
    categoryTitle: "声調の聞き分け (mā/má/mǎ/mà)",
    answer: "mà",
    meaning: "「罵る」という意味の動詞",
    spokenText: "骂",
    note: "漢字表記: 骂",
  },

  // そり舌音 zh と z の聞き分け
  {
    id: "zh-zhz-1",
    categoryTitle: "そり舌音 zh と z の聞き分け",
    answer: "zhī",
    meaning: "「知っている」という意味の動詞",
    spokenText: "知",
    note: "漢字表記: 知",
  },
  {
    id: "zh-zhz-2",
    categoryTitle: "そり舌音 zh と z の聞き分け",
    answer: "zī",
    meaning: "「資本・資源」の意味を持つ語根",
    spokenText: "资",
    note: "漢字表記: 资",
  },

  // そり舌音 ch と c の聞き分け
  {
    id: "zh-chc-1",
    categoryTitle: "そり舌音 ch と c の聞き分け",
    answer: "chā",
    meaning: "「差」という意味の名詞",
    spokenText: "差",
    note: "漢字表記: 差",
  },
  {
    id: "zh-chc-2",
    categoryTitle: "そり舌音 ch と c の聞き分け",
    answer: "cā",
    meaning: "「擦る・拭く」という意味の動詞",
    spokenText: "擦",
    note: "漢字表記: 擦",
  },

  // そり舌音 sh と s の聞き分け
  {
    id: "zh-shs-1",
    categoryTitle: "そり舌音 sh と s の聞き分け",
    answer: "shì",
    meaning: "「〜である」という意味の動詞",
    spokenText: "是",
    note: "漢字表記: 是",
  },
  {
    id: "zh-shs-2",
    categoryTitle: "そり舌音 sh と s の聞き分け",
    answer: "sì",
    meaning: "「4」という意味の数詞",
    spokenText: "四",
    note: "漢字表記: 四",
  },

  // 鼻音韻尾 n と ng の聞き分け
  {
    id: "zh-nng-1",
    categoryTitle: "鼻音韻尾 n と ng の聞き分け",
    answer: "guān",
    meaning: "「閉める」という意味の動詞",
    spokenText: "关",
    note: "漢字表記: 关",
  },
  {
    id: "zh-nng-2",
    categoryTitle: "鼻音韻尾 n と ng の聞き分け",
    answer: "guāng",
    meaning: "「光」という意味の名詞",
    spokenText: "光",
    note: "漢字表記: 光",
  },

  // 有気音 b と p の聞き分け
  {
    id: "zh-bp-1",
    categoryTitle: "有気音・無気音 b と p の聞き分け",
    answer: "bù",
    meaning: "「歩く・歩み」という意味の名詞",
    spokenText: "步",
    note: "漢字表記: 步",
  },
  {
    id: "zh-bp-2",
    categoryTitle: "有気音・無気音 b と p の聞き分け",
    answer: "pù",
    meaning: "「店・寝床」という意味の語根（店铺・床铺など）",
    spokenText: "铺",
    note: "漢字表記: 铺",
  },

  // 有気音 d と t の聞き分け
  {
    id: "zh-dt-1",
    categoryTitle: "有気音・無気音 d と t の聞き分け",
    answer: "dào",
    meaning: "「到着する」という意味の動詞",
    spokenText: "到",
    note: "漢字表記: 到",
  },
  {
    id: "zh-dt-2",
    categoryTitle: "有気音・無気音 d と t の聞き分け",
    answer: "tào",
    meaning: "「セット・かぶせる」という意味の語",
    spokenText: "套",
    note: "漢字表記: 套",
  },
];

// 中国語の「長文の穴埋め」出題データ。
// 文全体（spokenText）の発音を聞いて、空欄（"___"）に入る語のピンインを答える。
// 表示文（sentence）は漢字のまま、空欄部分だけを隠す（ピンインは答え合わせ前には表示しない）
export const chineseListeningClozeItems: ListeningClozeEntry[] = [
  {
    id: "zh-cloze-1",
    categoryTitle: "文中の語を聞き取る",
    sentence: "我___学生。",
    spokenText: "我是学生。",
    answer: "shì",
    translation: "私は学生です。",
  },
  {
    id: "zh-cloze-2",
    categoryTitle: "文中の語を聞き取る",
    sentence: "他很___。",
    spokenText: "他很高。",
    answer: "gāo",
    translation: "彼は背が高いです。",
  },
  {
    id: "zh-cloze-3",
    categoryTitle: "文中の語を聞き取る",
    sentence: "这是___的书。",
    spokenText: "这是我的书。",
    answer: "wǒ",
    translation: "これは私の本です。",
  },
  {
    id: "zh-cloze-4",
    categoryTitle: "文中の語を聞き取る",
    sentence: "他在___。",
    spokenText: "他在中国。",
    answer: "Zhōngguó",
    translation: "彼は中国にいます。",
  },
  {
    id: "zh-cloze-5",
    categoryTitle: "文中の語を聞き取る",
    sentence: "今天天气很___。",
    spokenText: "今天天气很好。",
    answer: "hǎo",
    translation: "今日は天気がとても良いです。",
  },
  {
    id: "zh-cloze-6",
    categoryTitle: "文中の語を聞き取る",
    sentence: "我有___个苹果。",
    spokenText: "我有三个苹果。",
    answer: "sān",
    translation: "私はリンゴを3つ持っています。",
  },
];
