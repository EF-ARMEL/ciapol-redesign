import "server-only";
import { marked, type Token, type Tokens } from "marked";
import { getPage, type Page } from "@/lib/content";

/* Découpe le Markdown officiel d'une page (web/content/pages/*.md) en blocs
   typés que le gabarit « détail » sait mettre en page : titres, paragraphes,
   listes, tableaux, images. Les commentaires HTML du scraping sont lus
   (images de fond « bg: ») puis retirés : ils ne sont jamais affichés. */

export type Img = { src: string; alt: string };
export type Block =
  | { kind: "heading"; depth: number; text: string }
  | { kind: "html"; html: string; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "image"; img: Img };

export type Section = { name: string; id: string; bg: string[]; blocks: Block[]; markdown: string };
type Card = { code: string; text: string; href: string; img?: Img };

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/* Liens de l'ancien site → routes de la refonte (barre oblique finale). */
function fixHref(href: string): string {
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  const giam = href.match(/^\/projets\/giamsuc\/actualites#(.+)$/);
  if (giam) return `/projets/giamsuc/actualites/${giam[1]}/`;
  const [path, hash] = href.split("#");
  if (!path) return href;
  if (/\.[a-z0-9]{2,4}$/i.test(path)) return href; // fichier
  const p = path.endsWith("/") ? path : `${path}/`;
  return hash ? `${p}#${hash}` : p;
}

function postHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/href="([^"]+)"/g, (_, h: string) => `href="${fixHref(h)}"`)
    .replace(
      /<a href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"$2>$3<span class="sr-only"> (nouvel onglet)</span></a>',
    )
    .replace(/<img /g, '<img loading="lazy" decoding="async" ')
    .trim();
}

const md = (src: string) => postHtml(marked.parse(src, { async: false, gfm: true }) as string);
const inline = (src: string) => postHtml(marked.parseInline(src, { async: false, gfm: true }) as string);
const unwrapP = (html: string) => html.replace(/^<p>([\s\S]*?)<\/p>$/, "$1");
const stripText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/* Puce « • » saisie à la main dans le texte des listes : doublon de la puce
   de liste, retirée à l'affichage. */
const cleanBullet = (s: string) => s.replace(/^\s*•\s*/, "");

function imagesOnly(tok: Tokens.Paragraph): Img[] | null {
  const parts = (tok.tokens ?? []).filter((t) => !(t.type === "text" && !t.raw.trim()) && t.type !== "br");
  if (!parts.length || !parts.every((t) => t.type === "image")) return null;
  return parts.map((t) => ({ src: (t as Tokens.Image).href, alt: (t as Tokens.Image).text ?? "" }));
}

export function parseBlocks(markdown: string): { bg: string[]; blocks: Block[] } {
  const bg = [...markdown.matchAll(/<!--\s*bg:\s*(\S+)\s*-->/g)].map((m) => m[1]);
  const clean = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const tokens = marked.lexer(clean, { gfm: true });
  const blocks: Block[] = [];
  const walk = (list: Token[]) => {
    for (const t of list) {
      if (t.type === "space" || t.type === "html" && !t.raw.trim()) continue;
      if (t.type === "heading") {
        blocks.push({ kind: "heading", depth: t.depth, text: t.text.replace(/\*\*/g, "") });
      } else if (t.type === "paragraph") {
        const imgs = imagesOnly(t as Tokens.Paragraph);
        if (imgs) imgs.forEach((img) => blocks.push({ kind: "image", img }));
        else {
          const html = md(t.raw);
          blocks.push({ kind: "html", html, text: stripText(html) });
        }
      } else if (t.type === "list") {
        const l = t as Tokens.List;
        blocks.push({
          kind: "list",
          ordered: l.ordered,
          items: l.items.map((it) => unwrapP(md(cleanBullet(it.text)))),
        });
      } else if (t.type === "table") {
        const tb = t as Tokens.Table;
        blocks.push({
          kind: "table",
          header: tb.header.map((h) => inline(h.text)),
          rows: tb.rows.map((r) => r.map((c) => inline(c.text))),
        });
      } else if (t.type === "html") {
        // iframe éventuel (carte) : conservé tel quel.
        if (/<iframe/i.test(t.raw)) blocks.push({ kind: "html", html: t.raw.trim(), text: "" });
      } else {
        const html = md(t.raw);
        if (html) blocks.push({ kind: "html", html, text: stripText(html) });
      }
    }
  };
  walk(tokens);
  return { bg, blocks };
}

export type DetailDoc = {
  page: Page;
  code: string;
  subtitle?: string;
  heroBg?: string;
  sections: Section[];
};

/* Charge une page à sections et renvoie le modèle « détail ». */
export function loadDetail(slug: string): DetailDoc {
  const page = getPage(slug);
  if (!page) throw new Error(`Page introuvable : ${slug}`);
  const sections: Section[] = page.sections.map((s) => ({
    name: s.name,
    id: slugify(s.name),
    markdown: s.markdown,
    ...parseBlocks(s.markdown),
  }));
  const hero = sections.find((s) => s.name === "hero" || s.name === "titre");
  const hHead = hero?.blocks.filter((b): b is Extract<Block, { kind: "heading" }> => b.kind === "heading") ?? [];
  return {
    page,
    code: hHead[0]?.text ?? page.title,
    subtitle: hHead[1]?.text,
    heroBg: hero?.bg[0],
    sections: sections.filter((s) => !["hero", "titre", "bandeau-titre"].includes(s.name)),
  };
}

export const sectionOf = (doc: DetailDoc, name: string) => doc.sections.find((s) => s.name === name);

/* Cartes « call-to-action » (titre, image, description, lien). */
export function cardsOf(section?: Section): Card[] {
  if (!section) return [];
  const cards: Card[] = [];
  let cur: Card | null = null;
  for (const b of section.blocks) {
    if (b.kind === "heading" && b.depth === 2) {
      if (cur) cards.push(cur);
      cur = { code: b.text, text: "", href: "" };
    } else if (cur && b.kind === "image") cur.img = b.img;
    else if (cur && b.kind === "html") {
      const link = b.html.match(/href="([^"]+)"/);
      if (link && /EN SAVOIR/i.test(b.text)) cur.href = link[1];
      else cur.text = b.text;
    }
  }
  if (cur) cards.push(cur);
  // Le titre de la rangée (« Autres services… ») n'est pas une carte.
  return cards.filter((c) => c.href);
}

/* Premier titre d'une section + blocs restants. */
export function splitTitle(section: Section): { title?: string; depth?: number; rest: Block[] } {
  const i = section.blocks.findIndex((b) => b.kind === "heading");
  if (i < 0) return { rest: section.blocks };
  const h = section.blocks[i] as Extract<Block, { kind: "heading" }>;
  return { title: h.text, depth: h.depth, rest: section.blocks.filter((_, j) => j !== i) };
}

export const imagesIn = (blocks: Block[]) =>
  blocks.filter((b): b is Extract<Block, { kind: "image" }> => b.kind === "image").map((b) => b.img);
export const withoutImages = (blocks: Block[]) => blocks.filter((b) => b.kind !== "image");

/* Regroupe des blocs sous chaque titre de niveau donné. */
export function groupBy(blocks: Block[], depth = 3): { title: string; blocks: Block[] }[] {
  const out: { title: string; blocks: Block[] }[] = [];
  for (const b of blocks) {
    if (b.kind === "heading" && b.depth === depth) out.push({ title: b.text, blocks: [] });
    else if (out.length) out[out.length - 1].blocks.push(b);
  }
  return out;
}

/* Liste à deux niveaux (« **Milieu :** » puis sous-éléments). */
export function nestedGroups(markdown: string): { label: string; items: string[] }[] {
  const clean = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const out: { label: string; items: string[] }[] = [];
  for (const t of marked.lexer(clean, { gfm: true })) {
    if (t.type !== "list") continue;
    for (const it of (t as Tokens.List).items) {
      const sub = it.tokens.find((x): x is Tokens.List => x.type === "list");
      if (!sub) continue;
      const head = it.tokens.find((x) => x.type === "text");
      out.push({
        label: stripText(inline(head?.raw.trim() ?? "")),
        items: sub.items.map((s) => unwrapP(md(cleanBullet(s.text)))),
      });
    }
  }
  return out;
}

/* Une phrase officielle exacte, vérifiée au build (jamais de texte inventé). */
export function officialSentence(slug: string, startsWith: string): string {
  const page = getPage(slug);
  const text = (page?.markdown ?? "").replace(/<!--[\s\S]*?-->/g, "").replace(/\*\*/g, "");
  const i = text.indexOf(startsWith);
  if (i < 0) throw new Error(`Phrase officielle introuvable dans ${slug} : ${startsWith}`);
  const rest = text.slice(i);
  const end = rest.search(/(?<=[.;:])\s|\n/);
  return (end < 0 ? rest : rest.slice(0, end)).replace(/\s*[;:]$/, "").trim();
}
