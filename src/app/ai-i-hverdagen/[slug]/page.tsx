import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getGuideBySlug, getGuideSlugs } from "@/lib/guides";
import { PromptBlock } from "@/components/ai/PromptBlock";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const {
    title, description, category, tags, problem, solution,
    workflow, prompts, example, content,
  } = guide;

  return (
    <article className="py-10 md:py-14">
      <div className="container-bfb max-w-3xl">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag-spice text-xs">{category}</span>
            {tags.map((t) => <span key={t} className="tag text-xs">{t}</span>)}
          </div>
          <h1 className="font-serif text-display-sm text-earth-900 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-earth-600 leading-relaxed">{description}</p>
        </header>

        {/* Problem / Losning */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-cream-200 rounded-2xl p-5">
            <h2 className="font-serif text-lg mb-2 text-earth-900">Problemet</h2>
            <p className="text-sm text-earth-700 leading-relaxed">{problem}</p>
          </div>
          <div className="bg-sage/10 rounded-2xl p-5">
            <h2 className="font-serif text-lg mb-2 text-earth-900">Losningen</h2>
            <p className="text-sm text-earth-700 leading-relaxed">{solution}</p>
          </div>
        </div>

        {/* Workflow */}
        {workflow.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-5">Trin for trin</h2>
            <ol className="space-y-4">
              {workflow.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full bg-spice text-white font-serif
                               font-bold text-sm flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-earth-800 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Prompts */}
        {prompts.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-2">Prompts du kan bruge</h2>
            <p className="text-sm text-earth-600 mb-4">
              Kopiér direkte ind i ChatGPT, Claude eller dit foretrukne AI-vaerktoj.
            </p>
            {prompts.map((p, i) => (
              <PromptBlock key={i} label={p.label} text={p.text} />
            ))}
          </section>
        )}

        {/* Eksempel */}
        {example && (
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-5">Eksempel</h2>
            <div className="rounded-2xl overflow-hidden ring-1 ring-earth-900/5">
              <div className="bg-cream-200 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-earth-500 mb-2">Input</p>
                <p className="text-sm text-earth-800 whitespace-pre-wrap leading-relaxed">
                  {example.input}
                </p>
              </div>
              <div className="bg-sage/5 px-5 py-4 border-t border-cream-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark mb-2">Output</p>
                <p className="text-sm text-earth-800 whitespace-pre-wrap leading-relaxed">
                  {example.output}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* MDX-indhold */}
        {content.trim() && (
          <div className="prose prose-bfb mt-10">
            <MDXRemote source={content} />
          </div>
        )}

        {/* Tilbage */}
        <div className="mt-12 pt-8 border-t border-cream-200">
          <a href="/ai-i-hverdagen" className="text-sm text-spice hover:underline">
            Tilbage til alle guides
          </a>
        </div>
      </div>
    </article>
  );
}
