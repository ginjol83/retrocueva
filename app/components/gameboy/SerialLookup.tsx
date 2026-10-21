"use client";

import { type FormEvent } from "react";
import { useUrlState } from "../../lib/use-url-state";
import {
  resolveSerial,
  type GbSerialRange,
  type GbUnit,
} from "../../lib/gameboy";

const DEFAULTS = { serial: "" };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-retro text-base tracking-widest text-ink/60">
        {label}
      </dt>
      <dd className="mt-0.5 font-retro text-lg text-ink/90">{value || "—"}</dd>
    </div>
  );
}

function UnitCard({ unit }: { unit: GbUnit }) {
  return (
    <div className="border-2 border-neon/40 bg-neon/5 p-5">
      <p className="font-retro text-base tracking-widest text-neon/70">
        Tu unidad · verificado en la vitrina
      </p>
      <p className="mt-1 font-pixel text-base text-neon">{unit.boardRevision}</p>
      <p className="mt-2 font-retro text-lg text-ink/80">
        {unit.model} · {unit.serial}
      </p>
    </div>
  );
}

function RangeCard({ range }: { range: GbSerialRange }) {
  return (
    <div className="border-2 border-white/10 bg-[#0b0e1d] p-5">
      <p className="font-retro text-base tracking-widest text-ink/60">
        Rango de fábrica · {range.serialChar}
        {range.serialIni} – {range.serialChar}
        {range.serialEnd}
      </p>
      <p className="mt-1 font-pixel text-base text-ink">{range.mainboard}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="CPU" value={range.cpu} />
        <Field label="VRAM" value={range.vram} />
        <Field label="WRAM" value={range.wram} />
        <Field label="Placa LCD" value={range.lcdBoard} />
        <Field label="Placa de alimentación" value={range.powerBoard} />
        <Field label="Placa de jack" value={range.jackBoard} />
        <Field label="Origen" value={range.madeIn} />
        <Field label="Tornillos" value={range.screws} />
        <Field label="Año" value={range.age} />
      </dl>
      {range.comment && (
        <p className="mt-4 border-l-2 border-neon/40 pl-3 text-sm leading-relaxed text-ink/60">
          {range.comment}
        </p>
      )}
    </div>
  );
}

export default function SerialLookup() {
  const { state, setValues } = useUrlState(DEFAULTS);
  const serial = state.serial.trim();
  const result = serial ? resolveSerial(serial) : null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full md:w-96">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-retro text-lg text-ink/60">
            &gt;
          </span>
          <input
            value={state.serial}
            onChange={(event) => setValues({ serial: event.target.value })}
            placeholder="Ej.: GH3783310, G01310831…"
            aria-label="Número de serie de una Game Boy DMG"
            className="w-full border-2 border-white/15 bg-black/40 py-2 pl-8 pr-4 font-retro text-lg uppercase text-ink outline-none transition-colors placeholder:normal-case placeholder:text-ink/60 focus:border-neon"
          />
        </label>
        <button
          type="submit"
          className="border-2 border-neon bg-neon/10 px-5 py-2 font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
        >
          Consultar
        </button>
        {serial && (
          <button
            type="button"
            onClick={() => setValues({ serial: "" })}
            className="font-retro text-base text-ink/60 underline transition-colors hover:text-neon"
          >
            Limpiar
          </button>
        )}
      </form>

      <div aria-live="polite" className="mt-6">
        {!result && (
          <p className="border-2 border-dashed border-white/15 px-6 py-10 text-center font-retro text-xl text-ink/60">
            Introduce el número de serie de la etiqueta trasera de una Game Boy
            DMG para averiguar qué revisión de placa lleva.
          </p>
        )}

        {result && !result.found && (
          <p className="border-2 border-dashed border-white/15 px-6 py-10 text-center font-retro text-xl text-ink/60">
            Ningún rango ni unidad propia coincide con «{serial}». Comprueba el
            formato: una letra (G, GH o GM) seguida de 7 u 8 dígitos, sin
            espacios.
          </p>
        )}

        {result?.found && (
          <div className="grid gap-4">
            {result.unit && <UnitCard unit={result.unit} />}

            {result.conflict && result.range && (
              <p className="border-l-2 border-magenta pl-4 font-retro text-base leading-relaxed text-ink/70">
                Tu unidad está abierta y su placa observada es{" "}
                <span className="text-neon">{result.unit?.boardRevision}</span>,
                mientras que el rango de fábrica la asocia a{" "}
                <span className="text-ink">{result.range.mainboard}</span>. El
                dato verificado es el de tu unidad; el rango queda como
                referencia comunitaria.
              </p>
            )}

            {result.unit && !result.range && (
              <p className="border-l-2 border-neon/50 pl-4 font-retro text-base leading-relaxed text-ink/60">
                Este número no cae dentro de los rangos documentados — común en
                las variantes americanas, cuyo formato no encaja con los rangos
                DMG publicados.
              </p>
            )}

            {result.range && <RangeCard range={result.range} />}
          </div>
        )}
      </div>
    </div>
  );
}
