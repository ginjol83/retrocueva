import { stripAccents } from "./gameboy";
import { gbRomset, isNoRelease, type GbRomEntry } from "./gameboy-romset";

/** Letras del índice A–Z + "0-9" para títulos que empiezan por cifra o símbolo. */
export const ROMSET_LETTERS = [
  "0-9",
  ..."abcdefghijklmnopqrstuvwxyz",
] as const;

export type RomsetLetter = (typeof ROMSET_LETTERS)[number];

/** Primera letra del título publicado (NTSC → EUR → JAP), sin acentos. */
export function letterFor(entry: GbRomEntry): RomsetLetter {
  const primary = [entry.ntsc, entry.pal, entry.jp].find(
    (title) => !isNoRelease(title),
  );
  if (!primary) return "0-9";
  const first = stripAccents(primary.trim())[0]?.toLowerCase() ?? "";
  return /^[a-z]$/.test(first) ? (first as RomsetLetter) : "0-9";
}

function primaryTitleOf(entry: GbRomEntry): string {
  return [entry.ntsc, entry.pal, entry.jp].find(
    (title) => !isNoRelease(title),
  ) ?? entry.ntsc;
}

export function isRomsetLetter(value: string): value is RomsetLetter {
  return (ROMSET_LETTERS as readonly string[]).includes(value);
}

/** Entradas de una letra, ordenadas por título principal. */
export function entriesForLetter(letter: RomsetLetter): GbRomEntry[] {
  return gbRomset
    .filter((entry) => letterFor(entry) === letter)
    .sort((a, b) => primaryTitleOf(a).localeCompare(primaryTitleOf(b), "en"));
}

/** Recuento por letra, para mostrar "(n)" en la navegación A–Z. */
export function letterCounts(): Record<RomsetLetter, number> {
  const counts = Object.fromEntries(
    ROMSET_LETTERS.map((letter) => [letter, 0]),
  ) as Record<RomsetLetter, number>;
  for (const entry of gbRomset) counts[letterFor(entry)] += 1;
  return counts;
}

export function displayTitle(entry: GbRomEntry): string {
  return primaryTitleOf(entry);
}
