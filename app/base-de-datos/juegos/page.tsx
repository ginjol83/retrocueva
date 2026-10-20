import type { Metadata } from "next";
import Link from "next/link";
import RomsetTable from "../../components/gameboy/RomsetTable";
import { GB_ROMSET_COUNT } from "../../lib/counts";
import { letterCounts, ROMSET_LETTERS } from "../../lib/gameboy-letters";
import { breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Buscador de juego",
  description:
    "Romset de Game Boy: busca un juego por cualquier título y descubre cómo se llamó en USA (NTSC), Europa (PAL) y Japón.",
  alternates: { canonical: "/base-de-datos/juegos" },
  openGraph: {
    title: "Buscador de juego · Base de datos",
    description:
      "Equivalencias de títulos de Game Boy en USA, Europa y Japón.",
  },
};

export default function JuegosPage() {
  const counts = letterCounts();
  const breadcrumb = breadcrumbLd([
    { name: "RETROCUEVA", path: "/" },
    { name: "Base de datos", path: "/base-de-datos" },
    { name: "Buscador de juego", path: "/base-de-datos/juegos" },
  ]);

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumb }}
      />
      <p className="font-retro text-lg tracking-widest text-ink/40">
        RETROCUEVA /{" "}
        <Link href="/base-de-datos" className="transition-colors hover:text-neon">
          BASE DE DATOS
        </Link>{" "}
        / <span className="text-neon">BUSCADOR DE JUEGO</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        Buscador de juego
      </h1>

      <div className="mt-5">
        <p className="max-w-3xl text-base leading-relaxed text-ink/80">
          Un mismo juego salió con nombres distintos según el mercado: Mega Man
          en USA, Rockman en Japón, Tetris 2 en Europa y Tetris Flash en
          Japón. Este buscador recorre {GB_ROMSET_COUNT} juegos del romset de
          Game Boy y localiza cualquier edición por el título que conozcas,
          mostrando cómo se llamó en las tres regiones.
        </p>
      </div>

      <div
        className="mt-8 h-1 w-full"
        style={{
          background: "linear-gradient(to right, #9be15d, transparent)",
        }}
      />

      <section className="mt-8" aria-labelledby="indice-az">
        <h2
          id="indice-az"
          className="font-pixel text-[11px] text-ink/80"
        >
          <span className="text-neon">■</span> Índice alfabético
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink/70">
          ¿Prefieres hojear en vez de buscar? El índice A–Z lista los{" "}
          {GB_ROMSET_COUNT} juegos por su título principal, con los nombres de
          las demás regiones.
        </p>
        <nav aria-label="Índice alfabético del romset" className="mt-4 flex flex-wrap gap-2">
          {ROMSET_LETTERS.map((letter) => (
            <Link
              key={letter}
              href={`/base-de-datos/juegos/indice/${letter}`}
              className="border-2 border-white/15 px-3 py-1 font-retro text-lg text-ink/70 transition-colors hover:border-neon hover:text-neon"
            >
              {letter}
              <span className="ml-1 text-base text-ink/40">
                {counts[letter]}
              </span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="mt-10" aria-labelledby="buscador-romset">
        <h2
          id="buscador-romset"
          className="font-pixel text-[11px] text-ink/80"
        >
          <span className="text-neon">■</span> Buscador
        </h2>
        <div className="mt-4">
          <RomsetTable />
        </div>
      </section>
    </main>
  );
}
