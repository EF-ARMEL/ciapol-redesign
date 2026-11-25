import type { Metadata } from "next";
import { DetailBody, DetailSection } from "@/components/detail/Detail";
import GiamsucShell from "../GiamsucShell";
import GiamsucPosts from "../GiamsucPosts";
import { getGiamsucPosts, giamsucPage } from "../giamsuc";

export const metadata: Metadata = {
  title: "Actualités du projet GIAMSUC",
  description: "Les articles publiés par le projet GIAMSUC : ateliers de validation, sensibilisation au plastique, plan de gestion spatiale maritime de Grand-Bassam.",
  alternates: { canonical: "/projets/giamsuc/actualites/" },
};

export default function GiamsucActualitesPage() {
  const { page } = giamsucPage("projets-giamsuc-actualites");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  const posts = getGiamsucPosts();
  return (
    <GiamsucShell title={h1} section="Actualités">
      <DetailBody toc={[]}>
        <DetailSection id="articles" kicker={`${posts.length} articles publiés`} title="Tous les articles" wide>
          <GiamsucPosts posts={posts} />
        </DetailSection>
      </DetailBody>
    </GiamsucShell>
  );
}
