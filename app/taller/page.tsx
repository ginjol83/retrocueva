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
    "El taller de La Retro Cueva: reparando y restaurando clásicos de 8 y 16 bits.",
  alternates: { canonical: "/taller" },
};

export default function TallerPage() {
  const section = taller[0];
  const paragraphs = (section?.description ?? "").split("\n\n");

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="mx-auto max-w-4xl px-6 py-12">
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

        <header className="mt-8">
          <h1 className="font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
            {section?.title ?? "Taller"}
          </h1>
          <p className="mt-4 max-w-2xl font-retro text-xl text-ink/70">
            Reparando y restaurando clásicos de 8 y 16 bits
          </p>
        </header>

        <article className="mt-10 space-y-6">
          {paragraphs.map((paragraph, index) => {
            if (paragraph.trim() === "Compramos y aceptamos donaciones") {
              return (
                <h2
                  key={index}
                  className="pt-6 font-pixel text-[11px] tracking-widest text-neon"
                >
                  {paragraph}
                </h2>
              );
            }
            if (paragraph.trim() === "Contacto") {
              return (
                <h2
                  key={index}
                  className="pt-6 font-pixel text-[11px] tracking-widest text-neon"
                >
                  {paragraph}
                </h2>
              );
            }
            if (paragraph.trim().startsWith("Escríbenos")) {
              return (
                <div
                  key={index}
                  className="border-l-2 border-neon/60 bg-neon/5 px-5 py-4"
                >
                  <p className="font-retro text-lg leading-relaxed text-ink">
                    {paragraph}
                  </p>
                </div>
              );
            }
            if (
              paragraph.trim().startsWith("Porque los ordenadores") ||
              paragraph.trim().startsWith("No importa")
            ) {
              return (
                <p
                  key={index}
                  className="text-base leading-relaxed text-ink/80"
                >
                  {paragraph}
                </p>
              );
            }

            // Insert first image after first paragraph
            if (index === 1 && section?.images[0]) {
              return (
                <div key={index} className="space-y-6">
                  <p className="text-base leading-relaxed text-ink/80">
                    {paragraph}
                  </p>
                  <figure className="overflow-hidden border-2 border-white/10 bg-[#0b0e1d] shadow-[8px_8px_0_0_rgba(0,0,0,0.4)]">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={section.images[0].src}
                        alt={section.images[0].alt}
                        fill
                        sizes="(max-width: 896px) 100vw, 896px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    {section.images[0].caption && (
                      <figcaption className="border-t border-white/10 px-4 py-2 text-center font-retro text-base text-ink/60">
                        {section.images[0].caption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              );
            }

            // Insert second image around middle/end
            if (index === 4 && section?.images[1]) {
              return (
                <div key={index} className="space-y-6">
                  <p className="text-base leading-relaxed text-ink/80">
                    {paragraph}
                  </p>
                  <figure className="overflow-hidden border-2 border-white/10 bg-[#0b0e1d] shadow-[8px_8px_0_0_rgba(0,0,0,0.4)]">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={section.images[1].src}
                        alt={section.images[1].alt}
                        fill
                        sizes="(max-width: 896px) 100vw, 896px"
                        className="object-cover"
                      />
                    </div>
                    {section.images[1].caption && (
                      <figcaption className="border-t border-white/10 px-4 py-2 text-center font-retro text-base text-ink/60">
                        {section.images[1].caption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              );
            }

            return (
              <p key={index} className="text-base leading-relaxed text-ink/80">
                {paragraph}
              </p>
            );
          })}
        </article>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <Link
            href="/quienes-somos"
            className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
          >
            ← Volver a Quiénes somos
          </Link>
          <Link
            href="/coleccion"
            className="font-retro text-lg text-neon/80 transition-colors hover:text-neon"
          >
            Ver la colección →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
