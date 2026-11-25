import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import UnitIndex from "@/components/detail/UnitIndex";
import { DetailCta } from "@/components/detail/Detail";
import { getProjects } from "./projects";
import "@/components/detail/detail.css";
import "./projets.css";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Les projets portés par le CIAPOL : Réseau National d'Observation (RNO), GIAMSUC, ONE HEALTH, UCP LAC YAKRO et Coalition pour le Climat et l'Air Pur (CCAC).",
  alternates: { canonical: "/projets/" },
};

export default function ProjetsPage() {
  const projects = getProjects();
  return (
    <>
      <PageHero
        eyebrow="Projets du CIAPOL"
        title="Projets"
        crumbs={[{ label: "Projets" }]}
        lead="Observation de la qualité des eaux, gestion du littoral, santé et environnement, réhabilitation des lacs, climat et air pur : les projets auxquels le CIAPOL prend part."
      />
      <section className="surface section" aria-labelledby="prj-titre">
        <div className="shell">
          <SectionHeading id="prj-titre" tag="Sur le terrain" title="Cinq projets" />
          <UnitIndex units={projects} label="Projets du CIAPOL" />
        </div>
      </section>
      <DetailCta
        title="Suivre l'action du CIAPOL"
        lead="Comptes rendus d'ateliers, missions de terrain et communiqués sont publiés dans les actualités."
        actions={[
          { href: "/actualites/", label: "Lire les actualités", variant: "light" },
          { href: "/contact/", label: "Nous contacter", variant: "ghost" },
        ]}
      />
    </>
  );
}
