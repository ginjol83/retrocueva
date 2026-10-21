import { describe, expect, it } from "vitest";
import { EMPTY_RESULTS, searchAll } from "../../app/lib/search";

describe("searchAll", () => {
  it("devuelve vacío con consulta vacía o en blanco", () => {
    expect(searchAll("")).toBe(EMPTY_RESULTS);
    expect(searchAll("   ")).toBe(EMPTY_RESULTS);
  });

  it("encuentra hardware por nombre y fabricante", () => {
    const results = searchAll("casio");
    expect(results.machines.map((m) => m.name)).toEqual(["Casio MX-10"]);
    expect(results.total).toBe(1);
  });

  it("no distingue mayúsculas", () => {
    expect(searchAll("CASIO")).toEqual(searchAll("casio"));
    expect(searchAll("Thomson MO5")).toEqual(searchAll("thomson mo5"));
  });

  it("encuentra software por título", () => {
    const results = searchAll("space invaders");
    expect(results.games.map((g) => g.title)).toEqual(["Space Invaders"]);
    expect(results.machines).toHaveLength(0);
    expect(results.total).toBe(1);
  });

  it("encuentra seriales de Game Boy", () => {
    const results = searchAll("gh3783310");
    expect(results.serials.map((s) => s.serial)).toEqual(["GH3783310"]);
    expect(results.total).toBe(1);
  });

  it("el total es la suma de todas las colecciones", () => {
    const results = searchAll("a");
    const sum =
      results.machines.length +
      results.games.length +
      results.articles.length +
      results.developed.length +
      results.serials.length;
    expect(results.total).toBe(sum);
  });

  it("sin coincidencias devuelve todo vacío", () => {
    const results = searchAll("zzzzzzz");
    expect(results).toEqual(EMPTY_RESULTS);
  });
});
