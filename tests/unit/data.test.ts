import { describe, expect, it } from "vitest";
import {
  accent,
  articlesMentioning,
  code,
  entitiesMentionedIn,
  gamesForMachine,
  getGame,
  getMachine,
  machinePlatforms,
  machinesForPlatform,
  normalize,
  serialsForMachine,
  type Article,
  type Machine,
} from "../../app/lib/data";

describe("normalize", () => {
  it("passa a minúsculas y recorta espacios", () => {
    expect(normalize("  CASIO ")).toBe("casio");
    expect(normalize("Game Boy")).toBe("game boy");
  });
});

describe("accent / code", () => {
  it("devuelve el color conocido y el fallback", () => {
    expect(accent("ZX Spectrum")).toBe("#ff2e97");
    expect(accent("Plataforma inventada")).toBe("#00f0ff");
  });

  it("devuelve el código conocido y abrevia el desconocido", () => {
    expect(code("Commodore 64")).toBe("C64");
    expect(code("Spectrum")).toBe("SPE");
  });
});

describe("getters", () => {
  it("encuentra máquina, juego y artículo por id", () => {
    expect(getMachine(1)?.name).toBe("Casio MX-10");
    expect(getGame(1)?.title).toBe("Space Invaders");
    expect(getMachine(999)).toBeUndefined();
    expect(getGame(999)).toBeUndefined();
  });
});

describe("plataformas", () => {
  const casio = getMachine(1)!;

  it("usa los platforms declarados o el nombre como fallback", () => {
    expect(machinePlatforms(casio)).toEqual(["MSX"]);
    const sinPlatforms = { ...casio, platforms: undefined } as Machine;
    expect(machinePlatforms(sinPlatforms)).toEqual(["Casio MX-10"]);
  });

  it("filtra juegos por plataforma de la máquina sin distinguir mayúsculas", () => {
    expect(gamesForMachine(casio)).toHaveLength(0);
    const gameBoy = { ...casio, platforms: ["Game Boy"] } as Machine;
    expect(gamesForMachine(gameBoy)).toHaveLength(3);
  });

  it("encuentra máquinas por plataforma sin distinguir mayúsculas", () => {
    expect(machinesForPlatform("msx").map((m) => m.name)).toEqual([
      "Casio MX-10",
    ]);
    expect(machinesForPlatform("GAME BOY")).toHaveLength(0);
  });

  it("encuentra seriales propios de una máquina", () => {
    expect(serialsForMachine(casio).map((s) => s.serial)).toEqual([
      "MX10-0231-JP",
    ]);
  });
});

describe("artículos", () => {
  it("busca artículos que mencionan un término (mínimo 4 letras)", () => {
    expect(articlesMentioning("Broken Sword")).toHaveLength(1);
    expect(articlesMentioning("ab")).toHaveLength(0);
    expect(articlesMentioning("zzzzzz")).toHaveLength(0);
  });

  it("extrae juegos y máquinas mencionados en un artículo", () => {
    const article: Article = {
      id: 999,
      title: "Título",
      magazine: "CAAD",
      year: 2026,
      summary: "R-Type corre en una Casio MX-10 perfectamente.",
    };
    const { games, machines } = entitiesMentionedIn(article);
    expect(games.map((g) => g.title)).toEqual(["R-Type"]);
    expect(machines.map((m) => m.name)).toEqual(["Casio MX-10"]);
  });
});
