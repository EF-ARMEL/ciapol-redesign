"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/ui/TransitionLink";

/* Navigation locale du sous-site GIAMSUC : onglets collants sous l'en-tête.
   Quand l'en-tête du site se masque au défilement, la barre remonte en haut. */
export default function GiamsucNav({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const [top, setTop] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const norm = (s: string) => s.replace(/\/+$/, "") || "/";
  const current = (href: string) =>
    href === "/projets/giamsuc/" ? norm(pathname) === norm(href) : norm(pathname).startsWith(norm(href));

  useEffect(() => {
    const hdr = document.querySelector(".hdr");
    if (!hdr) return;
    let raf = 0;
    /* Bas réel de l'en-tête (barre gouvernementale repliée ou non). */
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hidden = hdr.classList.contains("is-hidden");
        setTop(hidden ? 0 : Math.max(0, Math.round(hdr.getBoundingClientRect().bottom)));
      });
    };
    sync();
    const mo = new MutationObserver(() => {
      sync();
      window.setTimeout(sync, 750); // après la transition de l'en-tête
    });
    mo.observe(hdr, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", sync);
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Onglet courant visible sur petit écran. */
  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>("[aria-current='page']");
    if (el && list.current) list.current.scrollLeft = el.offsetLeft - 24;
  }, [pathname]);

  return (
    <nav className="gnav" style={top !== null ? { top } : undefined} aria-label="Navigation du projet GIAMSUC">
      <div className="shell gnav__inner">
        <span className="gnav__brand eyebrow" aria-hidden="true">
          GIAMSUC
        </span>
        <ul ref={list} className="gnav__list">
          {tabs.map((t) => (
            <li key={t.href}>
              <TransitionLink href={t.href} className="gnav__link" aria-current={current(t.href) ? "page" : undefined}>
                {t.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
