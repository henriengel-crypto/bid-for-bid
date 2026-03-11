#!/usr/bin/env node
/**
 * Genererer /public/search-index.json ved build.
 * Indeholder let-søgbare data for opskrifter og AI-guides.
 */

const fs = require("fs");
const path = require("path");

// gray-matter er ikke tilgængeligt som CJS nemt, brug manuel parsing
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, body: content };
  const yaml = match[1];
  const body = content.slice(match[0].length).trim();

  // Minimal YAML parser – understøtter simple key: value og lister
  const data = {};
  const lines = yaml.split("\n");
  let currentKey = null;
  let inList = false;

  for (const line of lines) {
    const listItem = line.match(/^\s+-\s+(.*)/);
    if (listItem) {
      if (currentKey && inList) {
        if (!Array.isArray(data[currentKey])) data[currentKey] = [];
        // Håndtér nested objekt (ingrediens-lister er komplekse – skip dem)
        const val = listItem[1].trim();
        if (!val.includes(":")) {
          data[currentKey].push(val.replace(/^["']|["']$/g, ""));
        }
      }
      continue;
    }
    const kvMatch = line.match(/^(\w[\w\s]*?):\s*(.*)/);
    if (kvMatch) {
      inList = false;
      currentKey = kvMatch[1].trim();
      const val = kvMatch[2].trim();
      if (val === "") {
        inList = true;
        data[currentKey] = [];
      } else if (val === "true") {
        data[currentKey] = true;
      } else if (val === "false") {
        data[currentKey] = false;
      } else if (!isNaN(Number(val))) {
        data[currentKey] = Number(val);
      } else {
        data[currentKey] = val.replace(/^["']|["']$/g, "");
      }
    }
  }
  return { data, body };
}

function buildRecipeIndex() {
  const dir = path.join(process.cwd(), "content/opskrifter");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf8");
      const { data } = parseFrontmatter(raw);

      // Udtræk ingrediensnavne fra den rå YAML-blok
      const ingredientMatches = raw.match(/item:\s*(.+)/g) || [];
      const ingredientNames = ingredientMatches
        .map((m) => m.replace(/item:\s*/, "").trim().replace(/^["']|["']$/g, "").toLowerCase());

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        dietary: Array.isArray(data.dietary) ? data.dietary : [],
        cuisine: data.cuisine || null,
        mealType: data.mealType || "aftensmad",
        ingredientNames,
        kidFriendly: !!data.kidFriendly,
        leftoverFriendly: !!data.leftoverFriendly,
        season: Array.isArray(data.season) ? data.season : [],
        timeTotal: data.timeTotal || 0,
        image: data.image || null,
      };
    });
}

function buildGuideIndex() {
  const dir = path.join(process.cwd(), "content/ai-guides");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf8");
      const { data } = parseFrontmatter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        category: data.category || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    });
}

const index = {
  recipes: buildRecipeIndex(),
  guides: buildGuideIndex(),
  generatedAt: new Date().toISOString(),
};

const outDir = path.join(process.cwd(), "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "search-index.json"),
  JSON.stringify(index, null, 2)
);

console.log(
  `[bid-for-bid] Søgeindeks genereret: ${index.recipes.length} opskrifter, ${index.guides.length} guides`
);
