"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { RecipeSearchItem } from "@/types";
import { scoreIngredientMatch, formatTime } from "@/lib/utils";

interface IngredientSearchProps {
  recipes: RecipeSearchItem[];
}

interface MatchResult {
  recipe: RecipeSearchItem;
  score: number;
  matched: string[];
}

export function IngredientSearch({ recipes }: IngredientSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(() => {
    const ingredients = query
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);

    if (ingredients.length === 0) return;

    const scored: MatchResult[] = recipes
      .map((recipe) => {
        const { score, matched } = scoreIngredientMatch(
          ingredients,
          recipe.ingredientNames,
          recipe.tags
        );
        return { recipe, score, matched };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || (b.recipe.kidFriendly ? 1 : 0) - (a.recipe.kidFriendly ? 1 : 0))
      .slice(0, 6);

    setResults(scored);
    setSearched(true);
  }, [query, recipes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm ring-1 ring-earth-900/5">
      <h2 className="font-serif text-2xl mb-2">Lav med det du har</h2>
      <p className="text-earth-600 text-sm mb-5">
        Skriv 3–6 ingredienser du har i køleskabet, adskilt af komma.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="fx rosenkål, kartofler, citron, nødder"
          className="input resize-none h-20 sm:h-14 flex-1"
          aria-label="Ingredienser du har"
          maxLength={200}
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="btn-primary shrink-0 sm:self-end"
        >
          Find opskrifter
        </button>
      </div>

      {searched && results.length === 0 && (
        <p className="mt-6 text-earth-600 text-sm">
          Ingen direkte match. Prøv med andre ingredienser eller tjek{" "}
          <Link href="/opskrifter" className="text-spice hover:underline">
            alle opskrifter
          </Link>
          .
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-earth-600 mb-4">
            {results.length} forslag der matcher det du har:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(({ recipe, matched }) => (
              <Link
                key={recipe.slug}
                href={`/opskrifter/${recipe.slug}`}
                className="flex items-start gap-3 rounded-2xl p-3 hover:bg-cream-100
                           border border-cream-200 transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-cream-200">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-2xl text-earth-900/20">
                        {recipe.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-medium text-earth-900 group-hover:text-spice transition-colors leading-tight mb-1 truncate">
                    {recipe.title}
                  </p>
                  <p className="text-xs text-earth-500">
                    {formatTime(recipe.timeTotal)}
                  </p>
                  <p className="text-xs text-sage mt-1 leading-snug">
                    Matcher: {matched.join(", ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
