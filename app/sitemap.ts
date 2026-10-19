import type { MetadataRoute } from "next";
import { articles, games, machines } from "./lib/data";
import { gbRomset } from "./lib/gameboy";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/coleccion`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/maquinas`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/juegos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/quienes-somos`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/articulos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/videos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/samaruc`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/desarrollos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/base-de-datos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/base-de-datos/placas`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/base-de-datos/juegos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/base-de-datos/unidades`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/base-de-datos/enviar-serial`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const detailRoutes: MetadataRoute.Sitemap = [
    ...machines.map((machine) => ({
      url: `${SITE_URL}/maquinas/${machine.id}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...games.map((game) => ({
      url: `${SITE_URL}/juegos/${game.id}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...articles
      .filter((article) => article.sections?.length)
      .map((article) => ({
        url: `${SITE_URL}/articulos/${article.id}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
    ...gbRomset.map((entry) => ({
      url: `${SITE_URL}/base-de-datos/juegos/${entry.id}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];

  return [...staticRoutes, ...detailRoutes];
}
