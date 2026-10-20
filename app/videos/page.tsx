import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import VideosSection from "../components/home/VideosSection";
import { videos } from "../lib/data";
import { jsonLd } from "../lib/seo";
import { SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Vídeos",
  description: "Vídeos de la colección y los proyectos de RETROCUEVA.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Vídeos · RETROCUEVA",
    description: "Vídeos de la colección y los proyectos de RETROCUEVA.",
  },
};

const videoObjects = jsonLd({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Vídeos de RETROCUEVA",
  itemListElement: videos.map((video) => ({
    "@type": "VideoObject",
    name: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    publisher: {
      "@type": "Organization",
      name: "RETROCUEVA",
      url: SITE_URL,
    },
  })),
});

export default function VideosPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: videoObjects }}
      />
      <VideosSection />
    </PageShell>
  );
}
