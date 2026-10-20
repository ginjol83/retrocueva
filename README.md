# RETROCUEVA

Web personal sobre **informática retro**: la colección física de Andrés Giménez documentada ficha a ficha (número de serie, estado, especificaciones y ubicación), más una base de datos de Game Boy DMG y proyectos de desarrollo de 8 bits.

En producción: <https://retrocueva.vercel.app> · Repo: `ginjol83/retrocueva`

## Stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents`, `partialPrefetching`) + **React 19**
- **TypeScript** estricto · **Tailwind CSS 4** (configuración vía CSS, sin `tailwind.config`)
- Datos en **JSON** (`db/`) importados como módulos — sin base de datos externa
- Despliegue en **Vercel** (cada push a `main` redespliega)

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run lint       # ESLint (flat config)
```

Copia `.env.example` a `.env.local` (o define la variable en Vercel):

```
NEXT_PUBLIC_SITE_URL=https://retrocueva.vercel.app
```

## Estructura

```
app/                  # App Router
├── components/       # SiteHeader, SiteFooter, PageShell, home/*, gameboy/*
├── lib/              # data.ts, gameboy.ts, search.ts, collection.ts, site.ts…
├── api/              # API REST de solo lectura (?q=, ?page=, ?perPage=)
├── base-de-datos/    # Hub GB: placas, juegos (romset), unidades, enviar-serial
├── maquinas/         # Colección de hardware + fichas [id]
├── articulos/        # Artículos + fichas [id]
└── …                 # coleccion, juegos, videos, samaruc, desarrollos, quienes-somos
db/                   # Datos JSON (machines, games, articles, gameboy/*…)
doc/                  # Fuentes de datos (XLSX, JSON) para regenerar db/
public/               # Imágenes de la colección
scripts/              # Importadores desde doc/
```

## Regenerar datos de Game Boy

Los datos de `db/gameboy/` se regeneran desde `doc/`:

```bash
npm run import:gb          # serial-ranges.json, units.json, romset.json (+ counts.json)
npm run import:gb:images   # images.json (carátulas/capturas desde libretro-thumbnails)
```

## API

`GET /api/{games,machines,serials,articles,videos,developed}` con detalle en `/api/.../[id]`, y `GET /api/gameboy/{romset,serials}`. Listados con `?q=` (búsqueda), `?page=` / `?perPage=` (máx. 100) y cabeceras `Cache-Control`.

## Notas de arquitectura

- El estado de los filtros vive en la URL (`useUrlState`, sin `useSearchParams`) para mantener la home prerenderizada.
- Las fichas dinámicas usan `generateStaticParams` + `export const instant = false` (convención Next 16 con `cacheComponents`).
- El recuento del romset/unidades se sirve desde `db/gameboy/counts.json` para no arrastrar los 1002 registros al bundle del cliente.
- Ver `ROADMAP.md` para el estado y los pasos pendientes.
