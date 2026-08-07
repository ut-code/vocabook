// 1枚のカード（見出し語1つ）が持つデータ構造。
// 多義語のように1つの見出し語が複数の意味を持てるよう、
// 2列目以降（意味・例文など）は senses の配列として保持する。
export type CardData = {
  head: string;
  senses: Record<string, string>[];
};
