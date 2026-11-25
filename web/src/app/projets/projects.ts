import "server-only";
import { NAV } from "@/lib/nav";
import { getArticleMetas, type ArticleMeta } from "@/lib/content";
import { officialSentence } from "@/components/detail/parse";
import type { Unit } from "@/components/detail/UnitIndex";
import type { Sibling } from "@/components/detail/Siblings";

export const ONE_HEALTH_ARTICLES = [
  "installation-dune-equipe-one-health-au-ciapol-quand-la-protection-de-lenvironnement-devient-un-enjeu-de-sante-publique-en-cote-divoire",
  "celebration-de-la-6eme-journee-nationale-une-seule-sante-en-cote-divoire",
];

/* Articles liés à ONE HEALTH : ceux de la catégorie officielle + ceux cités
   par la page (slugs tolérants : les slugs longs ont pu être raccourcis). */
export function getOneHealthArticles(): ArticleMeta[] {
  const metas = getArticleMetas();
  const match = (s: string) => metas.find((m) => m.slug === s || s.startsWith(m.slug) || m.slug.startsWith(s));
  const out: ArticleMeta[] = metas.filter((m) => m.categories.includes("ONE HEALTH"));
  for (const s of ONE_HEALTH_ARTICLES) {
    const m = match(s);
    if (m && !out.includes(m)) out.push(m);
  }
  return out;
}

/* Les cinq projets du menu officiel, avec une phrase officielle et une image
   issues de leur propre page. */
export function getProjects(): Unit[] {
  const nav = NAV.find((n) => n.href === "/projets/")?.children ?? [];
  const oh = getOneHealthArticles()[0];
  const extra: Record<string, Partial<Unit>> = {
    "/projets/rno/": {
      sentence: officialSentence("projets-rno", "Le Réseau National d’Observation de la qualité des eaux (RNO) est un outil"),
      img: { src: "/media/pages/projets-rno/img-1.jpg", alt: "" },
    },
    "/projets/giamsuc/": {
      sentence: officialSentence("projets-giamsuc", "Le projet GIAMSUC est une initiative majeure"),
      img: { src: "/media/pages/projets-giamsuc/dji-0679-scaled-1.jpg", alt: "" },
    },
    "/projets/one-health/": {
      sentence: oh?.title,
      img: oh?.cover ? { src: oh.cover, alt: "" } : undefined,
    },
    // La page officielle n'a pas d'image : photo de l'article officiel sur
    // l'avancement des travaux de réhabilitation des lacs de Yamoussoukro.
    "/projets/ucp-lac-yakro/": {
      img: {
        src: "/media/articles/etat-davancement-des-travaux-de-rehabilitation-des-lacs-de-yamoussoukro/329896696_699890515020566_7869837156099970463_n.jpg",
        alt: "",
      },
    },
    "/projets/ccac/": {
      sentence: officialSentence("projets-ccac", "La Coalition pour le Climat et l’Air Pur (CCAC) est un partenariat volontaire"),
      img: { src: "/media/pages/projets-ccac/abidjan-adobestock-106549160-scaled.jpeg", alt: "" },
    },
  };
  return nav.map((n) => ({ code: n.code ?? n.label, name: n.label, href: n.href, ...extra[n.href] }));
}

export function projectSiblings(current: string): Sibling[] {
  return getProjects()
    .filter((p) => p.href !== current)
    .map((p) => ({ code: p.code, text: p.name, href: p.href, img: p.img }));
}
