import fs from "node:fs/promises";
import path from "node:path";
import SpanishNumberPractice, { type SpanishNumberItem } from "./SpanishNumberPractice";

/**
 * スペイン語学習教材のMDXファイル群（app/learn/spanish/[section]/page.mdx）から
 * 数字と表記のペアを動的に抽出する関数。
 *
 * 【設計のポイント】
 * ハードコーディング（ベタ打ち）を回避し、MDX教材ファイル自身を単一のデータソース（Single Source of Truth）
 * として扱うことで、データの二重管理を防止している。
 */
async function getSpanishNumbersFromMdx(): Promise<SpanishNumberItem[]> {
  // スペイン語教材が配置されているルートディレクトリの絶対パスを取得
  const spanishDir = path.join(process.cwd(), "app", "learn", "spanish");
  const items: SpanishNumberItem[] = [];

  try {
    // ディレクトリ内のすべてのエントリ（"01", "02" などのセクションフォルダ）を取得
    const entries = await fs.readdir(spanishDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const mdxPath = path.join(spanishDir, entry.name, "page.mdx");
        try {
          // MDX ファイルのテキスト内容を非同期で読み込み
          const content = await fs.readFile(mdxPath, "utf-8");
          const lines = content.split("\n");

          for (const line of lines) {
            const trimmed = line.trim();
            // マークダウンテーブルの行（"|" で始まり "|" で終わる行）を検出
            if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
              // 先頭と末尾の空要素を除去し、各セルの文字列を取り出す
              const cells = trimmed
                .split("|")
                .slice(1, -1)
                .map((c) => c.trim());

              if (cells.length >= 2) {
                const num = cells[0];
                const spanish = cells[1];

                // 1列目が数字のみで構成され、かつヘッダー行や区切り行でないデータを抽出
                if (
                  num &&
                  spanish &&
                  /^\d+$/.test(num) &&
                  spanish !== "-" &&
                  spanish !== "綴り" &&
                  spanish !== "数"
                ) {
                  items.push({ num, spanish });
                }
              }
            }
          }
        } catch {
          // 指定フォルダ内に page.mdx が存在しない、または読込不能な場合はスキップ
        }
      }
    }
  } catch {
    // ディレクトリ読込エラー時は空配列を返す
  }

  return items;
}

/**
 * サーバー側でMDXデータを読み込み、クライアントUIコンポーネント（SpanishNumberPractice）
 * へデータを受け渡すためのReact Server Component。
 */
export default async function SpanishNumberPracticeLoader() {
  // サーバー側で既存ファイルから出題データ一覧を取得
  const items = await getSpanishNumbersFromMdx();

  // クライアントコンポーネントへ引き渡し
  return <SpanishNumberPractice items={items} />;
}
