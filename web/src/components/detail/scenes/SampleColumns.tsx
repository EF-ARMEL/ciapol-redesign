"use client";

import { useEffect, useRef } from "react";

export type SampleColumn = { title: string; items: string[] };

/* LCE : la liste officielle des analyses, en trois éprouvettes. À l'entrée
   dans l'écran, le prélèvement décante : le trouble se dépose au fond et
   l'échantillon s'éclaircit, puis les analyses s'affichent. Le contenu reste
   une liste lisible sans animation. */
export default function SampleColumns({ columns, caption }: { columns: SampleColumn[]; caption: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-settled");
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="samples" role="group" aria-label={caption}>
      {columns.map((c, i) => (
        <div key={c.title} className="samples__col" style={{ ["--i" as string]: i }}>
          <svg className="samples__vial" viewBox="0 0 60 150" aria-hidden="true">
            <defs>
              <clipPath id={`vial-${i}`}>
                <path d="M14 8h32v112a16 16 0 0 1-32 0z" />
              </clipPath>
            </defs>
            <g clipPath={`url(#vial-${i})`}>
              <rect className="samples__liquid" x="0" y="44" width="60" height="110" />
              <rect className="samples__silt" x="0" y="44" width="60" height="110" />
            </g>
            <path className="samples__glass" d="M14 8h32v112a16 16 0 0 1-32 0z" fill="none" />
            <path className="samples__lip" d="M9 8h42" />
          </svg>
          <h3 className="samples__title display">{c.title}</h3>
          <ul className="samples__list">
            {c.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
