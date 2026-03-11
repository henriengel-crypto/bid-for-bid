import Link from "next/link";
import type { GuideSearchItem } from "@/types";
import { cn } from "@/lib/utils";

interface GuideCardProps {
  guide: GuideSearchItem;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  madplan: "bg-spice/10 text-spice-dark",
  indkob: "bg-sage/10 text-sage-dark",
  rester: "bg-amber-100 text-amber-800",
  fermentering: "bg-lime-100 text-lime-800",
  "bornevenlig-mad": "bg-sky-100 text-sky-800",
  projektstyring: "bg-violet-100 text-violet-800",
};

export function GuideCard({ guide, className }: GuideCardProps) {
  const colorClass = CATEGORY_COLORS[guide.category] ?? "bg-cream-200 text-earth-700";

  return (
    <Link
      href={`/ai-i-hverdagen/${guide.slug}`}
      className={cn(
        "card group flex flex-col p-6 focus-visible:outline-2 focus-visible:outline-spice",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg leading-snug text-earth-900 group-hover:text-spice transition-colors">
          {guide.title}
        </h3>
        <span className={cn("tag text-[11px] shrink-0", colorClass)}>
          {guide.category}
        </span>
      </div>
      <p className="text-sm text-earth-600 mb-4 flex-1 line-clamp-3">
        {guide.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {guide.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag text-[11px]">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
