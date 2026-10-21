import type { CSSProperties } from "react";
import Link from "next/link";
import { accent, articles, type Article } from "../../lib/data";
import { SectionTitle } from "./SectionBits";

export default function ArticlesSection({
  data = articles,
}: {
  data?: Article[];
}) {
  return (
    <section className="border-t border-white/10 py-14">
      <SectionTitle
        as="h1"
        title="Artículos en revistas"
        count={data.length}
        noun={data.length === 1 ? "artículo" : "artículos"}
      />
      {data.length === 0 ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/60">
          Aún no hay artículos publicados. Esta sección está lista para cuando
          lleguen los números.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const hasContent = Boolean(article.sections?.length);
  const href = hasContent ? `/articulos/${article.id}` : article.link;

  const body = (
    <>
      <div className="screen h-24 px-5">
        <span className="badge">{article.magazine}</span>
        <span className="font-retro text-3xl" style={{ color: "var(--accent)" }}>
          {article.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {article.title}
        </h3>
        {article.issue && (
          <p className="mt-2 font-retro text-lg text-ink/60">{article.issue}</p>
        )}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {article.summary}
        </p>
        {href && (
          <span className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/60 transition-colors group-hover:text-[var(--accent)]">
            Leer artículo <span aria-hidden>→</span>
          </span>
        )}
      </div>
    </>
  );

  const style = { "--accent": accent(article.magazine) } as CSSProperties;

  return href ? (
    <Link
      href={href}
      {...(hasContent ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="retro-card group"
      style={style}
    >
      {body}
    </Link>
  ) : (
    <article className="retro-card" style={style}>
      {body}
    </article>
  );
}
