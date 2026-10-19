import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import CollectionView from "../components/home/CollectionView";

export const metadata: Metadata = {
  title: "Colección",
  description:
    "Colección completa de informática retro: equipos y juegos con filtros por plataforma, género, fabricante y década.",
  alternates: { canonical: "/coleccion" },
  openGraph: {
    title: "Colección · RETROCUEVA",
    description:
      "Equipos y juegos de informática retro con filtros por plataforma, género, fabricante y década.",
  },
};

export default function ColeccionPage() {
  return (
    <PageShell>
      <CollectionView mode="all" />
    </PageShell>
  );
}
