import type { ReactNode } from "react";
import type { Crumb } from "@/components/ui/Breadcrumb";
import Blocks from "./Blocks";
import { DetailBody, DetailCta, DetailHero, DetailSection, KnowPanel } from "./Detail";
import Siblings, { type Sibling } from "./Siblings";
import type { TocItem } from "./Toc";
import { imagesIn, splitTitle, withoutImages, type DetailDoc, type Section } from "./parse";

/* Les photos officielles n'ont pas de texte alternatif : on décrit leur rôle. */
export const altFor = (code: string, title?: string) =>
  title ? `${code} : illustration de la rubrique « ${title} »` : `${code} : illustration`;

export type SectionRender = (s: Section, ctx: { flip: boolean; title?: string }) => ReactNode;

/* Assemble une page de détail à partir des sections officielles. Chaque
   section a un rendu par défaut (texte + image alternés) que la page peut
   remplacer par un rendu propre à son sujet (`renders`). */
export default function UnitDetail({
  doc,
  kicker,
  crumbs,
  lead,
  siblings,
  siblingsTitle,
  renders = {},
  labels = {},
  skip = [],
  cta,
  after,
  unit,
}: {
  unit?: string;
  doc: DetailDoc;
  kicker: string;
  crumbs: Crumb[];
  lead?: ReactNode;
  siblings: Sibling[];
  siblingsTitle: string;
  renders?: Record<string, SectionRender>;
  labels?: Record<string, string>;
  skip?: string[];
  cta?: ReactNode;
  after?: ReactNode;
}) {
  const sections = doc.sections.filter((s) => !skip.includes(s.name) && s.name !== "autres-services");
  const toc: TocItem[] = sections.map((s) => ({
    id: s.id,
    label: labels[s.name] ?? (s.name === "bon-a-savoir" ? "Bon à savoir" : splitTitle(s).title ?? s.name),
  }));

  // Alternance gauche/droite et numéro de chaque chapitre, calculés avant le rendu.
  // « Bon à savoir » n'est pas numéroté ; sans rendu dédié, il n'alterne pas non plus.
  const layout: { flip: boolean; n: number }[] = [];
  for (const s of sections) {
    const prev = layout[layout.length - 1] ?? { flip: false, n: 0 };
    const know = s.name === "bon-a-savoir";
    layout.push(know && !renders[s.name] ? prev : { flip: !prev.flip, n: prev.n + (know ? 0 : 1) });
  }
  return (
    <>
      <DetailHero
        code={undefined}
        kicker={kicker}
        title={doc.code}
        lead={lead ?? doc.subtitle}
        crumbs={crumbs}
        image={doc.heroBg ? { src: doc.heroBg, alt: "" } : undefined}
        unit={unit}
      />
      <DetailBody toc={toc}>
        {sections.map((s, i) => {
          const { flip, n } = layout[i];
          const { title, rest } = splitTitle(s);
          const custom = renders[s.name];
          if (custom) {
            if (s.name === "bon-a-savoir") return <div key={s.id}>{custom(s, { flip, title })}</div>;
            return (
              <div key={s.id} className="uchap">
                <p className="dsec__num display" aria-hidden="true">{String(n).padStart(2, "0")}</p>
                {custom(s, { flip, title })}
              </div>
            );
          }
          if (s.name === "bon-a-savoir") {
            const first = imagesIn(s.blocks)[0];
            const img = first ? { ...first, alt: first.alt || altFor(doc.code, "Bon à savoir") } : undefined;
            return (
              <KnowPanel key={s.id} id={s.id} image={img}>
                <Blocks blocks={withoutImages(rest)} />
              </KnowPanel>
            );
          }
          const imgs = imagesIn(rest).map((im) => ({ ...im, alt: im.alt || altFor(doc.code, title ?? labels[s.name]) }));
          return (
            <DetailSection key={s.id} id={s.id} index={n} title={title ?? labels[s.name]} media={imgs.length ? imgs : undefined} flip={!flip}>
              <Blocks blocks={withoutImages(rest)} />
            </DetailSection>
          );
        })}
      </DetailBody>
      {after}
      <Siblings title={siblingsTitle} items={siblings} />
      {cta ?? (
        <DetailCta
          title="Une pollution constatée ?"
          lead="Déversement, rejet, dépôt sauvage, végétaux envahissants : signalez-le au CIAPOL."
          actions={[
            { href: "/signaler/", label: "Signaler une pollution", variant: "alert" },
            { href: "/contact/", label: "Nous contacter", variant: "light" },
          ]}
        />
      )}
    </>
  );
}
