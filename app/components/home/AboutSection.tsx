import type { CSSProperties } from "react";
import Image from "next/image";
import { about, type About } from "../../lib/data";
import { SectionTitle } from "./SectionBits";

export default function AboutSection({ data = about }: { data?: About }) {
  return (
    <section className="border-t border-white/10 py-14">
      <SectionTitle title="Quiénes somos" as="h1" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Image
            src="/logo/logo.png"
            alt="RETROCUEVA"
            width={202}
            height={173}
            className="mb-6 h-28 w-auto drop-shadow-[0_0_24px_rgba(0,240,255,0.25)] sm:h-36"
          />
          {data.intro.map((paragraph, i) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h1 key={i} className="mb-6 font-pixel text-[14px] leading-8 text-ink">
                  {paragraph.replace("# ", "")}
                </h1>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="mb-3 mt-8 font-pixel text-[11px] leading-7 text-ink">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.includes("**") && !paragraph.includes("mailto")) {
              return (
                <p
                  key={i}
                  className="mb-4 text-base leading-relaxed text-ink/75"
                  dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-ink">$1</strong>')
                      .replace(/\*([^*\s][^*]*?)\*/g, '<em>$1</em>'),
                  }}
                />
              );
            }
            return (
              <p
                key={i}
                className="mb-4 text-base leading-relaxed text-ink/75"
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-ink">$1</strong>'),
                }}
              />
            );
          })}

          {data.highlights && data.highlights.length > 0 && (
            <div className="mt-6 grid gap-px overflow-hidden border-2 border-white/10 bg-white/10 sm:grid-cols-2">
              {data.highlights.map((highlight) => (
                <div key={highlight.label} className="bg-[#0b0e1d] p-4">
                  <p className="font-retro text-base tracking-widest text-ink/60">
                    {highlight.label}
                  </p>
                  <p className="mt-1 font-retro text-lg text-ink">
                    {highlight.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 self-start">
          {data.members.map((member) => (
            <div
              key={member.name}
              className="retro-card"
              style={{ "--accent": "#00f0ff" } as CSSProperties}
            >
              <div className="screen h-24 px-5">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={`Avatar de ${member.name}`}
                    width={821}
                    height={787}
                    sizes="64px"
                    className="h-16 w-16 border-2 border-white/20 object-cover"
                  />
                ) : (
                  <span />
                )}
                <span className="badge">{member.role}</span>
              </div>
              <div className="p-5">
                <h3 className="font-pixel text-[12px] leading-6 text-ink">
                  {member.name}
                </h3>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/70">
                  {(Array.isArray(member.bio) ? member.bio : [member.bio]).map(
                    (paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
