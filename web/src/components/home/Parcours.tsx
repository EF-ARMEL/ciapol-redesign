"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaterWindow from "@/motion/WaterWindow";
import TransitionLink from "@/components/ui/TransitionLink";
import { lagoon } from "@/motion/lagoon-store";
import { prefersReduced } from "@/motion/primitives";

gsap.registerPlugin(ScrollTrigger);

export type Step = {
  verb: string;
  code: string;
  unit: string;
  text: string;
  href: string;
  state: string;
};

/* Parcours de dépollution : section épinglée (position: sticky) dont la
   traversée pilote directement la pureté de la lagune. Chaque étape est un
   maillon réel de la chaîne d'action du CIAPOL, porté par sa sous-direction. */
export default function Parcours({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReduced();
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
        if (!reduced) lagoon.override = 0.04 + p * 0.94;
      },
      onLeave: () => { lagoon.override = null; },
      onLeaveBack: () => { lagoon.override = null; },
      onEnter: (self) => { if (!reduced) lagoon.override = 0.04 + self.progress * 0.94; },
      onEnterBack: (self) => { if (!reduced) lagoon.override = 0.04 + self.progress * 0.94; },
    });
    return () => {
      st.kill();
      lagoon.override = null;
    };
  }, [steps.length]);

  const step = steps[active];

  return (
    <WaterWindow as="section" className="parcours" aria-labelledby="parcours-title" style={{ ["--steps" as string]: steps.length }}>
      <div ref={root} className="parcours__track">
        <div className="parcours__sticky">
          <div className="shell parcours__grid">
            <header className="parcours__head">
              <span className="tag">Parcours de dépollution</span>
              <h2 id="parcours-title" className="parcours__title display">
                De l&apos;eau trouble
                <br />à l&apos;eau claire.
              </h2>
              <p className="parcours__intro">
                Six maillons, cinq sous-directions et un réseau d&apos;observation : la chaîne d&apos;action du CIAPOL,
                du premier prélèvement à la restauration du milieu.
              </p>
            </header>

            <div className="parcours__stage" aria-live="polite">
              <div className="parcours__count display" aria-hidden="true">
                <span key={active} className="parcours__count-n">{String(active + 1).padStart(2, "0")}</span>
                <span className="parcours__count-of">/{String(steps.length).padStart(2, "0")}</span>
              </div>
              <div className="parcours__verb-mask">
                <p key={step.verb} className="parcours__verb display">{step.verb}</p>
              </div>
              <div key={step.code} className="parcours__card">
                <p className="parcours__code">
                  <b>{step.code}</b> {step.unit}
                </p>
                <p className="parcours__text">{step.text}</p>
                <TransitionLink href={step.href} className="parcours__more">
                  Découvrir {step.code}
                </TransitionLink>
              </div>
            </div>

            <ol className="parcours__rail" aria-label="Étapes">
              {steps.map((s, i) => (
                <li key={s.code} className={i === active ? "is-active" : i < active ? "is-done" : ""}>
                  <span className="parcours__rail-dot" aria-hidden="true" />
                  <span className="parcours__rail-label">{s.verb}</span>
                </li>
              ))}
            </ol>

            <div className="parcours__gauge" aria-hidden="true">
              <span className="eyebrow">État du milieu</span>
              <span className="parcours__state">{step.state}</span>
              <span className="parcours__bar"><i style={{ transform: `scaleX(${progress})` }} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Version linéaire, lisible sans animation (mobile étroit, mouvement réduit) */}
      <ol className="parcours__list shell">
        {steps.map((s, i) => (
          <li key={s.code}>
            <span className="parcours__list-n display">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="parcours__list-verb display">{s.verb}</p>
              <p className="parcours__code"><b>{s.code}</b> {s.unit}</p>
              <p className="parcours__text">{s.text}</p>
              <TransitionLink href={s.href} className="parcours__more">Découvrir {s.code}</TransitionLink>
            </div>
          </li>
        ))}
      </ol>
    </WaterWindow>
  );
}
