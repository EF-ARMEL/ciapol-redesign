import type { ReactNode } from "react";
import { Reveal, SplitReveal } from "@/motion/primitives";

/* Titre de section : pastille mono, titre en capitales révélé par lignes,
   chapeau optionnel aligné à droite sur grand écran (asymétrie contrôlée). */
export default function SectionHeading({
  tag,
  kicker,
  title,
  lead,
  action,
  tone = "dark",
  as = "h2",
  id,
}: {
  tag?: string;
  /** alias de tag */
  kicker?: string;
  title: string;
  lead?: ReactNode;
  action?: ReactNode;
  tone?: "dark" | "light";
  as?: "h2" | "h3";
  id?: string;
}) {
  const label = tag ?? kicker;
  return (
    <div className={`sh sh--${tone}`}>
      <div className="sh__left">
        {label ? (
          <Reveal>
            <span className="tag">{label}</span>
          </Reveal>
        ) : null}
        <SplitReveal as={as} id={id} className="sh__title display">
          {title}
        </SplitReveal>
      </div>
      {lead || action ? (
        <Reveal className="sh__right" delay={0.1}>
          {lead ? <div className="sh__lead">{lead}</div> : null}
          {action ? <div className="sh__action">{action}</div> : null}
        </Reveal>
      ) : null}
    </div>
  );
}
