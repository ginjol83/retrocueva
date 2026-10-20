import romsetData from "../../db/gameboy/romset.json";
import { stripAccents } from "./gameboy";

export interface GbRomEntry {
  id: number;
  ntsc: string;
  pal: string;
  jp: string;
}

export const gbRomset = romsetData as GbRomEntry[];

export const isNoRelease = (value: string): boolean =>
  /^no sali/i.test(value.trim());

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
