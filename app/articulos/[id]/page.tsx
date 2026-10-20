import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { accent, articles, entitiesMentionedIn, getArticle } from "../../lib/data";
import { jsonLd } from "../../lib/seo";
import { SITE_URL } from "../../lib/site";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const instant = false;

export function generateStaticParams() {
  return articles
    .filter((article) => article.sections?.length)
    .map((article) => ({ id: String(article.id) }));
}

export async function generateMetadata(
  props: PageProps<"/articulos/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const article = getArticle(Number(id));
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/articulos/${article.id}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `/articulos/${article.id}`,
      images: article.cover ? [{ url: article.cover, alt: article.title }] : undefined,
    },
  };
}

export default async function ArticlePage(props: PageProps<"/articulos/[id]">) {
  const { id } = await props.params;
  const article = getArticle(Number(id));
  if (!article || !article.sections?.length) notFound();

  const color = accent(article.magazine);
  const magazineName = article.magazine.toUpperCase();
  const mentioned = entitiesMentionedIn(article);
  const hasMentioned = mentioned.games.length > 0 || mentioned.machines.length > 0;

  return (
    <div className="min-h-dvh" style={{ "--accent": color } as CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.summary,
            author: article.author ? { "@type": "Person", name: article.author } : undefined,
            publisher: { "@type": "Organization", name: article.magazine },
            datePublished: article.year ? `${article.year}-01-01` : undefined,
            image: article.cover ? `${SITE_URL}${article.cover}` : undefined,
            mainEntityOfPage: `${SITE_URL}/articulos/${article.id}`,
          }),
        }}
      />
      <SiteHeader />

      <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/articulos"
          className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
        >
          ← Volver a artículos
        </Link>
        <p className="mt-4 font-retro text-lg tracking-widest text-ink/40">
          {magazineName} / ARTÍCULOS /{" "}
          <span style={{ color }}>
            {article.magazine} {article.issue ?? ""}
          </span>
        </p>

        <div className="mt-8 flex flex-col gap-6 border-2 border-white/10 bg-[#0b0e1d] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span
              className="inline-block border px-2 py-0.5 font-retro text-base tracking-widest"
              style={{ borderColor: color, color }}
            >
              {article.magazine} {article.issue ?? ""} · {article.year}
            </span>
            <p className="mt-3 font-retro text-xl text-ink/60">
              {article.author ? `Por ${article.author}` : "Publicación en revista"}
            </p>
          </div>
          {article.magazineUrl && (
            <a
              href={article.magazineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 border-2 px-5 py-3 font-retro text-lg transition-colors hover:bg-white/5"
              style={{ borderColor: color, color }}
            >
              {article.magazineLabel ?? "Ver la revista original"}{" "}
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>

        {article.cover && (
          <div className="mt-8 overflow-hidden border-2 border-white/10 bg-black/40">
            <Image
              src={article.cover}
              alt={article.title}
              width={1265}
              height={642}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-10 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
          {article.title}
        </h1>

        {article.lead && (
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            {article.lead}
          </p>
        )}

        <div
          className="mt-6 h-1 w-full"
          style={{
            background: `linear-gradient(to right, ${color}, transparent)`,
          }}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article>
            {article.sections!.map((section, index) => (
              <section key={index} className="mt-8 first:mt-0">
                {section.heading && (
                  <h2 className="font-pixel text-[12px] leading-6 text-ink sm:text-sm">
                    <span style={{ color }}>/</span> {section.heading}
                  </h2>
                )}
                {section.blocks.map((block, blockIndex) => {
                  if (block.kind === "p") {
                    return (
                      <p
                        key={blockIndex}
                        className="mt-5 text-base leading-relaxed text-ink/80"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  if (block.kind === "ul") {
                    return (
                      <ul
                        key={blockIndex}
                        className="mt-5 space-y-2 border-l-2 pl-5 text-base leading-relaxed text-ink/80"
                        style={{ borderColor: color }}
                      >
                        {block.items.map((item) => (
                          <li key={item} className="list-disc">
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <figure key={blockIndex} className="mt-6">
                      <div className="overflow-hidden border-2 border-white/10 bg-black/40">
                        <Image
                          src={block.src}
                          alt={block.alt}
                          width={block.width ?? 1280}
                          height={block.height ?? 720}
                          sizes="(max-width: 1024px) 100vw, 640px"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="mt-2 font-retro text-base text-ink/45">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </section>
            ))}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {article.specs && article.specs.length > 0 && (
              <div className="border-2 border-white/10 bg-[#0b0e1d] p-5">
                <h2 className="font-pixel text-[11px] text-ink/80">
                  <span style={{ color }}>■</span> Ficha
                </h2>
                <dl className="mt-4 grid gap-2 font-retro text-lg">
                  {article.specs.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <dt className="shrink-0 text-ink/45">{row.label}</dt>
                      <dd className="text-right text-ink/90">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {article.scores && article.scores.length > 0 && (
              <div className="mt-6 border-2 border-white/10 bg-[#0b0e1d] p-5">
                <h2 className="font-pixel text-[11px] text-ink/80">
                  <span style={{ color }}>■</span> Notas
                </h2>
                <ul className="mt-4 space-y-3">
                  {article.scores.map((score) => (
                    <li key={score.label}>
                      <div className="flex items-baseline justify-between gap-3 font-retro text-lg">
                        <span className="text-ink/60">{score.label}</span>
                        <span style={{ color }}>{score.value}/10</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-white/10">
                        <div
                          className="h-full"
                          style={{
                            width: `${score.value * 10}%`,
                            background: color,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {(article.credits || article.instagram) && (
          <div className="mt-12 border-2 border-white/10 bg-white/[0.02] p-5">
            {article.credits && (
              <p className="font-retro text-xl text-ink/70">{article.credits}</p>
            )}
            {article.instagram && (
              <p className="mt-1 font-retro text-lg text-ink/45">
                Instagram{" "}
                <a
                  href={`https://instagram.com/${article.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-neon"
                  style={{ color }}
                >
                  {article.instagram}
                </a>
              </p>
            )}
          </div>
        )}

        {hasMentioned && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>#</span> En la colección
            </h2>
            <ul className="mt-4 grid gap-3">
              {mentioned.machines.map((machine) => (
                <li key={`m-${machine.id}`}>
                  <Link
                    href={`/maquinas/${machine.id}`}
                    className="retro-card"
                    style={{ "--accent": accent(machine.name) } as CSSProperties}
                  >
                    <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3">
                      <span className="font-pixel text-[11px] leading-6 text-ink">
                        {machine.name}
                      </span>
                      <span className="font-retro text-base text-ink/50">
                        {machine.manufacturer} · hardware
                      </span>
                      <span className="ml-auto font-retro text-base text-ink/40">
                        {machine.year}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              {mentioned.games.map((game) => (
                <li key={`g-${game.id}`}>
                  <Link
                    href={`/juegos/${game.id}`}
                    className="retro-card"
                    style={{ "--accent": accent(game.platform) } as CSSProperties}
                  >
                    <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3">
                      <span className="font-pixel text-[11px] leading-6 text-ink">
                        {game.title}
                      </span>
                      <span className="font-retro text-base text-ink/50">
                        {game.platform} · software
                      </span>
                      <span className="ml-auto font-retro text-base text-ink/40">
                        {game.year}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
