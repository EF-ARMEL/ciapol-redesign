import ArticleCard from "@/components/ui/ArticleCard";
import { getArticleMetas } from "@/lib/content";
import type { Metadata } from "next";
import { DetailCta, DetailHero } from "@/components/detail/Detail";
import Siblings from "@/components/detail/Siblings";
import { loadDetail } from "@/components/detail/parse";
import { NAV } from "@/lib/nav";
import { projectSiblings } from "../projects";
import "@/components/detail/detail.css";
import "../projets.css";

export const metadata: Metadata = {
  title: "UCP LAC YAKRO",
  description: "UCP LAC YAKRO, projet du Centre Ivoirien Antipollution (CIAPOL).",
  alternates: { canonical: "/projets/ucp-lac-yakro/" },
};

/* Page officielle vide (bandeau seul, sous-titre recopié par erreur de la
   page RNO, non repris) : on le dit simplement et on oriente le lecteur. */
export default function UcpLacYakroPage() {
  const doc = loadDetail("projets-ucp-lac-yakro");
  // Articles officiels consacrés aux lacs de Yamoussoukro (réhabilitation, suivi).
  const lakes = getArticleMetas().filter((a) => /lacs?-de-yamoussoukro|13-lacs|treize-13-lacs/.test(a.slug));
  const label = NAV.flatMap((n) => n.children ?? []).find((c) => c.href === "/projets/ucp-lac-yakro/")?.label;
  return (
    <div className="detail detail--project">
      <DetailHero
        unit="ucp-lac-yakro"
        kicker="Projet"
        title={doc.code}
        lead={label}
        crumbs={[{ label: "Projets", href: "/projets/" }, { label: "UCP LAC YAKRO" }]}
        image={doc.heroBg ? { src: doc.heroBg, alt: "" } : undefined}
      />
      <section className="surface section ucp" aria-labelledby="ucp-titre">
        <div className="shell">
          <div className="ucp__head">
            <p className="dsec__num display" aria-hidden="true">01</p>
            <h2 id="ucp-titre" className="display dsec__title">Le projet en actualités</h2>
            <p className="ucp__lead">
              La présentation détaillée de ce projet n&apos;est pas encore publiée sur le site du CIAPOL. Ses étapes,
              du lancement des travaux au suivi des lacs, sont racontées dans les articles officiels ci-dessous.
            </p>
          </div>
          <ul className="ucp__grid">
            {lakes.map((a, i) => (
              <li key={a.slug}>
                <ArticleCard article={a} size={i === 0 ? "lg" : "md"} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Siblings title="Autres projets" items={projectSiblings("/projets/ucp-lac-yakro/")} />
      <DetailCta
        title="Une question sur ce projet ?"
        lead="Écrivez au Centre Ivoirien Antipollution."
        actions={[{ href: "/contact/", label: "Nous contacter", variant: "light" }]}
      />
    </div>
  );
}
