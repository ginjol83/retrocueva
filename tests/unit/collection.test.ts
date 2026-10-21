import { describe, expect, it } from "vitest";
import {
  ALL,
  decadeOf,
  decadeOptions,
  filterGames,
  filterMachines,
  genreOptions,
  isSortKey,
  platformOptions,
  sortItems,
  type CollectionFilters,
  type SortKey,
} from "../../app/lib/collection";
import { getMachine, type Game, type Machine } from "../../app/lib/data";

const filters = (
  overrides: Partial<CollectionFilters> = {},
): CollectionFilters => ({
  platform: ALL,
  genre: ALL,
  manufacturer: ALL,
  decade: ALL,
  sort: "id",
  ...overrides,
});

const makeMachine = (
  overrides: Partial<Machine> & Pick<Machine, "id" | "name">,
): Machine => ({
  manufacturer: "Genérico",
  year: 1990,
  cpu: "",
  ram: "",
  storage: "",
  description: "",
  serial: "",
  condition: "",
  acquired: 2020,
  location: "",
  notes: "",
  platforms: undefined,
  ...overrides,
});

const makeGame = (
  overrides: Partial<Game> & Pick<Game, "id" | "title">,
): Game => ({
  platform: "Game Boy",
  year: 1990,
  genre: "Acción",
  description: "",
  ...overrides,
});

describe("decadeOf", () => {
  it("agrupa el año en su década", () => {
    expect(decadeOf(1984)).toBe("1980s");
    expect(decadeOf(1989)).toBe("1980s");
    expect(decadeOf(1990)).toBe("1990s");
    expect(decadeOf(2004)).toBe("2000s");
  });
});

describe("isSortKey", () => {
  it("acepta las claves válidas y rechaza el resto", () => {
    expect(isSortKey("name-asc")).toBe(true);
    expect(isSortKey("year-desc")).toBe(true);
    expect(isSortKey("inventada")).toBe(false);
  });
});

describe("sortItems", () => {
  const items = [
    { id: 3, year: 1992, title: "Beta" },
    { id: 1, year: 1984, title: "Alfa" },
    { id: 2, year: 1988, title: "Gamma" },
  ];

  it("ordena por id, año y nombre sin mutar la lista original", () => {
    expect(sortItems(items, "id").map((i) => i.id)).toEqual([1, 2, 3]);
    expect(sortItems(items, "year-asc").map((i) => i.year)).toEqual([
      1984, 1988, 1992,
    ]);
    expect(sortItems(items, "year-desc").map((i) => i.year)).toEqual([
      1992, 1988, 1984,
    ]);
    expect(sortItems(items, "name-asc").map((i) => i.title)).toEqual([
      "Alfa",
      "Beta",
      "Gamma",
    ]);
    expect(sortItems(items, "name-desc").map((i) => i.title)).toEqual([
      "Gamma",
      "Beta",
      "Alfa",
    ]);
    expect(items.map((i) => i.id)).toEqual([3, 1, 2]);
  });
});

describe("filterMachines", () => {
  const list: Machine[] = [
    makeMachine({ id: 1, name: "Casio MX-10", manufacturer: "Casio", year: 1985, platforms: ["MSX"] }),
    makeMachine({ id: 2, name: "Thomson MO5", manufacturer: "Thomson", year: 1984 }),
  ];

  it("devuelve todo con filtros en ALL", () => {
    expect(filterMachines(list, filters())).toHaveLength(2);
  });

  it("filtra por plataforma sin distinguir mayúsculas", () => {
    const result = filterMachines(list, filters({ platform: "msx" }));
    expect(result.map((m) => m.name)).toEqual(["Casio MX-10"]);
  });

  it("filtra por fabricante y década a la vez", () => {
    expect(
      filterMachines(list, filters({ manufacturer: "Thomson" })).map((m) => m.id),
    ).toEqual([2]);
    expect(filterMachines(list, filters({ decade: "1980s" }))).toHaveLength(2);
    expect(filterMachines(list, filters({ decade: "1990s" }))).toHaveLength(0);
  });
});

describe("filterGames", () => {
  const list: Game[] = [
    makeGame({ id: 1, title: "Space Invaders", genre: "Shoot 'em up", year: 1990 }),
    makeGame({ id: 2, title: "Lunar Lander", genre: "Simulación", year: 1990 }),
    makeGame({ id: 3, title: "Otro", platform: "NES", genre: "Acción", year: 1985 }),
  ];

  it("filtra por plataforma, género y década", () => {
    expect(filterGames(list, filters())).toHaveLength(3);
    expect(
      filterGames(list, filters({ platform: "game boy" })).map((g) => g.id),
    ).toEqual([1, 2]);
    expect(
      filterGames(list, filters({ genre: "Simulación" })).map((g) => g.id),
    ).toEqual([2]);
    expect(
      filterGames(list, filters({ decade: "1980s" })).map((g) => g.id),
    ).toEqual([3]);
    expect(
      filterGames(
        list,
        filters({ platform: "game boy", genre: "Shoot 'em up" }),
      ).map((g) => g.id),
    ).toEqual([1]);
  });
});

describe("opciones de la colección", () => {
  it("plataformas únicas y ordenadas según los datos reales", () => {
    const options = platformOptions();
    expect(options).toContain("MSX");
    expect(options).toContain("MS-DOS");
    expect(options).toContain("Game Boy");
    expect(new Set(options).size).toBe(options.length);
    expect(options).toEqual(
      [...options].sort((a, b) => a.localeCompare(b, "es")),
    );
  });

  it("géneros y décadas únicos y ordenados", () => {
    const genres = genreOptions();
    expect(genres).toContain("Shoot 'em up");
    expect(new Set(genres).size).toBe(genres.length);

    const decades = decadeOptions();
    expect(decades).toContain("1980s");
    expect(decades).toContain("1990s");
    expect(decades).toEqual([...decades].sort());
  });

  it("la lista real de máquinas se puede filtrar sin combinaciones imposibles", () => {
    const real = [getMachine(1)!];
    expect(filterMachines(real, filters({ platform: "MSX" }))).toHaveLength(1);
    expect(filterMachines(real, filters({ platform: "Game Boy" }))).toHaveLength(
      0,
    );
  });
});
