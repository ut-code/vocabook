// 発音識別（聞き取り書き取り）演習の1問分のデータ型定義
export type ListeningWordEntry = {
  id: string;
  categoryTitle: string;
  // 正しい綴り（比較対象）。中国語の場合はピンイン
  answer: string;
  // 解答前から表示するヒント。真の同音異義語は音だけでは判別できないため必須
  meaning: string;
  // 実際に読み上げるテキスト（省略時はanswerをそのまま読み上げる。中国語は漢字を指定する）
  spokenText?: string;
  // 答え合わせ後にのみ表示する補足（中国語の漢字表記など）
  note?: string;
};

export type ListeningLanguageConfig = {
  // speechSynthesis用のBCP47言語タグ（例: "fr-FR"）
  langTag: string;
  accentCycles: string[][];
  toolbarChars: string[];
  // 解答比較前の正規化処理（省略時は trim + 小文字化）
  normalize?: (value: string) => string;
};
