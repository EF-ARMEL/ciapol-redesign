import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";
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
  const label = NAV.flatMap((n) => n.children ?? []).find((c) => c.href === "/projets/ucp-lac-yakro/")?.label;
  return (
    <div className="detail detail--project">
      <DetailHero
        kicker="Projet"
        title={doc.code}
        lead={label}
        crumbs={[{ label: "Projets", href: "/projets/" }, { label: "UCP LAC YAKRO" }]}
        image={doc.heroBg ? { src: doc.heroBg, alt: "" } : undefined}
      />
      <section className="surface section--tight" aria-labelledby="ucp-titre">
        <div className="shell">
          <h2 id="ucp-titre" className="eyebrow">
            Présentation du projet
          </h2>
          <p className="dnote prj-empty" style={{ marginTop: 20 }}>
            La présentation de ce projet n&apos;est pas encore publiée sur le site du CIAPOL. Les comptes rendus
            d&apos;activités paraissent dans les{" "}
            <TransitionLink href="/actualites/" className="link">
              actualités
            </TransitionLink>
            .
          </p>
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
