#!/usr/bin/env node
/**
 * Importa carátulas y capturas del romset de Game Boy desde el proyecto
 * libretro/libretro-thumbnails (vía GitHub API para listar y CDN jsDelivr
 * para servir) y genera db/gameboy/images.json emparejando por título.
 *
 * Uso: npm run import:gb:images
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const API = "https://api.github.com";
// Commit congelado de libretro/libretro-thumbnails (rama master): así una
// eventual renombrada upstream no rompe las 1600+ URLs del CDN de golpe.
// Actualizar solo con cuidado: verificar antes que las rutas siguen existiendo.
const LIBRETRO_SHA = "5e5b12fa7bb0f98e98aa4d0dffb784735639ea84";
const CDN = `https://cdn.jsdelivr.net/gh/libretro/libretro-thumbnails@${LIBRETRO_SHA}`;
const SYSTEM_DIR = "Nintendo - Game Boy";
const FOLDERS = ["Named_Boxarts", "Named_Snaps"];

const stripAccents = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

async function gh(pathname) {
  const response = await fetch(`${API}${pathname}`, {
    headers: {
      "User-Agent": "retrocueva-import",
      Accept: "application/vnd.github+json",
    },
  });
  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    throw new Error(
      `GitHub API ${response.status} en ${pathname} (rate remaining: ${remaining})`,
    );
  }
  return response.json();
}

const STOPWORDS = new Set([
  "the",
  "of",
  "a",
  "an",
  "and",
  "at",
  "to",
  "in",
  "for",
  "on",
  "vs",
]);

const FILLER = new Set(["version", "versions", "rev", "revision"]);

function normalizeTokens(title) {
  return stripAccents(title)
    .toLowerCase()
    .replace(/\.png$/i, "")
    .replace(/&/g, " and ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOPWORDS.has(token) && !FILLER.has(token));
}

/**
 * 1 = mismos tokens en el mismo orden;
 * 0.98 = mismos tokens sin espacios ("Duck Tales" vs "DuckTales");
 * 0.88 = nuestros tokens están en el archivo (el archivo añade subtítulo);
 * 0.86 = los del archivo están en los nuestros (nuestro título es más largo).
 */
function scoreTokens(ours, file) {
  if (ours.length === 0 || file.length === 0) return 0;
  const a = ours.join(" ");
  const b = file.join(" ");
  if (a === b) return 1;
  if (ours.join("") === file.join("")) return 0.98;
  const setOurs = new Set(ours);
  const setFile = new Set(file);
  if (ours.length >= 2 && ours.every((token) => setFile.has(token))) {
    return 0.88;
  }
  if (file.length >= 2 && file.every((token) => setOurs.has(token))) {
    return 0.86;
  }
  return 0;
}

function regionOf(fileName) {
  const tags = [...fileName.matchAll(/\(([^)]*)\)/g)].map((match) =>
    match[1].toLowerCase(),
  );
  const has = (needle) =>
    tags.some((tag) => tag.split(",").some((t) => t.trim() === needle));
  if (has("world")) return "world";
  const usa = has("usa") || has("canada");
  const eur =
    has("europe") ||
    ["france", "germany", "spain", "italy", "netherlands", "portugal"].some(
      (country) => has(country),
    );
  const jp = has("japan");
  if (usa && eur) return "usa-eur";
  if (usa) return "usa";
  if (eur) return "eur";
  if (jp) return "jp";
  return "multi";
}

const REGION_LABELS = {
  world: "Mundial",
  usa: "USA",
  eur: "Europa",
  "usa-eur": "USA + Europa",
  jp: "Japón",
  multi: "Multi",
};

async function listFolder(folder) {
  const parent = await gh(
    `/repos/libretro/libretro-thumbnails/contents/${encodeURIComponent(SYSTEM_DIR)}`,
  );
  const entry = parent.find((item) => item.name === folder);
  if (!entry) throw new Error(`No existe la carpeta ${folder}`);
  const tree = await gh(
    `/repos/libretro/libretro-thumbnails/git/trees/${entry.sha}`,
  );
  return tree.tree
    .filter((node) => node.type === "blob" && node.path.endsWith(".png"))
    .map((node) => node.path);
}

const cdnUrl = (folder, file) =>
  `${CDN}/${encodeURIComponent(SYSTEM_DIR)}/${folder}/${file.replace(/ /g, "%20")}`;

function choosePhase(matches) {
  const phases = [
    matches.filter((m) => m.score >= 0.98),
    matches.filter((m) => m.score >= 0.88),
    matches.filter((m) => m.score >= 0.86),
  ];
  return phases.find((phase) => phase.length > 0) ?? [];
}

function bestMatches(files, titles, folder) {
  const found = [];
  for (const file of files) {
    const fileTokens = normalizeTokens(file);
    const region = regionOf(file);
    let best = { score: 0, title: null };
    for (const title of titles) {
      const score = scoreTokens(normalizeTokens(title), fileTokens);
      if (score > best.score) best = { score, title };
    }
    if (best.score >= 0.86) {
      found.push({
        region,
        regionLabel: REGION_LABELS[region] ?? region,
        url: cdnUrl(folder, file),
        file,
        title: best.title,
        score: best.score,
      });
    }
  }
  return choosePhase(found.sort((a, b) => b.score - a.score));
}

const REGION_RANK = ["usa-eur", "world", "usa", "eur", "jp", "multi"];

function pickDistinct(matches, limit, relax = true) {
  const ordered = [...matches].sort(
    (a, b) =>
      b.score - a.score ||
      REGION_RANK.indexOf(a.region) - REGION_RANK.indexOf(b.region),
  );
  const picked = [];
  const usedRegions = new Set();
  for (const match of ordered) {
    if (picked.length >= limit) break;
    if (usedRegions.has(match.region)) continue;
    usedRegions.add(match.region);
    picked.push(match);
  }
  if (relax) {
    for (const match of ordered) {
      if (picked.length >= limit) break;
      if (!picked.includes(match)) picked.push(match);
    }
  }
  return picked;
}

async function main() {
  const romset = JSON.parse(
    await readFile(path.join(ROOT, "db/gameboy/romset.json"), "utf8"),
  );

  const folders = {};
  for (const folder of FOLDERS) {
    process.stdout.write(`Listando ${folder}… `);
    folders[folder] = await listFolder(folder);
    console.log(`${folders[folder].length} archivos`);
  }

  const games = {};
  const stats = { entries: romset.length, withCover: 0, withSnaps: 0 };
  const unmatched = [];

  for (const entry of romset) {
    const titles = [entry.ntsc, entry.pal, entry.jp].filter(
      (title) => !/^no sali/i.test(title.trim()),
    );
    const covers = pickDistinct(
      bestMatches(folders["Named_Boxarts"], titles, "Named_Boxarts"),
      3,
      false,
    );
    const snaps = pickDistinct(
      bestMatches(folders["Named_Snaps"], titles, "Named_Snaps"),
      3,
    );
    const slim = (assets) =>
      assets.map(({ region, regionLabel, url }) => ({ region, regionLabel, url }));
    if (covers.length > 0 || snaps.length > 0) {
      games[String(entry.id)] = {
        ...(covers.length > 0 && { covers: slim(covers) }),
        ...(snaps.length > 0 && { snaps: slim(snaps) }),
      };
    }
    if (covers.length > 0) stats.withCover += 1;
    if (snaps.length > 0) stats.withSnaps += 1;
    if (covers.length === 0 && snaps.length === 0) unmatched.push(entry);
  }

  const output = {
    generated: new Date().toISOString().slice(0, 10),
    source:
      "libretro/libretro-thumbnails (Named_Boxarts y Named_Snaps) servido desde cdn.jsdelivr.net",
    coverage: stats,
    games,
  };

  await writeFile(
    path.join(ROOT, "db/gameboy/images.json"),
    `${JSON.stringify(output, null, 2)}\n`,
  );

  console.log(
    `\nCoverage: ${stats.withCover}/${stats.entries} con carátula ` +
      `(${((stats.withCover / stats.entries) * 100).toFixed(1)}%), ` +
      `${stats.withSnaps}/${stats.entries} con capturas ` +
      `(${((stats.withSnaps / stats.entries) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Escrito db/gameboy/images.json (${Object.keys(games).length} juegos con imagen)`,
  );
  if (unmatched.length > 0) {
    console.log(`\nSin imagen (${unmatched.length}), primeros 30:`);
    for (const entry of unmatched.slice(0, 30)) {
      console.log(
        `  #${entry.id} · ${entry.ntsc} | ${entry.pal} | ${entry.jp}`,
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
