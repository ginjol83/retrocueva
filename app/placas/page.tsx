import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../components/Logo";
import SerialsTable from "../components/SerialsTable";
import { serials } from "../lib/data";

export const metadata: Metadata = {
  title: "Números de serie",
  description:
    "Base de datos de números de serie recogidos de varios equipos para validar cómo se generan: segmentos separados, patrón inferido, fuente de lectura y notas.",
  alternates: { canonical: "/placas" },
  openGraph: {
    title: "Números de serie",
    description:
      "Base de datos de números de serie recogidos para validar cómo se generan.",
  },
};

export default function PlacasPage() {
  const read = serials.filter((row) => row.serial.trim());
  const equipment = new Set(serials.map((row) => row.machine));
  const patterns = new Set(
    serials.map((row) => row.pattern ?? "").filter(Boolean),
  );

  const stats = [
    { value: serials.length, label: "Registros" },
    { value: read.length, label: "Nº leídos" },
    { value: equipment.size, label: "Equipos" },
    { value: patterns.size, label: "Patrones" },
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
          <span className="text-neon">NÚMEROS DE SERIE</span>
        </p>

        <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
          ¿Cómo se generan los números de serie?
        </h1>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <p className="text-base leading-relaxed text-ink/80">
              Esto no forma parte de la colección: es una base de datos que he
              ido montando a mano con números de serie de varios equipos para
              descubrir cómo los fabricaban. La idea es juntar suficientes
              ejemplos y comprobar si siguen una plantilla común o cada marca
              hacía lo que quería.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              Cada fila trae el número completo, sus segmentos ya separados
              (modelo, lote, año, país…) y el patrón que parecen seguir. Son
              hipótesis de lectura: según recoja más equipos iré ajustando el
              patrón y descartando lo que no encaje.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              <span className="text-neon">■</span> Cómo leer la tabla
            </h2>
            <ul className="mt-4 space-y-3 font-retro text-base leading-relaxed text-ink/70">
              <li>
                <span className="text-ink">Nº de serie</span>: tal y como
                aparece en la etiqueta.
              </li>
              <li>
                <span className="text-ink">Segmentos</span>: el número ya
                troceado por su posible significado.
              </li>
              <li>
                <span className="text-ink">Patrón</span>: la plantilla que le
                voy asignando.
              </li>
              <li>
                <span className="text-ink">Fuente</span>: dónde lo he leído
                (etiqueta, placa, BIOS…).
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

        <section className="mt-8">
          <SerialsTable serials={serials} />

          <p className="mt-5 border-l-2 border-neon/50 pl-4 font-retro text-base text-ink/50">
            Los segmentos y patrones marcados son hipótesis de lectura, no
            confirmaciones de fábrica: se validarán con más equipos.
          </p>
        </section>
      </main>

      <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-retro text-lg text-ink/50">
          RETROCUEVA · base de datos · {serials.length} registros ·{" "}
          <Link href="/" className="transition-colors hover:text-neon">
            mi colección
          </Link>
        </p>
      </footer>
    </div>
  );
}
