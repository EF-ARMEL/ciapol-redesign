/* Après `next build` (export statique) : Next écrit les fichiers de
   préchargement par segment dans des sous-dossiers
     services/cipomar/__next.services/$d$slug/__PAGE__.txt
   alors que le navigateur les demande à plat
     services/cipomar/__next.services.$d$slug.__PAGE__.txt
   Sur un hébergeur statique, chaque préchargement finit donc en 404 et chaque
   clic retélécharge la page. Ce script crée la copie au nom attendu. */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
let made = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) flatten(dir, p, [e.name]);
    else walk(p);
  }
}

function flatten(pageDir, dir, parts) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) flatten(pageDir, p, [...parts, e.name]);
    else {
      const target = path.join(pageDir, [...parts, e.name].join("."));
      if (!fs.existsSync(target)) {
        fs.copyFileSync(p, target);
        made++;
      }
    }
  }
}

if (!fs.existsSync(OUT)) {
  console.error("flatten-segments : dossier out/ absent, lancez d'abord next build.");
  process.exit(1);
}
walk(OUT);
console.log(`flatten-segments : ${made} fichier(s) de préchargement ajoutés.`);
