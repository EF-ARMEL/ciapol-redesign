import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/motion/primitives";
import type { Tile } from "@/lib/home";

/* Structures (tutelles et organismes sœurs) + partenaires + réseau social :
   l'ancienne colonne latérale de l'accueil, réunie en un « écosystème ». */
export default function Ecosysteme({ structures, partners, facebook }: { structures: Tile[]; partners: Tile[]; facebook?: string }) {
  const marquee = [...partners, ...partners];
  return (
    <section className="surface--white section ecosys" aria-labelledby="ecosys-title">
      <div className="shell">
        <SectionHeading
          id="ecosys-title"
          tag="Structures & partenaires"
          title="Un écosystème institutionnel"
          lead="Le CIAPOL agit aux côtés des structures du Ministère en charge de l'Environnement et de ses partenaires."
        />
        <Reveal className="ecosys__structs">
          {structures.map((s) => (
            <a key={s.title} data-reveal-item href={s.href} target="_blank" rel="noopener noreferrer" className="ecosys__struct">
              <span className="ecosys__logo">{s.image ? <img src={s.image} alt="" loading="lazy" /> : null}</span>
              <span className="ecosys__name">{s.title}</span>
            </a>
          ))}
        </Reveal>
      </div>

      <div className="ecosys__marquee" aria-label="Partenaires">
        <div className="ecosys__track">
          {marquee.map((p, i) => (
            <a
              key={`${p.title}-${i}`}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ecosys__partner"
              aria-hidden={i >= partners.length ? true : undefined}
              tabIndex={i >= partners.length ? -1 : undefined}
              title={p.title}
            >
              {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <span>{p.title}</span>}
            </a>
          ))}
        </div>
      </div>

      {facebook ? (
        <div className="shell ecosys__social">
          <span className="eyebrow">Réseau social</span>
          <a href={facebook} target="_blank" rel="noopener noreferrer" className="ecosys__fb">
            Suivre le CIAPOL sur Facebook
          </a>
        </div>
      ) : null}
    </section>
  );
}
