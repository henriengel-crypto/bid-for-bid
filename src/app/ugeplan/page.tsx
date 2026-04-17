import type { Metadata } from "next";
import { getAllRecipes } from "@/lib/recipes";
import { WeeklyPlan } from "@/components/home/WeeklyPlan";
import type { RecipeSearchItem, Recipe } from "@/types";

export const metadata: Metadata = {
  title: "Ugeplan",
  description: "Automatisk madplan for ugen med variation og indkøbsliste.",
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

export default function UgeplanPage() {
  const recipes = getAllRecipes();
  const searchItems = recipes.map(toSearchItem);

  return (
    <div className="py-10 md:py-14">
      <div className="container-bfb">
        <div className="mb-10 max-w-2xl">
          <h1 className="font-serif text-display-sm text-earth-900 mb-4">
            Ugeplan på autopilot
          </h1>
          <p className="text-earth-600 leading-relaxed">
            Et klik og du har fem middage med god variation: fisk, vegetar, pasta,
            one-pot og en ret der bruger det du allerede har. Ugeplanerne huskes,
            så du slipper for at se det samme to uger i træk.
          </p>
        </div>

        <WeeklyPlan recipes={searchItems} />

        {/* Info-boks */}
        <div className="mt-12 max-w-xl bg-cream-200 rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-3">Sådan virker det</h2>
          <ul className="space-y-2 text-sm text-earth-700">
            <li className="flex gap-2"><span className="text-spice shrink-0">1.</span> Klik "Generer ugeplan"</li>
            <li className="flex gap-2"><span className="text-spice shrink-0">2.</span> Få 5 forslag med variation (fisk, vegetar, pasta, one-pot, restemad)</li>
            <li className="flex gap-2"><span className="text-spice shrink-0">3.</span> Klik på en ret for at se opskriften</li>
            <li className="flex gap-2"><span className="text-spice shrink-0">4.</span> Klik "Lav indkøbsliste" for at samle alle ingredienser</li>
            <li className="flex gap-2"><span className="text-spice shrink-0">5.</span> Kopiér listen og brug den i butikken</li>
          </ul>
          <p className="text-xs text-earth-500 mt-4">
            Planen fra denne uge gemmes i din browser, så næste ugeplan undgår gentagelser.
          </p>
        </div>
      </div>
    </div>
  );
}
