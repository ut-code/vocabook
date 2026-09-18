// 発音識別（聞き取り書き取り）演習の共通フィールド
export type ListeningQuizItemBase = {
  id: string;
  categoryTitle: string;
  // 正しい綴り（比較対象）。中国語の場合はピンイン
  answer: string;
  // 実際に読み上げるテキスト（省略時はanswerをそのまま読み上げる。
  // 中国語は漢字、長文穴埋めは空欄を埋めた完全な文を指定する）
  spokenText?: string;
};

// 単語単位の聞き分け問題（例: 仏語 ver/vert/verre/vers、独語 Rad/Rat）
export type ListeningWordEntry = ListeningQuizItemBase & {
  // 解答前から表示するヒント。真の同音異義語は音だけでは判別できないため必須
  meaning: string;
  // 答え合わせ後にのみ表示する補足（中国語の漢字表記など）
  note?: string;
};

// 長文の一部を聞き取って空欄を埋める問題
export type ListeningClozeEntry = ListeningQuizItemBase & {
  // 空欄（"___"）を含む表示用の文
  sentence: string;
  // 日本語訳。文脈のヒントとして解答前から表示する
  translation: string;
};

export type ListeningLanguageConfig = {
  // speechSynthesis用のBCP47言語タグ（例: "fr-FR"）
  langTag: string;
  accentCycles: string[][];
  toolbarChars: string[];
  // 解答比較前の正規化処理（省略時は trim + 小文字化）
  normalize?: (value: string) => string;
};
