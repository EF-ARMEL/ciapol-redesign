"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import WaterWindow from "@/motion/WaterWindow";
import Button from "@/components/ui/Button";
import TransitionLink from "@/components/ui/TransitionLink";
import { prefersReduced } from "@/motion/primitives";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Featured = { title: string; href: string; date: string; image?: string };

/* Hero d'accueil : la devise officielle, en très grand, posée sur une lagune
   polluée. Au scroll, les lettres se dispersent comme des déchets emportés
   par le courant pendant que l'eau commence à se clarifier. Le curseur est
   un « écrémeur » : là où il passe, l'eau redevient propre. */
export default function HomeHero({ featured }: { featured?: Featured }) {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReduced();
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>(".hh__title")!;
      const split = SplitText.create(title, { type: "chars,words,lines", mask: "lines", linesClass: "split-line" });
      if (reduced) return;

      const intro = gsap.timeline({ delay: document.documentElement.classList.contains("is-intro") ? 3.6 : 0.25 });
      intro
        .from(split.chars, { yPercent: 120, rotate: 6, duration: 1.4, ease: "expo.out", stagger: { each: 0.018, from: "start" } })
        .from(".hh__meta > *", { y: 24, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5)
        .from(".hh__lead, .hh__actions, .hh__une", { y: 34, autoAlpha: 0, filter: "blur(8px)", duration: 1.2, ease: "expo.out", stagger: 0.1, clearProps: "filter" }, 0.7)
        .from(".hh__hint", { autoAlpha: 0, duration: 1 }, 1.2);

      // Dispersion au scroll : chaque lettre dérive selon son propre courant.
      const drift = split.chars.map((_, i) => ({
        x: ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 160 - 80,
        y: -40 - (((Math.cos(i * 78.233) * 12345.678) % 1) + 1) * 140,
        r: Math.sin(i * 3.1) * 40,
      }));
      gsap.to(split.chars, {
        x: (i) => drift[i].x,
        y: (i) => drift[i].y,
        rotate: (i) => drift[i].r,
        opacity: 0,
        ease: "none",
        stagger: { each: 0.004, from: "random" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 20%", scrub: 0.6 },
      });
      gsap.to(".hh__body", {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "35% top", end: "bottom 25%", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Écrémeur : anneau qui suit le curseur au-dessus de l'eau.
  useEffect(() => {
    const el = root.current, c = cursor.current;
    if (!el || !c || prefersReduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(c, "x", { duration: 0.6, ease: "expo.out" });
    const yTo = gsap.quickTo(c, "y", { duration: 0.6, ease: "expo.out" });
    const move = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest("a, button");
      c.classList.toggle("is-hidden", !!interactive);
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const enter = () => c.classList.add("is-on");
    const leave = () => c.classList.remove("is-on");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <WaterWindow as="section" className="hh" aria-labelledby="hh-title">
      <div ref={cursor} className="hh__cursor" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="hh-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text>
            <textPath href="#hh-ring">ÉCRÉMEUR · L&apos;EAU SE CLARIFIE · </textPath>
          </text>
        </svg>
      </div>

      <div className="shell hh__inner" ref={root}>
        <div className="hh__meta">
          <span className="tag">Établissement public · Décret n°91-662</span>
          <span className="eyebrow hh__since">Abidjan · depuis 1991</span>
        </div>

        <div className="hh__body">
          <h1 id="hh-title" className="hh__title display">
            La lutte contre la pollution, <em>notre priorité.</em>
          </h1>

          <div className="hh__row">
            <p className="hh__lead">
              Le Centre Ivoirien Antipollution surveille, analyse, contrôle et intervient pour protéger les eaux
              marines, lagunaires et continentales, l&apos;air et les sols de Côte d&apos;Ivoire.
            </p>
            <div className="hh__actions">
              <Button href="/presentation/" variant="light" magnetic>Découvrir le CIAPOL</Button>
              <Button href="/services/" variant="ghost">Nos services</Button>
            </div>
          </div>
        </div>

        {featured ? (
          <TransitionLink href={featured.href} className="hh__une">
            {featured.image ? <img src={featured.image} alt="" /> : null}
            <span className="hh__une-body">
              <span className="eyebrow">À la une</span>
              <span className="hh__une-title">{featured.title}</span>
            </span>
          </TransitionLink>
        ) : null}

        <p className="hh__hint eyebrow" aria-hidden="true">
          <span className="hh__hint-dot" /> Faites glisser le curseur : l&apos;eau se clarifie. Descendez : elle se dépollue.
        </p>
      </div>
    </WaterWindow>
  );
}
