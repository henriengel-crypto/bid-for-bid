import Link from "next/link";
import { siteConfig } from "../../../site.config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-cream-200 bg-cream-100">
      <div className="container-bfb py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif font-bold text-earth-900">{siteConfig.name}</p>
            <p className="text-sm text-earth-600 mt-0.5">{siteConfig.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-earth-600" aria-label="Fodsidenavigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-spice transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-earth-600/60">
          Lavet med fornuft og en god madplan. {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
}
