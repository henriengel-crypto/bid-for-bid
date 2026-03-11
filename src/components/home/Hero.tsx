import Link from "next/link";
import { siteConfig } from "../../../site.config";

export function Hero() {
  return (
    <section className="py-16 md:py-24 border-b border-cream-200">
      <div className="container-bfb">
        <div className="max-w-2xl">
          <h1 className="font-serif text-display-sm md:text-display text-earth-900 mb-4 leading-tight">
            {siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-earth-600 mb-8 leading-snug">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/opskrifter" className="btn-primary text-base px-6 py-3.5">
              Se alle opskrifter
            </Link>
            <Link href="/opskrifter#lav-med-det-du-har" className="btn-secondary text-base px-6 py-3.5">
              Hvad har jeg i køleskabet?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
