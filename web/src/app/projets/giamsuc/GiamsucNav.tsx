"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/ui/TransitionLink";

/* Navigation locale du sous-site GIAMSUC : onglets collants sous l'en-tête
   (position calée en CSS sur --hdr-bottom, mesuré par l'en-tête lui-même). */
export default function GiamsucNav({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const list = useRef<HTMLUListElement>(null);
  const norm = (s: string) => s.replace(/\/+$/, "") || "/";
  const current = (href: string) =>
    href === "/projets/giamsuc/" ? norm(pathname) === norm(href) : norm(pathname).startsWith(norm(href));

  /* Onglet courant visible sur petit écran. */
  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>("[aria-current='page']");
    if (el && list.current) list.current.scrollLeft = el.offsetLeft - 24;
  }, [pathname]);

  return (
    <nav className="gnav" aria-label="Navigation du projet GIAMSUC">
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
