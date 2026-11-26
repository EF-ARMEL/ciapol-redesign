"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getLenis } from "@/motion/SmoothScroll";
import { prefersReduced } from "@/motion/primitives";

export type TocItem = { id: string; label: string };

/* Barre de chapitres des fiches : suit la lecture, et son trait se remplit
   comme un niveau d'eau à mesure qu'on avance dans la page. */
/* Ligne de lecture : bas de l'en-tête (mesuré dans --hdr-bottom) plus la
   barre de chapitres collée quand elle existe. */
function readLine(goingDown = false) {
  // En descendant, l'en-tête se replie et la barre remonte en haut d'écran.
  const hdr = goingDown ? 0 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-bottom")) || 76;
  const bar = document.querySelector<HTMLElement>(".dbody__bar, .gnav");
  return hdr + (bar ? bar.getBoundingClientRect().height + 8 : 0) + 24;
}

export default function Toc({ items, label = "Sur cette page" }: { items: TocItem[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const level = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Chapitre actif : le dernier dont le haut a franchi la ligne de lecture
        // (sous l'en-tête et la barre de chapitres, plus une marge).
        const line = readLine() + 40;
        let cur = els[0].id;
        for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
        setActive(cur);
        const start = first.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
        if (level.current) level.current.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    // Cible calculée en pixels : passer l'élément à Lenis lui ferait retrancher
    // en plus scroll-margin-top et scroll-padding-top (le chapitre s'arrêtait
    // alors 200 px trop bas).
    const down = el.getBoundingClientRect().top > readLine();
    const target = () => Math.max(0, el.getBoundingClientRect().top + window.scrollY - readLine(down && window.scrollY + el.getBoundingClientRect().top > 400));
    setActive(id);
    const lenis = getLenis();
    if (lenis && !prefersReduced()) {
      // Des images chargées pendant le trajet peuvent décaler le chapitre :
      // à l'arrivée, on remesure et on recale (jusqu'à deux fois).
      const glide = (tries: number, duration: number) =>
        lenis.scrollTo(target(), {
          duration,
          onComplete: () => {
            if (tries > 0 && Math.abs(target() - window.scrollY) > 4) glide(tries - 1, 0.5);
          },
        });
      glide(2, 1.2);
    } else window.scrollTo({ top: target() });
    history.replaceState(null, "", `#${id}`);
    const h = el.querySelector<HTMLElement>("h2, h3");
    if (h) {
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    }
  };

  if (items.length < 2) return null;
  return (
    <nav className="toc toc--bar" aria-label={label}>
      <p className="toc__label">{label}</p>
      <div className="toc__track">
        <span className="toc__rail" aria-hidden="true">
          <span ref={level} className="toc__level" />
        </span>
        <ol>
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                onClick={(e) => go(e, i.id)}
                className={active === i.id ? "is-active" : undefined}
                aria-current={active === i.id ? "location" : undefined}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
