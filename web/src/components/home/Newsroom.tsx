"use client";

import { useState } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import FitImage from "@/components/ui/FitImage";
import Button from "@/components/ui/Button";
import { Reveal, SplitReveal } from "@/motion/primitives";

type NewsItem = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  excerpt?: string;
  category?: string;
};

const fmt = (iso: string, month: "long" | "short" = "long") =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month, year: "numeric" }).format(new Date(iso));

/* « Le fil du terrain » : remplace le grand carrousel « À la une » et le bloc
   « Dernières publications ». Une visionneuse montre la photo EN ENTIER (aucun
   recadrage) ; la liste numérotée des temps forts la pilote. La jauge de
   l'élément actif se remplit comme un niveau d'eau puis passe au suivant ;
   le survol ou le focus la met en pause. */
export default function Newsroom({ featured, latest }: { featured: NewsItem[]; latest: NewsItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const cur = featured[active];
  if (!cur) return null;

  const next = () => setActive((i) => (i + 1) % featured.length);

  return (
    <section className="fil surface section" aria-labelledby="fil-title">
      <div className="shell">
        <div className="fil__head">
          <div className="fil__head-l">
            <Reveal>
              <span className="tag">Actualités</span>
            </Reveal>
            <SplitReveal as="h2" id="fil-title" className="display fil__title">
              Le fil du terrain
            </SplitReveal>
          </div>
          <div className="fil__head-r">
            <p className="fil__lead">
              Interventions, inspections, ateliers et distinctions : les temps forts de l&apos;action du CIAPOL.
            </p>
            <Button href="/actualites/" variant="primary">Toutes les actualités</Button>
          </div>
        </div>

        <div
          className={`fil__grid ${paused ? "is-paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <article className="fil__viewer" aria-live="polite">
            <TransitionLink href={`/actualites/${cur.slug}/`} className="fil__frame" aria-label={cur.title}>
              {featured.map((f, i) =>
                f.cover ? (
                  <span key={f.slug} className={`fil__shot ${i === active ? "is-on" : ""}`} aria-hidden={i !== active}>
                    <FitImage src={f.cover} eager={i === 0} />
                  </span>
                ) : null,
              )}
              <span className="fil__stamp display" aria-hidden="true">
                {String(active + 1).padStart(2, "0")}
              </span>
            </TransitionLink>
            <div className="fil__caption" key={cur.slug}>
              <p className="eyebrow fil__meta">
                <time dateTime={cur.date}>{fmt(cur.date)}</time>
                {cur.category ? <span>{cur.category}</span> : null}
              </p>
              <h3 className="fil__h">
                <TransitionLink href={`/actualites/${cur.slug}/`}>
                  <span>{cur.title}</span>
                </TransitionLink>
              </h3>
            </div>
          </article>

          <ol className="fil__list" aria-label="Temps forts">
            {featured.map((f, i) => (
              <li key={f.slug} className={`fil__item ${i === active ? "is-on" : ""}`}>
                <TransitionLink
                  href={`/actualites/${f.slug}/`}
                  className="fil__link"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="fil__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fil__txt">
                    <span className="eyebrow fil__date">{fmt(f.date, "short")}</span>
                    <span className="fil__t">{f.title}</span>
                  </span>
                </TransitionLink>
                <span className="fil__gauge" aria-hidden="true">
                  {i === active ? <i key={`${f.slug}-${active}`} onAnimationEnd={next} /> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {latest.length ? (
          <div className="fil__latest">
            <p className="eyebrow fil__latest-k">Dernières publications</p>
            <Reveal as="ul" className="fil__latest-list">
              {latest.map((a) => (
                <li key={a.slug} data-reveal-item>
                  <TransitionLink href={`/actualites/${a.slug}/`} className="fil__mini">
                    <span className="fil__mini-media">{a.cover ? <FitImage src={a.cover} /> : null}</span>
                    <span className="fil__mini-body">
                      <span className="eyebrow fil__date">{fmt(a.date, "short")}</span>
                      <span className="fil__mini-t">{a.title}</span>
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </Reveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
