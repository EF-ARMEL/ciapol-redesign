"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitReveal, Reveal, prefersReduced } from "@/motion/primitives";

gsap.registerPlugin(ScrollTrigger);

/* CIAPOL'Publication : les pages du magazine, empilées, se déploient en
   éventail au scroll comme un document qu'on feuillette. Téléchargement PDF. */
export default function Publication({ pages, pdf }: { pages: string[]; pdf?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    const cards = el.querySelectorAll<HTMLElement>(".pub__page");
    const n = cards.length;
    const mq = gsap.matchMedia();
    mq.add({ wide: "(min-width: 821px)", narrow: "(max-width: 820px)" }, (c) => {
      const wide = c.conditions?.wide;
      gsap.fromTo(
        cards,
        { xPercent: 0, rotate: (i) => (i - n / 2) * 1.5, y: 0 },
        {
          xPercent: (i) => (i - (n - 1) / 2) * (wide ? 58 : 26),
          rotate: (i) => (i - (n - 1) / 2) * (wide ? 6 : 4),
          y: (i) => Math.abs(i - (n - 1) / 2) * (wide ? 26 : 12),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 85%", end: "center 45%", scrub: 0.8 },
        },
      );
    });
    return () => mq.revert();
  }, []);

  if (!pages.length) return null;
  return (
    <section className="surface section pub" aria-labelledby="pub-title">
      <div className="shell pub__head">
        <div>
          <Reveal><span className="tag" style={{ color: "var(--color-ciapol)" }}>CIAPOL&apos;Publication</span></Reveal>
          <SplitReveal as="h2" id="pub-title" className="pub__title display">Le magazine du CIAPOL</SplitReveal>
        </div>
        {pdf ? (
          <Reveal>
            <a href={pdf} className="pub__dl" download>
              <span>
                Télécharger le magazine
                <small>PDF</small>
              </span>
            </a>
          </Reveal>
        ) : null}
      </div>
      <div ref={root} className="pub__fan" aria-label="Pages du magazine">
        {pages.map((p, i) => (
          <figure key={p} className="pub__page" style={{ zIndex: pages.length - Math.abs(i - Math.floor(pages.length / 2)) }}>
            <img src={p} alt={`Magazine CIAPOL, page ${i + 1}`} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </section>
  );
}
