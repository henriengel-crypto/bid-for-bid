import type { Metadata } from "next";
import { getAllGuides } from "@/lib/guides";
import { GuideCard } from "@/components/ai/GuideCard";
import { siteConfig } from "../../../site.config";
import type { GuideSearchItem } from "@/types";

export const metadata: Metadata = {
  title: "AI i hverdagen",
  description: "Konkrete workflows, prompts og guides til at bruge AI i din hverdag.",
};

export default function AIPage() {
  const guides = getAllGuides();
  const guideItems: GuideSearchItem[] = guides.map((g) => ({
    slug: g.slug,
    title: g.title,
    description: g.description,
    category: g.category,
    tags: g.tags ?? [],
  }));

  // Gruppér efter kategori
  const byCategory = siteConfig.aiCategories.map((cat) => ({
    ...cat,
    guides: guideItems.filter((g) => g.category === cat.slug),
  })).filter((c) => c.guides.length > 0);

  const uncategorized = guideItems.filter(
    (g) => !siteConfig.aiCategories.find((c) => c.slug === g.category)
  );

  return (
    <div className="py-10 md:py-14">
      <div className="container-bfb">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <h1 className="font-serif text-display-sm text-earth-900 mb-4">
            AI i hverdagen
          </h1>
          <p className="text-earth-600 leading-relaxed">
            Ikke AI-hype. Konkrete genveje der sparer tid til det der tæller.
            Her finder du workflows, prompts og eksempler til madplan, indkøb og mere.
          </p>
        </div>

        {/* Guides per kategori */}
        {byCategory.map((cat) => (
          <section key={cat.slug} className="mb-14">
            <h2 className="font-serif text-2xl text-earth-900 mb-6">{cat.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.guides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        ))}

        {uncategorized.length > 0 && (
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-earth-900 mb-6">Andre guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {uncategorized.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {guides.length === 0 && (
          <p className="text-earth-500 py-12 text-center">
            Ingen guides endnu. Kom snart.
          </p>
        )}
      </div>
    </div>
  );
}
