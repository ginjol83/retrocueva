import type { ReactNode } from "react";
import type { Game, Machine } from "../../lib/data";
import { ALL, SORT_OPTIONS, type SortKey } from "../../lib/collection";
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

function ChipRow({
  label,
  allLabel,
  value,
  options,
  onSelect,
}: {
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 font-retro text-base tracking-widest text-ink/40">
        {label}
      </span>
      <Chip active={value === ALL} onClick={() => onSelect(ALL)}>
        {allLabel}
      </Chip>
      {options.map((item) => (
        <Chip
          key={item}
          active={value === item}
          onClick={() => onSelect(value === item ? ALL : item)}
        >
          {item}
        </Chip>
      ))}
    </div>
  );
}

export default function CollectionSection({
  machines,
  games,
  platforms,
  genres,
  manufacturers,
  decades,
  platform,
  genre,
  manufacturer,
  decade,
  sort,
  filtering,
  onPlatform,
  onGenre,
  onManufacturer,
  onDecade,
  onSort,
  onClear,
}: {
  machines: Machine[];
  games: Game[];
  platforms: string[];
  genres: string[];
  manufacturers: string[];
  decades: string[];
  platform: string;
  genre: string;
  manufacturer: string;
  decade: string;
  sort: SortKey;
  filtering: boolean;
  onPlatform: (value: string) => void;
  onGenre: (value: string) => void;
  onManufacturer: (value: string) => void;
  onDecade: (value: string) => void;
  onSort: (value: SortKey) => void;
  onClear: () => void;
}) {
  return (
    <section id="coleccion" className="scroll-mt-24 py-14">
      <SectionTitle title="Colección" count={machines.length + games.length} />

      <div className="mb-10 space-y-3 border-2 border-white/10 bg-white/[0.02] p-4">
        <ChipRow
          label="Plataforma"
          allLabel="Todo"
          value={platform}
          options={platforms}
          onSelect={onPlatform}
        />
        <ChipRow
          label="Género"
          allLabel="Todo"
          value={genre}
          options={genres}
          onSelect={onGenre}
        />
        <ChipRow
          label="Fabricante"
          allLabel="Todo"
          value={manufacturer}
          options={manufacturers}
          onSelect={onManufacturer}
        />
        <ChipRow
          label="Década"
          allLabel="Todas"
          value={decade}
          options={decades}
          onSelect={onDecade}
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
          <label className="flex items-center gap-2 font-retro text-base text-ink/40">
            Orden
            <select
              value={sort}
              onChange={(event) => onSort(event.target.value as SortKey)}
              className="border-2 border-white/15 bg-black/40 px-2 py-1 font-retro text-base text-ink outline-none transition-colors focus:border-neon"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {filtering && (
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
