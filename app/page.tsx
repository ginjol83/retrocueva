"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./components/Logo";
import {
  machines,
  games,
  articles,
  samaruc,
  developed,
  about,
  serials,
  videos,
  accent,
  code,
  type Machine,
  type Game,
  type Article,
  type Project,
  type DevelopedGame,
  type About,
  type Video,
} from "./lib/data";

export default function Home() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filteredMachines = useMemo(
    () =>
      machines.filter(
        (m) =>
          !q ||
          [m.name, m.manufacturer, m.cpu, m.storage, String(m.year)].some((f) =>
            f.toLowerCase().includes(q),
          ),
      ),
    [q],
  );

  const filteredGames = useMemo(
    () =>
      games.filter(
        (g) =>
          !q ||
          [g.title, g.platform, g.genre, String(g.year)].some((f) =>
            f.toLowerCase().includes(q),
          ),
      ),
    [q],
  );

  const genres = useMemo(
    () => Array.from(new Set(games.map((g) => g.genre))),
    [],
  );
  const firstYear = useMemo(() => Math.min(...machines.map((m) => m.year)), []);

  const stats = [
    { value: machines.length, label: "Hardware" },
    { value: games.length, label: "Software" },
    { value: genres.length, label: "Géneros" },
    { value: firstYear, label: "Desde el año" },
  ];

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 font-retro text-lg sm:gap-x-7 sm:text-xl">
            <CollectionMenu />
            <a
              href="#quienes-somos"
              className="text-ink/70 transition-colors hover:text-neon"
            >
              Quiénes somos
            </a>
            <a href="#articulos" className="text-ink/70 transition-colors hover:text-neon">
              Artículos
            </a>
            <a href="#videos" className="text-ink/70 transition-colors hover:text-neon">
              Vídeos
            </a>
            <a href="#samaruc" className="text-ink/70 transition-colors hover:text-neon">
              Samaruc
            </a>
            <a href="#desarrollos" className="text-ink/70 transition-colors hover:text-neon">
              Desarrollos
            </a>
            <Link
              href="/placas"
              className="text-ink/70 transition-colors hover:text-neon"
            >
              Serials
            </Link>
          </nav>
        </div>
      </header>

      <section id="top" className="mx-auto max-w-6xl px-6 pb-14 pt-16 text-center">
        <p className="mb-6 inline-block border border-neon/40 bg-neon/5 px-3 py-1 font-retro text-base tracking-[0.25em] text-neon">
          PASIÓN POR EL RETRO <span className="blink">▮</span>
        </p>
        <h1 className="neon-title font-pixel text-xl leading-[1.9] text-ink sm:text-2xl md:text-3xl">
          RETRO<span className="text-neon">CUEVA</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Mi colección de informática retro: ordenadores, consolas y juegos que
          he ido reuniendo a lo largo de los años. Todo agrupado en hardware y
          software, con su número de serie, estado y ficha. La expongo en
          internet para quien quiera curiosear.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#coleccion"
            className="border-2 border-neon bg-neon/10 px-5 py-2.5 font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
          >
            Ver la colección
          </a>
          <a
            href="#desarrollos"
            className="border-2 border-white/20 px-5 py-2.5 font-retro text-lg text-ink transition-all hover:border-magenta hover:text-magenta"
          >
            Juegos desarrollados
          </a>
        </div>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-2 border-white/10 bg-white/[0.02] px-4 py-5"
            >
              <dd className="font-pixel text-lg text-neon">{s.value}</dd>
              <dt className="mt-2 font-retro text-base tracking-widest text-ink/50">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      <div className="border-y border-white/10 bg-[#05060f]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end px-6 py-4">
          <label className="relative block w-full md:w-96">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-retro text-lg text-ink/40">
              &gt;
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en la colección…"
              className="w-full border-2 border-white/15 bg-black/40 py-2 pl-8 pr-4 font-retro text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-neon"
            />
          </label>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6">
        <section id="coleccion" className="scroll-mt-24 py-14">
          <SectionTitle
            title="Colección"
            count={filteredMachines.length + filteredGames.length}
          />

          <div id="hardware" className="scroll-mt-24">
            <SubsectionTitle
              title="Hardware"
              count={filteredMachines.length}
              items="equipos"
            />
            {filteredMachines.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMachines.map((machine) => (
                  <MachineCard key={machine.id} machine={machine} />
                ))}
              </div>
            )}
          </div>

          <div id="software" className="mt-14 scroll-mt-24">
            <SubsectionTitle
              title="Software"
              count={filteredGames.length}
              items="juegos"
            />
            {filteredGames.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </section>

        <AboutSection about={about} />
        <ArticlesSection articles={articles} />
        <VideosSection videos={videos} />
        <SamarucSection project={samaruc} />
        <DevelopedSection developed={developed} />
      </main>

      <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-retro text-lg text-ink/50">
          RETROCUEVA · mi colección · {machines.length} equipos · {games.length}{" "}
          juegos ·{" "}
          <Link href="/placas" className="transition-colors hover:text-neon">
            {serials.length} números de serie
          </Link>
        </p>
      </footer>
    </div>
  );
}

function CollectionMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const items = [
    { label: "Todo", href: "#coleccion", count: machines.length + games.length },
    { label: "Hardware", href: "#hardware", count: machines.length },
    { label: "Software", href: "#software", count: games.length },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-ink/70 transition-colors hover:text-neon"
      >
        Colección
        <span
          aria-hidden
          className={"text-xs transition-transform " + (open ? "rotate-180" : "")}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-56 border-2 border-white/15 bg-[#0b0e1d] shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]">
          {items.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                "flex items-center justify-between px-4 py-3 text-ink/75 transition-colors hover:bg-neon/10 hover:text-neon " +
                (index > 0 ? "border-t border-white/10" : "")
              }
            >
              <span>{item.label}</span>
              <span className="text-ink/40">{item.count}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MachineCard({ machine }: { machine: Machine }) {
  return (
    <Link
      href={`/maquinas/${machine.id}`}
      className="retro-card group"
      style={{ "--accent": accent(machine.name) } as CSSProperties}
    >
      <div className="screen h-28 px-5">
        {machine.image && (
          <>
            <Image
              src={machine.image}
              alt={machine.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-[#05060f]/85 via-[#05060f]/30 to-transparent" />
          </>
        )}
        <div className="relative z-10 flex w-full items-center justify-between">
          {!machine.image && (
            <span
              className="font-pixel text-2xl"
              style={{ color: "var(--accent)" }}
            >
              {code(machine.name)}
            </span>
          )}
          <span className="badge ml-auto">{machine.year}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {machine.name}
        </h3>
        <p className="mt-2 font-retro text-lg text-ink/50">
          {machine.manufacturer}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {machine.description}
        </p>
        <dl className="mt-4 grid gap-1.5 border-t border-white/10 pt-4 font-retro text-base">
          <SpecRow label="CPU" value={machine.cpu} />
          <SpecRow label="RAM" value={machine.ram} />
          <SpecRow label="Storage" value={machine.storage} />
        </dl>
        <span className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/50 transition-colors group-hover:text-[var(--accent)]">
          Ver ficha completa <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/juegos/${game.id}`}
      className="retro-card group"
      style={{ "--accent": accent(game.platform) } as CSSProperties}
    >
      <div className="screen h-32 px-5">
        {game.image && (
          <>
            <Image
              src={game.image}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-[#05060f]/85 via-[#05060f]/35 to-transparent" />
          </>
        )}
        <span className="badge relative z-10">{game.genre}</span>
        <span
          className="relative z-10 font-retro text-3xl"
          style={{ color: "var(--accent)" }}
        >
          {game.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {game.title}
        </h3>
        <p className="mt-2 font-retro text-lg text-ink/50">
          {game.platform}
          {game.publisher ? ` · ${game.publisher}` : ""}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {game.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/50 transition-colors group-hover:text-[var(--accent)]">
          Ver ficha del juego <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

function AboutSection({ about }: { about: About }) {
  return (
    <section
      id="quienes-somos"
      className="scroll-mt-24 border-t border-white/10 py-14"
    >
      <SectionTitle title="Quiénes somos" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Image
            src="/logo/logo.png"
            alt="RETROCUEVA"
            width={202}
            height={173}
            className="mb-6 h-28 w-auto drop-shadow-[0_0_24px_rgba(0,240,255,0.25)] sm:h-36"
          />
          {about.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mb-4 text-base leading-relaxed text-ink/75"
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-6 grid gap-px overflow-hidden border-2 border-white/10 bg-white/10 sm:grid-cols-2">
            {about.highlights.map((highlight) => (
              <div key={highlight.label} className="bg-[#0b0e1d] p-4">
                <p className="font-retro text-base tracking-widest text-ink/40">
                  {highlight.label}
                </p>
                <p className="mt-1 font-retro text-lg text-ink">
                  {highlight.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 self-start">
          {about.members.map((member) => (
            <div
              key={member.name}
              className="retro-card"
              style={{ "--accent": "#00f0ff" } as CSSProperties}
            >
              <div className="screen h-24 px-5">
                <span className="badge">{member.role}</span>
              </div>
              <div className="p-5">
                <h3 className="font-pixel text-[12px] leading-6 text-ink">
                  {member.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideosSection({ videos }: { videos: Video[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="videos" className="scroll-mt-24 border-t border-white/10 py-14">
      <SectionTitle
        title="Vídeos"
        count={videos.length}
        noun={videos.length === 1 ? "vídeo" : "vídeos"}
      />
      {videos.length === 0 ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
          Próximamente: vídeos de la colección y de mis proyectos.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.id}
              className="retro-card"
              style={{ "--accent": "#ff4747" } as CSSProperties}
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-white/15 bg-black">
                {playing === video.id ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPlaying(video.id)}
                      aria-label={`Reproducir ${video.title}`}
                      className="absolute inset-0 grid place-items-center bg-black/40 transition-colors hover:bg-black/25"
                    >
                      <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-neon bg-black/70 font-pixel text-lg text-neon">
                        ▶
                      </span>
                    </button>
                  </>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-pixel text-[12px] leading-6 text-ink">
                  {video.title}
                </h3>
                <p className="mt-2 font-retro text-lg text-ink/50">
                  {video.channel ?? "YouTube"}
                  {video.duration ? ` · ${video.duration}` : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section id="articulos" className="scroll-mt-24 border-t border-white/10 py-14">
      <SectionTitle
        title="Artículos en revistas"
        count={articles.length}
        noun={articles.length === 1 ? "artículo" : "artículos"}
      />
      {articles.length === 0 ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
          Aún no hay artículos publicados. Esta sección está lista para cuando
          lleguen los números.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const hasContent = Boolean(article.sections?.length);
  const href = hasContent ? `/articulos/${article.id}` : article.link;

  const body = (
    <>
      <div className="screen h-24 px-5">
        <span className="badge">{article.magazine}</span>
        <span className="font-retro text-3xl" style={{ color: "var(--accent)" }}>
          {article.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {article.title}
        </h3>
        {article.issue && (
          <p className="mt-2 font-retro text-lg text-ink/50">{article.issue}</p>
        )}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {article.summary}
        </p>
        {href && (
          <span className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/50 transition-colors group-hover:text-[var(--accent)]">
            Leer artículo <span aria-hidden>→</span>
          </span>
        )}
      </div>
    </>
  );

  const style = { "--accent": accent(article.magazine) } as CSSProperties;

  return href ? (
    <Link
      href={href}
      {...(hasContent ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="retro-card group"
      style={style}
    >
      {body}
    </Link>
  ) : (
    <article className="retro-card" style={style}>
      {body}
    </article>
  );
}

function SamarucSection({ project }: { project: Project }) {
  return (
    <section id="samaruc" className="scroll-mt-24 border-t border-white/10 py-14">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-pixel text-sm text-ink sm:text-base">
          <span className="text-neon">/</span> Samaruc
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-neon/50 to-transparent" />
        <span className="font-retro text-lg text-ink/40">
          {project.platforms.join(" · ")}
        </span>
      </div>

      <div className="retro-card" style={{ "--accent": "#39ff14" } as CSSProperties}>
        <div className="screen h-28 px-6">
          <span className="font-pixel text-xl sm:text-2xl" style={{ color: "var(--accent)" }}>
            SAMARUC
          </span>
          <span className="badge">{project.version}</span>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-2">
          <div>
            <h3 className="font-retro text-2xl text-ink">{project.tagline}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="border border-white/15 px-2.5 py-1 font-retro text-base text-ink/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-pixel text-[11px] text-ink/80">
              Características
            </h4>
            <ul className="mt-4 space-y-3">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm leading-relaxed text-ink/75"
                >
                  <span style={{ color: "var(--accent)" }}>▸</span> {feature}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-retro text-base text-ink/40">
              {project.author} · {project.year} · {project.license}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DevelopedSection({ developed }: { developed: DevelopedGame[] }) {
  return (
    <section
      id="desarrollos"
      className="scroll-mt-24 border-t border-white/10 py-14"
    >
      <SectionTitle title="Juegos desarrollados" count={developed.length} />
      {developed.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developed.map((item) => (
            <DevelopedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function DevelopedCard({ item }: { item: DevelopedGame }) {
  return (
    <article
      className="retro-card"
      style={{ "--accent": accent(item.platform) } as CSSProperties}
    >
      <div className="screen h-24 px-5">
        <span className="badge">{item.platform}</span>
        {item.year && (
          <span className="font-retro text-3xl" style={{ color: "var(--accent)" }}>
            {item.year}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {item.title}
        </h3>
        <p className="mt-2 font-retro text-lg text-ink/50">
          {item.language} · {item.tools}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function SectionTitle({
  title,
  count,
  noun = "registros",
}: {
  title: string;
  count?: number;
  noun?: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="font-pixel text-sm text-ink sm:text-base">
        <span className="text-neon">/</span> {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-neon/50 to-transparent" />
      {count !== undefined && (
        <span className="font-retro text-lg text-ink/40">
          {count} {noun}
        </span>
      )}
    </div>
  );
}

function SubsectionTitle({
  title,
  count,
  items,
}: {
  title: string;
  count: number;
  items: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h3 className="font-pixel text-[11px] text-ink/85">
        <span className="text-neon">■</span> {title}
      </h3>
      <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
      <span className="font-retro text-base text-ink/40">
        {count} {items}
      </span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink/45">{label}</dt>
      <dd className="text-right text-ink/90">{value}</dd>
    </div>
  );
}

function EmptyState() {
  return (
    <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
      Sin resultados. Prueba con otra búsqueda.
    </p>
  );
}
