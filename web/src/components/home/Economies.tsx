import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/motion/primitives";
import type { Tile } from "@/lib/home";

const TONES = ["circulaire", "bleue", "verte"];

/* Trois économies durables (bloc de l'ancien accueil, liens vers leurs
   définitions de référence). Tuiles hautes à l'italienne, teintées chacune
   d'une couleur de la charte. */
export default function Economies({ items }: { items: Tile[] }) {
  if (!items.length) return null;
  return (
    <section className="surface--white section eco" aria-labelledby="eco-title">
      <div className="shell">
        <SectionHeading id="eco-title" tag="Transition écologique" title="Trois économies pour un avenir durable" />
        <Reveal className="eco__grid">
          {items.map((e, i) => (
            <a
              key={e.title}
              data-reveal-item
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`eco__tile eco__tile--${TONES[i] ?? "verte"}`}
            >
              {e.image ? <img src={e.image} alt="" loading="lazy" decoding="async" /> : null}
              <span className="eco__label">
                <span className="eyebrow">Économie</span>
                <span className="eco__name display">{e.title.replace(/^Economie\s+/i, "")}</span>
                <span className="eco__more">Définition</span>
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
