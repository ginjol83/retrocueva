import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  machines,
  gamesForMachine,
  getMachine,
  accent,
  articlesMentioning,
  code,
  serialsForMachine,
} from "../../lib/data";
import Logo from "../../components/Logo";

export const instant = false;

export function generateStaticParams() {
  return machines.map((machine) => ({ id: String(machine.id) }));
}

export async function generateMetadata(
  props: PageProps<"/maquinas/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const machine = getMachine(Number(id));
  if (!machine) return { title: "Equipo no encontrado" };
  return {
    title: machine.name,
    description: machine.description,
    alternates: { canonical: `/maquinas/${machine.id}` },
    openGraph: {
      title: machine.name,
      description: machine.description,
      url: `/maquinas/${machine.id}`,
      images: machine.image
        ? [{ url: machine.image, alt: machine.name }]
        : undefined,
    },
  };
}

export default async function MachinePage(props: PageProps<"/maquinas/[id]">) {
  const { id } = await props.params;
  const machine = getMachine(Number(id));
  if (!machine) notFound();

  const color = accent(machine.name);
  const related = gamesForMachine(machine);
  const relatedSerials = serialsForMachine(machine);
  const mentions = articlesMentioning(machine.name);

  const specs = [
    { label: "Fabricante", value: machine.manufacturer },
    { label: "Año", value: String(machine.year) },
    { label: "CPU", value: machine.cpu },
    { label: "RAM", value: machine.ram },
    { label: "Almacenamiento", value: machine.storage },
  ];

  const unit = [
    { label: "Nº de serie", value: machine.serial },
    { label: "Estado", value: machine.condition },
    { label: "Adquirido", value: String(machine.acquired) },
    { label: "Ubicación", value: machine.location },
  ];

  return (
    <div
      className="min-h-dvh"
      style={{ "--accent": color } as CSSProperties}
    >
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Link
            href="/#hardware"
            className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
          >
            ← Volver al hardware
          </Link>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-retro text-lg tracking-widest text-ink/40">
          COLECCIÓN / <span style={{ color }}>{machine.name.toUpperCase()}</span>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-white/10 bg-black/40">
            {machine.image ? (
              <Image
                src={machine.image}
                alt={machine.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
              />
            ) : (
              <div
                className="grid h-full place-items-center font-pixel text-6xl"
                style={{ color }}
              >
                {code(machine.name)}
              </div>
            )}
            <span
              className="absolute left-0 top-0 border-b-2 border-r-2 px-3 py-1 font-retro text-lg"
              style={{ borderColor: color, color }}
            >
              {machine.year}
            </span>
          </div>

          <div>
            <h1 className="font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
              {machine.name}
            </h1>
            <p className="mt-3 font-retro text-xl text-ink/50">
              {machine.manufacturer} · {machine.year}
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink/75">
              {machine.description}
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
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4">
                  <dt className="text-ink/45">{s.label}</dt>
                  <dd className="text-right text-ink/90">{s.value}</dd>
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
                <p className="font-retro text-base tracking-widest text-ink/40">
                  {u.label}
                </p>
                <p className="mt-1 font-retro text-xl text-ink">{u.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-2 border-white/10 bg-white/[0.02] p-5">
            <p className="font-retro text-base tracking-widest text-ink/40">
              Notas
            </p>
            <p className="mt-1 text-base leading-relaxed text-ink/80">
              {machine.notes}
            </p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>/</span> Juegos para esta plataforma
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.map((game) => (
                <li
                  key={game.id}
                  className="border-2 border-white/10 bg-[#0b0e1d] p-5 transition-colors hover:border-[var(--accent)]"
                >
                  <p className="font-pixel text-[11px] leading-6 text-ink">
                    {game.title}
                  </p>
                  <p className="mt-2 font-retro text-lg text-ink/50">
                    {game.genre} · {game.year}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {game.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedSerials.length > 0 && (
          <section className="mt-12">
            <h2 className="font-pixel text-[11px] text-ink/80">
              <span style={{ color }}>#</span> Números de serie de esta unidad
            </h2>
            <ul className="mt-4 grid gap-3">
              {relatedSerials.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/placas?equipo=${encodeURIComponent(row.machine)}`}
                    className="retro-card"
                    style={{ "--accent": color } as CSSProperties}
                  >
                    <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3">
                      <span className="font-retro text-lg text-neon">
                        {row.serial || "pendiente"}
                      </span>
                      <span className="font-retro text-base text-ink/50">
                        {row.pattern || "sin patrón"}
                      </span>
                      <span className="ml-auto font-retro text-base text-ink/40">
                        {row.source || "—"}
                      </span>
                    </div>
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
                      <span className="font-retro text-base text-ink/50">
                        {article.magazine} {article.issue ?? ""}
                      </span>
                      <span className="ml-auto font-retro text-base text-ink/40">
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

      <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-retro text-lg text-ink/50">
          RETROCUEVA · unidad · {machine.name}
        </p>
      </footer>
    </div>
  );
}
