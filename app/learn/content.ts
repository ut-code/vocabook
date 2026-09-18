import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

export type SectionSummary = {
  sectionSlug: string;
  title: string;
};

// 任意の言語について、セクションの番号配列を返す関数
async function listSlugs(languageSlug: string): Promise<string[]> {
  // path.joinは、複数のパスを結合して1つのパスにする関数
  // process.cwd()は、現在の作業ディレクトリ（Current Working Directory）の絶対パスを返す関数
  // 引数languageSlugの値によって絶対パスが変化する
  const dirPath = path.join(process.cwd(), "app", "learn", languageSlug);
  let entries;
  try {
    // readdir関数は、指定されたディレクトリの内容を読み取り、その中のファイルとディレクトリの情報を配列として返す関数
    // withFileTypesオプションをtrueに設定することで、各要素がDirent（Directory Entryの略）クラスのインスタンスである配列が返される。
    /* Direntクラスの構造は、以下のような構造である。
    class Dirent {
      name;
      …
      isDirectory() {
        return ...;
      }
      isFile() {
        return ...;
      }
    }
    */
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  return (
    entries
      // filterによって、entries配列の中から、ディレクトリであり、かつ名前が数字のみで構成されているものを抽出する（layout.tsxを省くため）
      .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
      // mapによって、抽出されたディレクトリの名前を配列として返す
      .map((entry) => entry.name)
      // sortによって、数字順に並び替える
      .sort()
  );
}

// 任意のセクションについて、page.mdx / page.tsx のうち実際に存在する方の拡張子を返す関数
// （動詞活用ドリルのような練習教材は、静的なMDXではなくインタラクティブなpage.tsxとして実装されるため）
function resolveSectionExtension(languageSlug: string, sectionSlug: string): "mdx" | "tsx" {
  const dirPath = path.join(process.cwd(), "app", "learn", languageSlug, sectionSlug);
  return existsSync(path.join(dirPath, "page.tsx")) ? "tsx" : "mdx";
}

// 任意の言語について、セクションの番号配列を返す関数
export async function getSections(languageSlug: string): Promise<SectionSummary[]> {
  const sectionSlugs = await listSlugs(languageSlug);

  //　Promise.all()は、複数のPromiseをまとめて"並列"で待ち、すべて完了したら結果を1つの配列で返す
  return Promise.all(
    sectionSlugs.map(async (sectionSlug) => {
      // ここでのimport()は動的インポートであり、指定されたパスの情報を読み込む
      // page.mdx / page.tsx ファイルの中からtitleプロパティを、分割代入によって取得している
      const extension = resolveSectionExtension(languageSlug, sectionSlug);
      const { title } =
        extension === "tsx"
          ? await import(`./${languageSlug}/${sectionSlug}/page.tsx`)
          : await import(`./${languageSlug}/${sectionSlug}/page.mdx`);
      return { sectionSlug, title };
    }),
  );
}

// 全言語のセクション情報を保持する型定義（キー: 言語スラッグ, 値: セクション一覧の配列）
export type AllLanguageSections = Record<string, SectionSummary[]>;

/**
 * 指定された複数の言語スラッグに対応するセクション一覧をまとめて並列取得する関数
 * サイドバー等で全言語のセクション（項目）を一括表示するために使用される
 *
 * @param languageSlugs 取得対象の言語スラッグ配列（例: ["chinese", "french", "german", "spanish"]）
 * @returns 各言語スラッグをキーとするAllLanguageSectionsオブジェクト
 */
export async function getAllLanguageSections(
  languageSlugs: string[],
): Promise<AllLanguageSections> {
  // Promise.allを用いて、引数で受け取った全言語のセクション情報を並列で非同期取得する
  const entries = await Promise.all(
    languageSlugs.map(async (slug) => {
      const sections = await getSections(slug);
      return [slug, sections] as const;
    }),
  );
  // [ [key, value], ... ] 形式の二次元配列からオブジェクトを生成して返す
  return Object.fromEntries(entries);
}
