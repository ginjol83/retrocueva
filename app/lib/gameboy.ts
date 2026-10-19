import romsetData from "../../db/gameboy/romset.json";
import rangesData from "../../db/gameboy/serial-ranges.json";
import unitsData from "../../db/gameboy/units.json";

export interface GbSerialRange {
  serialChar: string;
  serialIni: string;
  serialEnd: string;
  mainboard: string;
  cpu: string;
  vram: string;
  wram: string;
  lcdBoard: string;
  powerBoard: string;
  jackBoard: string;
  comment: string;
  madeIn: string;
  screws: string;
  age: string;
}

export interface GbUnit {
  id: number;
  model: string;
  boardRevision: string;
  serial: string;
}

export interface GbRomEntry {
  id: number;
  ntsc: string;
  pal: string;
  jp: string;
}

export interface SerialResolution {
  found: boolean;
  conflict: boolean;
  unit?: GbUnit;
  range?: GbSerialRange;
}

export const gbRanges = rangesData as GbSerialRange[];
export const gbUnits = unitsData as GbUnit[];
export const gbRomset = romsetData as GbRomEntry[];

const PREFIXES = ["GH", "GM", "G"];

export const normalizeSerial = (value: string): string =>
  value.toUpperCase().replace(/[\s-]/g, "");

export const stripAccents = (value: string): string =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const isNoRelease = (value: string): boolean =>
  /^no sali/i.test(value.trim());

export function parseSerial(
  input: string,
): { prefix: string; digits: string } | null {
  const serial = normalizeSerial(input);
  const prefix = PREFIXES.find((item) => serial.startsWith(item));
  if (!prefix) return null;
  const digits = serial.slice(prefix.length);
  if (!/^\d{5,10}$/.test(digits)) return null;
  return { prefix, digits };
}

export function lookupRange(input: string): GbSerialRange | null {
  const parsed = parseSerial(input);
  if (!parsed) return null;
  const value = Number(parsed.digits);
  return (
    gbRanges.find((range) => {
      if (range.serialChar !== parsed.prefix) return false;
      return (
        value >= Number(range.serialIni) && value <= Number(range.serialEnd)
      );
    }) ?? null
  );
}

export function findGbUnit(input: string): GbUnit | undefined {
  const serial = normalizeSerial(input);
  return gbUnits.find((unit) => normalizeSerial(unit.serial) === serial);
}

export const boardOf = (range: GbSerialRange): string =>
  range.mainboard.replace(/^DMG\s+/, "");

export function resolveSerial(input: string): SerialResolution {
  const unit = findGbUnit(input);
  const range = lookupRange(input);
  return {
    found: Boolean(unit || range),
    conflict: Boolean(unit && range && unit.boardRevision !== boardOf(range)),
    unit,
    range: range ?? undefined,
  };
}

export function searchRomset(query: string): GbRomEntry[] {
  const needle = stripAccents(query.trim().toLowerCase());
  if (!needle) return [];
  return gbRomset.filter((entry) =>
    [entry.ntsc, entry.pal, entry.jp].some((title) =>
      stripAccents(title.toLowerCase()).includes(needle),
    ),
  );
}

export function romsetEntryFor(title: string): GbRomEntry | undefined {
  const needle = stripAccents(title.trim().toLowerCase());
  if (needle.length < 3) return undefined;
  const titles = (entry: GbRomEntry) =>
    [entry.ntsc, entry.pal, entry.jp].map((item) =>
      stripAccents(item.toLowerCase()),
    );
  return (
    gbRomset.find((entry) => titles(entry).some((item) => item === needle)) ??
    gbRomset.find((entry) => titles(entry).some((item) => item.includes(needle)))
  );
}
