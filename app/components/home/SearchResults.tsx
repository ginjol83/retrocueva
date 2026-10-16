import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { accent } from "../../lib/data";
import type { SearchResults } from "../../lib/search";
import { EmptyState, SectionTitle, SubsectionTitle } from "./SectionBits";

interface ResultRow {
  title: string;
  subtitle: string;
  meta?: string;
  accentColor: string;
  href?: string;
  external?: boolean;
}

function ResultRow({ title, subtitle, meta, accentColor, href, external }: ResultRow) {
  const style = { "--accent": accentColor } as CSSProperties;
  const body = (
    <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3">
      <span className="font-pixel text-[11px] leading-6 text-ink">{title}</span>
      <span className="font-retro text-base text-ink/50">{subtitle}</span>
      {meta && (
        <span className="ml-auto font-retro text-base text-ink/40">{meta}</span>
      )}
    </div>
  );

  return href ? (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

function Group({
  title,
  count,
  items,
}: {
  title: string;
  count: number;
  items: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div>
      <SubsectionTitle title={title} count={count} items={title.toLowerCase()} />
      <div className="grid gap-3">{items}</div>
    </div>
  );
}

export default function SearchResults({
  results,
  query,
}: {
  results: SearchResults;
  query: string;
}) {
  return (
    <section className="py-14">
      <SectionTitle
        title={`Resultados para «${query}»`}
        count={results.total}
        noun={results.total === 1 ? "resultado" : "resultados"}
      />

      {results.total === 0 ? (
        <EmptyState message="Nada coincide con esa búsqueda. Prueba con otro término." />
      ) : (
        <div className="grid gap-10">
          <Group
            title="Hardware"
            count={results.machines.length}
            items={results.machines.map((machine) => (
              <ResultRow
                key={`m-${machine.id}`}
                href={`/maquinas/${machine.id}`}
                accentColor={accent(machine.name)}
                title={machine.name}
                subtitle={`${machine.manufacturer} · ${machine.cpu}`}
                meta={String(machine.year)}
              />
            ))}
          />

          <Group
            title="Software"
            count={results.games.length}
            items={results.games.map((game) => (
              <ResultRow
                key={`g-${game.id}`}
                href={`/juegos/${game.id}`}
                accentColor={accent(game.platform)}
                title={game.title}
                subtitle={`${game.platform} · ${game.genre}`}
                meta={String(game.year)}
              />
            ))}
          />

          <Group
            title="Artículos"
            count={results.articles.length}
            items={results.articles.map((article) => {
              const internal = Boolean(article.sections?.length);
              return (
                <ResultRow
                  key={`a-${article.id}`}
                  href={internal ? `/articulos/${article.id}` : article.link}
                  external={!internal}
                  accentColor={accent(article.magazine)}
                  title={article.title}
                  subtitle={`${article.magazine} ${article.issue ?? ""}`.trim()}
                  meta={String(article.year)}
                />
              );
            })}
          />

          <Group
            title="Juegos desarrollados"
            count={results.developed.length}
            items={results.developed.map((item) => (
              <ResultRow
                key={`d-${item.id}`}
                href={item.link}
                external={Boolean(item.link)}
                accentColor={accent(item.platform)}
                title={item.title}
                subtitle={`${item.platform} · ${item.language}`}
                meta={item.year ? String(item.year) : undefined}
              />
            ))}
          />

          <Group
            title="Números de serie"
            count={results.serials.length}
            items={results.serials.map((row) => (
              <ResultRow
                key={`s-${row.id}`}
                href="/placas"
                accentColor="#00f0ff"
                title={row.serial || "Pendiente de leer"}
                subtitle={row.machine}
                meta={row.pattern || undefined}
              />
            ))}
          />
        </div>
      )}
    </section>
  );
}
