"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import TransitionLink from "@/components/ui/TransitionLink";
import { Reveal, prefersReduced } from "@/motion/primitives";

export type Unit = { code: string; name: string; sentence?: string; href: string; img?: { src: string; alt: string } };

/* Grande liste des unités (sous-directions, projets). Au survol ou au focus,
   la photo de l'unité remonte à la surface et suit le pointeur, comme un
   objet qui affleure dans l'eau. Sur écran tactile : vignette dans la rangée. */
export default function UnitIndex({ units, label }: { units: Unit[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const f = float.current;
    if (!w || !f) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = prefersReduced();
    const xTo = gsap.quickTo(f, "x", { duration: reduced ? 0 : 0.9, ease: "expo.out" });
    const yTo = gsap.quickTo(f, "y", { duration: reduced ? 0 : 0.9, ease: "expo.out" });
    const move = (e: PointerEvent) => {
      const r = w.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    w.addEventListener("pointermove", move);
    return () => w.removeEventListener("pointermove", move);
  }, []);

  /* Au clavier, la vignette se place à droite de la rangée ciblée. */
  const focusRow = (i: number, el: HTMLElement) => {
    setActive(i);
    const w = wrap.current;
    const f = float.current;
    if (!w || !f) return;
    const r = el.getBoundingClientRect();
    const wr = w.getBoundingClientRect();
    gsap.to(f, { x: wr.width * 0.72, y: r.top - wr.top + r.height / 2, duration: prefersReduced() ? 0 : 0.8, ease: "expo.out" });
  };

  return (
    <div ref={wrap} className="units" onPointerLeave={() => setActive(null)}>
      <Reveal as="ul" className="units__list" aria-label={label} y={30} stagger={0.08}>
        {units.map((u, i) => (
          <li key={u.href} data-reveal-item className={`units__row ${active === i ? "is-active" : ""} ${active !== null && active !== i ? "is-dim" : ""}`}>
            <TransitionLink
              href={u.href}
              className="units__link"
              onPointerEnter={() => setActive(i)}
              onFocus={(e) => focusRow(i, e.currentTarget)}
              onBlur={() => setActive(null)}
            >
              {u.img ? (
                <span className="units__thumb" aria-hidden="true">
                  <img src={u.img.src} alt="" loading="lazy" decoding="async" />
                </span>
              ) : null}
              <span className="units__code display">{u.code}</span>
              <span className="units__meta">
                <span className="units__name">{u.name}</span>
                {u.sentence ? <span className="units__sentence">{u.sentence}</span> : null}
              </span>
            </TransitionLink>
          </li>
        ))}
      </Reveal>
      <div ref={float} className="units__float" aria-hidden="true">
        {units.map((u, i) =>
          u.img ? (
            <img key={u.href} src={u.img.src} alt="" className={active === i ? "is-on" : ""} loading="lazy" decoding="async" />
          ) : null,
        )}
      </div>
    </div>
  );
}
