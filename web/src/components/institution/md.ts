import "server-only";
import { marked } from "marked";

/* Petits outils de lecture du Markdown officiel pour les pages
   institutionnelles. Les commentaires HTML (notes du scraping) sont
   toujours retirés : ils se lisent, ils ne s'affichent pas. */

export const stripComments = (md: string) => md.replace(/<!--[\s\S]*?-->/g, "").trim();

/** Markdown inline (gras, liens) → HTML, sans paragraphe englobant. */
export const inline = (md: string) => (marked.parseInline(md.trim(), { async: false }) as string);

/** Markdown bloc → HTML (contenu officiel uniquement). */
export const block = (md: string) =>
  (marked.parse(stripComments(md), { async: false }) as string).replace(/<img /g, '<img loading="lazy" decoding="async" ');

/** Paragraphes non vides d'un bloc Markdown (hors images, listes, titres). */
export function paragraphs(md: string): string[] {
  return stripComments(md)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("![") && !p.startsWith("- ") && !p.startsWith("#") && !p.startsWith("["));
}

/** Éléments de liste « - … » d'un bloc Markdown. */
export const listItems = (md: string) =>
  stripComments(md)
    .split("\n")
    .filter((l) => /^\s*-\s+/.test(l))
    .map((l) => l.replace(/^\s*-\s+/, "").trim());

/** Images « ![alt](src) » d'un bloc Markdown. */
export const images = (md: string) =>
  [...stripComments(md).matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map((m) => ({ alt: m[1], src: m[2] }));

/** Liens « [label](href) » hors images. */
export const links = (md: string) =>
  [...stripComments(md).matchAll(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => ({ label: m[1], href: m[2] }));
