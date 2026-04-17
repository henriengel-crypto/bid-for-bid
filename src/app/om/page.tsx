import type { Metadata } from "next";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Om",
  description: "Om Bid for bid – hvad er det, hvem er det til og hvorfor.",
};

export default function OmPage() {
  return (
    <div className="py-10 md:py-14">
      <div className="container-bfb max-w-2xl">
        <h1 className="font-serif text-display-sm text-earth-900 mb-8">Om {siteConfig.name}</h1>

        <div className="prose prose-bfb space-y-6">
          <p className="text-lg text-earth-600 leading-relaxed">
            {siteConfig.name} er et personligt opskriftsarkiv og AI-notesbog.
            Ikke en madblog. Ikke en platform. Bare et sted at samle det der virker.
          </p>

          <section>
            <h2 className="font-serif text-xl text-earth-900 mb-3">Hvad er det?</h2>
            <p className="text-earth-700 leading-relaxed">
              En samling opskrifter tilpasset en travl hverdag med børn – plus konkrete
              tips til at bruge AI til madplan, indkøb og rester. Alt er testet i et
              rigtigt køkken med rigtige børn og urealistiske ambitioner.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-earth-900 mb-3">Filosofien</h2>
            <p className="text-earth-700 leading-relaxed">
              God mad behøver ikke være kompliceret. De bedste hverdagsretter er dem
              der kan laves med det man har, der giver rester til næste dag, og som
              børn rent faktisk spiser. Det er dem du finder her.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-earth-900 mb-3">AI i hverdagen</h2>
            <p className="text-earth-700 leading-relaxed">
              AI-sektionen er ikke for dem der vil automatisere alt. Den er for dem
              der vil bruge 15 minutter på madplan i stedet for 45 – og stadig have
              lyst til at lave maden. Konkrete prompts, eksempler der virker,
              ingen techsnak.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-cream-200">
          <p className="text-sm text-earth-500">
            {siteConfig.name} – {siteConfig.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
