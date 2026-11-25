"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/motion/primitives";

gsap.registerPlugin(ScrollTrigger);

/* CIPOMAR : le confinement d'une nappe. Pendant la lecture des textes « Lutte »
   et « Perspectives », un barrage flottant se resserre autour de la nappe
   d'hydrocarbure, qui se résorbe ; l'eau retrouve sa couleur. */
export default function SpillScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    const build = (tl: gsap.core.Timeline) =>
      tl
        .fromTo(".spill__boom", { attr: { r: 182 }, opacity: 1 }, { attr: { r: 118 }, duration: 0.45, ease: "expo.out" })
        .fromTo(".spill__slick", { scale: 1, opacity: 0.94 }, { scale: 0.18, opacity: 0, duration: 0.55 }, 0.4)
        .fromTo(".spill__boom", { attr: { r: 118 } }, { attr: { r: 40 }, opacity: 0, duration: 0.4 }, 0.6)
        .fromTo(".spill__clear", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.45)
        .fromTo(".spill__ripple", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 0.5, duration: 0.4, stagger: 0.08 }, 0.6);
    const mm = gsap.matchMedia(el);
    // Grand écran : l'illustration reste collée, la lecture pilote l'animation.
    mm.add("(min-width: 901px)", () => {
      build(gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.8 }, defaults: { ease: "none" } }));
    });
    // Téléphone et tablette : l'illustration défile avec le texte, l'animation
    // se joue d'elle-même quand elle est à l'écran (et se rejoue en revenant).
    mm.add("(max-width: 900px)", () => {
      const tl = build(gsap.timeline({ paused: true, defaults: { ease: "power1.inOut" } })).timeScale(0.32);
      ScrollTrigger.create({
        trigger: el.querySelector(".spill__stage"),
        start: "top 80%",
        end: "bottom 15%",
        onEnter: () => tl.restart(),
        onEnterBack: () => tl.restart(),
      });
    });
    const ctx = { revert: () => mm.revert() };
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="spill">
      <div className="spill__stage">
        <svg
          className="spill__svg"
          viewBox="0 0 400 400"
          role="img"
          aria-label="Illustration : un barrage flottant se resserre autour d'une nappe d'hydrocarbure, qui se résorbe."
        >
          <rect className="spill__murky" width="400" height="400" rx="40" />
          <rect className="spill__clear" width="400" height="400" rx="40" />
          <g className="spill__ripples" fill="none">
            <circle className="spill__ripple" cx="200" cy="200" r="70" />
            <circle className="spill__ripple" cx="200" cy="200" r="120" />
            <circle className="spill__ripple" cx="200" cy="200" r="170" />
          </g>
          <path
            className="spill__slick"
            style={{ transformOrigin: "200px 200px", transformBox: "view-box" }}
            d="M200 92c42-6 96 14 104 58 9 44-22 58-14 92 9 38-36 74-86 64-38-8-52 20-92-6-34-22-22-62-34-94-13-35 6-78 46-96 26-12 46-15 76-18z"
          />
          <circle className="spill__boom" cx="200" cy="200" r="182" fill="none" />
        </svg>
      </div>
      <div className="spill__text">{children}</div>
    </div>
  );
}
