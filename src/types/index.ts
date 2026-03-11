// -----------------------------------------------
// Bid for bid – centrale TypeScript-typer
// -----------------------------------------------

export interface Ingredient {
  amount: string;       // fx "400", "1/2", "et nip"
  unit: string;         // fx "g", "dl", "spsk", "stk", ""
  item: string;         // fx "rosenkål", "tahini", "citroner"
  note?: string;        // fx "grofthakket", "saften af 1"
  group?: ShoppingGroup; // hvilken indkøbsgruppe
}

export type ShoppingGroup =
  | "Grønt"
  | "Mejeri"
  | "Kød & Fisk"
  | "Kolonial"
  | "Krydderier"
  | "Andet";

export type Season = "forår" | "sommer" | "efterår" | "vinter" | "hele året";
export type MealType = "aftensmad" | "frokost" | "morgenmad" | "snack" | "dessert";

export interface RecipeFrontmatter {
  title: string;
  description: string;
  tags: string[];
  cuisine?: string;
  mealType: MealType;
  timeTotal: number;          // minutter
  timePrep?: number;
  timeCook?: number;
  servingsDefault: string;    // fx "2 voksne + 2 børn"
  servingsCount: number;      // fx 4 (bruges til skalering)
  ingredients: Ingredient[];
  steps: string[];
  kidFriendly: boolean;
  leftoverFriendly: boolean;
  equipment?: string[];
  dietary: string[];          // fx ["vegetar", "glutenfri"]
  season: Season[];
  image?: string;             // sti relativ til /public
  source?: string;
  variations?: string[];
  tips?: string[];
  slug?: string;              // auto-genereret fra filnavn
  publishedAt?: string;       // ISO dato
}

export interface Recipe extends RecipeFrontmatter {
  slug: string;
  content: string;            // rå MDX
}

export interface RecipeSearchItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  dietary: string[];
  cuisine?: string;
  mealType: MealType;
  ingredientNames: string[];  // kun varens navn, lowercase
  kidFriendly: boolean;
  leftoverFriendly: boolean;
  season: Season[];
  timeTotal: number;
  image?: string;
}

// ----- AI-guides -----

export interface Prompt {
  label: string;
  text: string;
}

export interface GuideExample {
  input: string;
  output: string;
}

export interface GuideFrontmatter {
  title: string;
  description: string;
  category: string;           // fx "madplan"
  tags: string[];
  problem: string;
  solution: string;
  workflow: string[];         // trin-for-trin
  prompts: Prompt[];
  example?: GuideExample;
  publishedAt?: string;
}

export interface Guide extends GuideFrontmatter {
  slug: string;
  content: string;
}

export interface GuideSearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

// ----- Indkøbsliste -----

export interface ShoppingItem {
  id: string;
  amount: string;
  unit: string;
  item: string;
  note?: string;
  group: ShoppingGroup;
  bought: boolean;
  recipeSlug?: string;
  recipeTitle?: string;
}

export type ShoppingList = ShoppingItem[];

// ----- Søgeindeks -----

export interface SearchIndex {
  recipes: RecipeSearchItem[];
  guides: GuideSearchItem[];
  generatedAt: string;
}
