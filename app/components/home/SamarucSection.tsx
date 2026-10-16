import type { CSSProperties } from "react";
import { samaruc, type Project } from "../../lib/data";

export default function SamarucSection({ project = samaruc }: { project?: Project }) {
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
