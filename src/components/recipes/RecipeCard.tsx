import Link from "next/link";
import Image from "next/image";
import { formatTime } from "@/lib/utils";
import type { RecipeSearchItem } from "@/types";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: RecipeSearchItem;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <Link
      href={`/opskrifter/${recipe.slug}`}
      className={cn("card group flex flex-col focus-visible:outline-2 focus-visible:outline-spice", className)}
      aria-label={`Se opskrift: ${recipe.title}`}
    >
      {/* Billede eller placeholder */}
      <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <PlaceholderImage title={recipe.title} />
        )}
        {/* Tags overlay */}
        <div className="absolute bottom-0 left-0 p-3 flex gap-1.5 flex-wrap">
          {recipe.kidFriendly && (
            <span className="tag-sage text-[11px] backdrop-blur-sm bg-white/80 text-sage-dark">
              Børnevenlig
            </span>
          )}
          {recipe.leftoverFriendly && (
            <span className="tag text-[11px] backdrop-blur-sm bg-white/80">
              God som rest
            </span>
          )}
        </div>
      </div>

      {/* Indhold */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg leading-snug text-earth-900 group-hover:text-spice transition-colors">
            {recipe.title}
          </h3>
          <TimeChip minutes={recipe.timeTotal} />
        </div>
        <p className="text-sm text-earth-600 line-clamp-2 mb-4 flex-1">
          {recipe.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-[11px]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function TimeChip({ minutes }: { minutes: number }) {
  if (!minutes) return null;
  return (
    <span className="shrink-0 text-xs text-earth-600 bg-cream-200 rounded-full px-2.5 py-1 font-medium">
      {formatTime(minutes)}
    </span>
  );
}

function PlaceholderImage({ title }: { title: string }) {
  // Generér en blød baggrund baseret på titel-bogstav
  const hues: Record<string, string> = {
    A: "bg-amber-100", B: "bg-orange-100", C: "bg-yellow-100",
    D: "bg-lime-100", E: "bg-green-100", F: "bg-teal-100",
    G: "bg-cyan-100", H: "bg-sky-100", I: "bg-blue-100",
    J: "bg-indigo-100", K: "bg-violet-100", L: "bg-purple-100",
    M: "bg-fuchsia-100", N: "bg-pink-100", O: "bg-rose-100",
  };
  const letter = title[0]?.toUpperCase() ?? "A";
  const bg = hues[letter] ?? "bg-cream-200";
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", bg)} aria-hidden="true">
      <span className="font-serif text-6xl text-earth-900/20 select-none">
        {letter}
      </span>
    </div>
  );
}
