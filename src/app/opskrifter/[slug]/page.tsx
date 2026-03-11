import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getRecipeBySlug, getRecipeSlugs } from "@/lib/recipes";
import { ServingsScaler } from "@/components/recipes/ServingsScaler";
import { PrintButton } from "@/components/recipes/PrintButton";
import { formatTime } from "@/lib/utils";
import { siteConfig } from "../../../../site.config";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getRecipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = getRecipeBySlug(params.slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.image ? [recipe.image] : [],
    },
  };
}

export default function RecipePage({ params }: Props) {
  const recipe = getRecipeBySlug(params.slug);
  if (!recipe) notFound();

  const {
    title, description, image, timeTotal, timePrep, timeCook,
    servingsDefault, servingsCount, ingredients, steps,
    tags, dietary, cuisine, season, equipment, tips, variations,
    source, kidFriendly, leftoverFriendly, content,
  } = recipe;

  return (
    <article className="py-10 md:py-14 print:py-4">
      <div className="container-bfb max-w-4xl">
        {/* Billede */}
        {image && (
          <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden mb-10 bg-cream-200">
            <Image
              src={image}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        {/* Titel og meta */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {dietary.map((d) => <span key={d} className="tag-sage text-xs">{d}</span>)}
            {cuisine && <span className="tag text-xs">{cuisine}</span>}
            {kidFriendly && <span className="tag-sage text-xs">Bornevenlig</span>}
            {leftoverFriendly && <span className="tag text-xs">God som rest</span>}
          </div>
          <h1 className="font-serif text-display-sm text-earth-900 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-earth-600 max-w-2xl leading-relaxed">{description}</p>

          {/* Tidsoversigt */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-cream-200">
            <MetaItem label="I alt" value={formatTime(timeTotal)} />
            {timePrep && <MetaItem label="Forberedelse" value={formatTime(timePrep)} />}
            {timeCook && <MetaItem label="Tilberedning" value={formatTime(timeCook)} />}
            <MetaItem label="Portioner" value={servingsDefault} />
            {season?.length > 0 && <MetaItem label="Saeson" value={season.join(", ")} />}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4 no-print">
            {tags.map((tag) => (
              <a
                key={tag}
                href={`/opskrifter?tag=${encodeURIComponent(tag)}`}
                className="tag text-xs hover:bg-cream-300 transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </header>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-14">
          {/* Venstre kolonne: ingredienser */}
          <div>
            <ServingsScaler
              ingredients={ingredients}
              servingsCount={servingsCount ?? siteConfig.defaultServingsCount}
              servingsDefault={servingsDefault ?? siteConfig.defaultServingsLabel}
            />

            {equipment && equipment.length > 0 && (
              <div className="mt-8">
                <h3 className="font-serif text-lg mb-3">Udstyr</h3>
                <ul className="space-y-1.5">
                  {equipment.map((e, i) => (
                    <li key={i} className="text-sm text-earth-600 flex gap-2">
                      <span className="text-spice">—</span> {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Højre kolonne: fremgangsmåde */}
          <div>
            <h2 className="font-serif text-xl mb-6">Fremgangsmate</h2>
            <ol className="space-y-5">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full bg-spice/10 text-spice font-serif
                               font-bold text-sm flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-earth-800 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>

            {/* Tips */}
            {tips && tips.length > 0 && (
              <div className="mt-10 bg-cream-200 rounded-2xl p-5">
                <h3 className="font-serif text-lg mb-3">Tips</h3>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-sm text-earth-700 flex gap-2">
                      <span className="text-sage shrink-0">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variationer */}
            {variations && variations.length > 0 && (
              <div className="mt-6">
                <h3 className="font-serif text-lg mb-3">Variationer</h3>
                <ul className="space-y-2">
                  {variations.map((v, i) => (
                    <li key={i} className="text-sm text-earth-700 flex gap-2">
                      <span className="text-spice shrink-0">→</span> {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* MDX-indhold (ekstra noter, historier) */}
            {content.trim() && (
              <div className="mt-10 prose prose-bfb">
                <MDXRemote source={content} />
              </div>
            )}
          </div>
        </div>

        {/* Kilde + print */}
        <div className="mt-12 pt-8 border-t border-cream-200 flex flex-wrap items-center justify-between gap-4 no-print">
          {source && (
            <p className="text-sm text-earth-500">
              Inspireret af:{" "}
              {source.startsWith("http") ? (
                <a href={source} className="text-spice hover:underline" target="_blank" rel="noopener noreferrer">
                  {source}
                </a>
              ) : (
                <span>{source}</span>
              )}
            </p>
          )}
          <PrintButton />
        </div>
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-earth-500">{label}</dt>
      <dd className="text-sm font-medium text-earth-900 mt-0.5">{value}</dd>
    </div>
  );
}
