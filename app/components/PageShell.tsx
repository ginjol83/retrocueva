import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="contenido" className="mx-auto max-w-6xl px-6">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
