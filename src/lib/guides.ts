import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Guide, GuideFrontmatter } from "@/types";

const GUIDES_DIR = path.join(process.cwd(), "content/ai-guides");

export function getGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getGuideBySlug(slug: string): Guide | null {
  const fullPath = path.join(GUIDES_DIR, `${slug}.mdx`);
  const fallback = path.join(GUIDES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(fullPath) ? fullPath : fallback;
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...(data as GuideFrontmatter),
    slug,
    content,
  };
}

export function getAllGuides(): Guide[] {
  return getGuideSlugs()
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== null)
    .sort((a, b) => {
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return a.title.localeCompare(b.title, "da");
    });
}
