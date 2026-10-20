import type { ReactNode } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function BaseDeDatosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
