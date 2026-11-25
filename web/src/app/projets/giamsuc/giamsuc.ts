import "server-only";
import { getPage } from "@/lib/content";
import { parseBlocks, type Block, type Img } from "@/components/detail/parse";

/* Données du sous-site GIAMSUC (giamsuc.ciapol.ci), reconstitué via son API
   publique : pages, articles publiés et navigation locale. */

export const GIAMSUC_TABS = [
  { href: "/projets/giamsuc/", label: "Accueil" },
  { href: "/projets/giamsuc/a-propos/", label: "A-propos" },
  { href: "/projets/giamsuc/activites/", label: "Activités" },
  { href: "/projets/giamsuc/actualites/", label: "Actualités" },
  { href: "/projets/giamsuc/organes/", label: "Organes" },
  { href: "/projets/giamsuc/mediatheque/", label: "Médiathèques" },
  { href: "/projets/giamsuc/rapports-d-activite/", label: "Rapports d’activités" },
  { href: "/projets/giamsuc/contact/", label: "Contact" },
];

export const GIAMSUC_LOGO: Img = { src: "/media/pages/projets-giamsuc/logo-giamsuc.png", alt: "Logo GIAMSUC" };
export const GIAMSUC_NAME = "Gestion Intégrée de l’Aire Marine et Côtière du Sud - Comoé";

export type GiamsucPost = {
  slug: string;
  title: string;
  date: string;
  sourceUrl?: string;
  excerpt?: string;
  cover?: Img;
  body: Block[];
  gallery: Img[];
};

let _posts: GiamsucPost[] | null = null;

export function getGiamsucPosts(): GiamsucPost[] {
  if (_posts) return _posts;
  const page = getPage("projets-giamsuc-actualites");
  if (!page) return [];
  _posts = page.sections
    .filter((s) => s.name.startsWith("article "))
    .map((s) => {
      const slug = s.name.slice("article ".length).trim();
      const src = s.markdown.match(/Source\s*:\s*(\S+)\s.*?publié le (\d{4}-\d{2}-\d{2}T[\d:]+)/);
      const { blocks } = parseBlocks(s.markdown);
      const h = blocks.find((b): b is Extract<Block, { kind: "heading" }> => b.kind === "heading");
      let rest = blocks.filter((b) => b !== h);
      const ex = rest.find((b): b is Extract<Block, { kind: "html" }> => b.kind === "html" && b.text.startsWith("Extrait :"));
      rest = rest.filter((b) => b !== ex);
      // Images de fin d'article : galerie.
      const gallery: Img[] = [];
      while (rest.length && rest[rest.length - 1].kind === "image") {
        gallery.unshift((rest.pop() as Extract<Block, { kind: "image" }>).img);
      }
      const firstImg = blocks.find((b): b is Extract<Block, { kind: "image" }> => b.kind === "image")?.img;
      return {
        slug,
        title: h?.text ?? slug,
        date: src?.[2] ?? "",
        sourceUrl: src?.[1],
        excerpt: ex?.text.replace(/^Extrait\s*:\s*/, ""),
        cover: firstImg,
        body: rest,
        gallery,
      };
    });
  return _posts;
}

export const formatFr = (iso: string) =>
  iso ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "";

/* Page simple du sous-site : blocs (sans commentaires) + images de fond. */
export function giamsucPage(slug: string) {
  const page = getPage(slug);
  if (!page) throw new Error(`Page introuvable : ${slug}`);
  return { page, ...parseBlocks(page.markdown) };
}

/* Découpe en rubriques : un libellé « GIAMSUC » / « PROJET » isolé avant un
   titre h2 devient le repère (eyebrow) de cette rubrique. */
export type Rubrique = { kicker?: string; title?: string; blocks: Block[] };
export function rubriques(blocks: Block[]): Rubrique[] {
  const out: Rubrique[] = [];
  let pendingKicker: string[] = [];
  let cur: Rubrique | null = null;
  for (const b of blocks) {
    if (b.kind === "html" && /^(GIAMSUC|PROJET)$/.test(b.text)) {
      pendingKicker.push(b.text);
      continue;
    }
    if (b.kind === "heading" && b.depth === 2) {
      cur = { kicker: pendingKicker.join(" · ") || undefined, title: b.text, blocks: [] };
      pendingKicker = [];
      out.push(cur);
      continue;
    }
    if (b.kind === "heading" && b.depth === 1) continue;
    if (!cur) {
      cur = { blocks: [] };
      out.push(cur);
    }
    cur.blocks.push(b);
  }
  return out;
}
