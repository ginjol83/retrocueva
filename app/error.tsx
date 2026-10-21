"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center"
    >
      <p className="font-pixel text-5xl text-amber neon-title">ERROR</p>
      <h1 className="font-pixel text-lg text-ink sm:text-xl">
        ALGO HA FALLADO
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-ink/70">
        Se ha producido un error inesperado al cargar esta sección. Puedes
        intentarlo de nuevo; si el problema continúa, vuelve al inicio.
      </p>
      {error.digest ? (
        <p className="font-retro text-base text-ink/60">
          Código de referencia: {error.digest}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="border-2 border-amber bg-amber/10 px-5 py-2.5 font-retro text-lg text-amber transition-all hover:bg-amber hover:text-black"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="border-2 border-white/20 px-5 py-2.5 font-retro text-lg text-ink transition-all hover:border-neon hover:text-neon"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
