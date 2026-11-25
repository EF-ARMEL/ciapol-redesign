import type { Metadata } from "next";
import { DetailBody, DetailSection } from "@/components/detail/Detail";
import GiamsucShell from "../GiamsucShell";
import GiamsucPosts from "../GiamsucPosts";
import { getGiamsucPosts, giamsucPage } from "../giamsuc";

export const metadata: Metadata = {
  title: "Activités du projet GIAMSUC",
  description: "Les activités du projet GIAMSUC : ateliers, campagnes de sensibilisation et réunions, publiées sous forme d'articles.",
  alternates: { canonical: "/projets/giamsuc/activites/" },
};

/* La page « Activités » du sous-site est vide : les activités y sont publiées
   comme articles. On présente donc ces comptes rendus. */
export default function GiamsucActivitesPage() {
  const { page } = giamsucPage("projets-giamsuc-activites");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  return (
    <GiamsucShell title={h1} section="Activités">
      <DetailBody toc={[]}>
        <DetailSection id="comptes-rendus" kicker="GIAMSUC" title="Comptes rendus d'activités" wide>
          <p className="g-intro">Les activités du projet sont publiées sous forme d&apos;articles.</p>
          <GiamsucPosts posts={getGiamsucPosts()} />
        </DetailSection>
      </DetailBody>
    </GiamsucShell>
  );
}
