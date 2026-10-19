import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

export default function BaseDeDatosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Logo />
          <Link
            href="/"
            className="font-retro text-lg text-ink/70 transition-colors hover:text-neon"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {children}

      <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-retro text-lg text-ink/50">
          RETROCUEVA · base de datos ·{" "}
          <Link href="/" className="transition-colors hover:text-neon">
            mi colección
          </Link>
        </p>
      </footer>
    </div>
  );
}
