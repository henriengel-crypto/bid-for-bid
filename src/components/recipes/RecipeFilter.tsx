"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "../../../site.config";

const DIETARY_OPTIONS = ["vegetar", "vegansk", "glutenfri", "mælkefri", "fisk"];
const SEASON_OPTIONS = [
  { value: "forår", label: "Forår" },
  { value: "sommer", label: "Sommer" },
  { value: "efterår", label: "Efterår" },
  { value: "vinter", label: "Vinter" },
];

export function RecipeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const toggleParam = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key);
      updateParam(key, current === value ? null : value);
    },
    [searchParams, updateParam]
  );

  const active = (key: string, value: string) =>
    searchParams.get(key) === value;

  const hasFilters = ["tag", "dietary", "season", "kidFriendly", "leftoverFriendly"].some(
    (k) => searchParams.has(k)
  );

  return (
    <aside
      className={cn("transition-opacity", isPending && "opacity-60")}
      aria-label="Filtrer opskrifter"
    >
      {/* Kategorier */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-earth-600 mb-3">
          Kategori
        </h3>
        <div className="flex flex-wrap gap-2">
          {siteConfig.categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => toggleParam("tag", cat.slug)}
              className={cn(
                "tag cursor-pointer transition-colors text-xs",
                active("tag", cat.slug)
                  ? "bg-spice text-white"
                  : "hover:bg-cream-300"
              )}
              aria-pressed={active("tag", cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Dietary */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-earth-600 mb-3">
          Kost
        </h3>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => toggleParam("dietary", d)}
              className={cn(
                "tag cursor-pointer capitalize transition-colors text-xs",
                active("dietary", d)
                  ? "bg-sage text-white"
                  : "hover:bg-cream-300"
              )}
              aria-pressed={active("dietary", d)}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Sæson */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-earth-600 mb-3">
          Sæson
        </h3>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => toggleParam("season", s.value)}
              className={cn(
                "tag cursor-pointer transition-colors text-xs",
                active("season", s.value)
                  ? "bg-earth-800 text-white"
                  : "hover:bg-cream-300"
              )}
              aria-pressed={active("season", s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Hurtige filtre */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-earth-600 mb-3">
          Hurtige filtre
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              toggleParam("kidFriendly", "true")
            }
            className={cn(
              "tag cursor-pointer transition-colors text-xs",
              searchParams.get("kidFriendly") === "true"
                ? "bg-sage text-white"
                : "hover:bg-cream-300"
            )}
            aria-pressed={searchParams.get("kidFriendly") === "true"}
          >
            Børnevenlig
          </button>
          <button
            onClick={() =>
              toggleParam("leftoverFriendly", "true")
            }
            className={cn(
              "tag cursor-pointer transition-colors text-xs",
              searchParams.get("leftoverFriendly") === "true"
                ? "bg-sage text-white"
                : "hover:bg-cream-300"
            )}
            aria-pressed={searchParams.get("leftoverFriendly") === "true"}
          >
            God som rest
          </button>
        </div>
      </section>

      {/* Nulstil */}
      {hasFilters && (
        <button
          onClick={() => {
            startTransition(() => {
              router.push(pathname, { scroll: false });
            });
          }}
          className="text-sm text-spice hover:underline"
        >
          Nulstil filtre
        </button>
      )}
    </aside>
  );
}
