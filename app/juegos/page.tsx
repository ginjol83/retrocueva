import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import CollectionView from "../components/home/CollectionView";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Juegos de la colección RETROCUEVA, con filtros por plataforma, género, editorial y década.",
  alternates: { canonical: "/juegos" },
  openGraph: {
    title: "Software · RETROCUEVA",
    description:
      "Juegos de la colección, con filtros por plataforma, género, editorial y década.",
  },
};

export default function JuegosPage() {
  return (
    <PageShell>
      <CollectionView mode="software" />
    </PageShell>
  );
}
