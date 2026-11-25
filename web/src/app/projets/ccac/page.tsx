import type { Metadata } from "next";
import ArticleCard from "@/components/ui/ArticleCard";
import UnitDetail, { type SectionRender } from "@/components/detail/UnitDetail";
import Blocks from "@/components/detail/Blocks";
import { DetailSection } from "@/components/detail/Detail";
import { Parallax, Reveal, SplitReveal } from "@/motion/primitives";
import { imagesIn, loadDetail, splitTitle, withoutImages } from "@/components/detail/parse";
import { getArticleMetas } from "@/lib/content";
import { projectSiblings } from "../projects";
import "@/components/detail/detail.css";
import "../projets.css";

export const metadata: Metadata = {
  title: "CCAC · Coalition pour le Climat et l'Air Pur",
  description:
    "La Coalition pour le Climat et l'Air Pur (Climate & Clean Air Coalition) et son partenariat avec la Côte d'Ivoire depuis 2013, porté par le CIAPOL.",
  alternates: { canonical: "/projets/ccac/" },
};

const presentation: SectionRender = (s) => {
  const imgs = imagesIn(s.blocks);
  return (
    <DetailSection id={s.id} title="La Coalition" media={imgs} flip>
      <Blocks blocks={withoutImages(s.blocks)} />
    </DetailSection>
  );
};

/* Côte d'Ivoire : panneau nuit sur la photo aérienne de la section officielle. */
const coteDivoire: SectionRender = (s) => {
  const { title, rest } = splitTitle(s);
  const logo = imagesIn(rest)[0];
  const bg = s.bg[0];
  return (
    <section id={s.id} aria-labelledby={`${s.id}-titre`} className="ccac-ci">
      {bg ? (
        <Parallax className="ccac-ci__bg" amount={8} scale={1.16}>
          <img src={bg} alt="" loading="lazy" decoding="async" />
        </Parallax>
      ) : null}
      <div className="ccac-ci__inner">
        {logo ? <img className="ccac-ci__logo" src={logo.src} alt="Côte d'Ivoire, partenaire de la CCAC" loading="lazy" decoding="async" /> : null}
        <SplitReveal as="h2" id={`${s.id}-titre`} className="display ccac-ci__title">
          {title ?? "Côte d'Ivoire"}
        </SplitReveal>
        <Reveal className="ccac-ci__body">
          <Blocks blocks={withoutImages(rest)} />
        </Reveal>
      </div>
    </section>
  );
};

export default function CcacPage() {
  const doc = loadDetail("projets-ccac");
  const related = getArticleMetas().filter((a) => a.tags.includes("CCAC"));
  const articles: SectionRender = (s, { title }) => (
    <DetailSection id={s.id} title={title} wide>
      <ul className="ccac-articles">
        {related.map((a, i) => (
          <li key={a.slug}>
            <ArticleCard article={a} size={i === 0 ? "lg" : "md"} />
          </li>
        ))}
      </ul>
    </DetailSection>
  );

  return (
    <div className="detail detail--project">
      <UnitDetail
        doc={doc}
        kicker="Partenariat"
        crumbs={[{ label: "Projets", href: "/projets/" }, { label: "CCAC" }]}
        siblings={projectSiblings("/projets/ccac/")}
        siblingsTitle="Autres projets"
        renders={{ "presentation-ccac": presentation, "cote-divoire": coteDivoire, "articles-recents": articles }}
        labels={{ "presentation-ccac": "La Coalition", "cote-divoire": "Côte d'Ivoire", "articles-recents": "Articles récents", histoire: "Histoire" }}
      />
    </div>
  );
}
