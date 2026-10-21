import { describe, expect, it } from "vitest";
import {
  boardOf,
  findGbUnit,
  lookupRange,
  normalizeSerial,
  parseSerial,
  resolveSerial,
  stripAccents,
} from "../../app/lib/gameboy";

describe("normalizeSerial", () => {
  it("passa a mayúsculas y quita espacios y guiones", () => {
    expect(normalizeSerial(" gh3783 310 ")).toBe("GH3783310");
    expect(normalizeSerial("GH-3783-310")).toBe("GH3783310");
  });
});

describe("stripAccents", () => {
  it("elimina las tildes", () => {
    expect(stripAccents("Comodín")).toBe("Comodin");
    expect(stripAccents("Placa revisión")).toBe("Placa revision");
  });
});

describe("parseSerial", () => {
  it("acepta los prefijos G, GH y GM con 5 a 10 dígitos", () => {
    expect(parseSerial("GH3783310")).toEqual({ prefix: "GH", digits: "3783310" });
    expect(parseSerial("g01310831")).toEqual({ prefix: "G", digits: "01310831" });
    expect(parseSerial("GM2001939")).toEqual({ prefix: "GM", digits: "2001939" });
  });

  it("rechaza prefijos desconocidos y longitudes de dígitos inválidas", () => {
    expect(parseSerial("XY1234567")).toBeNull();
    expect(parseSerial("GH1234")).toBeNull();
    expect(parseSerial("GH12345678901")).toBeNull();
  });
});

describe("lookupRange", () => {
  it("resuelve un serial dentro de un rango documentado", () => {
    const range = lookupRange("G01310831");
    expect(range?.mainboard).toBe("DMG CPU-01");
    expect(range?.serialChar).toBe("G");
  });

  it("resuelve GH al rango de fábrica que le corresponde", () => {
    expect(lookupRange("GH3783310")?.mainboard).toBe("DMG CPU-07");
    expect(lookupRange("GH1100000")?.mainboard).toBe("DMG CPU-06");
  });

  it("devuelve null fuera de rangos o con formato inválido", () => {
    expect(lookupRange("GH9999999")).toBeNull();
    expect(parseSerial("basura") && lookupRange("basura")).toBeNull();
  });
});

describe("boardOf", () => {
  it("quita el prefijo DMG del nombre de la placa", () => {
    expect(boardOf({ mainboard: "DMG CPU-03" } as never)).toBe("CPU-03");
  });
});

describe("findGbUnit", () => {
  it("encuentra unidades propias sin distinguir mayúsculas", () => {
    expect(findGbUnit("gh3783310")?.model).toBe("GB DMG AZUL");
    expect(findGbUnit("G0000000")).toBeUndefined();
  });
});

describe("resolveSerial", () => {
  it("unidad propia con conflicto documentado frente al rango", () => {
    const result = resolveSerial("GH3783310");
    expect(result.found).toBe(true);
    expect(result.conflict).toBe(true);
    expect(result.unit?.boardRevision).toBe("CPU-06");
    expect(result.range?.mainboard).toBe("DMG CPU-07");
  });

  it("unidad propia sin conflicto cuando coinciden placa y rango", () => {
    const result = resolveSerial("G01310831");
    expect(result.found).toBe(true);
    expect(result.conflict).toBe(false);
    expect(result.unit?.boardRevision).toBe("CPU-01");
    expect(result.range?.mainboard).toBe("DMG CPU-01");
  });

  it("serial solo en rangos, sin unidad propia", () => {
    const result = resolveSerial("GH1100000");
    expect(result.found).toBe(true);
    expect(result.unit).toBeUndefined();
    expect(result.range).toBeDefined();
  });

  it("unidad propia fuera de los rangos documentados", () => {
    const result = resolveSerial("G721048947");
    expect(result.found).toBe(true);
    expect(result.unit).toBeDefined();
    expect(result.range).toBeUndefined();
  });

  it("serial que no coincide con nada", () => {
    expect(resolveSerial("ZZ999")).toEqual({
      found: false,
      conflict: false,
      unit: undefined,
      range: undefined,
    });
  });
});
