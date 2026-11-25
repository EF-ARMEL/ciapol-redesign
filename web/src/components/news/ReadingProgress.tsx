"use client";

import { useEffect, useRef } from "react";

/* Fine barre verte de progression de lecture, calée sur l'élément cible
   (le corps de l'article) plutôt que sur toute la page. */
export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(target);
    const b = bar.current;
    if (!el || !b) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      const p = total > 0 ? (window.innerHeight * 0.35 - r.top) / total : 0;
      b.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target]);
  return (
    <div className="rprog" aria-hidden="true">
      <div ref={bar} className="rprog__bar" />
    </div>
  );
}
