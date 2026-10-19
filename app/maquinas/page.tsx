import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import CollectionView from "../components/home/CollectionView";

export const metadata: Metadata = {
  title: "Hardware",
  description:
    "Ordenadores y consolas de la colección RETROCUEVA, con especificaciones, número de serie y estado.",
  alternates: { canonical: "/maquinas" },
  openGraph: {
    title: "Hardware · RETROCUEVA",
    description:
      "Ordenadores y consolas de la colección, con especificaciones, número de serie y estado.",
  },
};

export default function MaquinasPage() {
  return (
    <PageShell>
      <CollectionView mode="hardware" />
    </PageShell>
  );
}
