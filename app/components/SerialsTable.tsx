"use client";

import { useMemo, type ReactNode } from "react";
import { normalize, type Serial } from "../lib/data";
import { useUrlState } from "../lib/use-url-state";
import Highlight from "./Highlight";

type SortKey = "id" | "serial" | "machine" | "pattern";

const DEFAULTS = { q: "", equipo: "all", orden: "id", dir: "asc" };

const isSortKey = (value: string): value is SortKey =>
  value === "id" || value === "serial" || value === "machine" || value === "pattern";

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

export default function SerialsTable({ serials }: { serials: Serial[] }) {
  const { state, setValues } = useUrlState(DEFAULTS);
  const query = state.q;
  const machine = state.equipo;
  const sort: SortKey = isSortKey(state.orden) ? state.orden : "id";
  const asc = state.dir !== "desc";

  const machines = useMemo(
    () =>
      Array.from(new Set(serials.map((row) => row.machine))).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [serials],
  );

  const rows = useMemo(() => {
    const needle = normalize(query);
    const filtered = serials.filter((row) => {
      const machineOk = machine === "all" || row.machine === machine;
      if (!machineOk) return false;
      if (!needle) return true;
      return [
        row.serial,
        row.machine,
        row.pattern,
        row.source,
        row.notes,
        row.parts.map((part) => part.value).join(" "),
      ].some((field) => normalize(field ?? "").includes(needle));
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "id") return a.id - b.id;
      return normalize(a[sort] ?? "").localeCompare(normalize(b[sort] ?? ""), "es");
    });

    return asc ? sorted : sorted.reverse();
  }, [serials, query, machine, sort, asc]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) {
      setValues({ dir: asc ? "desc" : "asc" });
    } else {
      setValues({ orden: key, dir: "asc" });
    }
  };

  const headerClass = "px-4 py-3 font-normal";

  const sortButton = (label: string, field: SortKey) => {
    const active = sort === field;
    return (
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 transition-colors hover:text-neon"
      >
        {label}
        <span aria-hidden className={active ? "text-neon" : "text-ink/30"}>
          {active && !asc ? "▲" : "▼"}
        </span>
      </button>
    );
  };

  return (
    <>
      <div className="mb-6 border-2 border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 font-retro text-base tracking-widest text-ink/40">
            Equipo
          </span>
          <Chip active={machine === "all"} onClick={() => setValues({ equipo: "all" })}>
            Todos
          </Chip>
          {machines.map((item) => (
            <Chip
              key={item}
              active={machine === item}
              onClick={() =>
                setValues({ equipo: machine === item ? "all" : item })
              }
            >
              {item}
            </Chip>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="relative block w-full md:w-96">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-retro text-lg text-ink/40">
              &gt;
            </span>
            <input
              value={query}
              onChange={(event) => setValues({ q: event.target.value })}
              placeholder="Buscar número de serie, patrón, nota…"
              aria-label="Buscar en los números de serie"
              className="w-full border-2 border-white/15 bg-black/40 py-2 pl-8 pr-4 font-retro text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-neon"
            />
          </label>
          <span aria-live="polite" className="font-retro text-base text-ink/40">
            {rows.length} de {serials.length} registros
          </span>
          {(machine !== "all" || query.trim()) && (
            <button
              type="button"
              onClick={() => setValues({ equipo: "all", q: "" })}
              className="font-retro text-base text-ink/40 underline transition-colors hover:text-neon"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
          Ningún registro coincide con la búsqueda.
        </p>
      ) : (
        <div className="overflow-x-auto border-2 border-white/10">
          <table className="w-full min-w-[54rem] border-collapse text-left">
            <caption className="sr-only">
              Base de datos de números de serie: número, equipo, segmentos,
              patrón, fuente y notas.
            </caption>
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] font-retro text-base tracking-widest text-ink/40">
                <th
                  scope="col"
                  className={headerClass}
                  aria-sort={sort === "serial" ? (asc ? "ascending" : "descending") : "none"}
                >
                  {sortButton("Nº de serie", "serial")}
                </th>
                <th
                  scope="col"
                  className={headerClass}
                  aria-sort={sort === "machine" ? (asc ? "ascending" : "descending") : "none"}
                >
                  {sortButton("Equipo", "machine")}
                </th>
                <th scope="col" className={headerClass}>
                  Segmentos
                </th>
                <th
                  scope="col"
                  className={headerClass}
                  aria-sort={sort === "pattern" ? (asc ? "ascending" : "descending") : "none"}
                >
                  {sortButton("Patrón", "pattern")}
                </th>
                <th scope="col" className={headerClass}>
                  Fuente
                </th>
                <th scope="col" className={headerClass}>
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 align-top transition-colors last:border-b-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-retro text-lg text-neon">
                    {row.serial ? (
                      <Highlight text={row.serial} query={query} />
                    ) : (
                      <span className="border border-dashed border-white/20 px-2 py-0.5 text-base text-ink/40">
                        pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/80">
                    <Highlight text={row.machine} query={query} />
                  </td>
                  <td className="px-4 py-3">
                    {row.parts.length === 0 ? (
                      <span className="text-sm text-ink/40">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {row.parts.map((part) => (
                          <span
                            key={part.label}
                            className="border border-white/15 px-2 py-0.5 font-retro text-base text-ink/45"
                          >
                            {part.label}{" "}
                            <span className="text-ink">
                              <Highlight text={part.value} query={query} />
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-retro text-base text-ink/80">
                    {row.pattern ? (
                      <Highlight text={row.pattern} query={query} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/70">
                    {row.source ? (
                      <Highlight text={row.source} query={query} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/60">
                    {row.notes ? (
                      <Highlight text={row.notes} query={query} />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
