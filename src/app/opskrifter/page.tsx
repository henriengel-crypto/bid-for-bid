import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllRecipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilter } from "@/components/recipes/RecipeFilter";
import { IngredientSearch } from "@/components/recipes/IngredientSearch";
import type { RecipeSearchItem, Recipe } from "@/types";

export const metadata: Metadata = {
  title: "Opskrifter",
  description: "Alle opskrifter – filtrer på kategori, sæson, kost og mere.",
};

function toSearchItem(r: Recipe): RecipeSearchItem {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    tags: r.tags ?? [],
    dietary: r.dietary ?? [],
    cuisine: r.cuisine,
    mealType: r.mealType,
    ingredientNames: (r.ingredients ?? []).map((i) => i.item.toLowerCase()),
    kidFriendly: r.kidFriendly,
    leftoverFriendly: r.leftoverFriendly,
    season: r.season ?? [],
    timeTotal: r.timeTotal,
    image: r.image,
  };
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function OpskrifterPage({ searchParams }: PageProps) {
  const allRecipes = getAllRecipes();
  const allItems = allRecipes.map(toSearchItem);

  // Server-side filtrering baseret på searchParams
  const tag = searchParams.tag as string | undefined;
  const dietary = searchParams.dietary as string | undefined;
  const season = searchParams.season as string | undefined;
  const kidFriendly = searchParams.kidFriendly === "true";
  const leftoverFriendly = searchParams.leftoverFriendly === "true";
  const q = searchParams.q as string | undefined;

  const filtered = allItems.filter((r) => {
    if (q) {
      const search = q.toLowerCase();
      const haystack = [r.title, r.description, ...r.tags, ...r.ingredientNames].join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (tag && !r.tags.includes(tag)) return false;
    if (dietary && !r.dietary.includes(dietary)) return false;
    if (season && !r.season.includes(season as RecipeSearchItem["season"][number])) return false;
    if (kidFriendly && !r.kidFriendly) return false;
    if (leftoverFriendly && !r.leftoverFriendly) return false;
    return true;
  });

  const hasFilters = !!(tag || dietary || season || kidFriendly || leftoverFriendly || q);

  return (
    <div className="py-10 md:py-14">
      <div className="container-bfb">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-display-sm text-earth-900 mb-3">Opskrifter</h1>
          <p className="text-earth-600 max-w-xl">
            {allItems.length} opskrifter til en travl hverdag. Filtrer, sog, og find det der passer til i dag.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar – filtre */}
          <aside className="lg:w-56 shrink-0">
            <Suspense>
              <RecipeFilter />
            </Suspense>
          </aside>

          {/* Hoved-indhold */}
          <div className="flex-1 min-w-0">
            {/* Søgefelt */}
            <SearchBar defaultValue={q} />

            {/* Resultat-header */}
            <div className="mt-6 mb-5 flex items-center gap-3">
              <p className="text-sm text-earth-600">
                {filtered.length === allItems.length
                  ? `${allItems.length} opskrifter`
                  : `${filtered.length} af ${allItems.length} opskrifter`}
              </p>
              {hasFilters && (
                <span className="tag-spice text-[11px]">Filtreret</span>
              )}
            </div>

            {/* Opskriftsgrid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((recipe) => (
                  <RecipeCard key={recipe.slug} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-earth-600 mb-2">Ingen opskrifter matcher dit filter.</p>
                <a href="/opskrifter" className="text-sm text-spice hover:underline">
                  Se alle opskrifter
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Lav med det du har */}
        <div id="lav-med-det-du-har" className="mt-16 scroll-mt-24">
          <IngredientSearch recipes={allItems} />
        </div>
      </div>
    </div>
  );
}

// Server-kompatibel søgeboks der bruger URL-params
function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <form method="get" action="/opskrifter" role="search">
      <label htmlFor="q" className="sr-only">Sog i opskrifter</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </span>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Sog pa opskrift, ingrediens eller tag..."
          className="input pl-10"
        />
      </div>
    </form>
  );
}
