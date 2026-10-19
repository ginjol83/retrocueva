import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import VideosSection from "../components/home/VideosSection";

export const metadata: Metadata = {
  title: "Vídeos",
  description: "Vídeos de la colección y los proyectos de RETROCUEVA.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Vídeos · RETROCUEVA",
    description: "Vídeos de la colección y los proyectos de RETROCUEVA.",
  },
};

export default function VideosPage() {
  return (
    <PageShell>
      <VideosSection />
    </PageShell>
  );
}
