/* Serveur statique minimal pour les tests : sert out/ comme Vercel
   (dossier -> index.html, sinon 404.html). Aucune dépendance. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = Number(process.env.PORT ?? 3100);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    let status = 200;
    if (!fs.existsSync(file)) {
      status = 404;
      file = path.join(ROOT, "404.html");
    }
    res.writeHead(status, { "content-type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`out/ servi sur http://localhost:${PORT}`));
