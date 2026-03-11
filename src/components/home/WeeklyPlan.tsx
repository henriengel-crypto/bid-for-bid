"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { RecipeSearchItem, ShoppingItem } from "@/types";
import { formatTime, guessShoppingGroup } from "@/lib/utils";
import { ShoppingListModal } from "@/components/shopping/ShoppingList";

interface WeeklyPlanProps {
  recipes: RecipeSearchItem[];
}

const STORAGE_KEY = "bfb-last-week-slugs";
const DAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
type DayPlan = { day: string; recipe: RecipeSearchItem };

// Vælg én opskrift af en bestemt type
function pickOne(
  pool: RecipeSearchItem[],
  used: Set<string>,
  criteria: (r: RecipeSearchItem) => boolean
): RecipeSearchItem | undefined {
  const candidates = pool.filter((r) => !used.has(r.slug) && criteria(r));
  if (candidates.length === 0) return pool.find((r) => !used.has(r));
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function WeeklyPlan({ recipes }: WeeklyPlanProps) {
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [generated, setGenerated] = useState(false);
  const [showShopping, setShowShopping] = useState(false);

  // Hent slugs fra sidste uge til at undgå gentagelser
  const getLastWeekSlugs = (): Set<string> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  };

  const generate = useCallback(() => {
    const lastWeek = getLastWeekSlugs();
    // Undgå gentagelser fra sidste uge hvis muligt
    const pool = recipes.filter((r) => !lastWeek.has(r.slug));
    const fallback = pool.length >= 5 ? pool : recipes;

    const used = new Set<string>();
    const add = (r?: RecipeSearchItem) => {
      if (r) used.add(r.slug);
      return r;
    };

    const fish    = add(pickOne(fallback, used, (r) => r.dietary.includes("fisk") || r.tags.some(t => t.includes("fisk"))));
    const veg     = add(pickOne(fallback, used, (r) => r.dietary.includes("vegetar")));
    const pasta   = add(pickOne(fallback, used, (r) => r.cuisine === "italiensk" || r.tags.some(t => t.includes("pasta") || t.includes("polenta"))));
    const onepot  = add(pickOne(fallback, used, (r) => r.tags.some(t => t.includes("one-pot") || t.includes("ovn") || t.includes("gryde") || t.includes("suppe"))));
    const leftover= add(pickOne(fallback, used, (r) => r.leftoverFriendly));

    const picks = [fish, veg, pasta, onepot, leftover]
      .filter(Boolean) as RecipeSearchItem[];

    // Fyld op til 5 hvis nogen mangler
    for (const r of fallback) {
      if (picks.length >= 5) break;
      if (!used.has(r.slug)) picks.push(r);
    }

    const newPlan: DayPlan[] = DAYS.map((day, i) => ({
      day,
      recipe: picks[i] ?? recipes[i % recipes.length],
    }));

    setPlan(newPlan);
    setGenerated(true);

    // Gem denne uges slugs til næste uge
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newPlan.map((p) => p.recipe.slug))
      );
    } catch {}
  }, [recipes]);

  // Byg indkøbsliste fra plan (brug kun ingrediensnavne fra søgeindekset)
  const buildShoppingItems = useCallback((): ShoppingItem[] => {
    const items: ShoppingItem[] = [];
    plan.forEach(({ recipe }) => {
      recipe.ingredientNames.forEach((name, idx) => {
        items.push({
          id: `${recipe.slug}-${idx}`,
          amount: "",
          unit: "",
          item: name,
          group: guessShoppingGroup(name),
          bought: false,
          recipeSlug: recipe.slug,
          recipeTitle: recipe.title,
        });
      });
    });
    return items;
  }, [plan]);

  return (
    <section className="py-12 md:py-16 border-b border-cream-200">
      <div className="container-bfb">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-earth-900 mb-1">
              Ugeplan pa autopilot
            </h2>
            <p className="text-earth-600 text-sm">
              5 middage med variation: fisk, vegetar, pasta, one-pot og restemad.
            </p>
          </div>
          <button
            onClick={generate}
            className="btn-primary shrink-0"
          >
            {generated ? "Ny ugeplan" : "Generer ugeplan"}
          </button>
        </div>

        {plan.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 animate-fade-in">
              {plan.map(({ day, recipe }) => (
                <div key={day} className="bg-white rounded-2xl p-4 ring-1 ring-earth-900/5">
                  <p className="text-xs font-semibold text-earth-500 uppercase tracking-wide mb-2">
                    {day}
                  </p>
                  <Link
                    href={`/opskrifter/${recipe.slug}`}
                    className="font-serif text-sm font-medium text-earth-900
                               hover:text-spice transition-colors leading-snug block mb-1"
                  >
                    {recipe.title}
                  </Link>
                  <p className="text-[11px] text-earth-500">{formatTime(recipe.timeTotal)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-start">
              <button
                onClick={() => setShowShopping(true)}
                className="btn-sage"
              >
                <ShoppingBagIcon />
                Lav indkobsliste
              </button>
            </div>
          </>
        )}

        {!generated && (
          <div className="py-10 text-center text-earth-400 text-sm">
            Én knap. Fem middage. Klar til ugen.
          </div>
        )}
      </div>

      {showShopping && (
        <ShoppingListModal
          initialItems={buildShoppingItems()}
          onClose={() => setShowShopping(false)}
        />
      )}
    </section>
  );
}

function ShoppingBagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
