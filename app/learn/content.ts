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

// 任意の言語について、セクションの番号配列を返す関数
export async function getSections(languageSlug: string): Promise<SectionSummary[]> {
  const sectionSlugs = await listSlugs(languageSlug);

  //　Promise.all()は、複数のPromiseをまとめて"並列"で待ち、すべて完了したら結果を1つの配列で返す
  return Promise.all(
    sectionSlugs.map(async (sectionSlug) => {
      // ここでのimport()は動的インポートであり、指定されたパスの情報を読み込む
      // page.mdxファイルの中からtitleプロパティを、分割代入によって取得している
      const { title } = await import(`./${languageSlug}/${sectionSlug}/page.mdx`);
      return { sectionSlug, title };
    }),
  );
}
