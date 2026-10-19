"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { games, machines } from "../../lib/data";
import {
  ALL,
  SORT_OPTIONS,
  decadeOptions,
  filterGames,
  filterMachines,
  genreOptions,
  isSortKey,
  manufacturerOptions,
  platformOptions,
  type SortKey,
} from "../../lib/collection";
import { useUrlState } from "../../lib/use-url-state";
import GameCard from "./GameCard";
import MachineCard from "./MachineCard";
import { EmptyState, SectionTitle, SubsectionTitle } from "./SectionBits";

const DEFAULTS = {
  platform: ALL,
  genre: ALL,
  fab: ALL,
  decada: ALL,
  orden: "id",
};

export type CollectionMode = "all" | "hardware" | "software";

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

export default function CollectionView({ mode }: { mode: CollectionMode }) {
  const { state, setValues, reset } = useUrlState(DEFAULTS);
  const { platform, genre, fab, decada } = state;
  const sort: SortKey = isSortKey(state.orden) ? state.orden : "id";

  const platforms = useMemo(() => platformOptions(), []);
  const genres = useMemo(() => genreOptions(), []);
  const manufacturers = useMemo(() => manufacturerOptions(), []);
  const decades = useMemo(() => decadeOptions(), []);

  const filteredMachines = useMemo(
    () =>
      filterMachines(machines, {
        platform,
        genre,
        manufacturer: fab,
        decade: decada,
        sort,
      }),
    [platform, genre, fab, decada, sort],
  );

  const filteredGames = useMemo(
    () =>
      filterGames(games, {
        platform,
        genre,
        manufacturer: fab,
        decade: decada,
        sort,
      }),
    [platform, genre, fab, decada, sort],
  );

  const filtering =
    platform !== ALL ||
    genre !== ALL ||
    fab !== ALL ||
    decada !== ALL ||
    sort !== "id";

  const showMachines = mode !== "software";
  const showGames = mode !== "hardware";
  const total =
    (showMachines ? filteredMachines.length : 0) +
    (showGames ? filteredGames.length : 0);
  const title =
    mode === "hardware" ? "Hardware" : mode === "software" ? "Software" : "Colección";
  const noun =
    mode === "hardware" ? "equipos" : mode === "software" ? "juegos" : "registros";

  return (
    <section className="border-t border-white/10 py-14">
      <SectionTitle as="h1" title={title} count={total} noun={noun} />

      <div className="mb-10 space-y-3 border-2 border-white/10 bg-white/[0.02] p-4">
        <ChipRow
          label="Plataforma"
          allLabel="Todo"
          value={platform}
          options={platforms}
          onSelect={(value) => setValues({ platform: value })}
        />
        <ChipRow
          label="Género"
          allLabel="Todo"
          value={genre}
          options={genres}
          onSelect={(value) => setValues({ genre: value })}
        />
        <ChipRow
          label="Fabricante"
          allLabel="Todo"
          value={fab}
          options={manufacturers}
          onSelect={(value) => setValues({ fab: value })}
        />
        <ChipRow
          label="Década"
          allLabel="Todas"
          value={decada}
          options={decades}
          onSelect={(value) => setValues({ decada: value })}
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
          <label className="flex items-center gap-2 font-retro text-base text-ink/40">
            Orden
            <select
              value={sort}
              onChange={(event) => setValues({ orden: event.target.value })}
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
              onClick={reset}
              className="ml-auto font-retro text-base text-ink/40 underline transition-colors hover:text-neon"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {showMachines && (
        <div>
          {mode === "all" && (
            <SubsectionTitle
              as="h2"
              title="Hardware"
              count={filteredMachines.length}
              items="equipos"
            />
          )}
          {filteredMachines.length === 0 ? (
            <EmptyState message="Ningún equipo coincide con los filtros." />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMachines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          )}
        </div>
      )}

      {showGames && (
        <div className={showMachines ? "mt-14" : undefined}>
          {mode === "all" && (
            <SubsectionTitle
              as="h2"
              title="Software"
              count={filteredGames.length}
              items="juegos"
            />
          )}
          {filteredGames.length === 0 ? (
            <EmptyState message="Ningún juego coincide con los filtros." />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
