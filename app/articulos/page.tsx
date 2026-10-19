import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import ArticlesSection from "../components/home/ArticlesSection";

export const metadata: Metadata = {
  title: "Artículos",
  description:
    "Artículos publicados en revistas de informática y videojuegos retro.",
  alternates: { canonical: "/articulos" },
  openGraph: {
    title: "Artículos · RETROCUEVA",
    description:
      "Artículos publicados en revistas de informática y videojuegos retro.",
  },
};

export default function ArticulosPage() {
  return (
    <PageShell>
      <ArticlesSection />
    </PageShell>
  );
}
