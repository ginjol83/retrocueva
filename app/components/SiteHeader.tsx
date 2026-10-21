"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import BaseDatosMenu from "./home/BaseDatosMenu";
import CollectionMenu from "./home/CollectionMenu";

const LINKS = [
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/taller", label: "Taller" },
  { href: "/articulos", label: "Artículos" },
  { href: "/videos", label: "Vídeos" },
  { href: "/samaruc", label: "Samaruc" },
  { href: "/desarrollos", label: "Desarrollos" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo />
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 font-retro text-lg sm:gap-x-7 sm:text-xl">
          <CollectionMenu />
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={
                isActive(pathname, link.href)
                  ? "text-neon transition-colors"
                  : "text-ink/70 transition-colors hover:text-neon"
              }
            >
              {link.label}
            </Link>
          ))}
          <BaseDatosMenu />
        </nav>
      </div>
    </header>
  );
}
