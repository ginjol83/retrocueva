import Link from "next/link";
import { gbUnits } from "../../lib/gameboy";

export default function UnitsTable() {
  const headerClass = "px-4 py-3 font-normal";

  return (
    <div className="overflow-x-auto border-2 border-white/10">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="sr-only">
          Unidades Game Boy de la colección con su revisión de placa observada
          y su número de serie.
        </caption>
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] font-retro text-base tracking-widest text-ink/40">
            <th scope="col" className={headerClass}>
              Modelo
            </th>
            <th scope="col" className={headerClass}>
              Revisión observada
            </th>
            <th scope="col" className={headerClass}>
              Nº de serie
            </th>
          </tr>
        </thead>
        <tbody>
          {gbUnits.map((unit) => (
            <tr
              key={unit.id}
              className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3 text-sm text-ink/80">{unit.model}</td>
              <td className="px-4 py-3 font-retro text-lg text-ink">
                {unit.boardRevision}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/gameboy?serial=${encodeURIComponent(unit.serial)}`}
                  className="font-retro text-lg text-neon transition-colors hover:underline"
                >
                  {unit.serial}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
