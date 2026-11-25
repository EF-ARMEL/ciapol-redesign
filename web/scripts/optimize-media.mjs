// Optimise les images de public/media EN PLACE (même nom, même format) :
// redimensionne au-delà de 1800 px de large, ré-encode JPEG/PNG/WebP.
// Les originaux restent disponibles sur ciapol.ci (sourceUrl de chaque contenu).
// Usage : node scripts/optimize-media.mjs [dossier]   (défaut : public/media)
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.argv[2] ?? "public/media");
const MAX_W = 1800;
const exts = new Set([".jpg", ".jpeg", ".png", ".webp"]);
let before = 0, after = 0, count = 0, skipped = 0;

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (exts.has(path.extname(e.name).toLowerCase())) yield p;
  }
}

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  const input = await fs.readFile(file);
  before += input.length;
  let img = sharp(input, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  if (meta.width && meta.width > MAX_W) img = img.resize({ width: MAX_W, withoutEnlargement: true });
  let out;
  if (ext === ".png") out = await img.png({ compressionLevel: 9, palette: (meta.width ?? 0) < 1200, quality: 82 }).toBuffer();
  else if (ext === ".webp") out = await img.webp({ quality: 78 }).toBuffer();
  else out = await img.jpeg({ quality: 76, progressive: true, mozjpeg: true }).toBuffer();
  if (out.length < input.length * 0.97) {
    await fs.writeFile(file, out);
    after += out.length;
    count++;
  } else {
    after += input.length;
    skipped++;
  }
}

const files = [];
for await (const f of walk(ROOT)) files.push(f);
const CONC = 4;
for (let i = 0; i < files.length; i += CONC) {
  await Promise.all(files.slice(i, i + CONC).map((f) => optimize(f).catch((e) => console.warn("échec", f, e.message))));
  if (i % 200 === 0) process.stdout.write(`\r${i}/${files.length}`);
}
const mb = (n) => (n / 1048576).toFixed(1) + " Mo";
console.log(`\n${files.length} images · optimisées ${count} · inchangées ${skipped} · ${mb(before)} → ${mb(after)}`);
