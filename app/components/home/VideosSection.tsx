"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { videos, type Video } from "../../lib/data";
import { SectionTitle } from "./SectionBits";

export default function VideosSection({ data = videos }: { data?: Video[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="videos" className="scroll-mt-24 border-t border-white/10 py-14">
      <SectionTitle
        title="Vídeos"
        count={data.length}
        noun={data.length === 1 ? "vídeo" : "vídeos"}
      />
      {data.length === 0 ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
          Próximamente: vídeos de la colección y de mis proyectos.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((video) => (
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
