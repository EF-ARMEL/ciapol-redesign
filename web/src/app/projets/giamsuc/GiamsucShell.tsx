import type { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import Siblings from "@/components/detail/Siblings";
import { DetailCta } from "@/components/detail/Detail";
import GiamsucNav from "./GiamsucNav";
import { GIAMSUC_LOGO, GIAMSUC_NAME, GIAMSUC_TABS } from "./giamsuc";
import { projectSiblings } from "../projects";
import "@/components/detail/detail.css";
import "../projets.css";
import "./giamsuc.css";

/* Cadre commun aux pages du sous-site GIAMSUC : fenêtre d'eau (le littoral
   du Sud-Comoé), onglets collants, puis voisins et appel à l'action. */
export default function GiamsucShell({
  title,
  section,
  lead,
  children,
  siblings = false,
  variant,
  current,
}: {
  title: string;
  section?: string;
  lead?: ReactNode;
  children: ReactNode;
  siblings?: boolean;
  variant?: "post";
  /** dernier maillon du fil d'Ariane quand la rubrique n'est pas la page courante */
  current?: string;
}) {
  const crumbs = [
    { label: "Projets", href: "/projets/" },
    section ? { label: "GIAMSUC", href: "/projets/giamsuc/" } : { label: "GIAMSUC" },
    ...(section
      ? current
        ? [{ label: section, href: GIAMSUC_TABS.find((t) => t.label === section)?.href }, { label: current }]
        : [{ label: section }]
      : []),
  ];
  return (
    <div className={`detail giamsuc ${variant ? `giamsuc--${variant}` : ""}`}>
      <PageHero
        eyebrow="Projet GIAMSUC"
        title={title}
        lead={lead ?? GIAMSUC_NAME}
        crumbs={crumbs}
        aside={
          <figure className="g-logo">
            <img src={GIAMSUC_LOGO.src} alt={GIAMSUC_LOGO.alt} decoding="async" />
          </figure>
        }
      />
      <GiamsucNav tabs={GIAMSUC_TABS} />
      {children}
      {siblings ? <Siblings title="Autres projets" items={projectSiblings("/projets/giamsuc/")} /> : null}
      <DetailCta
        title="Une question sur le littoral du Sud-Comoé ?"
        lead="Écrivez à l'équipe du projet GIAMSUC."
        actions={[
          { href: "/projets/giamsuc/contact/", label: "Contacter le projet", variant: "light" },
          { href: "/signaler/", label: "Signaler une pollution", variant: "alert" },
        ]}
      />
    </div>
  );
}
