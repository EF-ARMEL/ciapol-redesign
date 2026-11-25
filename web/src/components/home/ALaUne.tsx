"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TransitionLink from "@/components/ui/TransitionLink";
import SectionHeading from "@/components/ui/SectionHeading";

export type Slide = { slug: string; title: string; date: string; cover?: string; excerpt?: string; category?: string };

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));

/* « À la une » : les articles mis en vedette par le CIAPOL (même sélection
   que le carrousel de l'ancien site). Piste horizontale à défilement natif
   (scroll-snap : tactile, trackpad, clavier), défilement automatique doux
   suspendu au survol / focus, compteur et barre de progression. */
export default function ALaUne({ slides }: { slides: Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + slides.length) % slides.length;
    const card = el.children[n] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, [slides.length]);

  // Index courant = carte la plus proche du bord gauche.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      let best = 0, dist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < dist) { dist = d; best = i; }
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(index + 1), 6500);
    return () => window.clearTimeout(id);
  }, [index, paused, go]);

  return (
    <section className="une surface section" aria-labelledby="une-title">
      <div className="shell">
        <SectionHeading
          id="une-title"
          tag="À la une"
          title="L'actualité du terrain"
          lead="Interventions, inspections, ateliers, distinctions : les temps forts de l'action du CIAPOL, sélectionnés par la rédaction."
          action={
            <div className="une__ctrl">
              <span className="une__count display" aria-live="polite">
                {String(index + 1).padStart(2, "0")}
                <small>/{String(slides.length).padStart(2, "0")}</small>
              </span>
              <button type="button" className="une__btn" onClick={() => go(index - 1)} aria-label="Article précédent">
                <ArrowLeft size={20} />
              </button>
              <button type="button" className="une__btn" onClick={() => go(index + 1)} aria-label="Article suivant">
                <ArrowRight size={20} />
              </button>
            </div>
          }
        />
      </div>

      <div
        ref={track}
        className="une__track"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Articles à la une"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        }}
      >
        {slides.map((s, i) => (
          <article
            key={s.slug}
            className={`une__card ${i === index ? "is-active" : ""}`}
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${slides.length}`}
          >
            <TransitionLink href={`/actualites/${s.slug}/`} className="une__link">
              <div className="une__media">
                {s.cover ? <img src={s.cover} alt="" loading={i < 2 ? "eager" : "lazy"} decoding="async" /> : null}
              </div>
              <div className="une__body">
                <p className="eyebrow une__meta">
                  <time dateTime={s.date}>{fmt(s.date)}</time>
                  {s.category ? <span>· {s.category}</span> : null}
                </p>
                <h3 className="une__title">{s.title}</h3>
                <span className="une__more">En savoir +</span>
              </div>
            </TransitionLink>
          </article>
        ))}
      </div>

      <div className="shell">
        <div className="une__progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${(index + 1) / slides.length})` }} />
        </div>
      </div>
    </section>
  );
}
