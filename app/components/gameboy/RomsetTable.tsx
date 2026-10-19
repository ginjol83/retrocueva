"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { gbRomset, isNoRelease, searchRomset, type GbRomEntry } from "../../lib/gameboy";
import Highlight from "../Highlight";

const MAX_ROWS = 100;

export default function RomsetTable() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const rows = useMemo(() => searchRomset(trimmed), [trimmed]);
  const shown = rows.slice(0, MAX_ROWS);

  const cell = (entry: GbRomEntry, title: string) =>
    isNoRelease(title) ? (
      <span className="text-ink/30">no salió</span>
    ) : (
      <Link
        href={`/base-de-datos/juegos/${entry.id}`}
        className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-neon hover:decoration-neon"
      >
        <Highlight text={title} query={trimmed} />
      </Link>
    );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 border-2 border-white/10 bg-white/[0.02] p-4">
        <label className="relative block w-full md:w-96">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-retro text-lg text-ink/40">
            &gt;
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cualquier título (USA, EUR o JAP)…"
            aria-label="Buscar en el romset de Game Boy"
            className="w-full border-2 border-white/15 bg-black/40 py-2 pl-8 pr-4 font-retro text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-neon"
          />
        </label>
        <span aria-live="polite" className="font-retro text-base text-ink/40">
          {trimmed
            ? `${rows.length} ${rows.length === 1 ? "coincidencia" : "coincidencias"} de ${gbRomset.length}`
            : `${gbRomset.length} juegos · USA · EUR · JAP`}
        </span>
        {trimmed && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="font-retro text-base text-ink/40 underline transition-colors hover:text-neon"
          >
            Limpiar
          </button>
        )}
      </div>

      {!trimmed ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
          Escribe un título para buscar entre {gbRomset.length} juegos: por
          ejemplo «Rockman» (el Mega Man japonés) o «Tetris Flash» (el Tetris 2
          europeo).
        </p>
      ) : rows.length === 0 ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
          Ningún juego coincide con «{trimmed}».
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border-2 border-white/10">
            <table className="w-full min-w-[48rem] border-collapse text-left">
              <caption className="sr-only">
                Equivalencias de títulos de Game Boy por región: USA (NTSC),
                Europa (PAL) y Japón.
              </caption>
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] font-retro text-base tracking-widest text-ink/40">
                  <th scope="col" className="px-4 py-3 font-normal">
                    id
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    USA (NTSC)
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Europa (PAL)
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Japón
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 font-retro text-base text-ink/40">
                      {entry.id}
                    </td>
                    <td className="px-4 py-3 font-retro text-lg text-ink/90">
                      {cell(entry, entry.ntsc)}
                    </td>
                    <td className="px-4 py-3 font-retro text-lg text-ink/90">
                      {cell(entry, entry.pal)}
                    </td>
                    <td className="px-4 py-3 font-retro text-lg text-ink/90">
                      {cell(entry, entry.jp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > MAX_ROWS && (
            <p className="mt-4 border-l-2 border-neon/50 pl-4 font-retro text-base text-ink/50">
              Mostrando los primeros {MAX_ROWS} de {rows.length} coincidencias:
              afina la búsqueda para ver menos.
            </p>
          )}
        </>
      )}
    </div>
  );
}
