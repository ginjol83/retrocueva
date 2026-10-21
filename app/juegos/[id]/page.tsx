import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  accent,
  articlesMentioning,
  games,
  gamesOnPlatform,
  getGame,
  machinesForPlatform,
  normalize,
} from "../../lib/data";
import { isNoRelease, romsetEntryFor } from "../../lib/gameboy-romset";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const instant = false;

export function generateStaticParams() {
  return games.map((game) => ({ id: String(game.id) }));
}

export async function generateMetadata(
  props: PageProps<"/juegos/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const game = getGame(Number(id));
  if (!game) return { title: "Juego no encontrado" };
  return {
    title: game.title,
    description: game.description,
    alternates: { canonical: `/juegos/${game.id}` },
    openGraph: {
      title: game.title,
      description: game.description,
      url: `/juegos/${game.id}`,
      images: game.image ? [{ url: game.image, alt: game.title }] : undefined,
    },
  };
}

export default async function GamePage(props: PageProps<"/juegos/[id]">) {
  const { id } = await props.params;
  const game = getGame(Number(id));
  if (!game) notFound();

  const color = accent(game.platform);
  const siblings = gamesOnPlatform(game.platform, game.id);
  const machinesForGame = machinesForPlatform(game.platform);
  const mentions = articlesMentioning(game.title);
  const romEntry =
    normalize(game.platform) === "game boy"
      ? romsetEntryFor(game.title)
      : undefined;

  const specs = [
    { label: "Plataforma", value: game.platform },
    { label: "Año", value: String(game.year) },
    { label: "Género", value: game.genre },
    ...(game.publisher ? [{ label: "Editora", value: game.publisher }] : []),
    ...(game.region ? [{ label: "Región", value: game.region }] : []),
  ];

  const unit = [
    { label: "Código", value: game.code ?? "—" },
    { label: "Estado", value: game.condition ?? "—" },
    { label: "Adquirido", value: game.acquired ? String(game.acquired) : "—" },
    { label: "Ubicación", value: game.location ?? "—" },
  ];

  return (
    <div
      className="min-h-dvh"
      style={{ "--accent": color } as CSSProperties}
    >
      <SiteHeader />

      <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/juegos"
          className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
        >
          ← Volver al software
        </Link>
        <p className="mt-4 font-retro text-lg tracking-widest text-ink/60">
          COLECCIÓN / SOFTWARE /{" "}
          <span style={{ color }}>{game.title.toUpperCase()}</span>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-white/10 bg-black/40">
            {game.image ? (
              <Image
                src={game.image}
                alt={game.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            ) : (
              <div
                className="grid h-full place-items-center font-pixel text-6xl"
                style={{ color }}
              >
                {game.title.slice(0, 3).toUpperCase()}
              </div>
            )}
            <span
              className="absolute left-0 top-0 border-b-2 border-r-2 px-3 py-1 font-retro text-lg"
              style={{ borderColor: color, color }}
            >
              {game.year}
            </span>
          </div>

          <div>
            <h1 className="font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
              {game.title}
            </h1>
            <p className="mt-3 font-retro text-xl text-ink/60">
              {game.platform} · {game.genre}
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink/75">
              {game.description}
            </p>

            <div
              className="mt-6 h-1 w-full"
              style={{
                background: `linear-gradient(to right, ${color}, transparent)`,
              }}
            />

            <h2 className="mt-6 font-pixel text-[11px] text-ink/80">
              Especificaciones
            </h2>
            <dl className="mt-3 grid gap-1.5 font-retro text-lg">
              {specs.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-ink/60">{row.label}</dt>
                  <dd className="text-right text-ink/90">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="font-pixel text-[11px] text-ink/80">
            <span style={{ color }}>■</span> Ficha de la unidad
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden border-2 border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {unit.map((u) => (
              <div key={u.label} className="bg-[#0b0e1d] p-5">
                <p className="font-retro text-base tracking-widest text-ink/60">
                  {u.label}
                </p>
                <p className="mt-1 font-retro text-xl text-ink">{u.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-2 border-white/10 bg-white/[0.02] p-5">
            <p className="font-retro text-base tracking-widest text-ink/60">
              Notas
            </p>
            <p className="mt-1 text-base leading-relaxed text-ink/80">
              {game.notes ?? "Sin notas por ahora."}
            </p>
          </div>
        </section>

        {romEntry && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>▾</span> Títulos por región
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden border-2 border-white/10 bg-white/10 sm:grid-cols-3">
              {[
                { label: "USA (NTSC)", value: romEntry.ntsc },
                { label: "Europa (PAL)", value: romEntry.pal },
                { label: "Japón", value: romEntry.jp },
              ].map((row) => (
                <div key={row.label} className="bg-[#0b0e1d] p-5">
                  <p className="font-retro text-base tracking-widest text-ink/60">
                    {row.label}
                  </p>
                  <p
                    className={
                      isNoRelease(row.value)
                        ? "mt-1 font-retro text-xl text-ink/60"
                        : "mt-1 font-retro text-xl text-ink"
                    }
                  >
                    {isNoRelease(row.value) ? "no salió" : row.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 font-retro text-base text-ink/60">
              Títulos del romset de Game Boy ·{" "}
              <Link
                href="/base-de-datos/juegos"
                className="transition-colors hover:text-neon"
              >
                buscador de juego
              </Link>
              {romEntry && (
                <>
                  {" · "}
                  <Link
                    href={`/base-de-datos/juegos/${romEntry.id}`}
                    className="transition-colors hover:text-neon"
                  >
                    ficha #{romEntry.id} con carátula y capturas
                  </Link>
                </>
              )}
            </p>
          </section>
        )}

        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>/</span> Otros juegos de {game.platform}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {siblings.map((sibling) => (
                <li key={sibling.id}>
                  <Link
                    href={`/juegos/${sibling.id}`}
                    className="block border-2 border-white/10 bg-[#0b0e1d] p-5 transition-colors hover:border-[var(--accent)]"
                  >
                    <p className="font-pixel text-[11px] leading-6 text-ink">
                      {sibling.title}
                    </p>
                    <p className="mt-2 font-retro text-lg text-ink/60">
                      {sibling.genre} · {sibling.year}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {sibling.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {machinesForGame.length > 0 && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>#</span> Equipos compatibles
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {machinesForGame.map((machine) => (
                <li key={machine.id}>
                  <Link
                    href={`/maquinas/${machine.id}`}
                    className="block border-2 border-white/10 bg-[#0b0e1d] p-5 transition-colors hover:border-[var(--accent)]"
                  >
                    <p className="font-pixel text-[11px] leading-6 text-ink">
                      {machine.name}
                    </p>
                    <p className="mt-2 font-retro text-lg text-ink/60">
                      {machine.manufacturer} · {machine.year}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {mentions.length > 0 && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>@</span> Aparece en
            </h2>
            <ul className="mt-4 grid gap-3">
              {mentions.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/articulos/${article.id}`}
                    className="retro-card"
                    style={{ "--accent": accent(article.magazine) } as CSSProperties}
                  >
                    <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3">
                      <span className="font-pixel text-[11px] leading-6 text-ink">
                        {article.title}
                      </span>
                      <span className="font-retro text-base text-ink/60">
                        {article.magazine} {article.issue ?? ""}
                      </span>
                      <span className="ml-auto font-retro text-base text-ink/60">
                        {article.year}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
