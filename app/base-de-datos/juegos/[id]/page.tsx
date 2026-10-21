import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gbRomset, isNoRelease } from "../../../lib/gameboy-romset";
import {
  gbImagesCoverage,
  gbImagesSource,
  imagesFor,
} from "../../../lib/gameboy-images";
import {
  breadcrumbLd,
  gbFichaDescription,
  isThinGbEntry,
  jsonLd,
} from "../../../lib/seo";

export const instant = false;

export function generateStaticParams() {
  return gbRomset.map((entry) => ({ id: String(entry.id) }));
}

function findEntry(id: string) {
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) return undefined;
  return gbRomset.find((entry) => entry.id === numeric);
}

function primaryTitle(ntsc: string, pal: string, jp: string): string {
  for (const title of [ntsc, pal, jp]) {
    if (!isNoRelease(title)) return title;
  }
  return ntsc;
}

export async function generateMetadata(
  props: PageProps<"/base-de-datos/juegos/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const entry = findEntry(id);
  if (!entry) return { title: "Juego no encontrado" };

  const title = primaryTitle(entry.ntsc, entry.pal, entry.jp);
  const cover = imagesFor(entry.id)?.covers?.[0];
  const description = gbFichaDescription(entry);
  const thin = isThinGbEntry(entry);

  return {
    title: `${title} · Ficha Game Boy`,
    description,
    alternates: { canonical: `/base-de-datos/juegos/${entry.id}` },
    ...(thin ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${title} · Ficha Game Boy`,
      description,
      url: `/base-de-datos/juegos/${entry.id}`,
      images: cover ? [{ url: cover.url, alt: `${title} — carátula` }] : undefined,
    },
  };
}

export default async function RomsetGamePage(
  props: PageProps<"/base-de-datos/juegos/[id]">,
) {
  const { id } = await props.params;
  const entry = findEntry(id);
  if (!entry) notFound();

  const images = imagesFor(entry.id);
  const cover = images?.covers?.[0];
  const extraCovers = images?.covers?.slice(1) ?? [];
  const snaps = images?.snaps ?? [];
  const title = primaryTitle(entry.ntsc, entry.pal, entry.jp);

  const regions = [
    { label: "USA (NTSC)", value: entry.ntsc },
    { label: "Europa (PAL)", value: entry.pal },
    { label: "Japón", value: entry.jp },
  ];
  const released = regions.filter((region) => !isNoRelease(region.value)).length;

  const index = gbRomset.findIndex((item) => item.id === entry.id);
  const previous = index > 0 ? gbRomset[index - 1] : undefined;
  const next =
    index < gbRomset.length - 1 ? gbRomset[index + 1] : undefined;

  const facts = [
    { label: "Entrada", value: `#${entry.id}` },
    { label: "Regiones", value: `${released} de 3` },
    { label: "Carátula", value: cover ? "Sí" : "No" },
    { label: "Capturas", value: snaps.length > 0 ? String(snaps.length) : "No" },
  ];

  const videoGameLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: title,
    alternateName: regions
      .filter((region) => !isNoRelease(region.value))
      .map((region) => region.value),
    gamePlatform: "Nintendo Game Boy (DMG)",
    playMode: "SinglePlayer",
    image: cover?.url,
  };

  const breadcrumb = breadcrumbLd([
    { name: "RETROCUEVA", path: "/" },
    { name: "Base de datos", path: "/base-de-datos" },
    { name: "Buscador de juego", path: "/base-de-datos/juegos" },
    { name: title, path: `/base-de-datos/juegos/${entry.id}` },
  ]);

  return (
    <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(videoGameLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumb }}
      />

      <p className="font-retro text-lg tracking-widest text-ink/60">
        RETROCUEVA /{" "}
        <Link
          href="/base-de-datos"
          className="transition-colors hover:text-neon"
        >
          BASE DE DATOS
        </Link>{" "}
        /{" "}
        <Link
          href="/base-de-datos/juegos"
          className="transition-colors hover:text-neon"
        >
          BUSCADOR DE JUEGO
        </Link>{" "}
        / <span className="text-neon">{title.toUpperCase()}</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        {title}
      </h1>
      <p className="mt-3 font-retro text-xl text-ink/60">
        Romset Game Boy · entrada #{entry.id}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div>
          <div className="relative aspect-square w-full overflow-hidden border-2 border-white/10 bg-black/40">
            {cover ? (
              <Image
                src={cover.url}
                alt={`${title} — carátula (${cover.regionLabel})`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 22rem"
                className="object-cover object-center"
              />
            ) : (
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <p className="font-pixel text-6xl text-ink/60">N/A</p>
                  <p className="mt-4 font-retro text-lg text-ink/60">
                    Sin carátula disponible
                  </p>
                </div>
              </div>
            )}
            {cover && (
              <span className="absolute bottom-0 left-0 border-r-2 border-t-2 border-neon bg-black/70 px-3 py-1 font-retro text-base text-neon">
                {cover.regionLabel}
              </span>
            )}
          </div>

          {extraCovers.length > 0 && (
            <>
              <h2 className="mt-5 font-pixel text-[11px] text-ink/80">
                Otras carátulas
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {extraCovers.map((asset) => (
                  <div
                    key={asset.url}
                    title={`${title} — ${asset.regionLabel}`}
                    className="relative aspect-square overflow-hidden border-2 border-white/10 bg-black/40"
                  >
                    <Image
                      src={asset.url}
                      alt={`${title} — carátula (${asset.regionLabel})`}
                      fill
                      sizes="(max-width: 1024px) 33vw, 7rem"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <div className="grid grid-cols-1 gap-px overflow-hidden border-2 border-white/10 bg-white/10 sm:grid-cols-3">
            {regions.map((region) => (
              <div key={region.label} className="bg-[#0b0e1d] p-5">
                <p className="font-retro text-base tracking-widest text-ink/60">
                  {region.label}
                </p>
                <p
                  className={
                    isNoRelease(region.value)
                      ? "mt-1 font-retro text-xl text-ink/60"
                      : "mt-1 font-retro text-xl text-ink"
                  }
                >
                  {isNoRelease(region.value) ? "no salió" : region.value}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-[#0b0e1d] p-4">
                <dt className="font-retro text-base tracking-widest text-ink/60">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-retro text-xl text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div
            className="mt-5 h-1 w-full"
            style={{
              background: "linear-gradient(to right, #00f0ff, transparent)",
            }}
          />

          <p className="mt-5 text-base leading-relaxed text-ink/75">
            {(() => {
              const releasedNames = regions
                .filter((region) => !isNoRelease(region.value))
                .map((region) => region.label);
              const skippedNames = regions
                .filter((region) => isNoRelease(region.value))
                .map((region) => region.label);
              return skippedNames.length === 0
                ? "Equivalencias de título por región según el romset de Game Boy: el mismo juego cambió de nombre entre mercados."
                : `Salió en ${releasedNames.join(" y ")}; no se publicó en ${skippedNames.join(" ni ")}.`;
            })()}
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-pixel text-[11px] text-ink/80">
          <span className="text-neon">■</span> Capturas de pantalla
        </h2>
        {snaps.length > 0 ? (
          <>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {snaps.map((snap) => (
                <figure
                  key={snap.url}
                  className="border-2 border-white/10 bg-black/60"
                >
                  <div className="relative aspect-[10/9] w-full">
                    <Image
                      src={snap.url}
                      alt={`${title} — captura (${snap.regionLabel})`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover [image-rendering:pixelated]"
                    />
                  </div>
                  <figcaption className="border-t border-white/10 px-3 py-2 font-retro text-base text-ink/60">
                    {snap.regionLabel}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 font-retro text-base text-ink/60">
              Captura del juego en ejecución a resolución nativa de Game Boy
              (160×144).
            </p>
          </>
        ) : (
          <p className="mt-4 border-2 border-dashed border-white/15 px-6 py-10 text-center font-retro text-xl text-ink/60">
            No hay capturas disponibles para este título.
          </p>
        )}
      </section>

      <p className="mt-6 border-l-2 border-neon/50 pl-4 font-retro text-base leading-relaxed text-ink/60">
        Imágenes de {gbImagesCoverage.withCover} carátulas y{" "}
        {gbImagesCoverage.withSnaps} capturas procedentes del proyecto{" "}
        <a
          href="https://github.com/libretro/libretro-thumbnails"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-neon"
        >
          libretro-thumbnails
        </a>{" "}
        (imágenes de sus respectivos autores). Fuente: {gbImagesSource}.
      </p>

      <nav
        aria-label="Navegación entre fichas"
        className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"
      >
        <Link
          href="/base-de-datos/juegos"
          className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
        >
          ← Volver al buscador
        </Link>
        <div className="flex flex-wrap gap-4">
          {previous && (
            <Link
              href={`/base-de-datos/juegos/${previous.id}`}
              className="font-retro text-lg text-ink/60 transition-colors hover:text-neon"
            >
              ‹ #{previous.id}{" "}
              {primaryTitle(previous.ntsc, previous.pal, previous.jp)}
            </Link>
          )}
          {next && (
            <Link
              href={`/base-de-datos/juegos/${next.id}`}
              className="font-retro text-lg text-ink/60 transition-colors hover:text-neon"
            >
              #{next.id} {primaryTitle(next.ntsc, next.pal, next.jp)} ›
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
