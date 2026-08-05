import ExcelJS from "exceljs";

export type ParsedNotebook = {
  // Excelの1行目（ヘッダー行）の値を、出現順のまま並べたもの
  columns: string[];
  // 2行目以降の各行を { 列名: セルの値 } の形にしたもの
  rows: Record<string, string>[];
};

export class ExcelParseError extends Error {}

// exceljsのCell.valueは文字列・数値・日付・数式結果オブジェクトなど
// 型がまちまちなので、表示用の1本の文字列に正規化する
function cellToText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("ja-JP");
  }
  if (typeof value === "object") {
    // 数式セル: { formula, result } の result を使う
    if ("result" in value) {
      return cellToText((value as ExcelJS.CellFormulaValue).result ?? "");
    }
    // リッチテキストセル: { richText: [{ text }, ...] }
    if ("richText" in value) {
      return (value as ExcelJS.CellRichTextValue).richText
        .map((fragment) => fragment.text)
        .join("");
    }
    // ハイパーリンクセル: { text, hyperlink }
    if ("text" in value) {
      return String((value as ExcelJS.CellHyperlinkValue).text ?? "");
    }
    return "";
  }
  return String(value).trim();
}

// アップロードされたExcelファイル（1シート目）を読み取り、
// 1行目をヘッダーとする可変列の単語帳データに変換する
export async function parseExcelWorkbook(
  buffer: ArrayBuffer,
): Promise<ParsedNotebook> {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer);
  } catch {
    throw new ExcelParseError(
      "Excelファイル（.xlsx）として読み込めませんでした。ファイル形式を確認してください。",
    );
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet || worksheet.actualRowCount === 0) {
    throw new ExcelParseError("シートにデータが見つかりませんでした。");
  }

  const headerRow = worksheet.getRow(1);
  const columnCount = Math.max(headerRow.actualCellCount, worksheet.actualColumnCount);
  if (columnCount === 0) {
    throw new ExcelParseError("1行目にヘッダーが見つかりませんでした。");
  }

  const usedNames = new Set<string>();
  const columns: string[] = [];
  for (let col = 1; col <= columnCount; col += 1) {
    const raw = cellToText(headerRow.getCell(col).value);
    let name = raw || `列${col}`;
    // 同名列がある場合は連番を振って区別する
    while (usedNames.has(name)) {
      name = `${raw || `列${col}`} (${col})`;
    }
    usedNames.add(name);
    columns.push(name);
  }

  const rows: Record<string, string>[] = [];
  for (let r = 2; r <= worksheet.rowCount; r += 1) {
    const row = worksheet.getRow(r);
    if (row.actualCellCount === 0) {
      continue;
    }

    const data: Record<string, string> = {};
    let hasValue = false;
    columns.forEach((name, index) => {
      const text = cellToText(row.getCell(index + 1).value);
      if (text) {
        hasValue = true;
      }
      data[name] = text;
    });

    if (hasValue) {
      rows.push(data);
    }
  }

  if (rows.length === 0) {
    throw new ExcelParseError("2行目以降にデータが見つかりませんでした。");
  }

  return { columns, rows };
}
