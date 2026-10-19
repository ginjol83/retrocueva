import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "db", "gameboy");

const decodeXml = (value) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, "&");

function readZip(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("ZIP: EOCD no encontrado");
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const files = new Map();
  for (let i = 0; i < count; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("ZIP: entrada de directorio central inválida");
    }
    const method = buffer.readUInt16LE(offset + 10);
    const compSize = buffer.readUInt32LE(offset + 20);
    const nameLen = buffer.readUInt16LE(offset + 28);
    const extraLen = buffer.readUInt16LE(offset + 30);
    const commentLen = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLen);
    const localNameLen = buffer.readUInt16LE(localOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLen + localExtraLen;
    const data = buffer.subarray(dataStart, dataStart + compSize);
    files.set(name, method === 8 ? inflateRawSync(data) : Buffer.from(data));
    offset += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

function parseXlsx(path) {
  const files = readZip(readFileSync(path));
  const shared = [];
  const sharedXml = files.get("xl/sharedStrings.xml");
  if (sharedXml) {
    const xml = sharedXml.toString("utf8");
    for (const si of xml.match(/<si>[\s\S]*?<\/si>/g) ?? []) {
      const texts = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) =>
        decodeXml(m[1]),
      );
      shared.push(texts.join(""));
    }
  }
  const sheetXml = files.get("xl/worksheets/sheet1.xml").toString("utf8");
  const rows = [];
  for (const row of sheetXml.match(/<row[^>]*>[\s\S]*?<\/row>/g) ?? []) {
    const cells = [];
    for (const cell of row.match(/<c\s([^>]*?)(?:\/>|>[\s\S]*?<\/c>)/g) ?? []) {
      const attrs = cell.match(/<c\s([^>]*?)(?:\/>|>)/)?.[1] ?? "";
      const col = attrs.match(/r="([A-Z]+)\d+"/)?.[1];
      const type = attrs.match(/t="([^"]+)"/)?.[1] ?? "";
      const value = cell.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
      if (col) cells.push({ col, value: type === "s" ? (shared[Number(value)] ?? "") : value });
    }
    const arr = [];
    for (const cell of cells) {
      let index = 0;
      for (const ch of cell.col) index = index * 26 + (ch.charCodeAt(0) - 64);
      arr[index - 1] = cell.value;
    }
    rows.push(arr);
  }
  return rows;
}

const colIndex = (value, index) => (value?.[index] ?? "").trim();

const ranges = JSON.parse(readFileSync(join(root, "doc", "bd (1).json"), "utf8")).map(
  (row) => ({
    serialChar: row.serial_char,
    serialIni: row.serial_ini,
    serialEnd: row.serial_end,
    mainboard: row.mainboard,
    cpu: row.cpu,
    vram: row.vram,
    wram: row.wram,
    lcdBoard: row.lcd_board,
    powerBoard: row.power_board,
    jackBoard: row.jack_board,
    comment: row.comment,
    madeIn: row.made_in,
    screws: row.screws,
    age: row.age,
  }),
);

const unitRows = parseXlsx(join(root, "doc", "serials.xls.xlsx")).slice(1);
const units = unitRows
  .filter((row) => colIndex(row, 2))
  .map((row, index) => ({
    id: index + 1,
    model: colIndex(row, 0),
    boardRevision: colIndex(row, 1),
    serial: colIndex(row, 2),
  }));

const romRows = parseXlsx(join(root, "doc", "gb_romset_tabla_equiv.xlsx")).slice(2);
const romset = romRows
  .filter((row) => colIndex(row, 1) || colIndex(row, 2) || colIndex(row, 3))
  .map((row) => ({
    id: Number(colIndex(row, 0)) || 0,
    ntsc: colIndex(row, 1),
    pal: colIndex(row, 2),
    jp: colIndex(row, 3),
  }));

mkdirSync(outDir, { recursive: true });
const write = (name, data) => {
  writeFileSync(join(outDir, name), `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`${name}: ${data.length} registros`);
};
write("serial-ranges.json", ranges);
write("units.json", units);
write("romset.json", romset);
