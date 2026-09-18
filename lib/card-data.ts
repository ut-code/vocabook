// 1枚のカード（見出し語1つ）が持つデータ構造。
// cells: 列名 → その列の値のリスト。通常1件だが、同じ見出し語で複数の値
// （多義語の意味、複数ある発音など）を持たせたいときだけ配列を伸ばす。
// 列同士は完全に独立しており、「この意味とこの発音が対応している」といった
// セル間の対応付けは持たない（列ごとに自由に件数を変えられる）
export type CardData = {
  head: string;
  cells: Record<string, string[]>;
};

// DBから読んだcard.dataを正規化する。
// 過去に一時的に存在した別形式（single: Record<string,string> + senses: Record<string,string>[]）
// との互換性のため、そちらの形式で保存されたデータも cells 形式へ変換して読み込む
export function normalizeCardData(raw: unknown): CardData {
  const data = (raw ?? {}) as {
    head?: unknown;
    cells?: unknown;
    single?: unknown;
    senses?: unknown;
  };
  const head = typeof data.head === "string" ? data.head : "";

  // 最新形式: { head, cells }
  if (data.cells && typeof data.cells === "object" && !Array.isArray(data.cells)) {
    const cells: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(data.cells as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        cells[key] = value.filter((v): v is string => typeof v === "string" && v !== "");
      }
    }
    return { head, cells };
  }

  // 旧形式（single + senses）からの変換
  const cells: Record<string, string[]> = {};
  const single =
    data.single && typeof data.single === "object" && !Array.isArray(data.single)
      ? (data.single as Record<string, string>)
      : {};
  for (const [key, value] of Object.entries(single)) {
    if (value !== "") cells[key] = [value];
  }
  const senses = Array.isArray(data.senses) ? (data.senses as Record<string, string>[]) : [];
  for (const sense of senses) {
    for (const [key, value] of Object.entries(sense)) {
      if (value === "") continue;
      (cells[key] ??= []).push(value);
    }
  }

  return { head, cells };
}
