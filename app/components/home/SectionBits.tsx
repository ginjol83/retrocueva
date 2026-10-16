export function SectionTitle({
  title,
  count,
  noun = "registros",
}: {
  title: string;
  count?: number;
  noun?: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="font-pixel text-sm text-ink sm:text-base">
        <span className="text-neon">/</span> {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-neon/50 to-transparent" />
      {count !== undefined && (
        <span className="font-retro text-lg text-ink/40">
          {count} {noun}
        </span>
      )}
    </div>
  );
}

export function SubsectionTitle({
  title,
  count,
  items,
}: {
  title: string;
  count: number;
  items: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h3 className="font-pixel text-[11px] text-ink/85">
        <span className="text-neon">■</span> {title}
      </h3>
      <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
      <span className="font-retro text-base text-ink/40">
        {count} {items}
      </span>
    </div>
  );
}

export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink/45">{label}</dt>
      <dd className="text-right text-ink/90">{value}</dd>
    </div>
  );
}

export function EmptyState({ message = "Sin resultados. Prueba con otra búsqueda." }: { message?: string }) {
  return (
    <p className="border-2 border-dashed border-white/15 px-6 py-14 text-center font-retro text-xl text-ink/50">
      {message}
    </p>
  );
}
