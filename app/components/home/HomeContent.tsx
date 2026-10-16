"use client";

import { useMemo } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { about, articles, developed, samaruc, serials, videos, machines, games } from "../../lib/data";
import {
  ALL,
  decadeOptions,
  filterGames,
  filterMachines,
  genreOptions,
  isSortKey,
  manufacturerOptions,
  platformOptions,
  type SortKey,
} from "../../lib/collection";
import { searchAll } from "../../lib/search";
import { useUrlState } from "../../lib/use-url-state";
import AboutSection from "./AboutSection";
import ArticlesSection from "./ArticlesSection";
import CollectionMenu from "./CollectionMenu";
import CollectionSection from "./CollectionSection";
import DevelopedSection from "./DevelopedSection";
import SamarucSection from "./SamarucSection";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import VideosSection from "./VideosSection";

const DEFAULTS = {
  q: "",
  platform: ALL,
  genre: ALL,
  fab: ALL,
  decada: ALL,
  orden: "id",
};

export default function HomeContent() {
  const { state, setValues, reset } = useUrlState(DEFAULTS);
  const { q: rawQuery, platform, genre, fab, decada } = state;
  const sort: SortKey = isSortKey(state.orden) ? state.orden : "id";

  const query = rawQuery.trim();

  const platforms = useMemo(() => platformOptions(), []);
  const genres = useMemo(() => genreOptions(), []);
  const manufacturers = useMemo(() => manufacturerOptions(), []);
  const decades = useMemo(() => decadeOptions(), []);

  const filteredMachines = useMemo(
    () =>
      filterMachines(machines, {
        platform,
        genre,
        manufacturer: fab,
        decade: decada,
        sort,
      }),
    [platform, genre, fab, decada, sort],
  );

  const filteredGames = useMemo(
    () =>
      filterGames(games, {
        platform,
        genre,
        manufacturer: fab,
        decade: decada,
        sort,
      }),
    [platform, genre, fab, decada, sort],
  );

  const results = useMemo(() => (query ? searchAll(query) : null), [query]);

  const firstYear = useMemo(() => Math.min(...machines.map((m) => m.year)), []);

  const stats = [
    { value: machines.length, label: "Hardware" },
    { value: games.length, label: "Software" },
    { value: genres.length, label: "Géneros" },
    { value: firstYear, label: "Desde el año" },
  ];

  const filtering =
    platform !== ALL ||
    genre !== ALL ||
    fab !== ALL ||
    decada !== ALL ||
    sort !== "id";

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 font-retro text-lg sm:gap-x-7 sm:text-xl">
            <CollectionMenu />
            <a
              href="#quienes-somos"
              className="text-ink/70 transition-colors hover:text-neon"
            >
              Quiénes somos
            </a>
            <a href="#articulos" className="text-ink/70 transition-colors hover:text-neon">
              Artículos
            </a>
            <a href="#videos" className="text-ink/70 transition-colors hover:text-neon">
              Vídeos
            </a>
            <a href="#samaruc" className="text-ink/70 transition-colors hover:text-neon">
              Samaruc
            </a>
            <a href="#desarrollos" className="text-ink/70 transition-colors hover:text-neon">
              Desarrollos
            </a>
            <Link
              href="/placas"
              className="text-ink/70 transition-colors hover:text-neon"
            >
              Serials
            </Link>
          </nav>
        </div>
      </header>

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
          <a
            href="#coleccion"
            className="border-2 border-neon bg-neon/10 px-5 py-2.5 font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
          >
            Ver la colección
          </a>
          <a
            href="#desarrollos"
            className="border-2 border-white/20 px-5 py-2.5 font-retro text-lg text-ink transition-all hover:border-magenta hover:text-magenta"
          >
            Juegos desarrollados
          </a>
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
          <>
            <CollectionSection
              machines={filteredMachines}
              games={filteredGames}
              platforms={platforms}
              genres={genres}
              manufacturers={manufacturers}
              decades={decades}
              platform={platform}
              genre={genre}
              manufacturer={fab}
              decade={decada}
              sort={sort}
              filtering={filtering}
              onPlatform={(value) => setValues({ platform: value })}
              onGenre={(value) => setValues({ genre: value })}
              onManufacturer={(value) => setValues({ fab: value })}
              onDecade={(value) => setValues({ decada: value })}
              onSort={(value) => setValues({ orden: value })}
              onClear={reset}
            />
            <AboutSection data={about} />
            <ArticlesSection data={articles} />
            <VideosSection data={videos} />
            <SamarucSection project={samaruc} />
            <DevelopedSection data={developed} />
          </>
        )}
      </main>

      <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-retro text-lg text-ink/50">
          RETROCUEVA · mi colección · {machines.length} equipos · {games.length}{" "}
          juegos ·{" "}
          <Link href="/placas" className="transition-colors hover:text-neon">
            {serials.length} números de serie
          </Link>
        </p>
      </footer>
    </div>
  );
}
