import type { Metadata } from "next";
import Link from "next/link";
import RomsetTable from "../../components/gameboy/RomsetTable";
import { GB_ROMSET_COUNT } from "../../lib/counts";

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
  return (
    <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
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

      <section className="mt-8">
        <RomsetTable />
      </section>
    </main>
  );
}
