# ROADMAP · RETROCUEVA

Hoja de ruta del proyecto. Marca las casillas al completar y añade notas donde haga falta.
Última actualización: octubre 2026.

Leyenda: `[x]` hecho · `[~]` en curso · `[ ]` pendiente · `[–]` descartado / pospuesto.

---

## Estado actual (resumen)

- **Stack**: Next.js 16.4.1 (App Router, Turbopack, `cacheComponents`, `partialPrefetching`), React 19, Tailwind 4, TypeScript.
- **Datos**: JSON en `db/` importados en `app/lib/data.ts` (3 equipos, 3 juegos, 1 artículo, 1 vídeo, 3 serials, 4 desarrollos).
- **Páginas**: `/` (colección + editorial), `/placas`, fichas `/maquinas/[id]`, `/juegos/[id]`, `/articulos/[id]`.
- **API**: listas y detalle en `/api/{games,machines,serials,articles,videos,developed}`; listas con `?q=`, `?page=`/`?perPage=` y cabecera `Cache-Control`.
- **Ya hecho**: búsqueda global, filtros (plataforma/género/fabricante/década/orden), estado en URL, relación máquina↔juegos por `platforms`, tabla interactiva de serials, split de la home en componentes, API con `?q=`/paginación/`Cache-Control`, SEO (metadata/OG/sitemap/robots/manifest/JSON-LD), `not-found`/`error`, a11y.
- **Despliegue**: producción en Vercel → <https://retrocueva.vercel.app> (integración git: cada push a `main` redespliega). Falta `NEXT_PUBLIC_SITE_URL` y dominio propio (4.19).
- **Repo**: `ginjol83/retrocueva` (público). Push por SSH (`git@github.com:...`); el fine-grained PAT actual no tiene permiso de escritura.

---

## Fase 1 — Contenido y datos  `[ ]` (bloqueada: faltan datos)

- [ ] **1.1 Lookup de número de serie Game Boy DMG** desde `doc/bd (1).json` (10 rangos `serial_ini`/`serial_end` → mainboard, CPU, VRAM, WRAM, LCD/power/jack, `made_in`, tornillos, año). Modelo `SerialRange` + página `/gameboy`.
- [ ] **1.2** Importar `doc/gb_romset_tabla_equiv.xlsx` (equivalencias de ROM set).
- [ ] **1.3** Importar `doc/serials.xls.xlsx`.
- [ ] **1.4** Ampliar colección real (C64, ZX Spectrum, NES, Atari 2600, Amstrad CPC, BBC Micro…).
- [ ] **1.5** Más vídeos + metadatos (`channel`, `duration`).
- [ ] **1.6** Rellenar seriales pendientes (Portátil 486) y añadir más.
- [ ] **1.7** Enlazar `link` de desarrollos y Samaruc a sus repos.
- [ ] **1.8** Sección "Taller" usando `public/taller/*`.

---

## Fase 2 — Funcionalidad  `[x]`

- [x] **2.8 Búsqueda y filtros en la URL** (compartible). Query params `q`, `platform`, `genre` en `/`; `q`, `equipo`, `orden` en `/placas`.
- [x] **2.9 Filtros de hardware** por fabricante y década + orden de colección (nombre/año).
- [x] **2.10 Enlaces cruzados**: máquina → sus seriales en `/placas`; juego → equipos de su plataforma; artículos ↔ juegos.
- [x] **2.11 API**: `videos/[id]`, `?q=`, paginación y cabeceras de caché (`Cache-Control`).
- [x] **2.12 UX de búsqueda**: resaltado de coincidencias, atajo `/` para enfocar, historial en `localStorage`.
- [x] **2.13** Silenciar aviso `instant-shell-url-data` en `/maquinas/[id]`, `/juegos/[id]`, `/articulos/[id]`.

---

## Fase 3 — SEO, accesibilidad y calidad  `[~]`

- [x] **3.14 Metadata**: `metadataBase`, OpenGraph/Twitter, `sitemap.ts`, `robots.ts`, `manifest` PWA, iconos desde `logo.png`.
- [x] **3.15** `not-found.tsx` y `error.tsx` personalizados.
- [x] **3.16** JSON-LD (`ItemList` en la colección, `Article` en artículos).
- [x] **3.17** Auditoría a11y: foco visible, contraste, "saltar al contenido", orden de tabla, `aria-live` en resultados.
- [ ] **3.18** Tests: Vitest (funciones de datos/búsqueda) + Playwright (home, `/placas`) + CI en GitHub Actions.

---

## Fase 4 — Despliegue y operación  `[~]`

- [~] **4.19** Desplegar (Vercel o self-host) + dominio y `metadataBase` real. *Desplegado en Vercel (oct. 2026); pendiente `NEXT_PUBLIC_SITE_URL` en el panel y dominio propio.*
- [ ] **4.20** Limpieza: SVG de create-next-app, `doc/serials.xls` (0 bytes), README boilerplate y `Readme.txt` duplicado.
- [x] **4.21** `data-scroll-behavior="smooth"` en `<html>` (elimina warning de Next 16).

---

## Fase 5 — Escalado (cuando la colección crezca)  `[ ]`

- [ ] **5.22** Migrar `db/*.json` a base de datos o CMS (hoy los JSON viajan en el bundle del cliente).
- [ ] **5.23** Panel de administración para dar de alta equipos y seriales sin editar JSON.

---

## Decisiones de diseño

- **Estado en la URL** (Fase 2): se sincroniza con `history.replaceState` desde componentes cliente (hook `useUrlState`), sin `useSearchParams`, para que la home siga prerenderizada íntegra (SEO) y no aparezcan avisos de Suspense. El filtrado sigue en cliente porque los datos ya viajan en el bundle; el filtrado en servidor se hará al migrar a BD (Fase 5).
- **Next 16 / Cache Components**: las fichas dinámicas usan `generateStaticParams` y `export const instant = false` (son estáticas; se descarta la validación de navegación instantánea).
- **Búsqueda**: `searchAll()` en `app/lib/search.ts` cubre hardware, software, artículos, desarrollos y serials.
- **Relación máquina↔juegos**: por `Machine.platforms: string[]` (no por nombre), con `machinePlatforms()` y `gamesForMachine()`.

## Convenciones Next 16 (no usar el Next "de siempre")

- Tipos de props: `PageProps<"/ruta/[id]">`, `LayoutProps<"/">`, `RouteContext<"/api/x/[id]">`.
- `params` y `searchParams` son `Promise`: hay que `await`-earlos.
- `cacheComponents: true`: datos sin `"use cache"` no se pueden prerenderizar en rutas estáticas.
- Para forzar render dinámico usar `connection()`, no `export const dynamic`.
- Consultar `node_modules/next/dist/docs/` antes de escribir código nuevo.
