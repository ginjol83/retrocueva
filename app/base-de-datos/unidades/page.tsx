import type { Metadata } from "next";
import Link from "next/link";
import UnitsTable from "../../components/gameboy/UnitsTable";
import { GB_UNITS_COUNT } from "../../lib/counts";
import { breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Unidades verificadas",
  description:
    "Unidades de la colección abiertas y verificadas, con la revisión de placa leída directamente del hardware.",
  alternates: { canonical: "/base-de-datos/unidades" },
  openGraph: {
    title: "Unidades verificadas · Base de datos",
    description:
      "Las unidades de la colección con su revisión de placa verificada.",
  },
};

export default function UnidadesPage() {
  return (
    <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbLd([
            { name: "RETROCUEVA", path: "/" },
            { name: "Base de datos", path: "/base-de-datos" },
            { name: "Unidades verificadas", path: "/base-de-datos/unidades" },
          ]),
        }}
      />
      <p className="font-retro text-lg tracking-widest text-ink/40">
        RETROCUEVA /{" "}
        <Link href="/base-de-datos" className="transition-colors hover:text-neon">
          BASE DE DATOS
        </Link>{" "}
        / <span className="text-neon">UNIDADES VERIFICADAS</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        Unidades verificadas
      </h1>

      <div className="mt-5">
        <p className="max-w-3xl text-base leading-relaxed text-ink/80">
          Estas unidades están en mi casa, abiertas y revisadas: la revisión de
          placa que aparece aquí es la que he leído directamente del hardware,
          no una estimación por número de serie. Por ahora todas son Game Boy
          DMG; a medida que vaya abriendo más máquinas se irán sumando.
        </p>
      </div>

      <div
        className="mt-8 h-1 w-full"
        style={{
          background: "linear-gradient(to right, #9be15d, transparent)",
        }}
      />

      <section className="mt-8">
        <UnitsTable />
        <p className="mt-5 border-l-2 border-neon/50 pl-4 font-retro text-base text-ink/50">
          Pulsa un número de serie para ver su ficha en el{" "}
          <Link
            href="/base-de-datos/placas"
            className="underline transition-colors hover:text-neon"
          >
            buscador de placa
          </Link>
          . {GB_UNITS_COUNT} unidades verificadas y contando.
        </p>
      </section>
    </main>
  );
}
