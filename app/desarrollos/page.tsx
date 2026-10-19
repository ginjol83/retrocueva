import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import DevelopedSection from "../components/home/DevelopedSection";

export const metadata: Metadata = {
  title: "Desarrollos",
  description: "Juegos y proyectos desarrollados para plataformas de 8 bits.",
  alternates: { canonical: "/desarrollos" },
  openGraph: {
    title: "Desarrollos · RETROCUEVA",
    description: "Juegos y proyectos desarrollados para plataformas de 8 bits.",
  },
};

export default function DesarrollosPage() {
  return (
    <PageShell>
      <DevelopedSection />
    </PageShell>
  );
}
