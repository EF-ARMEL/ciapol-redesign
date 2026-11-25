"use client";

import { useEffect, useRef } from "react";

export type Station = { name: string; detail?: string };

/* RNO : les trois volets du réseau, comme des stations d'observation posées
   le long d'un trait de côte. Le littoral se trace, puis chaque station
   s'allume et émet son onde de mesure. Schéma, pas une carte. */
export default function StationLine({ stations, label }: { stations: Station[]; label: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-live");
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="stations">
      <svg className="stations__coast" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="stations__sea" d="M0 70 C 120 40, 220 96, 340 66 S 560 30, 680 64 S 880 100, 1000 58 L1000 120 L0 120 Z" />
        <path className="stations__shore" pathLength={1} d="M0 70 C 120 40, 220 96, 340 66 S 560 30, 680 64 S 880 100, 1000 58" />
      </svg>
      <ul className="stations__list" aria-label={label}>
        {stations.map((s, i) => (
          <li key={s.name} className="stations__item" style={{ ["--i" as string]: i }}>
            <span className="stations__buoy" aria-hidden="true">
              <i />
            </span>
            <span className="stations__name display">
              {s.name}
              {s.detail ? <span className="sr-only"> – </span> : null}
            </span>
            {s.detail ? <span className="stations__detail">{s.detail}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
