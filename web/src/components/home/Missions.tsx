"use client";

import { useState } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Tile } from "@/lib/home";

const LINKS = ["/qualite-de-lair/", "/services/cipomar/", "/services/lce/", "/projets/rno/"];

/* Les quatre missions du diaporama d'accueil historique (archives du site
   officiel) : panneaux qui s'ouvrent au survol / focus, image qui passe du
   trouble au net. Sur mobile : cartes empilées. */
export default function Missions({ items }: { items: Tile[] }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <section className="surface section missions" aria-labelledby="missions-title">
      <div className="shell">
        <SectionHeading
          id="missions-title"
          tag="Nos missions"
          title="Mesurer, surveiller, évaluer"
          lead="Le CIAPOL est chargé du suivi de l'état de l'environnement et de l'application des textes et conventions en matière de pollution."
        />
        <ul className="missions__row">
          {items.map((m, i) => (
            <li
              key={m.title}
              className={`missions__item ${open === i ? "is-open" : ""}`}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
            >
              <TransitionLink href={LINKS[i] ?? "/services/"} className="missions__link">
                {m.image ? <img src={m.image} alt="" loading="lazy" decoding="async" /> : null}
                <span className="missions__n display" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="missions__body">
                  <span className="missions__title" data-long={m.title.length > 30 ? "" : undefined}>{m.title}</span>
                  <span className="missions__more">En savoir +</span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
