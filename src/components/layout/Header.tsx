"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "../../../site.config";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200">
      <div className="container-bfb">
        <div className="flex h-16 items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            className="flex flex-col leading-none group"
            aria-label="Bid for bid – gå til forsiden"
          >
            <span className="font-serif text-xl font-bold text-earth-900 group-hover:text-spice transition-colors">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primær navigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-spice/10 text-spice-dark"
                    : "text-earth-700 hover:bg-cream-200 hover:text-earth-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Søg + mobil-menu */}
          <div className="flex items-center gap-2">
            <Link
              href="/opskrifter?focus=search"
              className="btn-ghost p-2.5 rounded-xl"
              aria-label="Søg"
            >
              <SearchIcon />
            </Link>

            {/* Mobil toggle */}
            <button
              className="md:hidden btn-ghost p-2.5 rounded-xl"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Luk menu" : "Åbn menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil navigation */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-cream-200 bg-cream-100 animate-fade-in"
          aria-label="Mobil navigation"
        >
          <div className="container-bfb py-3 flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-spice/10 text-spice-dark"
                    : "text-earth-700 hover:bg-cream-200"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
