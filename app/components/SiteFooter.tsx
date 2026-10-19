import Link from "next/link";
import { games, machines } from "../lib/data";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-white/10 px-6 py-10 text-center">
      <p className="font-retro text-lg text-ink/50">
        RETROCUEVA · mi colección · {machines.length} equipos · {games.length}{" "}
        juegos ·{" "}
        <Link href="/base-de-datos" className="transition-colors hover:text-neon">
          base de datos
        </Link>
      </p>
    </footer>
  );
}
