"use client";

import { useState } from "react";
import type { Ingredient } from "@/types";
import { scaleAmount, cn } from "@/lib/utils";

interface IngredientCheckerProps {
  ingredients: Ingredient[];
  servingsCount: number;      // original
  currentServings: number;    // skaleret
}

export function IngredientChecker({
  ingredients,
  servingsCount,
  currentServings,
}: IngredientCheckerProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const factor = currentServings / servingsCount;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const allChecked = checked.size === ingredients.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl">Ingredienser</h2>
        {checked.size > 0 && (
          <button
            onClick={() => setChecked(new Set())}
            className="text-xs text-earth-600 hover:text-spice transition-colors"
          >
            Nulstil
          </button>
        )}
      </div>

      <ul className="space-y-2" role="list" aria-label="Ingrediensliste med tjekbokse">
        {ingredients.map((ing, i) => {
          const isChecked = checked.has(i);
          const scaledAmount = scaleAmount(ing.amount, factor);
          return (
            <li key={i}>
              <label
                className={cn(
                  "flex items-start gap-3 cursor-pointer group rounded-xl px-3 py-2.5",
                  "hover:bg-cream-200 transition-colors",
                  isChecked && "opacity-50"
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(i)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-300 accent-spice cursor-pointer"
                  aria-label={`${scaledAmount} ${ing.unit} ${ing.item}`}
                />
                <span className={cn("text-sm leading-snug", isChecked && "line-through")}>
                  <span className="font-medium text-earth-900">
                    {scaledAmount}
                    {ing.unit && ` ${ing.unit}`}
                  </span>{" "}
                  <span className="text-earth-700">{ing.item}</span>
                  {ing.note && (
                    <span className="text-earth-500 text-xs ml-1">({ing.note})</span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {allChecked && ingredients.length > 0 && (
        <p className="mt-4 text-sm text-sage font-medium text-center py-2">
          Alt er klar. God fornojelse.
        </p>
      )}
    </div>
  );
}
