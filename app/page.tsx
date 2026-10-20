import { SITE_URL } from "./lib/site";
import HomeContent from "./components/home/HomeContent";
import { games, machines } from "./lib/data";
import { jsonLd } from "./lib/seo";

export default function Home() {
  const itemListElement = [
    ...machines.slice(0, 20).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.name,
      url: `${SITE_URL}/maquinas/${m.id}`,
      item: {
        "@type": "Thing",
        name: m.name,
      },
    })),
    ...games.slice(0, 20).map((g, i) => ({
      "@type": "ListItem",
      position: machines.slice(0, 20).length + i + 1,
      name: g.title,
      url: `${SITE_URL}/juegos/${g.id}`,
      item: {
        "@type": "Thing",
        name: g.title,
      },
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Colección Retrocueva",
            itemListElement,
          }),
        }}
      />
      <HomeContent />
    </>
  );
}
