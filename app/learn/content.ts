import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type Section = {
  slug: string;
  title: string;
  source: string;
  body: string;
};

const TITLE_LINE_PATTERN = /^\*\*(.+?)\*\*\s*(.*)$/;

async function loadSections(languageSlug: string): Promise<Section[]> {
  const dirPath = path.join(process.cwd(), "public", "docs", languageSlug);
  let fileNames: string[];
  try {
    fileNames = (await readdir(dirPath))
      .filter((fileName) => fileName.endsWith(".md") && !fileName.startsWith("00_"))
      .sort();
  } catch {
    return [];
  }

  return Promise.all(
    fileNames.map(async (fileName) => {
      const raw = await readFile(path.join(dirPath, fileName), "utf-8");
      const [firstLine, ...rest] = raw.split("\n");
      const match = firstLine.match(TITLE_LINE_PATTERN);

      return {
        slug: fileName.replace(/^\d+_/, "").replace(/\.md$/, ""),
        title: match ? match[1] : firstLine,
        source: match ? match[2].replace(/^[（(]|[）)]$/g, "") : "",
        body: rest.join("\n").trim(),
      };
    }),
  );
}

export function getSections(languageSlug: string): Promise<Section[]> {
  return loadSections(languageSlug);
}

export async function getSection(
  languageSlug: string,
  slug: string,
): Promise<Section | null> {
  const sections = await loadSections(languageSlug);
  return sections.find((section) => section.slug === slug) ?? null;
}
