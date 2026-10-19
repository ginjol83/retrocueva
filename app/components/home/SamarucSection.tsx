import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { samaruc, type Project, type ProjectBlock } from "../../lib/data";

const ACCENT = "#39ff14";

function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={index} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={index}
            className="mx-0.5 border border-white/15 bg-white/[0.05] px-1.5 py-0.5 font-retro text-[0.85em] text-neon"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return <span key={index}>{part}</span>;
    });
}

function Block({ block }: { block: ProjectBlock }) {
  if (block.kind === "p") {
    return (
      <p className="mt-5 text-base leading-relaxed text-ink/80">
        {inline(block.text)}
      </p>
    );
  }
  if (block.kind === "ul") {
    return (
      <ul className="mt-5 space-y-3">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-base leading-relaxed text-ink/80"
          >
            <span style={{ color: ACCENT }}>▸</span>
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === "quote") {
    return (
      <blockquote className="mt-5 border-l-2 border-neon/50 pl-4 text-base italic leading-relaxed text-ink/70">
        {inline(block.text)}
      </blockquote>
    );
  }
  return (
    <div className="mt-5 overflow-x-auto border-2 border-white/10">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] font-retro text-base tracking-widest text-ink/40">
            {block.headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-normal">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr
              key={row.join("|")}
              className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 font-retro text-lg text-ink/90"
                >
                  {inline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SamarucSection({ project = samaruc }: { project?: Project }) {
  return (
    <section id="samaruc" className="scroll-mt-24 border-t border-white/10 py-14">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-pixel text-sm text-ink sm:text-base">
          <span className="text-neon">/</span> Samaruc
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-neon/50 to-transparent" />
        <span className="font-retro text-lg text-ink/40">
          {project.platforms.length} plataformas
        </span>
      </div>

      <div className="retro-card" style={{ "--accent": ACCENT } as CSSProperties}>
        <div className="screen h-28 px-6">
          <div className="flex items-center gap-4">
            {project.logo && (
              <Image
                src={project.logo}
                alt={`Logo de ${project.name}`}
                width={1024}
                height={1024}
                className="h-16 w-16 border border-white/20 object-cover sm:h-20 sm:w-20"
              />
            )}
            <span className="font-pixel text-xl sm:text-2xl" style={{ color: "var(--accent)" }}>
              {project.name.toUpperCase()}
            </span>
          </div>
          <span className="badge">{project.version}</span>
        </div>

        <article className="p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="max-w-3xl font-pixel text-base leading-8 text-ink sm:text-lg md:text-xl">
              {project.title}
            </h3>
            {project.link && (
              <a
                href={project.link}
                className="border-2 border-neon bg-neon/10 px-5 py-2.5 font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
              >
                Descargar Samaruc
              </a>
            )}
          </div>

          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            {inline(project.lead)}
          </p>

          <div
            className="mt-6 h-1 w-full"
            style={{
              background: `linear-gradient(to right, ${ACCENT}, transparent)`,
            }}
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="border border-white/15 px-2.5 py-1 font-retro text-base text-ink/70"
              >
                {item}
              </span>
            ))}
          </div>

          {project.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h4 className="font-pixel text-[12px] leading-6 text-ink sm:text-sm">
                <span style={{ color: ACCENT }}>/</span> {section.heading}
              </h4>
              {section.blocks.map((block, blockIndex) => (
                <Block key={blockIndex} block={block} />
              ))}
            </section>
          ))}

          {project.screenshots && project.screenshots.length > 0 && (
            <section className="mt-8">
              <h4 className="font-pixel text-[12px] leading-6 text-ink sm:text-sm">
                <span style={{ color: ACCENT }}>/</span> Capturas de pantalla
              </h4>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.screenshots.map((shot) => (
                  <figure
                    key={shot.src}
                    className="border-2 border-white/10 bg-black/40"
                  >
                    {shot.width && shot.height ? (
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="h-auto w-full"
                      />
                    ) : (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    {shot.caption && (
                      <figcaption className="border-t border-white/10 px-3 py-2 font-retro text-base text-ink/50">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <p className="mt-8 font-retro text-base text-ink/40">
            {project.author} · {project.year} · {project.license}
          </p>
        </article>
      </div>
    </section>
  );
}
