/* Préparation du corps d'article (serveur) : les photos de reportage que
   l'ancien site empilait dans le texte sont regroupées dans la galerie
   (aucune image n'est supprimée : elles sont toutes présentes dans
   la galerie et la visionneuse). Si le texte seul serait vide (affiche,
   communiqué en image), le corps est laissé tel quel. */

const IMG_ONLY_P = /<p>((?:\s*<img\b[^>]*>\s*(?:<br\s*\/?>)?\s*)+)<\/p>/g;
const SRC = /src="([^"]+)"/g;

export function prepareBody(html: string, images: string[], cover?: string) {
  const pool = new Set(images);
  const inBody = (src: string) => html.includes(`src="${src}"`);
  const notInBody = images.filter((s) => !inBody(s));

  const stripped = html.replace(IMG_ONLY_P, (whole, inner: string) => {
    const srcs = [...inner.matchAll(SRC)].map((m) => m[1]);
    return srcs.length && srcs.every((s) => pool.has(s)) ? "" : whole;
  });
  const text = stripped.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const moved = images.filter(inBody);
  const canMove = text.length > 0 && images.length >= 2 && stripped !== html;

  const gallery = (canMove ? [...moved, ...notInBody] : notInBody).filter(
    (s, i, a) => a.indexOf(s) === i && s !== cover,
  );
  return { html: canMove ? stripped : html, gallery };
}
