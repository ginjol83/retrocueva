import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { accent, type Game } from "../../lib/data";

export default function GameCard({ game }: { game: Game }) {
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
