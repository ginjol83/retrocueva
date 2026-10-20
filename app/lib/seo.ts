import { imagesFor } from "./gameboy-images";
import { isNoRelease, type GbRomEntry } from "./gameboy-romset";
import { SITE_URL } from "./site";

/**
 * Serializa un objeto a JSON-LD seguro para embeber en un <script>:
 * escape `<` para cerrar el tag y colapsar secuencias de cierre.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

/**
 * Una ficha del romset es "thin" si se publicó en una sola región y además
 * no tiene carátula: contenido casi idéntico al de plantilla, sin valor
 * para el índice. Se sirve con noindex y se excluye del sitemap.
 */
export function isThinGbEntry(entry: GbRomEntry): boolean {
  const released = [entry.ntsc, entry.pal, entry.jp].filter(
    (title) => !isNoRelease(title),
  ).length;
  const hasCover = (imagesFor(entry.id)?.covers?.length ?? 0) > 0;
  return released <= 1 && !hasCover;
}

function releasedRegions(entry: GbRomEntry): { label: string; title: string }[] {
  return [
    { label: "USA", title: entry.ntsc },
    { label: "Europa", title: entry.pal },
    { label: "Japón", title: entry.jp },
  ].filter((region) => !isNoRelease(region.title));
}

/**
 * Meta description única y determinista por ficha: la fórmula varía según
 * cuántas regiones publicaron el juego y si los títulos difieren entre ellas.
 */
export function gbFichaDescription(entry: GbRomEntry): string {
  const regions = releasedRegions(entry);
  const titles = regions.map((region) => region.title);
  const distinct = new Set(titles).size > 1;
  const primary =
    titles.find((title) => title === entry.ntsc) ?? titles[0] ?? entry.ntsc;

  if (regions.length === 0) {
    return `Ficha de «${primary}» en Game Boy: registro del romset sin confirmación de publicación en ninguna región comercial.`;
  }

  if (regions.length === 1) {
    return `«${primary}» salió únicamente en ${regions[0].label} en Game Boy. Ficha con el título de la edición original, carátula y capturas cuando están disponibles.`;
  }

  if (regions.length === 2) {
    return distinct
      ? `«${primary}» en Game Boy: salió solo en ${regions[0].label} y ${regions[1].label}, y cambió de nombre entre ambos mercados.`
      : `«${primary}» en Game Boy: salió en ${regions[0].label} y ${regions[1].label} con el mismo título en los dos mercados.`;
  }

  return distinct
    ? `«${primary}» en Game Boy: salió en las tres regiones con nombres distintos — USA «${entry.ntsc}», Europa «${entry.pal}» y Japón «${entry.jp}».`
    : `«${primary}» en Game Boy: salió en USA, Europa y Japón; solo un mercado lo publicó con otro nombre (USA «${entry.ntsc}», Europa «${entry.pal}», Japón «${entry.jp}»).`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * JSON-LD BreadcrumbList para las migas visibles de la app
 * (patrón "RETROCUEVA / SECCIÓN / …").
 */
export function breadcrumbLd(items: BreadcrumbItem[]): string {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  });
}
