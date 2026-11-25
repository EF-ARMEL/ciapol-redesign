"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* Ouverture : le mot CIAPOL se remplit d'eau trouble qui s'éclaircit en bleu
   CIAPOL, puis la scène se retire comme une marée. Jouée une seule fois par
   session d'onglet ; Échap / Entrée / clic la passent. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = false;
    try { seen = sessionStorage.getItem("ciapol:intro") === "1"; } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setGone(true);
      document.documentElement.classList.add("is-ready");
      return;
    }
    document.documentElement.classList.add("is-intro");
    const finish = () => {
      try { sessionStorage.setItem("ciapol:intro", "1"); } catch {}
      document.documentElement.classList.remove("is-intro");
      document.documentElement.classList.add("is-ready");
    };

    const fill = el.querySelector<SVGRectElement>(".pl__level")!;
    const wave = el.querySelector<SVGPathElement>(".pl__wave")!;
    const waveWrap = el.querySelector<SVGGElement>(".pl__wavewrap")!;
    const count = el.querySelector<HTMLElement>(".pl__count")!;
    const steps = el.querySelectorAll<HTMLElement>(".pl__step");
    const state = { level: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        finish();
        setGone(true);
      },
    });
    tl.to(state, {
      level: 100,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const l = state.level;
        fill.setAttribute("y", String(120 - l * 1.2));
        waveWrap.setAttribute("transform", `translate(0 ${120 - l * 1.2 - 8})`);
        count.textContent = String(Math.round(l)).padStart(3, "0");
        const k = Math.min(Math.floor(l / 34), steps.length - 1);
        steps.forEach((s, i) => s.classList.toggle("is-on", i === k));
        // eau trouble → bleu CIAPOL
        const t = l / 100;
        const c = gsap.utils.interpolate("#6b5d43", "#003f8c", t);
        fill.setAttribute("fill", c);
        wave.setAttribute("fill", c);
      },
    })
      .to(wave, { x: -200, duration: 2.4, ease: "none" }, 0)
      .to(el.querySelector(".pl__stage"), { scale: 1.08, autoAlpha: 0, duration: 0.8, ease: "expo.in" }, "+=0.25")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.35");

    const skip = () => tl.progress(1);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter") skip(); };
    window.addEventListener("keydown", onKey);
    el.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("click", skip);
      tl.kill();
      // Démontage avant la fin (double montage en développement) : rien ne reste bloqué.
      document.documentElement.classList.remove("is-intro");
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="pl" role="status" aria-live="polite" aria-label="Chargement du site du CIAPOL">
      <div className="pl__top eyebrow">
        <span>République de Côte d&apos;Ivoire</span>
        <span>Décret n°91-662 · 9 oct. 1991</span>
      </div>
      <div className="pl__stage">
        <svg className="pl__word" viewBox="0 0 600 120" role="img" aria-label="CIAPOL">
          <defs>
            <clipPath id="pl-clip">
              <text x="300" y="108" textAnchor="middle" className="pl__glyphs">CIAPOL</text>
            </clipPath>
          </defs>
          <text x="300" y="108" textAnchor="middle" className="pl__glyphs pl__outline">CIAPOL</text>
          <g clipPath="url(#pl-clip)">
            <rect className="pl__level" x="0" y="120" width="600" height="140" fill="#6b5d43" />
            <g className="pl__wavewrap" transform="translate(0 112)"><path className="pl__wave" d="M0 8 Q25 0 50 8 T100 8 T150 8 T200 8 T250 8 T300 8 T350 8 T400 8 T450 8 T500 8 T550 8 T600 8 T650 8 T700 8 T750 8 T800 8 V16 H0 Z" fill="#6b5d43" /></g>
          </g>
        </svg>
        <p className="pl__sub eyebrow">Centre Ivoirien Antipollution</p>
      </div>
      <div className="pl__bottom eyebrow">
        <span className="pl__steps">
          <span className="pl__step">Prélèvement</span>
          <span className="pl__step">Analyse</span>
          <span className="pl__step">Dépollution</span>
        </span>
        <span><span className="pl__count">000</span> %</span>
      </div>
    </div>
  );
}
