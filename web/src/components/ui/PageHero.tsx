import type { ReactNode } from "react";
import WaterWindow from "@/motion/WaterWindow";
import { Reveal, SplitReveal } from "@/motion/primitives";
import Breadcrumb, { type Crumb } from "./Breadcrumb";

/* En-tête de page intérieure : une fenêtre sur la lagune (encore trouble en
   haut de page, chaque page se « dépollue » à la lecture), titre massif,
   fil d'Ariane, chapeau et éventuels méta-éléments. */
export default function PageHero({
  eyebrow,
  kicker,
  title,
  lead,
  crumbs,
  code,
  children,
  aside,
}: {
  eyebrow?: string;
  /** alias de eyebrow */
  kicker?: string;
  title: string;
  lead?: ReactNode;
  crumbs: Crumb[];
  code?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const label = eyebrow ?? kicker;
  return (
    <WaterWindow className="page-hero">
      <div className="shell page-hero__inner">
        <Breadcrumb items={crumbs} />
        <div className="page-hero__grid">
          <div>
            {label ? (
              <Reveal>
                <span className="tag page-hero__tag">{label}</span>
              </Reveal>
            ) : null}
            {code ? (
              <p className="page-hero__code display" aria-hidden="true">
                {code}
              </p>
            ) : null}
            <SplitReveal as="h1" mode="words" immediate delay={0.15} className="page-hero__title display">
              {title}
            </SplitReveal>
            {lead ? (
              <Reveal delay={0.35}>
                <div className="page-hero__lead">{lead}</div>
              </Reveal>
            ) : null}
            {children ? <Reveal delay={0.45} className="page-hero__extra">{children}</Reveal> : null}
          </div>
          {aside ? <Reveal delay={0.4} className="page-hero__aside">{aside}</Reveal> : null}
        </div>
      </div>
      <div className="page-hero__shore" aria-hidden="true" />
    </WaterWindow>
  );
}
