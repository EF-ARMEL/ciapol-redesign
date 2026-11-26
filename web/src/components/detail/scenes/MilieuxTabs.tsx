"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Milieu = { label: string; items: string[] };

/* UNIPOL : les milieux récepteurs (sol, air, zones côtières) en onglets.
   Clavier : flèches gauche / droite, Début, Fin (motif ARIA « tabs »). */
export default function MilieuxTabs({ milieux, id = "milieux" }: { milieux: Milieu[]; id?: string }) {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = milieux.length;
    let next = cur;
    if (e.key === "ArrowRight") next = (cur + 1) % n;
    else if (e.key === "ArrowLeft") next = (cur - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setCur(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="milieux" data-milieu={cur}>
      <div role="tablist" aria-label="Milieux récepteurs" className="milieux__tabs">
        {milieux.map((m, i) => (
          <button
            key={m.label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={cur === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={cur === i ? 0 : -1}
            className="milieux__tab"
            onClick={() => setCur(i)}
            onKeyDown={onKey}
          >
            {m.label}
          </button>
        ))}
      </div>
      {milieux.map((m, i) => (
        <div
          key={m.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={cur !== i}
          className="milieux__panel"
          tabIndex={0}
        >
          <ul className="milieux__list">
            {m.items.map((it, j) => (
              <li key={j} style={{ ["--j" as string]: j }} dangerouslySetInnerHTML={{ __html: it }} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
