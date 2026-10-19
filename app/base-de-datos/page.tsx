import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { gbRanges, gbRomset, gbUnits } from "../lib/gameboy";

export const metadata: Metadata = {
  title: "Base de datos",
  description:
    "Base de datos de RETROCUEVA: buscador de placas por número de serie, buscador de juegos por región, unidades verificadas y envío de nuevos seriales.",
  alternates: { canonical: "/base-de-datos" },
  openGraph: {
    title: "Base de datos · RETROCUEVA",
    description:
      "Buscador de placas, buscador de juegos, unidades verificadas y envío de seriales.",
  },
};

const sections = [
  {
    href: "/base-de-datos/placas",
    symbol: "#",
    title: "Buscador de placa",
    description:
      "Introduce el número de serie de una Game Boy DMG y descubre qué revisión de placa lleva según los rangos documentados.",
    color: "#00f0ff",
  },
  {
    href: "/base-de-datos/juegos",
    symbol: "▾",
    title: "Buscador de juego",
    description:
      "Más de mil juegos con el título con el que salieron en USA, Europa y Japón: localiza cualquier edición por su nombre.",
    color: "#9be15d",
  },
  {
    href: "/base-de-datos/unidades",
    symbol: "■",
    title: "Unidades verificadas",
    description:
      "Las unidades de la colección abiertas y verificadas, con la revisión de placa leída directamente del hardware.",
    color: "#9be15d",
  },
  {
    href: "/base-de-datos/enviar-serial",
    symbol: "@",
    title: "Envía tu serial",
    description:
      "¿Tienes una máquina retro? Envía su número de serie y una foto de la placa para verificarla y añadirla a la base de datos.",
    color: "#ffb000",
  },
];

export default function BaseDeDatosPage() {
  const stats = [
    { value: gbRanges.length, label: "Rangos DMG" },
    { value: gbUnits.length, label: "Unidades verificadas" },
    { value: gbRomset.length, label: "Juegos (romset)" },
  ];

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-retro text-lg tracking-widest text-ink/40">
        RETROCUEVA / <span className="text-neon">BASE DE DATOS</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        Base de datos
      </h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-base leading-relaxed text-ink/80">
            Esta sección reúne las bases de datos que voy montando a mano: los
            rangos de números de serie de las revisiones de placa de la Game
            Boy DMG, mis unidades abiertas y verificadas, y el romset completo
            con los títulos de cada mercado.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/80">
            Y crece contigo: si tienes una máquina retro, puedes enviarme su
            número de serie y una foto de la placa para verificarla y sumarla a
            la base de datos.
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
              etiqueta trasera, con el prefijo G, GH o GM en el caso de la
              Game Boy.
            </li>
            <li>
              <span className="text-ink">Revisión de placa</span>: los rangos
              asocian números a una revisión DMG CPU-0X.
            </li>
            <li>
              <span className="text-ink">Unidades propias</span>: si el número
              es el de una mía, se muestra lo observado dentro.
            </li>
            <li>
              <span className="text-ink">Colabora</span>: envía tu serial y
              foto de placa para ampliar la base de datos.
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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="retro-card block p-6"
            style={{ "--accent": section.color } as CSSProperties}
          >
            <p className="font-pixel text-[11px] leading-6 text-ink">
              <span style={{ color: section.color }}>{section.symbol}</span>{" "}
              {section.title}
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink/70">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
