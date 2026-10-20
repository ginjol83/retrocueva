// Comprime y redimensiona las imágenes de public/ en sitio.
// Uso: node scripts/compress-images.mjs
// Los originales quedan en el historial de git si necesitas revertir.
import { readFile, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const MAX_WIDTH = 1600;

// JPG grandes de la colección → redimensionar y recomprimir en sitio.
const jpgs = [
  "public/Juegos/GB_DMG/Space_invaders_JAP.jpg",
  "public/Juegos/GB_DMG/RType_JAP.jpg",
  "public/Juegos/GB_DMG/Lunar_Lander_JAP.jpg",
  "public/Ordenadores/486_PORTATIL.jpg",
  "public/microordenadores/Thompson_MO5.jpg",
  "public/microordenadores/CASIO_MX.jpg",
];

// PNG pesados → convertir a JPG (actualiza db/articles.json y borra el PNG).
const pngToJpg = [
  "public/articulos/broken-sword/image1.png",
  "public/articulos/broken-sword/image2.png",
  "public/articulos/broken-sword/image3.png",
];

// PNG que se quedan en PNG (logos) → solo redimensionar/comprimir.
const pngs = [{ file: "public/samaruc/favicon.png", width: 512 }];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function compressJpg(relPath) {
  const path = join(root, relPath);
  const before = (await readFile(path)).length;
  const tmp = `${path}.tmp`;
  await sharp(path)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(tmp);
  await rm(path);
  await rename(tmp, path);
  const after = (await readFile(path)).length;
  console.log(`${relPath}: ${kb(before)} → ${kb(after)}`);
}

async function convertPngToJpg(relPath) {
  const src = join(root, relPath);
  const dest = src.replace(/\.png$/, ".jpg");
  const before = (await readFile(src)).length;
  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(dest);
  await rm(src);
  const after = (await readFile(dest)).length;
  console.log(`${relPath} → .jpg: ${kb(before)} → ${kb(after)}`);
}

async function compressPng(relPath, width) {
  const path = join(root, relPath);
  const before = (await readFile(path)).length;
  const tmp = `${path}.tmp`;
  await sharp(path)
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(tmp);
  await rm(path);
  await rename(tmp, path);
  const after = (await readFile(path)).length;
  console.log(`${relPath}: ${kb(before)} → ${kb(after)}`);
}

for (const file of jpgs) await compressJpg(file);
for (const file of pngToJpg) await convertPngToJpg(file);
for (const { file, width } of pngs) await compressPng(file, width);

// Actualiza las referencias en db/articles.json (.png → .jpg).
const articlesPath = join(root, "db", "articles.json");
const articles = JSON.stringify(
  JSON.parse(await readFile(articlesPath, "utf8")),
  null,
  2,
);
const updated = articles.replace(
  /\/articulos\/broken-sword\/image([123])\.png/g,
  "/articulos/broken-sword/image$1.jpg",
);
if (updated !== articles) {
  await writeFile(articlesPath, `${updated}\n`, "utf8");
  console.log("db/articles.json: referencias .png → .jpg actualizadas");
}
