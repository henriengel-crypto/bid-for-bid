import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Recipe, RecipeFrontmatter } from "@/types";

const RECIPES_DIR = path.join(process.cwd(), "content/opskrifter");

export function getRecipeSlugs(): string[] {
  if (!fs.existsSync(RECIPES_DIR)) return [];
  return fs
    .readdirSync(RECIPES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getRecipeBySlug(slug: string): Recipe | null {
  const fullPath = path.join(RECIPES_DIR, `${slug}.mdx`);
  const fallback = path.join(RECIPES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(fullPath) ? fullPath : fallback;
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...(data as RecipeFrontmatter),
    slug,
    content,
  };
}

export function getAllRecipes(): Recipe[] {
  return getRecipeSlugs()
    .map((slug) => getRecipeBySlug(slug))
    .filter((r): r is Recipe => r !== null)
    .sort((a, b) => {
      // Sortér nyeste først (fallback: alfabetisk)
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return a.title.localeCompare(b.title, "da");
    });
}

export function getLatestRecipes(count = 6): Recipe[] {
  return getAllRecipes().slice(0, count);
}

/** Returnér opskrifter filtreret og/eller sorteret */
export function filterRecipes(
  recipes: Recipe[],
  filters: {
    search?: string;
    tags?: string[];
    cuisine?: string;
    mealType?: string;
    kidFriendly?: boolean;
    leftoverFriendly?: boolean;
    dietary?: string[];
    season?: string;
  }
): Recipe[] {
  return recipes.filter((recipe) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        recipe.title,
        recipe.description,
        ...recipe.tags,
        ...(recipe.ingredients?.map((i) => i.item) ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.tags?.length) {
      if (!filters.tags.some((t) => recipe.tags?.includes(t))) return false;
    }
    if (filters.cuisine) {
      if (recipe.cuisine !== filters.cuisine) return false;
    }
    if (filters.mealType) {
      if (recipe.mealType !== filters.mealType) return false;
    }
    if (filters.kidFriendly === true) {
      if (!recipe.kidFriendly) return false;
    }
    if (filters.leftoverFriendly === true) {
      if (!recipe.leftoverFriendly) return false;
    }
    if (filters.dietary?.length) {
      if (!filters.dietary.some((d) => recipe.dietary?.includes(d))) return false;
    }
    if (filters.season) {
      if (!recipe.season?.includes(filters.season as Recipe["season"][number])) return false;
    }
    return true;
  });
}
