import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, jsonLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Envía tu serial",
  description:
    "Envía el número de serie y una foto de la placa de tu máquina retro para verificarla y añadirla a la base de datos.",
  alternates: { canonical: "/base-de-datos/enviar-serial" },
  openGraph: {
    title: "Envía tu serial · Base de datos",
    description:
      "Colabora con la base de datos: envía tu número de serie y una foto de la placa.",
  },
};

const steps = [
  {
    label: "Etiqueta trasera",
    value: "Foto del número de serie completo y legible, tal y como está en la etiqueta.",
  },
  {
    label: "Placa",
    value: "Foto de la placa principal con visible el código de revisión (p. ej. DMG CPU-07).",
  },
  {
    label: "Máquina",
    value: "Modelo y región si los conoces (por ejemplo: Game Boy DMG, versión europea).",
  },
  {
    label: "Origen",
    value: "Dónde la compraste o su historia, si quieres contarla (opcional).",
  },
];

export default function EnviarSerialPage() {
  const howToLd = jsonLd({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo verificar la revisión de placa de una Game Boy DMG",
    description:
      "Qué datos enviar para verificar el número de serie de una Game Boy DMG y averiguar su revisión de placa.",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.label,
      text: step.value,
    })),
  });

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbLd([
            { name: "RETROCUEVA", path: "/" },
            { name: "Base de datos", path: "/base-de-datos" },
            { name: "Envía tu serial", path: "/base-de-datos/enviar-serial" },
          ]),
        }}
      />
      <p className="font-retro text-lg tracking-widest text-ink/40">
        RETROCUEVA /{" "}
        <Link href="/base-de-datos" className="transition-colors hover:text-neon">
          BASE DE DATOS
        </Link>{" "}
        / <span className="text-neon">ENVÍA TU SERIAL</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        Envía tu serial
      </h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-base leading-relaxed text-ink/80">
            Esta base de datos crece con ayuda de la comunidad. Si tienes una
            máquina retro —una Game Boy, un ordenador, una consola— puedes
            enviarme su número de serie junto a una foto de la placa: verifico
            qué revisión lleva y la añado a la base de datos con tu crédito.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/80">
            No hace falta que sea Game Boy: cuanto más diversa sea la colección
            de máquinas documentadas, mejor se podrán cruzar los datos para
            averiguar cómo generaban sus números de serie los fabricantes.
          </p>

          <h2 className="mt-8 font-pixel text-[11px] text-ink/80">
            <span className="text-neon">■</span> Qué necesito de ti
          </h2>
          <dl className="mt-4 grid gap-3">
            {steps.map((step) => (
              <div
                key={step.label}
                className="border-2 border-white/10 bg-white/[0.02] px-4 py-3"
              >
                <dt className="font-retro text-base tracking-widest text-ink/45">
                  {step.label}
                </dt>
                <dd className="mt-1 text-base leading-relaxed text-ink/80">
                  {step.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 border-l-2 border-neon/50 pl-4 font-retro text-base leading-relaxed text-ink/60">
            Las fotos no se publican con metadatos de ubicación y puedes
            recortar lo que no interese: lo importante es el número de serie y
            el código de revisión de la placa.
          </p>
        </div>

        <div className="self-start border-2 border-neon/40 bg-neon/5 p-5">
          <h2 className="font-pixel text-[11px] text-ink/80">
            <span className="text-neon">@</span> Cómo enviarlo
          </h2>
          <p className="mt-4 font-retro text-base leading-relaxed text-ink/70">
            Escríbeme por Instagram con las fotos y los datos de la máquina:
          </p>
          <a
            href="https://instagram.com/tecnicgimenezing"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block border-2 border-neon bg-neon/10 px-5 py-2.5 text-center font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
          >
            @tecnicgimenezing
          </a>
          <p className="mt-4 font-retro text-base leading-relaxed text-ink/50">
            Agradezco cada unidad: con cada placa la base de datos se parece
            más a cómo salieron de fábrica.
          </p>
        </div>
      </div>
    </main>
  );
}
