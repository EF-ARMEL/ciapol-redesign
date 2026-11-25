"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import { SplitReveal } from "@/motion/primitives";

export type Sibling = { code: string; text: string; href: string; img?: { src: string; alt: string } };

/* Carrousel des services / projets voisins. Défilement natif avec aimantation
   (le doigt est suivi 1:1, élan du système), boutons texte pour la souris et
   le clavier. */
export default function Siblings({ title, items, id = "voisins" }: { title: string; items: Sibling[]; id?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const w = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * w, behavior: reduced ? "auto" : "smooth" });
  };

  if (!items.length) return null;
  return (
    <section className="surface--white section sibs" aria-labelledby={`${id}-titre`}>
      <div className="shell sibs__head">
        <SplitReveal as="h2" id={`${id}-titre`} className="display sibs__title">
          {title}
        </SplitReveal>
        <div className="sibs__nav">
          <button type="button" className="sibs__btn" onClick={() => step(-1)} disabled={edge.start} aria-controls={`${id}-piste`}>
            Précédent
          </button>
          <button type="button" className="sibs__btn" onClick={() => step(1)} disabled={edge.end} aria-controls={`${id}-piste`}>
            Suivant
          </button>
        </div>
      </div>
      <ul ref={track} id={`${id}-piste`} className="sibs__track" tabIndex={0} aria-label={title}>
        {items.map((s) => (
          <li key={s.href} className="sibs__item">
            <TransitionLink href={s.href} className="sibs__link">
              <span className="sibs__media">
                {s.img ? <img src={s.img.src} alt="" loading="lazy" decoding="async" /> : null}
              </span>
              <span className="sibs__code display">{s.code}</span>
              <span className="sibs__text">{s.text}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
