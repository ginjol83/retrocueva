"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { accent, articles, developed, games, machines, videos } from "../../lib/data";
import { genreOptions } from "../../lib/collection";
import { searchAll } from "../../lib/search";
import { useUrlState } from "../../lib/use-url-state";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { SectionTitle } from "./SectionBits";

const DEFAULTS = { q: "" };

const ACCESS = [
  {
    href: "/coleccion",
    title: "Colección",
    meta: `${machines.length + games.length} registros`,
    description: "Equipos y juegos con filtros por plataforma, género y década.",
  },
  {
    href: "/base-de-datos",
    title: "Base de datos",
    meta: "Game Boy",
    description: "Placas, romset y unidades verificadas de Game Boy.",
  },
  {
    href: "/articulos",
    title: "Artículos",
    meta: `${articles.length} artículos`,
    description: "Publicados en revistas de informática retro.",
  },
  {
    href: "/videos",
    title: "Vídeos",
    meta: `${videos.length} vídeos`,
    description: "Demos y proyectos en vídeo.",
  },
  {
    href: "/samaruc",
    title: "Samaruc",
    meta: "8 plataformas",
    description: "IDE de desarrollo retro de 8 bits hecho a mano.",
  },
  {
    href: "/desarrollos",
    title: "Desarrollos",
    meta: `${developed.length} juegos`,
    description: "Juegos propios para plataformas de 8 bits.",
  },
  {
    href: "/quienes-somos",
    title: "Quiénes somos",
    meta: "RETROCUEVA",
    description: "Quién está detrás de esta colección.",
  },
];

export default function HomeContent() {
  const { state, setValues } = useUrlState(DEFAULTS);
  const { q: rawQuery } = state;
  const query = rawQuery.trim();

  const genres = useMemo(() => genreOptions(), []);
  const results = useMemo(() => (query ? searchAll(query) : null), [query]);
  const firstYear = useMemo(() => Math.min(...machines.map((m) => m.year)), []);

  const stats = [
    { value: machines.length, label: "Hardware" },
    { value: games.length, label: "Software" },
    { value: genres.length, label: "Géneros" },
    { value: firstYear, label: "Desde el año" },
  ];

  return (
    <div className="min-h-dvh">
      <SiteHeader />

      <section id="top" className="mx-auto max-w-6xl px-6 pb-14 pt-16 text-center">
        <p className="mb-6 inline-block border border-neon/40 bg-neon/5 px-3 py-1 font-retro text-base tracking-[0.25em] text-neon">
          PASIÓN POR EL RETRO <span className="blink">▮</span>
        </p>
        <h1 className="neon-title font-pixel text-xl leading-[1.9] text-ink sm:text-2xl md:text-3xl">
          RETRO<span className="text-neon">CUEVA</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Mi colección de informática retro: ordenadores, consolas y juegos que
          he ido reuniendo a lo largo de los años. Todo agrupado en hardware y
          software, con su número de serie, estado y ficha. La expongo en
          internet para quien quiera curiosear.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/coleccion"
            className="border-2 border-neon bg-neon/10 px-5 py-2.5 font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
          >
            Ver la colección
          </Link>
          <Link
            href="/desarrollos"
            className="border-2 border-white/20 px-5 py-2.5 font-retro text-lg text-ink transition-all hover:border-magenta hover:text-magenta"
          >
            Juegos desarrollados
          </Link>
        </div>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-2 border-white/10 bg-white/[0.02] px-4 py-5"
            >
              <dd className="font-pixel text-lg text-neon">{s.value}</dd>
              <dt className="mt-2 font-retro text-base tracking-widest text-ink/50">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      <div className="border-y border-white/10 bg-[#05060f]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end px-6 py-4">
          <SearchInput
            value={rawQuery}
            onChange={(value) => setValues({ q: value })}
          />
        </div>
      </div>

      <main id="contenido" className="mx-auto max-w-6xl px-6">
        {results ? (
          <SearchResults results={results} query={query} />
        ) : (
          <section className="py-14">
            <SectionTitle
              title="Explora RETROCUEVA"
              count={ACCESS.length}
              noun="secciones"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ACCESS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="retro-card group block p-6"
                  style={{ "--accent": accent(item.title) } as CSSProperties}
                >
                  <p className="font-pixel text-[11px] leading-6 text-ink">
                    {item.title}
                  </p>
                  <p className="mt-2 font-retro text-lg text-ink/50">
                    {item.meta}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink/70">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/50 transition-colors group-hover:text-[var(--accent)]">
                    Entrar <span aria-hidden>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
