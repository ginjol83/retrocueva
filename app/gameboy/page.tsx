import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../components/Logo";
import RomsetTable from "../components/gameboy/RomsetTable";
import SerialLookup from "../components/gameboy/SerialLookup";
import UnitsTable from "../components/gameboy/UnitsTable";
import { gbRanges, gbRomset, gbUnits } from "../lib/gameboy";

export const metadata: Metadata = {
  title: "Game Boy",
  description:
    "Base de datos Game Boy: consulta un número de serie DMG y descubre su revisión de placa, las unidades de la colección y las equivalencias de títulos USA, Europa y Japón.",
  alternates: { canonical: "/gameboy" },
  openGraph: {
    title: "Game Boy · Base de datos",
    description:
      "Consulta números de serie DMG, revisión de placas y equivalencias de títulos por región.",
  },
};

export default function GameBoyPage() {
  const stats = [
    { value: gbRanges.length, label: "Rangos DMG" },
    { value: gbUnits.length, label: "Unidades propias" },
    { value: gbRomset.length, label: "Juegos (romset)" },
  ];

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Logo />
          <Link
            href="/"
            className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-retro text-lg tracking-widest text-ink/40">
          RETROCUEVA / BASE DE DATOS /{" "}
          <span className="text-neon">GAME BOY</span>
        </p>

        <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
          Base de datos Game Boy (DMG)
        </h1>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <p className="text-base leading-relaxed text-ink/80">
              Aquí cruzo dos cosas: los rangos de números de serie de las
              distintas revisiones de placa de la Game Boy DMG y mis propias
              unidades, abiertas y verificadas. Introduce un número de serie en
              el buscador y te digo qué placa lleva según los rangos; si el
              número es el de una de mis unidades, manda lo que yo he visto
              dentro.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              Además está el romset completo: más de mil juegos con el título
              con el que salieron en USA, Europa y Japón, para localizar
              cualquier edición por el nombre de su mercado.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-2 border-white/10 bg-white/[0.02] px-4 py-5"
                >
                  <dd className="font-pixel text-lg text-neon">{stat.value}</dd>
                  <dt className="mt-2 font-retro text-base tracking-widest text-ink/50">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="self-start border-2 border-white/10 bg-[#0b0e1d] p-5">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span className="text-neon">■</span> Cómo funciona
            </h2>
            <ul className="mt-4 space-y-3 font-retro text-base leading-relaxed text-ink/70">
              <li>
                <span className="text-ink">Número de serie</span>: está en la
                etiqueta trasera, con el prefijo G, GH o GM.
              </li>
              <li>
                <span className="text-ink">Revisión de placa</span>: los rangos
                asocian números a una revisión DMG CPU-0X.
              </li>
              <li>
                <span className="text-ink">Unidades propias</span>: si el
                número es el de una mía, se muestra lo observado dentro.
              </li>
              <li>
                <span className="text-ink">Romset</span>: busca por cualquier
                título y ve cómo se llamó en cada región.
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 h-1 w-full"
          style={{
            background: "linear-gradient(to right, #00f0ff, transparent)",
          }}
        />

        <section className="mt-10">
          <h2 className="font-pixel text-[11px] text-ink/80">
            <span className="text-neon">#</span> Consultar número de serie
          </h2>
          <div className="mt-5">
            <SerialLookup />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-pixel text-[11px] text-ink/80">
            <span className="text-neon">■</span> Mis Game Boy (unidades
            verificadas)
          </h2>
          <div className="mt-5">
            <UnitsTable />
          </div>
          <p className="mt-5 border-l-2 border-neon/50 pl-4 font-retro text-base text-ink/50">
            Revisiones leídas directamente de la placa de cada unidad. Pulsa un
            número de serie para compararlo con los rangos.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-pixel text-[11px] text-ink/80">
            <span className="text-neon">▾</span> Equivalencias de títulos
            (romset)
          </h2>
          <div className="mt-5">
            <RomsetTable />
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-retro text-lg text-ink/50">
          RETROCUEVA · base de datos · {gbUnits.length} unidades ·{" "}
          {gbRomset.length} juegos ·{" "}
          <Link href="/" className="transition-colors hover:text-neon">
            mi colección
          </Link>
        </p>
      </footer>
    </div>
  );
}
