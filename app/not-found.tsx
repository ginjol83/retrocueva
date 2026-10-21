import type { Metadata } from "next";
import Link from "next/link";
import Logo from "./components/Logo";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center"
    >
      <Logo />
      <p className="font-pixel text-5xl text-magenta neon-title">404</p>
      <h1 className="font-pixel text-lg text-ink sm:text-xl">
        ARCHIVO NO ENCONTRADO
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-ink/70">
        La página que buscas no está en la colección. Puede que el enlace esté
        roto o que nunca haya existido.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="border-2 border-neon bg-neon/10 px-5 py-2.5 font-retro text-lg text-neon transition-all hover:bg-neon hover:text-black"
        >
          Volver al inicio
        </Link>
        <Link
          href="/base-de-datos"
          className="border-2 border-white/20 px-5 py-2.5 font-retro text-lg text-ink transition-all hover:border-cyber hover:text-cyber"
        >
          Base de datos
        </Link>
      </div>
    </main>
  );
}
