import type { Metadata } from "next";
import GiamsucShell from "../GiamsucShell";
import Rubriques from "../Rubriques";
import { giamsucPage, rubriques } from "../giamsuc";

export const metadata: Metadata = {
  title: "A-propos du projet GIAMSUC",
  description:
    "Présentation, mission et objectifs du projet de Gestion Intégrée de l'Aire Marine de la Région du Sud-Comoé (GIAMSUC), porté par le CIAPOL.",
  alternates: { canonical: "/projets/giamsuc/a-propos/" },
};

export default function GiamsucAProposPage() {
  const { page, blocks, bg } = giamsucPage("projets-giamsuc-a-propos");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  return (
    <GiamsucShell title={h1} section="A-propos">
      <Rubriques
        items={rubriques(blocks)}
        media={bg.map((src) => ({ src, alt: "Vue aérienne prise par drone" }))}
      />
    </GiamsucShell>
  );
}
