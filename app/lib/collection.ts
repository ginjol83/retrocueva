import {
  games,
  machinePlatforms,
  machines,
  normalize,
  type Game,
  type Machine,
} from "./data";

export const ALL = "all";

export const platformOptions = (): string[] =>
  Array.from(
    new Set([
      ...machines.flatMap((machine) => machinePlatforms(machine)),
      ...games.map((game) => game.platform),
    ]),
  ).sort((a, b) => a.localeCompare(b, "es"));

export const genreOptions = (): string[] =>
  Array.from(new Set(games.map((game) => game.genre))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );

export const manufacturerOptions = (): string[] =>
  Array.from(new Set(machines.map((machine) => machine.manufacturer))).sort(
    (a, b) => a.localeCompare(b, "es"),
  );

export const decadeOf = (year: number): string => `${Math.floor(year / 10) * 10}s`;

export const decadeOptions = (): string[] =>
  Array.from(
    new Set(
      [...machines.map((m) => m.year), ...games.map((g) => g.year)].map(decadeOf),
    ),
  ).sort();

export type SortKey = "id" | "name-asc" | "name-desc" | "year-asc" | "year-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "id", label: "Colección" },
  { value: "name-asc", label: "Nombre A→Z" },
  { value: "name-desc", label: "Nombre Z→A" },
  { value: "year-asc", label: "Año ↑" },
  { value: "year-desc", label: "Año ↓" },
];

export const isSortKey = (value: string): value is SortKey =>
  SORT_OPTIONS.some((option) => option.value === value);

export interface CollectionFilters {
  platform: string;
  genre: string;
  manufacturer: string;
  decade: string;
  sort: SortKey;
}

type Sortable = { id: number; year: number; name?: string; title?: string };

export const sortItems = <T extends Sortable>(list: T[], sort: SortKey): T[] => {
  const label = (item: T) => item.title ?? item.name ?? "";
  const copy = [...list];
  switch (sort) {
    case "name-asc":
      return copy.sort((a, b) => label(a).localeCompare(label(b), "es"));
    case "name-desc":
      return copy.sort((a, b) => label(b).localeCompare(label(a), "es"));
    case "year-asc":
      return copy.sort((a, b) => a.year - b.year);
    case "year-desc":
      return copy.sort((a, b) => b.year - a.year);
    default:
      return copy.sort((a, b) => a.id - b.id);
  }
};

export const filterMachines = (
  list: Machine[],
  filters: CollectionFilters,
): Machine[] =>
  sortItems(
    list.filter(
      (machine) =>
        (filters.platform === ALL ||
          machinePlatforms(machine).some(
            (item) => normalize(item) === normalize(filters.platform),
          )) &&
        (filters.manufacturer === ALL ||
          machine.manufacturer === filters.manufacturer) &&
        (filters.decade === ALL || decadeOf(machine.year) === filters.decade),
    ),
    filters.sort,
  );

export const filterGames = (
  list: Game[],
  filters: CollectionFilters,
): Game[] =>
  sortItems(
    list.filter(
      (game) =>
        (filters.platform === ALL ||
          normalize(game.platform) === normalize(filters.platform)) &&
        (filters.genre === ALL || game.genre === filters.genre) &&
        (filters.decade === ALL || decadeOf(game.year) === filters.decade),
    ),
    filters.sort,
  );
