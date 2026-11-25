import type { Metadata } from "next";
import UnitDetail, { altFor, type SectionRender } from "@/components/detail/UnitDetail";
import Blocks from "@/components/detail/Blocks";
import { KnowPanel } from "@/components/detail/Detail";
import StationLine from "@/components/detail/scenes/StationLine";
import { imagesIn, loadDetail, splitTitle, withoutImages, type Block } from "@/components/detail/parse";
import { projectSiblings } from "../projects";
import "@/components/detail/detail.css";
import "../projets.css";

export const metadata: Metadata = {
  title: "RNO · Réseau National d'Observation",
  description:
    "Le Réseau National d'Observation de la qualité des eaux (RNO), coordonné par le CIAPOL : paramètres généraux de qualité, contaminants, surveillance microbiologique.",
  alternates: { canonical: "/projets/rno/" },
};

/* Bon à savoir : le texte officiel, puis ses trois volets posés comme des
   stations d'observation le long du littoral. */
const knowWithStations: SectionRender = (s) => {
  const { rest } = splitTitle(s);
  const list = rest.find((b): b is Extract<Block, { kind: "list" }> => b.kind === "list");
  const stations = (list?.items ?? []).map((html) => {
    const t = html.replace(/<[^>]+>/g, "").trim();
    const [name, ...detail] = t.split(/\s[–-]\s/);
    return { name, detail: detail.join(" – ") || undefined };
  });
  const img = imagesIn(rest)[0];
  return (
    <KnowPanel id={s.id} image={img ? { ...img, alt: altFor("RNO", "Bon à savoir") } : undefined}>
      <Blocks blocks={withoutImages(rest).filter((b) => b.kind !== "list")} />
      <StationLine stations={stations} label="Les trois volets du réseau" />
    </KnowPanel>
  );
};

export default function RnoPage() {
  const doc = loadDetail("projets-rno");
  return (
    <div className="detail detail--project">
      <UnitDetail
        doc={{ ...doc, code: "RNO" }}
        kicker="Projet coordonné par le CIAPOL"
        crumbs={[{ label: "Projets", href: "/projets/" }, { label: "RNO" }]}
        siblings={projectSiblings("/projets/rno/")}
        siblingsTitle="Autres projets"
        renders={{ "bon-a-savoir": knowWithStations }}
        labels={{ "bon-a-savoir": "Bon à savoir" }}
      />
    </div>
  );
}
