"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Button from "@/components/ui/Button";
import TransitionLink from "@/components/ui/TransitionLink";
import { prefersReduced } from "@/motion/primitives";

gsap.registerPlugin(SplitText);

/* Hero d'accueil : de vraies scènes de terrain du CIAPOL (photos officielles).
   Chaque scène apparaît d'abord ternie, comme une eau chargée de vase, puis une
   onde de dépollution la traverse et lui rend ses couleurs. Sur ordinateur, le
   curseur dépollue aussi l'image là où il passe. */
const SCENES = [
  {
    verb: "Prélever",
    caption: "Prélèvements d'eau par les équipes du CIAPOL sur les lacs de Yamoussoukro.",
    src: "/media/articles/repousse-de-vegetaux-des-lacs-de-yamoussoukro-le-ciapol-depeche-des-experts/DSC05730.jpg",
    href: "/actualites/repousse-de-vegetaux-des-lacs-de-yamoussoukro-le-ciapol-depeche-des-experts/",
    origin: "62% 58%",
  },
  {
    verb: "Intervenir",
    caption: "Déploiement de barrages flottants contre les hydrocarbures, exercice du plan POLLUMAR.",
    src: "/media/articles/lutte-contre-les-pollutions-par-hydrocarbures/IMG_0285.jpg",
    href: "/actualites/lutte-contre-les-pollutions-par-hydrocarbures/",
    origin: "55% 70%",
  },
  {
    verb: "Surveiller",
    caption: "Mesures de la qualité de l'eau au bord du lac, sous-direction du Laboratoire Central de l'Environnement.",
    src: "/media/articles/repousse-de-vegetaux-des-lacs-de-yamoussoukro-le-ciapol-depeche-des-experts/DSC05681-1.jpg",
    href: "/actualites/repousse-de-vegetaux-des-lacs-de-yamoussoukro-le-ciapol-depeche-des-experts/",
    origin: "40% 55%",
  },
];

const HOLD = 4.2; // secondes d'image propre avant la scène suivante

export default function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const go = useRef<(i: number) => void>(() => {});

  // Titre, texte et boutons : entrée unique.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(".hh__title", { type: "words,lines", mask: "lines", linesClass: "split-line" });
      const delay = document.documentElement.classList.contains("is-intro") ? 3.4 : 0.2;
      gsap.timeline({ delay })
        .from(split.lines, { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.1 })
        .from(".hh__lead, .hh__actions, .hh__scenes", { y: 26, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.45);
    }, el);
    return () => ctx.revert();
  }, []);

  // Scènes : ternie, onde de dépollution, image propre, scène suivante.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>(".hh__slide"));
    const reduced = prefersReduced();
    if (reduced) {
      slides.forEach((s, i) => {
        s.style.opacity = i === 0 ? "1" : "0";
        s.style.setProperty("--r", "160%");
      });
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let current = 0;
    const play = (i: number) => {
      tl?.kill();
      const prev = slides[current];
      const s = slides[i];
      current = i;
      setActive(i);
      el.style.setProperty("--progress", "0");
      gsap.set(s, { zIndex: 2, "--r": "0%" });
      slides.forEach((o) => { if (o !== s && o !== prev) gsap.set(o, { opacity: 0, zIndex: 0 }); });
      if (prev !== s) gsap.set(prev, { zIndex: 1 });
      const img = s.querySelectorAll("img");
      tl = gsap.timeline({ onComplete: () => play((i + 1) % slides.length) });
      tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: prev === s ? 0.01 : 1.1, ease: "power2.out" })
        .fromTo(img, { scale: 1.1 }, { scale: 1, duration: 3.4 + HOLD + 1, ease: "none" }, 0)
        .to(s, { "--r": "165%", duration: 3.4, ease: "power2.inOut" }, 0.9)
        .fromTo(el, { "--progress": 0 }, { "--progress": 1, duration: 0.9 + 3.4 + HOLD, ease: "none" }, 0)
        .to({}, { duration: HOLD });
    };
    go.current = play;

    // Démarrage après l'intro éventuelle ; pause quand le hero n'est plus visible.
    const start = window.setTimeout(() => play(0), document.documentElement.classList.contains("is-intro") ? 3200 : 300);
    const io = new IntersectionObserver(([e]) => { if (tl) (e.isIntersecting && !document.hidden ? tl.resume() : tl.pause()); });
    io.observe(el);

    // Curseur : une lentille de dépollution suit la souris.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - b.left}px`);
      el.style.setProperty("--my", `${e.clientY - b.top}px`);
    };
    const enter = () => el.classList.add("is-lens");
    const leave = () => el.classList.remove("is-lens");
    if (fine) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
    }
    return () => {
      window.clearTimeout(start);
      io.disconnect();
      tl?.kill();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const scene = SCENES[active];

  return (
    <section ref={root} className="hh" aria-labelledby="hh-title">
      <div className="hh__stage" aria-hidden="true">
        {SCENES.map((s, i) => (
          <div key={s.src} className="hh__slide" style={{ ["--o" as string]: s.origin, opacity: i === 0 ? 1 : 0 }}>
            <img className="hh__img hh__img--dirty" src={s.src} alt="" fetchPriority={i === 0 ? "high" : "low"} decoding="async" />
            <span className="hh__murk" />
            <img className="hh__img hh__img--clean" src={s.src} alt="" decoding="async" />
          </div>
        ))}
        <span className="hh__veil" />
      </div>

      <div className="shell hh__inner">
        <div className="hh__body">
          <h1 id="hh-title" className="hh__title display">
            La lutte contre la pollution, <em>notre priorité.</em>
          </h1>
          <p className="hh__lead">
            Le Centre Ivoirien Antipollution veille sur les eaux, l&apos;air et les sols de Côte d&apos;Ivoire.
          </p>
          <div className="hh__actions">
            <Button href="/presentation/" variant="light" magnetic>Découvrir le CIAPOL</Button>
            <TransitionLink href="/services/" className="hh__more">Nos services</TransitionLink>
          </div>
        </div>

        <div className="hh__scenes">
          <div className="hh__bars" role="group" aria-label="Scènes de terrain">
            {SCENES.map((s, i) => (
              <button
                key={s.verb}
                type="button"
                className={`hh__bar ${i === active ? "is-on" : ""}`}
                aria-pressed={i === active}
                onClick={() => go.current(i)}
              >
                <span className="hh__bar-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="hh__bar-v">{s.verb}</span>
                <span className="hh__bar-line" aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="hh__cap" aria-live="polite">
            <span>{scene.caption}</span>{" "}
            <TransitionLink href={scene.href} className="hh__cap-link">Voir le reportage</TransitionLink>
          </p>
        </div>
      </div>
    </section>
  );
}
