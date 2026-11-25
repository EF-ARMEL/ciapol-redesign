import type { Metadata } from "next";
import ArticleCard from "@/components/ui/ArticleCard";
import { DetailBody, DetailCta, DetailHero, DetailSection } from "@/components/detail/Detail";
import Siblings from "@/components/detail/Siblings";
import { loadDetail } from "@/components/detail/parse";
import { getOneHealthArticles, projectSiblings } from "../projects";
import "@/components/detail/detail.css";
import "../projets.css";

export const metadata: Metadata = {
  title: "ONE HEALTH · Une seule santé",
  description: "Le projet ONE HEALTH (Une seule santé) au CIAPOL : installation d'une équipe « One Health » et journée nationale Une seule santé.",
  alternates: { canonical: "/projets/one-health/" },
};

/* Aucune page « ONE HEALTH » n'existe sur ciapol.ci : la rubrique officielle
   est la liste des articles de la catégorie. */
export default function OneHealthPage() {
  const doc = loadDetail("projets-one-health");
  const articles = getOneHealthArticles();
  const lead = articles[0];

  return (
    <div className="detail detail--project">
      <DetailHero
        kicker="Projet"
        title={doc.code}
        lead="Une seule santé"
        crumbs={[{ label: "Projets", href: "/projets/" }, { label: "ONE HEALTH" }]}
        image={lead?.cover ? { src: lead.cover, alt: "" } : undefined}
      />
      <DetailBody toc={[{ id: "articles", label: "Articles" }]}>
        <DetailSection id="articles" title="Articles" wide>
          <ul className="oh-grid">
            {articles.map((a, i) => (
              <li key={a.slug}>
                <ArticleCard article={a} size={i === 0 ? "lg" : "md"} />
              </li>
            ))}
          </ul>
        </DetailSection>
      </DetailBody>
      <Siblings title="Autres projets" items={projectSiblings("/projets/one-health/")} />
      <DetailCta
        title="Suivre l'action du CIAPOL"
        lead="Comptes rendus d'ateliers, missions de terrain et communiqués sont publiés dans les actualités."
        actions={[
          { href: "/actualites/", label: "Lire les actualités", variant: "light" },
          { href: "/contact/", label: "Nous contacter", variant: "ghost" },
        ]}
      />
    </div>
  );
}
