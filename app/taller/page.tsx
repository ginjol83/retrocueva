import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { taller } from "../lib/data";
import { breadcrumbLd } from "../lib/seo";

export const metadata: Metadata = {
  title: "Taller",
  description:
    "Banco de trabajo, electrónica y restauración de equipos de informática retro.",
  alternates: { canonical: "/taller" },
};

export default function TallerPage() {
  const section = taller[0];

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbLd([
              { name: "RETROCUEVA", path: "/" },
              { name: "Taller", path: "/taller" },
            ]),
          }}
        />
        <p className="font-retro text-lg tracking-widest text-ink/60">
          RETROCUEVA / <span className="text-neon">TALLER</span>
        </p>

        <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
          {section?.title ?? "Taller"}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink/80">
          {section?.description ??
            "Zona de trabajo para reparación, pruebas y restauración de equipos retro."}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {section?.images.map((image) => (
            <figure
              key={image.src}
              className="overflow-hidden border-2 border-white/10 bg-[#0b0e1d]"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {image.caption && (
                <figcaption className="border-t border-white/10 px-4 py-3 font-retro text-base text-ink/60">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/quienes-somos"
            className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
          >
            ← Volver a Quiénes somos
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
