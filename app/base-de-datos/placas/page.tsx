import type { Metadata } from "next";
import Link from "next/link";
import SerialLookup from "../../components/gameboy/SerialLookup";
import { breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Buscador de placa",
  description:
    "Consulta el número de serie de una Game Boy DMG y descubre qué revisión de placa lleva según los rangos documentados y las unidades verificadas.",
  alternates: { canonical: "/base-de-datos/placas" },
  openGraph: {
    title: "Buscador de placa · Base de datos",
    description:
      "Número de serie de Game Boy DMG → revisión de placa (DMG CPU-0X).",
  },
};

export default function PlacasPage() {
  return (
    <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbLd([
            { name: "RETROCUEVA", path: "/" },
            { name: "Base de datos", path: "/base-de-datos" },
            { name: "Buscador de placa", path: "/base-de-datos/placas" },
          ]),
        }}
      />
      <p className="font-retro text-lg tracking-widest text-ink/60">
        RETROCUEVA /{" "}
        <Link href="/base-de-datos" className="transition-colors hover:text-neon">
          BASE DE DATOS
        </Link>{" "}
        / <span className="text-neon">BUSCADOR DE PLACA</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        Buscador de placa
      </h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-base leading-relaxed text-ink/80">
            Los rangos de números de serie permiten saber qué revisión de
            placa lleva una Game Boy DMG sin abrirla: introduce el número de
            la etiqueta trasera y el buscador te dice si cae en los rangos
            documentados (DMG CPU-01 a CPU-08), con su CPU, memorias, placas
            de pantalla, alimentación y jack.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/80">
            Si el número es el de una de mis unidades verificadas, manda lo
            observado dentro de la vitrina: los rangos quedan como referencia
            comunitaria.
          </p>
        </div>

        <div className="self-start border-2 border-white/10 bg-[#0b0e1d] p-5">
          <h2 className="font-pixel text-[11px] text-ink/80">
            <span className="text-neon">■</span> Cómo leer el resultado
          </h2>
          <ul className="mt-4 space-y-3 font-retro text-base leading-relaxed text-ink/70">
            <li>
              <span className="text-ink">Tu unidad</span>: revisión leída
              directamente del hardware (verificada).
            </li>
            <li>
              <span className="text-ink">Rango de fábrica</span>: a qué revisión
              asocia el número según los rangos.
            </li>
            <li>
              <span className="text-ink">Formato</span>: G, GH o GM seguido de
              7 u 8 dígitos, sin espacios.
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
        <SerialLookup />
        <p className="mt-5 border-l-2 border-neon/50 pl-4 font-retro text-base text-ink/60">
          ¿No es una Game Boy?{" "}
          <Link
            href="/base-de-datos/enviar-serial"
            className="underline transition-colors hover:text-neon"
          >
            Envía tu serial
          </Link>{" "}
          con una foto de la placa y ayúdame a ampliar la base de datos con
          otras máquinas.
        </p>
      </section>
    </main>
  );
}
