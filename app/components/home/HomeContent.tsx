"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import {
  about,
  articles,
  developed,
  games,
  machinePlatforms,
  machines,
  normalize,
  samaruc,
  serials,
  videos,
} from "../../lib/data";
import { searchAll } from "../../lib/search";
import AboutSection from "./AboutSection";
import ArticlesSection from "./ArticlesSection";
import CollectionMenu from "./CollectionMenu";
import CollectionSection from "./CollectionSection";
import DevelopedSection from "./DevelopedSection";
import SamarucSection from "./SamarucSection";
import SearchResults from "./SearchResults";
import VideosSection from "./VideosSection";

export default function HomeContent() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [genre, setGenre] = useState("all");

  const q = query.trim();

  const platforms = useMemo(
    () =>
      Array.from(
        new Set([
          ...machines.flatMap((machine) => machinePlatforms(machine)),
          ...games.map((game) => game.platform),
        ]),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [],
  );

  const genres = useMemo(
    () =>
      Array.from(new Set(games.map((game) => game.genre))).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [],
  );

  const filteredMachines = useMemo(
    () =>
      machines.filter(
        (machine) =>
          platform === "all" ||
          machinePlatforms(machine).some(
            (item) => normalize(item) === normalize(platform),
          ),
      ),
    [platform],
  );

  const filteredGames = useMemo(
    () =>
      games.filter(
        (game) =>
          (platform === "all" ||
            normalize(game.platform) === normalize(platform)) &&
          (genre === "all" || game.genre === genre),
      ),
    [platform, genre],
  );

  const results = useMemo(() => (q ? searchAll(q) : null), [q]);

  const firstYear = useMemo(() => Math.min(...machines.map((m) => m.year)), []);

  const stats = [
    { value: machines.length, label: "Hardware" },
    { value: games.length, label: "Software" },
    { value: genres.length, label: "Géneros" },
    { value: firstYear, label: "Desde el año" },
  ];

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
          <label className="relative block w-full md:w-96">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-retro text-lg text-ink/40">
              &gt;
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar en la colección…"
              className="w-full border-2 border-white/15 bg-black/40 py-2 pl-8 pr-4 font-retro text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-neon"
            />
          </label>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6">
        {results ? (
          <SearchResults results={results} query={q} />
        ) : (
          <>
            <CollectionSection
              machines={filteredMachines}
              games={filteredGames}
              platforms={platforms}
              genres={genres}
              platform={platform}
              genre={genre}
              onPlatform={setPlatform}
              onGenre={setGenre}
              onClear={() => {
                setPlatform("all");
                setGenre("all");
              }}
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
