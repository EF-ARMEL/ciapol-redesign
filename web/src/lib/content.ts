import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/* Lecture du contenu officiel récupéré sur ciapol.ci (web/content).
   Exécuté uniquement au build (export statique) : aucune requête en ligne. */

const ROOT = path.join(process.cwd(), "content");

export type ArticleDoc = { label: string; url: string };

export type Article = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  author?: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  cover?: string;
  images: string[];
  videos: string[];
  documents: ArticleDoc[];
  sourceUrl?: string;
  html: string;
  readingMinutes: number;
};

export type ArticleMeta = Omit<Article, "html">;

export type Page = {
  slug: string;
  title: string;
  route?: string;
  description?: string;
  sourceUrl?: string;
  images: string[];
  data: Record<string, unknown>;
  markdown: string;
  html: string;
  sections: { name: string; markdown: string; html: string }[];
};

marked.setOptions({ gfm: true, breaks: false });

/* Liens internes de l'ancien site → routes de la refonte. */
const ROUTE_MAP: [RegExp, string][] = [
  [/^https?:\/\/(www\.)?ciapol\.ci\/?$/i, "/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/presentation\/?$/i, "/presentation/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/services\/?$/i, "/services/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/(cipomar|lce|unipol|sdiic|sdgsp-vae)\/?$/i, "/services/$2/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/rno\/?$/i, "/projets/rno/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/ucp-lac-yakro\/?$/i, "/projets/ucp-lac-yakro/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/ciapol\/?$/i, "/projets/ccac/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/qualite-de-lair\/?$/i, "/qualite-de-lair/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/contactez-nous\/?$/i, "/contact/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/gallerie\/?$/i, "/galerie/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/nos-articles\/?$/i, "/actualites/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/decret-de-creation\/?$/i, "/decret-de-creation/"],
  [/^https?:\/\/(www\.)?ciapol\.ci\/(le-)?mot-du-directeur(-2)?\/?$/i, "/mot-du-directeur/"],
];

function mapHref(href: string, articleSlugs: Set<string>, originalToSlug: Map<string, string>): string {
  for (const [re, to] of ROUTE_MAP) if (re.test(href)) return href.replace(re, to);
  const m = href.match(/^https?:\/\/(www\.)?ciapol\.ci\/([^/?#]+)\/?$/i);
  if (m) {
    const raw = decodeURIComponent(m[2]);
    const slug = originalToSlug.get(raw) ?? raw;
    if (articleSlugs.has(slug)) return `/actualites/${slug}/`;
  }
  return href;
}

/* Cache invalidé par une signature (nombre de fichiers + date de modification
   la plus récente) : en développement le contenu reste à jour sans relire
   les 130 articles à chaque rendu ; au build tout est lu une seule fois. */
type Raw = { file: string; data: Record<string, unknown>; content: string };
let _raw: { sig: string; list: Raw[] } | null = null;
let _derived: { sig: string; slugs: Set<string>; orig: Map<string, string> } | null = null;
let _articles: { sig: string; list: Article[] } | null = null;

const PROD = process.env.NODE_ENV === "production";

function signature(dir: string): string {
  if (!fs.existsSync(dir)) return "0";
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  if (PROD) return String(files.length);
  let max = 0;
  for (const f of files) max = Math.max(max, fs.statSync(path.join(dir, f)).mtimeMs);
  return `${files.length}:${max}`;
}

function articlesSig(): string {
  if (PROD && _raw) return _raw.sig;
  return signature(path.join(ROOT, "articles"));
}

function readArticlesRaw(): Raw[] {
  const sig = articlesSig();
  if (_raw && _raw.sig === sig) return _raw.list;
  const dir = path.join(ROOT, "articles");
  const list = !fs.existsSync(dir)
    ? []
    : fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => {
          const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
          return { file: f, data, content };
        });
  _raw = { sig, list };
  return list;
}

function linkMaps() {
  const raw = readArticlesRaw();
  const sig = _raw!.sig;
  if (_derived && _derived.sig === sig) return _derived;
  const slugs = new Set<string>();
  const orig = new Map<string, string>();
  for (const a of raw) {
    const slug = String(a.data.slug ?? a.file.replace(/\.md$/, ""));
    slugs.add(slug);
    if (a.data.originalSlug) orig.set(String(a.data.originalSlug), slug);
    orig.set(slug, slug);
  }
  _derived = { sig, slugs, orig };
  return _derived;
}

function toISO(d: unknown): string {
  if (!d) return "1970-01-01T00:00:00Z";
  const date = d instanceof Date ? d : new Date(String(d));
  return isNaN(date.getTime()) ? "1970-01-01T00:00:00Z" : date.toISOString();
}

function renderMarkdown(md: string): string {
  const { slugs, orig } = linkMaps();
  let html = marked.parse(md, { async: false }) as string;
  html = html.replace(/href="([^"]+)"/g, (_, h: string) => `href="${mapHref(h, slugs, orig)}"`);
  // Liens externes : nouvel onglet, sans fuite de référent.
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  // Images : chargement différé.
  html = html.replace(/<img /g, '<img loading="lazy" decoding="async" ');
  return html;
}

export function getArticles(): Article[] {
  const raw = readArticlesRaw();
  const sig = _raw!.sig;
  if (_articles && _articles.sig === sig) return _articles.list;
  const list = raw
    .map(({ file, data, content }) => {
      const text = content.replace(/[#>*_`!\[\]\(\)-]/g, " ");
      const words = text.split(/\s+/).filter(Boolean).length;
      return {
        slug: String(data.slug ?? file.replace(/\.md$/, "")),
        title: String(data.title ?? "Sans titre"),
        date: toISO(data.date),
        updated: data.updated ? toISO(data.updated) : undefined,
        author: data.author ? String(data.author) : undefined,
        categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        excerpt: String(data.excerpt ?? ""),
        cover: data.cover ? String(data.cover) : undefined,
        images: Array.isArray(data.images) ? data.images.map(String) : [],
        videos: Array.isArray(data.videos) ? data.videos.map(String) : [],
        documents: Array.isArray(data.documents) ? (data.documents as ArticleDoc[]) : [],
        sourceUrl: data.sourceUrl ? String(data.sourceUrl) : undefined,
        html: renderMarkdown(content),
        readingMinutes: Math.max(1, Math.round(words / 220)),
      } satisfies Article;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  _articles = { sig, list };
  return list;
}

export function getArticleMetas(): ArticleMeta[] {
  return getArticles().map(({ html: _html, ...meta }) => meta);
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const a of getArticles()) for (const c of a.categories) map.set(c, (map.get(c) ?? 0) + 1);
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

/* ------------------------------------------------------------- PAGES */
const _pages = new Map<string, { sig: string; page: Page }>();

export function getPage(slug: string): Page | undefined {
  const file = path.join(ROOT, "pages", `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const sig = `${PROD ? 0 : fs.statSync(file).mtimeMs}|${articlesSig()}`;
  const hit = _pages.get(slug);
  if (hit && hit.sig === sig) return hit.page;
  const page = readPage(slug, file);
  _pages.set(slug, { sig, page });
  return page;
}

function readPage(slug: string, file: string): Page {
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const sections: Page["sections"] = [];
  const re = /<!--\s*section:\s*([^>]+?)\s*-->/g;
  const marks = [...content.matchAll(re)];
  marks.forEach((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index ?? content.length : content.length;
    const md = content.slice(start, end).trim();
    sections.push({ name: m[1], markdown: md, html: renderMarkdown(md) });
  });
  return {
    slug,
    title: String(data.title ?? slug),
    route: data.route ? String(data.route) : undefined,
    description: data.description ? String(data.description) : undefined,
    sourceUrl: data.sourceUrl ? String(data.sourceUrl) : undefined,
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    data,
    markdown: content,
    html: renderMarkdown(content),
    sections,
  };
}

export function listPages(): string[] {
  const dir = path.join(ROOT, "pages");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

/* ------------------------------------------------------------- SITE */
export function getSite<T = Record<string, unknown>>(): T {
  const file = path.join(ROOT, "site.json");
  if (!fs.existsSync(file)) return {} as T;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" }) =>
  new Intl.DateTimeFormat("fr-FR", opts).format(new Date(iso));
