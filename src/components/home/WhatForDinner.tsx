"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { RecipeSearchItem } from "@/types";
import { formatTime } from "@/lib/utils";

interface WhatForDinnerProps {
  recipes: RecipeSearchItem[];
}

export function WhatForDinner({ recipes: allRecipes }: WhatForDinnerProps) {
  const [suggestions, setSuggestions] = useState<RecipeSearchItem[]>([]);
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(() => {
    // Boost børnevenlige opskrifter
    const pool = [...allRecipes].sort(() => {
      return Math.random() - (Math.random() > 0.5 ? 0.3 : 0.5);
    });

    // Prioritér kidFriendly men bland godt
    const kids = pool.filter((r) => r.kidFriendly);
    const rest = pool.filter((r) => !r.kidFriendly);

    const mixed = [...kids, ...rest];
    const picked = mixed.slice(0, 6);
    setSuggestions(picked);
    setGenerated(true);
  }, [allRecipes]);

  return (
    <section className="py-12 md:py-16 border-b border-cream-200">
      <div className="container-bfb">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-earth-900 mb-1">
              Hvad skal vi have i aften?
            </h2>
            <p className="text-earth-600 text-sm">
              6 forslag. Trykker du igen, kommer der nye.
            </p>
          </div>
          <button
            onClick={generate}
            className="btn-primary shrink-0"
          >
            {generated ? "Vis andre" : "Giv mig forslag"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 animate-fade-in">
            {suggestions.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/opskrifter/${recipe.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden
                           bg-white ring-1 ring-earth-900/5 hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-cream-200">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-4xl text-earth-900/20">
                        {recipe.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-earth-900 group-hover:text-spice transition-colors leading-snug line-clamp-2">
                    {recipe.title}
                  </p>
                  <p className="text-[11px] text-earth-500 mt-0.5">{formatTime(recipe.timeTotal)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!generated && (
          <div className="py-10 text-center text-earth-400 text-sm">
            Et klik, og du har 6 forslag.
          </div>
        )}
      </div>
    </section>
  );
}
