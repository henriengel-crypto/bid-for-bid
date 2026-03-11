import type { Metadata } from "next";
import Link from "next/link";
import { getAllRecipes } from "@/lib/recipes";
import { getAllGuides } from "@/lib/guides";
import { Hero } from "@/components/home/Hero";
import { WhatForDinner } from "@/components/home/WhatForDinner";
import { WeeklyPlan } from "@/components/home/WeeklyPlan";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GuideCard } from "@/components/ai/GuideCard";
import type { RecipeSearchItem } from "@/types";

export const metadata: Metadata = {
  title: "Bid for bid – Mad, der virker. Hver dag.",
};

export default function Home() {
  const recipes = getAllRecipes();
  const guides = getAllGuides();
  const latest = recipes.slice(0, 6);

  // Konverter til søgeformat til klientkomponenter
  const searchItems: RecipeSearchItem[] = recipes.map((r) => ({
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
  }));

  const guideItems = guides.map((g) => ({
    slug: g.slug,
    title: g.title,
    description: g.description,
    category: g.category,
    tags: g.tags ?? [],
  }));

  return (
    <>
      <Hero />
      <WhatForDinner recipes={searchItems} />
      <WeeklyPlan recipes={searchItems} />

      {/* Seneste opskrifter */}
      <section className="py-12 md:py-16 border-b border-cream-200">
        <div className="container-bfb">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-earth-900">
              Seneste opskrifter
            </h2>
            <Link href="/opskrifter" className="text-sm text-spice hover:underline font-medium">
              Se alle
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((recipe) => {
              const item: RecipeSearchItem = {
                slug: recipe.slug,
                title: recipe.title,
                description: recipe.description,
                tags: recipe.tags ?? [],
                dietary: recipe.dietary ?? [],
                cuisine: recipe.cuisine,
                mealType: recipe.mealType,
                ingredientNames: (recipe.ingredients ?? []).map((i) => i.item.toLowerCase()),
                kidFriendly: recipe.kidFriendly,
                leftoverFriendly: recipe.leftoverFriendly,
                season: recipe.season ?? [],
                timeTotal: recipe.timeTotal,
                image: recipe.image,
              };
              return <RecipeCard key={recipe.slug} recipe={item} />;
            })}
          </div>
        </div>
      </section>

      {/* AI i hverdagen teaser */}
      {guideItems.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-bfb">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-earth-900 mb-1">
                  AI i hverdagen
                </h2>
                <p className="text-earth-600 text-sm">
                  Genveje der faktisk virker.
                </p>
              </div>
              <Link href="/ai-i-hverdagen" className="text-sm text-spice hover:underline font-medium">
                Se alle guides
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {guideItems.slice(0, 4).map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
