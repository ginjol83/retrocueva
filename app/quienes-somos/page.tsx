import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import AboutSection from "../components/home/AboutSection";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Quién está detrás de RETROCUEVA: pasión por la informática retro, hardware y software de 8 bits.",
  alternates: { canonical: "/quienes-somos" },
  openGraph: {
    title: "Quiénes somos · RETROCUEVA",
    description:
      "Quién está detrás de RETROCUEVA: pasión por la informática retro de 8 bits.",
  },
};

export default function QuienesSomosPage() {
  return (
    <PageShell>
      <AboutSection />
    </PageShell>
  );
}
