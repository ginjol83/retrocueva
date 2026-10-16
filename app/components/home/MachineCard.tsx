import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { accent, code, type Machine } from "../../lib/data";
import { SpecRow } from "./SectionBits";

export default function MachineCard({ machine }: { machine: Machine }) {
  return (
    <Link
      href={`/maquinas/${machine.id}`}
      className="retro-card group"
      style={{ "--accent": accent(machine.name) } as CSSProperties}
    >
      <div className="screen h-28 px-5">
        {machine.image && (
          <>
            <Image
              src={machine.image}
              alt={machine.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-[#05060f]/85 via-[#05060f]/30 to-transparent" />
          </>
        )}
        <div className="relative z-10 flex w-full items-center justify-between">
          {!machine.image && (
            <span
              className="font-pixel text-2xl"
              style={{ color: "var(--accent)" }}
            >
              {code(machine.name)}
            </span>
          )}
          <span className="badge ml-auto">{machine.year}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-[12px] leading-6 text-ink">
          {machine.name}
        </h3>
        <p className="mt-2 font-retro text-lg text-ink/50">
          {machine.manufacturer}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {machine.description}
        </p>
        <dl className="mt-4 grid gap-1.5 border-t border-white/10 pt-4 font-retro text-base">
          <SpecRow label="CPU" value={machine.cpu} />
          <SpecRow label="RAM" value={machine.ram} />
          <SpecRow label="Storage" value={machine.storage} />
        </dl>
        <span className="mt-4 inline-flex items-center gap-2 font-retro text-base text-ink/50 transition-colors group-hover:text-[var(--accent)]">
          Ver ficha completa <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
