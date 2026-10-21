import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  displayTitle,
  entriesForLetter,
  isRomsetLetter,
  ROMSET_LETTERS,
  type RomsetLetter,
} from "../../../../lib/gameboy-letters";
import { isNoRelease } from "../../../../lib/gameboy-romset";
import { breadcrumbLd, jsonLd } from "../../../../lib/seo";

const LETTER_TITLES: Record<RomsetLetter, string> = {
  "0-9": "números y símbolos",
};

function letterTitle(letter: RomsetLetter): string {
  return LETTER_TITLES[letter] ?? letter.toUpperCase();
}

export function generateStaticParams() {
  return ROMSET_LETTERS.map((letra) => ({ letra }));
}

export async function generateMetadata(
  props: PageProps<"/base-de-datos/juegos/indice/[letra]">,
): Promise<Metadata> {
  const { letra } = await props.params;
  if (!isRomsetLetter(letra)) return { title: "Índice no encontrado" };
  const entries = entriesForLetter(letra);
  return {
    title: `Juegos por letra ${letterTitle(letra)} · Índice Game Boy`,
    description: `Índice alfabético del romset de Game Boy: ${entries.length} juegos cuyo título principal empieza por ${letterTitle(letra)}.`,
    alternates: { canonical: `/base-de-datos/juegos/indice/${letra}` },
  };
}

const breadcrumb = (letter: RomsetLetter) =>
  breadcrumbLd([
    { name: "RETROCUEVA", path: "/" },
    { name: "Base de datos", path: "/base-de-datos" },
    { name: "Buscador de juego", path: "/base-de-datos/juegos" },
    {
      name: `Índice ${letterTitle(letter)}`,
      path: `/base-de-datos/juegos/indice/${letter}`,
    },
  ]);

export default async function LetterIndexPage(
  props: PageProps<"/base-de-datos/juegos/indice/[letra]">,
) {
  const { letra } = await props.params;
  if (!isRomsetLetter(letra)) notFound();
  const entries = entriesForLetter(letra);

  const itemListLd = jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Juegos de Game Boy por letra ${letterTitle(letra)}`,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, 500).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: displayTitle(entry),
      url: `/base-de-datos/juegos/${entry.id}`,
    })),
  });

  return (
    <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: itemListLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumb(letra) }}
      />

      <p className="font-retro text-lg tracking-widest text-ink/60">
        RETROCUEVA /{" "}
        <Link href="/base-de-datos" className="transition-colors hover:text-neon">
          BASE DE DATOS
        </Link>{" "}
        /{" "}
        <Link
          href="/base-de-datos/juegos"
          className="transition-colors hover:text-neon"
        >
          BUSCADOR DE JUEGO
        </Link>{" "}
        / <span className="text-neon">ÍNDICE {letterTitle(letra).toUpperCase()}</span>
      </p>

      <h1 className="mt-8 font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
        Juegos por letra {letterTitle(letra)}
      </h1>
      <p className="mt-3 font-retro text-xl text-ink/70">
        {entries.length} {entries.length === 1 ? "juego" : "juegos"} del romset
        de Game Boy
      </p>

      <nav aria-label="Índice alfabético" className="mt-6 flex flex-wrap gap-2">
        {ROMSET_LETTERS.map((item) => (
          <Link
            key={item}
            href={`/base-de-datos/juegos/indice/${item}`}
            aria-current={item === letra ? "page" : undefined}
            className={
              item === letra
                ? "border-2 border-neon bg-neon/10 px-3 py-1 font-retro text-lg text-neon"
                : "border-2 border-white/15 px-3 py-1 font-retro text-lg text-ink/70 transition-colors hover:border-neon hover:text-neon"
            }
          >
            {item}
          </Link>
        ))}
        <Link
          href="/base-de-datos/juegos"
          className="border-2 border-white/15 px-3 py-1 font-retro text-lg text-ink/70 transition-colors hover:border-neon hover:text-neon"
        >
          Buscar…
        </Link>
      </nav>

      <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => {
          const title = displayTitle(entry);
          const alternatives = [
            { label: "USA", value: entry.ntsc },
            { label: "EUR", value: entry.pal },
            { label: "JAP", value: entry.jp },
          ].filter(
            (region) =>
              !isNoRelease(region.value) && region.value !== title,
          );
          return (
            <li key={entry.id} className="border-b border-white/5 py-2">
              <Link
                href={`/base-de-datos/juegos/${entry.id}`}
                className="font-retro text-lg text-ink underline decoration-white/20 underline-offset-4 transition-colors hover:text-neon hover:decoration-neon"
              >
                {title}
              </Link>{" "}
              <span className="font-retro text-base text-ink/60">
                #{entry.id}
              </span>
              {alternatives.length > 0 && (
                <span className="font-retro text-base text-ink/60">
                  {" "}
                  = {alternatives.map((region) => region.value).join(" / ")}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
