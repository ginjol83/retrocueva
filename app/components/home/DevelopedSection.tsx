import type { CSSProperties } from "react";
import Image from "next/image";
import { accent, developed, type DevelopedGame } from "../../lib/data";
import { EmptyState, SectionTitle } from "./SectionBits";

export default function DevelopedSection({
  data = developed,
}: {
  data?: DevelopedGame[];
}) {
  return (
    <section className="border-t border-white/10 py-14">
      <SectionTitle title="Juegos desarrollados" as="h1" count={data.length} />
      {data.length === 0 ? (
        <EmptyState message="Todavía no hay desarrollos publicados." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
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
      {item.image ? (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="screen h-24 px-5">
          <span className="badge">{item.platform}</span>
          {item.year && (
            <span className="font-retro text-3xl" style={{ color: "var(--accent)" }}>
              {item.year}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="badge">{item.platform}</span>
          {item.year && (
            <span className="font-retro text-xl" style={{ color: "var(--accent)" }}>
              {item.year}
            </span>
          )}
        </div>
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {item.title}
        </h3>
        <p className="mt-2 font-retro text-lg text-ink/60">
          {item.language} · {item.tools}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {item.description}
        </p>
        {item.link && (
          <a
            href={item.link}
            target={item.link.startsWith("http") ? "_blank" : "_self"}
            rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/60 transition-colors hover:text-[var(--accent)]"
          >
            {item.link.endsWith(".xex") || item.link.includes("/roms/") ? "Descargar" : "Jugar online"} <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </article>
  );
}
