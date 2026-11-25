/* Utilitaires d'affichage des actualités (sans dépendance serveur :
   utilisables côté client comme dans les page.tsx). */

/** Libellés publics des catégories WordPress de l'ancien site. */
const CATEGORY_LABELS: Record<string, string> = {
  Vedette: "À la une",
  "Non classé": "Actualités",
};

export const categoryLabel = (c: string) => CATEGORY_LABELS[c] ?? c;

/** Catégories « éditoriales » (hors fourre-tout), dans l'ordre d'affichage :
    la catégorie thématique d'abord, « À la une » ensuite. */
export function displayCategories(cats: string[]): string[] {
  const specific = cats.filter((c) => c !== "Vedette" && c !== "Non classé");
  const out = [...specific];
  if (cats.includes("Vedette")) out.push("Vedette");
  return out;
}

/** Normalisation pour la recherche : minuscules, sans accents ni apostrophes typographiques. */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`]/g, "'")
    .toLowerCase();

/** Identifiant YouTube d'une URL (watch, youtu.be, embed, shorts, live). */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return clean(u.pathname.slice(1));
    if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return clean(v);
      const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([^/?#]+)/);
      if (m) return clean(m[2]);
    }
  } catch {
    /* URL invalide */
  }
  return null;
}
const clean = (id: string) => (/^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null);

export const fmtDate = (iso: string, month: "long" | "short" = "long") =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month, year: "numeric" }).format(new Date(iso));

/** Nom lisible d'un hôte pour les liens vidéo non YouTube. */
export function hostLabel(url: string): string {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    if (h.includes("facebook")) return "Facebook";
    if (h.includes("vimeo")) return "Vimeo";
    return h;
  } catch {
    return "lien externe";
  }
}
