"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GB_ROMSET_COUNT, GB_UNITS_COUNT } from "../../lib/counts";

const items = [
  { label: "Buscador de placa", href: "/base-de-datos/placas" },
  { label: "Buscador de juego", href: "/base-de-datos/juegos", count: GB_ROMSET_COUNT },
  { label: "Unidades verificadas", href: "/base-de-datos/unidades", count: GB_UNITS_COUNT },
  { label: "Envía tu serial", href: "/base-de-datos/enviar-serial" },
];

export default function BaseDatosMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-ink/70 transition-colors hover:text-neon"
      >
        Base Datos
        <span
          aria-hidden
          className={"text-xs transition-transform " + (open ? "rotate-180" : "")}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 border-2 border-white/15 bg-[#0b0e1d] shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                "flex items-center justify-between px-4 py-3 text-ink/75 transition-colors hover:bg-neon/10 hover:text-neon " +
                (index > 0 ? "border-t border-white/10" : "")
              }
            >
              <span>{item.label}</span>
              {"count" in item && (
                <span className="text-ink/40">{item.count}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
