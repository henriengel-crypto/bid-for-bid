import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Konverter filnavn til slug */
export function toSlug(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

/** Formatér tid i minutter til læsevenlig streng */
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} t ${m} min` : `${h} t`;
}

/** Skalér en mængde-streng med en faktor */
export function scaleAmount(amount: string, factor: number): string {
  // Håndtér brøker som "1/2"
  if (amount.includes("/")) {
    const [num, den] = amount.split("/").map(Number);
    const result = (num / den) * factor;
    return formatNumber(result);
  }
  // Håndtér rækker som "et nip", "efter smag" – lad dem stå
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return formatNumber(num * factor);
}

function formatNumber(n: number): string {
  // Rund til rimelig præcision
  const rounded = Math.round(n * 4) / 4; // nærmeste 0.25
  if (rounded === Math.floor(rounded)) return String(Math.floor(rounded));
  // Vis som brøk hvis det er pænt
  const frac: Record<number, string> = {
    0.25: "1/4",
    0.5: "1/2",
    0.75: "3/4",
    1.25: "1 1/4",
    1.5: "1 1/2",
    1.75: "1 3/4",
  };
  const decimal = rounded - Math.floor(rounded);
  if (frac[decimal]) {
    const whole = Math.floor(rounded);
    return whole > 0 ? `${whole} ${frac[decimal]}` : frac[decimal];
  }
  return String(Math.round(rounded * 10) / 10);
}

/** Simpel tokenisering til søgning */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // fjern diakritika
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Beregn matchscore for ingredient-søgning */
export function scoreIngredientMatch(
  query: string[],
  ingredientNames: string[],
  tags: string[]
): { score: number; matched: string[] } {
  const haystack = [
    ...ingredientNames.map((i) => i.toLowerCase()),
    ...tags.map((t) => t.toLowerCase()),
  ];
  const matched: string[] = [];
  let score = 0;
  for (const q of query) {
    const qNorm = q.toLowerCase().trim();
    if (!qNorm) continue;
    const found = haystack.find(
      (h) => h.includes(qNorm) || qNorm.includes(h)
    );
    if (found) {
      matched.push(q);
      score++;
    }
  }
  return { score, matched };
}

/** Gruppe-gæt baseret på ingrediensnavn */
export function guessShoppingGroup(itemName: string): import("@/types").ShoppingGroup {
  const name = itemName.toLowerCase();
  const groups: Record<string, string[]> = {
    "Grønt": [
      "løg","hvidløg","tomat","gulerod","kartoffel","spinat","broccoli",
      "rosenkål","squash","aubergine","peberfrugt","kål","salat","gulerødder",
      "selleri","purre","fennikel","persille","koriander","timian","basilikum",
      "rosmarin","ingefær","chili","citron","lime","æble","banan","zucchini",
      "blomkål","artiskok","asparges","svampe","champignon","porrer","radise",
      "rødkål","ærter","bønne","linser","kikærter",
    ],
    "Mejeri": [
      "mælk","fløde","smør","ost","yoghurt","creme fraiche","ricotta",
      "parmesan","mozzarella","feta","skyr","kefir","kærnemælk","æg",
    ],
    "Kød & Fisk": [
      "kylling","oksekød","svinekød","laks","torsk","rejer","tun","sardiner",
      "bacon","pølse","skinke","fisk","kød","hakket","filet","bryst","lår",
    ],
    "Krydderier": [
      "salt","peber","spidskommen","koriander","kardemomme","gurkemeje",
      "paprika","oregano","laurbær","muskat","kanel","nelliker","stjerneanis",
      "sesamfrø","hørfrø","chiliflager","tørret",
    ],
    "Kolonial": [
      "pasta","ris","quinoa","linser","kikærter","dåse","olivenolie","olie",
      "eddike","sojasauce","tahini","honning","sirup","mel","sukker","bagepulver",
      "nødder","mandler","valnødder","cashew","kokosmelk","tomat","hakkede",
      "polenta","gryn","havregryn","brød","cornflakes","müsli",
    ],
  };
  for (const [group, keywords] of Object.entries(groups)) {
    if (keywords.some((kw) => name.includes(kw))) {
      return group as import("@/types").ShoppingGroup;
    }
  }
  return "Andet";
}

/** Formatér dato til dansk */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
