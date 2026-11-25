"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getLenis } from "@/motion/SmoothScroll";
import { prefersReduced } from "@/motion/primitives";

export type TocItem = { id: string; label: string };

/* Sommaire de la page (grand écran) : suit la lecture. Le trait vertical se
   remplit comme un niveau d'eau à mesure qu'on avance dans la page. */
export default function Toc({ items, label = "Sur cette page" }: { items: TocItem[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const level = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));

    const first = els[0];
    const last = els[els.length - 1];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const start = first.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
        if (level.current) level.current.style.transform = `scaleY(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis && !prefersReduced()) lenis.scrollTo(el, { offset: -110, duration: 1.2 });
    else el.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${id}`);
    const h = el.querySelector<HTMLElement>("h2, h3");
    if (h) {
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    }
  };

  if (items.length < 2) return null;
  return (
    <nav className="toc" aria-label={label}>
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
