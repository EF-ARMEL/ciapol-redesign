import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import NewsHub, { type HubFacet } from "@/components/news/NewsHub";
import { categoryLabel } from "@/components/news/news-utils";
import { getArticleMetas } from "@/lib/content";
import "./actualites.css";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Toutes les actualités du Centre Ivoirien Antipollution (CIAPOL) : exercices Plan POLLUMAR, ateliers de validation, visites de terrain, distinctions et communiqués.",
  alternates: { canonical: "/actualites/" },
  openGraph: { title: "Actualités du CIAPOL", url: "/actualites/" },
};

/* Ordre des rubriques : « À la une » d'abord, les thématiques par volume,
   le fourre-tout « Actualités » (Non classé) en dernier. */
function categoryFacets(cats: string[][]): HubFacet[] {
  const count = new Map<string, number>();
  for (const list of cats) for (const c of list) count.set(c, (count.get(c) ?? 0) + 1);
  const rank = (c: string) => (c === "Vedette" ? 0 : c === "Non classé" ? 2 : 1);
  return [...count.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
    .map(([value, n]) => ({ value, label: categoryLabel(value), count: n }));
}

export default function ActualitesPage() {
  const metas = getArticleMetas();
  // Le client n'a besoin que des champs des cartes : on allège la charge utile.
  const items = metas.map((m) => ({ ...m, images: [], videos: [], documents: [], tags: [] }));
  const categories = categoryFacets(metas.map((m) => m.categories));
  const yearCount = new Map<string, number>();
  for (const m of metas) yearCount.set(m.date.slice(0, 4), (yearCount.get(m.date.slice(0, 4)) ?? 0) + 1);
  const years: HubFacet[] = [...yearCount.entries()]
    .filter(([y]) => y !== "1970")
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([value, count]) => ({ value, label: value, count }));
  const first = years.at(-1)?.value;
  const last = years[0]?.value;

  return (
    <>
      <PageHero
        eyebrow="Salle de presse"
        title="Actualités"
        crumbs={[{ label: "Actualités" }]}
        lead="Exercices du Plan POLLUMAR, ateliers, missions d'inspection, visites de terrain et distinctions : les communiqués et comptes rendus publiés par le Centre Ivoirien Antipollution."
        aside={
          <dl className="news-stats">
            <div>
              <dt className="eyebrow">Articles</dt>
              <dd className="display">{metas.length}</dd>
            </div>
            {first && last ? (
              <div>
                <dt className="eyebrow">Période</dt>
                <dd className="display">
                  {first} <span className="news-stats__to">à</span> {last}
                </dd>
              </div>
            ) : null}
          </dl>
        }
      />
      <section className="surface section news-section" aria-label="Liste des actualités">
        <div className="shell">
          <NewsHub items={items} categories={categories} years={years} />
        </div>
      </section>
    </>
  );
}
