import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import Blocks from "@/components/detail/Blocks";
import { DetailBody, DetailSection, PhotoBand } from "@/components/detail/Detail";
import { Reveal } from "@/motion/primitives";
import type { Block } from "@/components/detail/parse";
import GiamsucShell from "../GiamsucShell";
import { giamsucPage, rubriques } from "../giamsuc";

export const metadata: Metadata = {
  title: "Documentations et rapports d'activités du projet GIAMSUC",
  description: "Rapports d'activité, études et documents officiels du projet GIAMSUC, en téléchargement libre.",
  alternates: { canonical: "/projets/giamsuc/rapports-d-activite/" },
};

/* Rapports : le texte de présentation, puis chaque rapport avec ses documents
   téléchargeables. L'extrait « Lorem Ipsum » du sous-site (texte de
   remplissage) n'est pas publié ; seule sa date est conservée. */
export default function GiamsucRapportsPage() {
  const { page, blocks, bg } = giamsucPage("projets-giamsuc-rapports-d-activite");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  const [pres, avancement] = rubriques(blocks);
  const rest = avancement?.blocks ?? [];
  const reportTitle = rest.find((b): b is Extract<Block, { kind: "heading" }> => b.kind === "heading" && b.depth === 3);
  const dateLine = rest.find((b): b is Extract<Block, { kind: "html" }> => b.kind === "html" && /^\d{4}-\d{2}-\d{2}/.test(b.text));
  const date = dateLine?.text.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  const docs = rest.find((b): b is Extract<Block, { kind: "list" }> => b.kind === "list");
  const titleText = reportTitle?.text.replace(/\[([^\]]+)\]\([^)]*\)/, "$1");
  const toc = [
    { id: "presentation", label: pres?.title ?? "Présentation" },
    { id: "rapports", label: avancement?.title ?? "Rapports" },
  ];
  return (
    <GiamsucShell title={h1} section="Rapports d’activités">
      <DetailBody toc={toc}>
        <DetailSection id="presentation" kicker={pres?.kicker} title={pres?.title}>
          <Blocks blocks={pres?.blocks ?? []} />
        </DetailSection>
        <DetailSection id="rapports" title={avancement?.title} wide>
          <article className="greport" id="lancement-des-activites-du-giamsuc">
            <div className="greport__head">
              {date ? (
                <time className="eyebrow" dateTime={date}>
                  {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date))}
                </time>
              ) : null}
              <h3 className="display greport__title">{titleText}</h3>
            </div>
            <Reveal as="ul" className="gdocs" y={16} stagger={0.07}>
              {(docs?.items ?? []).map((html) => {
                const href = html.match(/href="([^"]+)"/)?.[1] ?? "#";
                const label = html.replace(/<[^>]+>/g, "").trim();
                return (
                  <li key={href} data-reveal-item>
                    <a href={href} className="gdocs__link" download>
                      <FileDown className="gdocs__icon" size={22} strokeWidth={1.8} aria-hidden="true" />
                      <span className="gdocs__label">{label}</span>
                      <span className="sr-only"> (téléchargement)</span>
                    </a>
                  </li>
                );
              })}
            </Reveal>
          </article>
        </DetailSection>
      </DetailBody>
      {bg[0] ? <PhotoBand image={{ src: bg[0], alt: "" }} /> : null}
    </GiamsucShell>
  );
}
