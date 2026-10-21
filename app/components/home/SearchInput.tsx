"use client";

import { useEffect, useRef, useState } from "react";

const HISTORY_KEY = "retrocueva:search-history";
const MAX_HISTORY = 6;

function loadHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const remember = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const next = [
      clean,
      ...history.filter((item) => item.toLowerCase() !== clean.toLowerCase()),
    ].slice(0, MAX_HISTORY);
    setHistory(next);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const showHistory = open && !value.trim() && history.length > 0;

  return (
    <div
      className="relative w-full md:w-96"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <label className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-retro text-lg text-ink/60">
          &gt;
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            setOpen(true);
            setHistory(loadHistory());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              remember(value);
              inputRef.current?.blur();
            }
            if (event.key === "Escape" && showHistory) {
              event.stopPropagation();
              setOpen(false);
            }
          }}
          placeholder="Buscar en la colección…"
          aria-label="Buscar en la colección"
          className="w-full border-2 border-white/15 bg-black/40 py-2 pl-8 pr-16 font-retro text-lg text-ink outline-none transition-colors placeholder:text-ink/60 focus:border-neon"
        />
        <kbd
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 border border-white/20 px-1.5 font-retro text-sm text-ink/60 sm:block"
        >
          /
        </kbd>
      </label>

      {showHistory && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 border-2 border-white/15 bg-[#0b0e1d] p-3 shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]">
          <p className="font-retro text-sm tracking-widest text-ink/60">
            Búsquedas recientes
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {history.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  onChange(term);
                  remember(term);
                  inputRef.current?.focus();
                }}
                className="border-2 border-white/15 px-2 py-0.5 font-retro text-base text-ink/70 transition-colors hover:border-neon/50 hover:text-neon"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
