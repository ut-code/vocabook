import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type SectionSummary = {
  slug: string;
  title: string;
};

const TITLE_LINE_PATTERN = /^#\s+(.+)$/m;

async function listSlugs(languageSlug: string): Promise<string[]> {
  const dirPath = path.join(process.cwd(), "app", "learn", languageSlug);
  let entries;
  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

export async function getSections(languageSlug: string): Promise<SectionSummary[]> {
  const slugs = await listSlugs(languageSlug);

  return Promise.all(
    slugs.map(async (slug) => {
      const raw = await readFile(
        path.join(process.cwd(), "app", "learn", languageSlug, slug, "page.mdx"),
        "utf-8",
      );
      const match = raw.match(TITLE_LINE_PATTERN);

      return { slug, title: match ? match[1] : slug };
    }),
  );
}
