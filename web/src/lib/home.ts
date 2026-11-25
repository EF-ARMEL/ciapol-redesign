import "server-only";
import { getPage } from "./content";

/* Extraction des blocs de l'accueil officiel (content/pages/accueil.md)
   pour les sections de la refonte. Rien n'est réécrit : titres, liens et
   images viennent tels quels du fichier source. */

export type Tile = { title: string; image?: string; href?: string };
export type Video = { title: string; url: string; id: string; thumb?: string };

const md = () => getPage("accueil");
const section = (name: string) => md()?.sections.find((s) => s.name === name)?.markdown ?? "";

/** Blocs « ### [Titre](lien) » ou « ### Titre » suivis d'une image. */
function tiles(src: string): Tile[] {
  const out: Tile[] = [];
  const blocks = src.split(/^###\s+/m).slice(1);
  for (const b of blocks) {
    const head = b.split("\n")[0].trim();
    const link = head.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    const title = link ? link[1] : head;
    const href = link ? link[2] : undefined;
    const img = b.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    out.push({ title, href, image: img?.[1] });
  }
  return out;
}

export function getMissions(): Tile[] {
  return tiles(section("hero-slider"));
}
export function getStructures(): Tile[] {
  return tiles(section("colonne-gauche-structures"));
}
export function getPartners(): Tile[] {
  return tiles(section("colonne-gauche-partenaires"));
}
export function getEconomies(): Tile[] {
  return tiles(section("economies"));
}

export function getHomeVideos(): Video[] {
  const src = section("colonne-gauche-videos");
  const out: Video[] = [];
  const re = /-\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)[^\n]*\n+\s*!\[[^\]]*\]\(([^)]+)\)/g;
  for (const m of src.matchAll(re)) {
    const id = m[2].match(/[?&]v=([\w-]{6,})/)?.[1] ?? m[2].split("/").pop() ?? "";
    out.push({ title: m[1], url: m[2], id, thumb: m[3] });
  }
  return out;
}

export function getPublication(): { cover?: string; pdf?: string; pages: string[] } {
  const src = section("publication");
  const imgs = [...src.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  const pdf = src.match(/\[[^\]]*\]\(([^)]+\.pdf)\)/i)?.[1];
  return { cover: imgs[0], pdf, pages: [...new Set(imgs)] };
}

export function getFacebook(): string | undefined {
  return section("reseau-social").match(/\((https?:\/\/(?:www\.)?facebook\.com[^)]*)\)/)?.[1];
}
