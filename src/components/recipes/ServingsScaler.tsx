"use client";

import { useState } from "react";
import { IngredientChecker } from "./IngredientChecker";
import type { Ingredient } from "@/types";

interface ServingsScalerProps {
  ingredients: Ingredient[];
  servingsCount: number;
  servingsDefault: string;
}

export function ServingsScaler({
  ingredients,
  servingsCount,
  servingsDefault,
}: ServingsScalerProps) {
  const [current, setCurrent] = useState(servingsCount);

  const decrement = () => setCurrent((n) => Math.max(1, n - 1));
  const increment = () => setCurrent((n) => Math.min(20, n + 1));

  return (
    <div>
      {/* Skaler-kontrol */}
      <div className="flex items-center gap-3 mb-6 bg-cream-200 rounded-2xl px-4 py-3 w-fit">
        <span className="text-sm text-earth-600">Portioner</span>
        <div className="flex items-center gap-2">
          <button
            onClick={decrement}
            className="w-8 h-8 rounded-full bg-white text-earth-900 font-bold text-lg
                       hover:bg-spice hover:text-white transition-colors
                       flex items-center justify-center shadow-sm"
            aria-label="Færre portioner"
            disabled={current <= 1}
          >
            −
          </button>
          <span className="w-8 text-center font-serif text-xl font-bold text-earth-900">
            {current}
          </span>
          <button
            onClick={increment}
            className="w-8 h-8 rounded-full bg-white text-earth-900 font-bold text-lg
                       hover:bg-spice hover:text-white transition-colors
                       flex items-center justify-center shadow-sm"
            aria-label="Flere portioner"
            disabled={current >= 20}
          >
            +
          </button>
        </div>
        {current !== servingsCount && (
          <span className="text-xs text-earth-500 ml-1">
            (orig. {servingsDefault})
          </span>
        )}
      </div>

      <IngredientChecker
        ingredients={ingredients}
        servingsCount={servingsCount}
        currentServings={current}
      />
    </div>
  );
}
