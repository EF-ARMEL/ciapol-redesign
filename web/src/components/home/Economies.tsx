"use client";

import { useState } from "react";
import { Reveal, SplitReveal } from "@/motion/primitives";
import type { Tile } from "@/lib/home";

/* Trois économies pour un avenir durable (bloc de l'accueil officiel, liens
   vers leurs définitions de référence). Accordéon sur fond nuit : chaque
   panneau porte une illustration animée dessinée en code (boucle, houle,
   pousse) au lieu des images d'origine. Survol, focus ou clic l'ouvrent. */
const META: Record<string, { key: "circulaire" | "bleue" | "verte"; def: string }> = {
  circulaire: {
    key: "circulaire",
    def: "Produire, consommer, réparer, recycler : les ressources restent en boucle au lieu de finir en déchets.",
  },
  bleue: {
    key: "bleue",
    def: "Tirer parti des océans, des lagunes et des côtes tout en préservant leurs écosystèmes.",
  },
  verte: {
    key: "verte",
    def: "Une croissance qui réduit les pollutions et les émissions et ménage les ressources naturelles.",
  },
};

export default function Economies({ items }: { items: Tile[] }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <section className="surface--nuit section eco3" aria-labelledby="eco-title">
      <div className="shell">
        <div className="eco3__head">
          <div>
            <Reveal>
              <span className="tag eco3__tag">Transition écologique</span>
            </Reveal>
            <SplitReveal as="h2" id="eco-title" className="display eco3__title">
              Trois économies pour un avenir durable
            </SplitReveal>
          </div>
          <p className="eco3__lead">
            Réduire les pollutions à la source, c&apos;est aussi changer la façon de produire. Trois modèles
            économiques y contribuent.
          </p>
        </div>

        <ul className="eco3__panels">
          {items.map((e, i) => {
            const name = e.title.replace(/^[ÉE]conomie\s+/i, "");
            const m = META[name.toLowerCase()] ?? META.verte;
            const isOpen = open === i;
            return (
              <li
                key={e.title}
                className={`eco3__panel eco3__panel--${m.key} ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => setOpen(i)}
                onFocusCapture={() => setOpen(i)}
                onClick={() => setOpen(i)}
              >
                <span className="eco3__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="eco3__art" aria-hidden="true">
                  {m.key === "circulaire" ? <ArtLoop /> : m.key === "bleue" ? <ArtWaves /> : <ArtSprout />}
                </div>
                <div className="eco3__body">
                  <p className="eyebrow eco3__k">Économie</p>
                  <h3 className="display eco3__name">{name}</h3>
                  <p className="eco3__def">{m.def}</p>
                  <a className="eco3__link" href={e.href} target="_blank" rel="noopener noreferrer">
                    Lire la définition<span className="sr-only"> de l&apos;économie {name} (nouvel onglet)</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* Boucle : les ressources tournent au lieu de sortir du cycle. */
function ArtLoop() {
  const steps = ["Produire", "Consommer", "Collecter", "Recycler"];
  return (
    <svg viewBox="0 0 320 320" className="art art--loop">
      <circle cx="160" cy="160" r="112" className="art__ring" />
      <circle cx="160" cy="160" r="112" className="art__flow" pathLength="100" />
      <g className="art__orbit">
        <circle cx="160" cy="48" r="9" className="art__dot" />
      </g>
      {steps.map((s, i) => {
        const a = (i * Math.PI) / 2 - Math.PI / 2;
        const x = 160 + Math.cos(a) * 112;
        const y = 160 + Math.sin(a) * 112;
        const lx = 160 + Math.cos(a) * 146;
        const ly = 160 + Math.sin(a) * 146 + 4;
        return (
          <g key={s} className="art__node" style={{ ["--d" as string]: `${i * 0.25}s` }}>
            <circle cx={x} cy={y} r="14" />
            <text x={lx} y={ly} textAnchor={i === 1 ? "start" : i === 3 ? "end" : "middle"}>{s}</text>
          </g>
        );
      })}
      <text x="160" y="168" textAnchor="middle" className="art__core">0 déchet</text>
    </svg>
  );
}

/* Houle : trois couches d'eau qui ondulent, des bulles qui remontent. */
function ArtWaves() {
  // Houle périodique sur 640 de large (deux fois le cadre) : on la fait glisser de 320.
  const wave = (y: number, amp: number) =>
    `M0 ${y} Q 40 ${y - amp} 80 ${y} ` + Array.from({ length: 7 }, (_, i) => `T ${160 + i * 80} ${y}`).join(" ") + " V320 H0 Z";
  return (
    <svg viewBox="0 0 320 320" className="art art--waves" preserveAspectRatio="xMidYMid slice">
      <circle cx="240" cy="70" r="26" className="art__sun" />
      <g className="art__wave art__wave--1"><path d={wave(150, 18)} /></g>
      <g className="art__wave art__wave--2"><path d={wave(190, 14)} /></g>
      <g className="art__wave art__wave--3"><path d={wave(232, 10)} /></g>
      {[60, 120, 200, 260].map((x, i) => (
        <circle key={x} cx={x} cy={300} r={4 + (i % 2) * 3} className="art__bubble" style={{ ["--d" as string]: `${i * 0.9}s` }} />
      ))}
    </svg>
  );
}

/* Pousse : la tige se dessine, les feuilles s'ouvrent, le soleil respire. */
function ArtSprout() {
  return (
    <svg viewBox="0 0 320 320" className="art art--sprout">
      <circle cx="232" cy="84" r="30" className="art__sun" />
      <path d="M40 262 H280" className="art__ground" />
      <path d="M160 262 C160 220 158 190 162 150" className="art__stem" pathLength="100" />
      <path d="M161 196 C130 192 108 172 104 146 C132 148 154 166 161 196 Z" className="art__leaf art__leaf--l" />
      <path d="M162 168 C190 160 214 138 216 108 C186 112 166 136 162 168 Z" className="art__leaf art__leaf--r" />
      <path d="M100 262 q10 -14 20 0 M196 262 q10 -14 20 0" className="art__grass" />
    </svg>
  );
}
