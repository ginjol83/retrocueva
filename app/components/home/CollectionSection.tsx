import type { ReactNode } from "react";
import type { Game, Machine } from "../../lib/data";
import GameCard from "./GameCard";
import MachineCard from "./MachineCard";
import { EmptyState, SectionTitle, SubsectionTitle } from "./SectionBits";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "border-2 border-neon bg-neon/10 px-3 py-1 font-retro text-base text-neon"
          : "border-2 border-white/15 px-3 py-1 font-retro text-base text-ink/70 transition-colors hover:border-neon/50 hover:text-neon"
      }
    >
      {children}
    </button>
  );
}

export default function CollectionSection({
  machines,
  games,
  platforms,
  genres,
  platform,
  genre,
  onPlatform,
  onGenre,
  onClear,
}: {
  machines: Machine[];
  games: Game[];
  platforms: string[];
  genres: string[];
  platform: string;
  genre: string;
  onPlatform: (value: string) => void;
  onGenre: (value: string) => void;
  onClear: () => void;
}) {
  const filtered = platform !== "all" || genre !== "all";

  return (
    <section id="coleccion" className="scroll-mt-24 py-14">
      <SectionTitle title="Colección" count={machines.length + games.length} />

      <div className="mb-10 border-2 border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 font-retro text-base tracking-widest text-ink/40">
            Plataforma
          </span>
          <Chip active={platform === "all"} onClick={() => onPlatform("all")}>
            Todo
          </Chip>
          {platforms.map((item) => (
            <Chip
              key={item}
              active={platform === item}
              onClick={() => onPlatform(platform === item ? "all" : item)}
            >
              {item}
            </Chip>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-retro text-base tracking-widest text-ink/40">
            Género
          </span>
          <Chip active={genre === "all"} onClick={() => onGenre("all")}>
            Todo
          </Chip>
          {genres.map((item) => (
            <Chip
              key={item}
              active={genre === item}
              onClick={() => onGenre(genre === item ? "all" : item)}
            >
              {item}
            </Chip>
          ))}
          {filtered && (
            <button
              type="button"
              onClick={onClear}
              className="ml-auto font-retro text-base text-ink/40 underline transition-colors hover:text-neon"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div id="hardware" className="scroll-mt-24">
        <SubsectionTitle
          title="Hardware"
          count={machines.length}
          items="equipos"
        />
        {machines.length === 0 ? (
          <EmptyState message="Ningún equipo coincide con los filtros." />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </div>

      <div id="software" className="mt-14 scroll-mt-24">
        <SubsectionTitle
          title="Software"
          count={games.length}
          items="juegos"
        />
        {games.length === 0 ? (
          <EmptyState message="Ningún juego coincide con los filtros." />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
