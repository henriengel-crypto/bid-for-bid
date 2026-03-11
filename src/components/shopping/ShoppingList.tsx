"use client";

import { useState, useEffect, useCallback } from "react";
import type { ShoppingItem, ShoppingGroup } from "@/types";
import { cn } from "@/lib/utils";
import { siteConfig } from "../../../site.config";

const GROUPS = siteConfig.shoppingGroups as unknown as ShoppingGroup[];

interface ShoppingListModalProps {
  initialItems: ShoppingItem[];
  onClose: () => void;
}

export function ShoppingListModal({ initialItems, onClose }: ShoppingListModalProps) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [copied, setCopied] = useState(false);

  // Luk ved Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopy = async () => {
    const text = GROUPS.map((group) => {
      const groupItems = items.filter((i) => i.group === group && !i.bought);
      if (groupItems.length === 0) return null;
      return `## ${group}\n` + groupItems.map((i) =>
        `- ${i.amount ? `${i.amount} ${i.unit} `.trim() : ""}${i.item}`
      ).join("\n");
    })
      .filter(Boolean)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const remaining = items.filter((i) => !i.bought).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-earth-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Indkobsliste"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-200">
          <div>
            <h2 className="font-serif text-xl text-earth-900">Indkobsliste</h2>
            <p className="text-sm text-earth-500 mt-0.5">
              {remaining} varer tilbage
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="btn-secondary text-xs px-3 py-2"
              aria-label="Kopiér indkobsliste"
            >
              {copied ? "Kopieret!" : "Kopiér"}
            </button>
            <button
              onClick={onClose}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Luk indkobsliste"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="overflow-y-auto flex-1 p-4">
          {GROUPS.map((group) => {
            const groupItems = items.filter((i) => i.group === group);
            if (groupItems.length === 0) return null;
            return (
              <section key={group} className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-earth-500 mb-2 px-2">
                  {group}
                </h3>
                <ul className="space-y-1">
                  {groupItems.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 group transition-colors",
                        item.bought ? "opacity-40" : "hover:bg-cream-100"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={item.bought}
                        onChange={() => toggle(item.id)}
                        className="h-4 w-4 rounded accent-spice cursor-pointer shrink-0"
                        aria-label={`Marker ${item.item} som kobt`}
                      />
                      <span className={cn("text-sm flex-1 leading-snug", item.bought && "line-through text-earth-500")}>
                        {item.amount && (
                          <span className="font-medium text-earth-900">
                            {item.amount}{item.unit ? ` ${item.unit}` : ""}{" "}
                          </span>
                        )}
                        {item.item}
                        {item.recipeTitle && (
                          <span className="text-[11px] text-earth-400 ml-1.5">
                            ({item.recipeTitle})
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => remove(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-earth-400 hover:text-spice
                                   transition-all p-1 rounded"
                        aria-label={`Fjern ${item.item}`}
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {items.length === 0 && (
            <p className="text-center text-earth-400 text-sm py-8">
              Listen er tom.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}
