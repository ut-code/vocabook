// 母音ごとの声調サイクル。母音を入力した直後に ↑/↓ キーで
// 第1声→第2声→第3声→第4声（→軽声）と切り替えられる。
export const TONE_CYCLES: string[][] = [
  ["a", "ā", "á", "ǎ", "à"],
  ["e", "ē", "é", "ě", "è"],
  ["i", "ī", "í", "ǐ", "ì"],
  ["o", "ō", "ó", "ǒ", "ò"],
  ["u", "ū", "ú", "ǔ", "ù"],
  ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
];

export const TOOLBAR_CHARS = [
  "ü",
  "ā",
  "á",
  "ǎ",
  "à",
  "ē",
  "é",
  "ě",
  "è",
  "ī",
  "í",
  "ǐ",
  "ì",
  "ō",
  "ó",
  "ǒ",
  "ò",
  "ū",
  "ú",
  "ǔ",
  "ù",
  "ǖ",
  "ǘ",
  "ǚ",
  "ǜ",
];

// 声調記号付きの母音 → { 基本母音, 声調番号 }
const TONE_MARKS: Record<string, { base: string; tone: string }> = {
  ā: { base: "a", tone: "1" },
  á: { base: "a", tone: "2" },
  ǎ: { base: "a", tone: "3" },
  à: { base: "a", tone: "4" },
  ē: { base: "e", tone: "1" },
  é: { base: "e", tone: "2" },
  ě: { base: "e", tone: "3" },
  è: { base: "e", tone: "4" },
  ī: { base: "i", tone: "1" },
  í: { base: "i", tone: "2" },
  ǐ: { base: "i", tone: "3" },
  ì: { base: "i", tone: "4" },
  ō: { base: "o", tone: "1" },
  ó: { base: "o", tone: "2" },
  ǒ: { base: "o", tone: "3" },
  ò: { base: "o", tone: "4" },
  ū: { base: "u", tone: "1" },
  ú: { base: "u", tone: "2" },
  ǔ: { base: "u", tone: "3" },
  ù: { base: "u", tone: "4" },
  ǖ: { base: "ü", tone: "1" },
  ǘ: { base: "ü", tone: "2" },
  ǚ: { base: "ü", tone: "3" },
  ǜ: { base: "ü", tone: "4" },
};

// ピンインを「基本つづり + 声調番号」の正規形にそろえる。
// 声調記号（wǒ）・末尾の数字（wo3）どちらの入力でも同じ形になり、
// v / u: は ü として扱う。軽声・無声調は番号なし。
export function canonicalPinyin(raw: string): string {
  let s = raw.normalize("NFC").trim().toLowerCase().replace(/\s+/g, "");
  s = s.replace(/u:/g, "ü").replace(/v/g, "ü");

  let tone = "";
  let base = "";
  for (const ch of s) {
    const mark = TONE_MARKS[ch];
    if (mark) {
      base += mark.base;
      tone = mark.tone;
    } else {
      base += ch;
    }
  }

  const trailing = base.match(/([0-5])$/);
  if (trailing) {
    base = base.slice(0, -1);
    const t = trailing[1];
    tone = t === "0" || t === "5" ? "" : t;
  }

  return base + tone;
}
