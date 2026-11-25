"use client";

import { useEffect, useState } from "react";

export type DecreeToc = { id: string; label: string; articles: { id: string; label: string }[] }[];

/* Sommaire collant du décret : titres et articles, article courant
   signalé (aria-current) pendant la lecture. Sur petit écran, il se replie. */
export default function DecreeNav({ toc }: { toc: DecreeToc }) {
  const [active, setActive] = useState<string>(toc[0]?.articles[0]?.id ?? "");

  useEffect(() => {
    const ids = toc.flatMap((t) => t.articles.map((a) => a.id));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  const list = (
    <ol className="dnav__titres">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="dnav__titre">
            {t.label}
          </a>
          <ol className="dnav__arts">
            {t.articles.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`} className="dnav__art" aria-current={active === a.id ? "location" : undefined}>
                  {a.label}
                </a>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );

  return (
    <nav className="dnav" aria-label="Sommaire du décret">
      <details className="dnav__fold">
        <summary className="dnav__summary">Sommaire du décret</summary>
        {list}
      </details>
      <div className="dnav__full">
        <p className="dnav__head">Sommaire</p>
        {list}
      </div>
    </nav>
  );
}
