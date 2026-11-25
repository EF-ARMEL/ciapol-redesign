import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/motion/primitives";
import { getPage } from "@/lib/content";
import { stripComments } from "@/components/institution/md";
import GalleryGrid, { type GalleryPhoto } from "./GalleryGrid";
import "@/components/institution/institution.css";
import "./galerie.css";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Galerie photos du CIAPOL : comité de gestion, GIAMAA et Plan POLLUMAR.",
};

/* Ordre d'affichage d'origine de l'onglet « Tous » (note d'archive du .md). */
const ORDER = [
  "project5",
  "journee-terre-hotel-ivoire-0003",
  "service2",
  "project1",
  "d97cef5b-3c8e-387b-8bf7-54916bf2bced",
  "project3",
  "bf65ad1a-e7c6-36f8-81f2-4da25c4eb3d0",
  "galerie-bg2",
  "galerie-bg1",
  "3886d915-74d9-3d55-87e1-95af6a301c93",
  "project2",
  "project4",
];

const base = (src: string) => (src.split("/").pop() ?? "").replace(/\.[a-z]+$/i, "");
/* Libellés d'albums en casse de lecture (sigles conservés). */
const LABEL: Record<string, string> = { "COMITÉ DE GESTION": "Comité de gestion", "PLAN POLLUMAR": "Plan POLLUMAR" };
const cap = (s: string) => LABEL[s] ?? s;

export default function GaleriePage() {
  const page = getPage("galerie");
  if (!page) notFound();
  const md = stripComments(page.markdown);

  // Albums = titres « ## » ; photos = images qui suivent chaque titre.
  const albums: string[] = [];
  const map = new Map<string, { src: string; albums: string[] }>();
  let current = "";
  for (const line of md.split("\n")) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      current = h[1].trim();
      albums.push(current);
      continue;
    }
    const img = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (img && current) {
      const e = map.get(img[1]) ?? { src: img[1], albums: [] };
      if (!e.albums.includes(current)) e.albums.push(current);
      map.set(img[1], e);
    }
  }
  const entries = [...map.values()].sort((a, b) => {
    const ia = ORDER.indexOf(base(a.src));
    const ib = ORDER.indexOf(base(b.src));
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  // Texte alternatif factuel : album(s) et rang dans l'album (les fichiers d'origine n'ont pas de légende).
  const rank = new Map<string, number>();
  const photos: GalleryPhoto[] = entries.map((e) => {
    const a = e.albums[0];
    const n = (rank.get(a) ?? 0) + 1;
    rank.set(a, n);
    const total = entries.filter((x) => x.albums[0] === a).length;
    return { src: e.src, albums: e.albums, alt: `${cap(a)}, photo ${n} sur ${total}` };
  });

  return (
    <>
      <PageHero
        eyebrow="Présentation"
        title={page.title}
        crumbs={[{ label: "Présentation", href: "/presentation/" }, { label: page.title }]}
        lead={`${photos.length} photos réparties en ${albums.length} albums : ${albums.map(cap).join(", ")}.`}
      />
      <section className="surface surface--white section gal-sec">
        <div className="shell">
          <Reveal>
            <GalleryGrid photos={photos} albums={albums} labels={Object.fromEntries(albums.map((a) => [a, cap(a)]))} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
