"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { games, machines } from "../../lib/data";

export default function CollectionMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  const items = [
    { label: "Todo", href: "/coleccion", count: machines.length + games.length },
    { label: "Hardware", href: "/maquinas", count: machines.length },
    { label: "Software", href: "/juegos", count: games.length },
  ];

  const active = items.some((item) => item.href === pathname);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={
          "flex items-center gap-1.5 transition-colors " +
          (active ? "text-neon" : "text-ink/70 hover:text-neon")
        }
      >
        Colección
        <span
          aria-hidden
          className={"text-xs transition-transform " + (open ? "rotate-180" : "")}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-56 border-2 border-white/15 bg-[#0b0e1d] shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={item.href === pathname ? "page" : undefined}
              className={
                "flex items-center justify-between px-4 py-3 transition-colors hover:bg-neon/10 hover:text-neon " +
                (item.href === pathname ? "text-neon " : "text-ink/75 ") +
                (index > 0 ? "border-t border-white/10" : "")
              }
            >
              <span>{item.label}</span>
              <span className="text-ink/40">{item.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
