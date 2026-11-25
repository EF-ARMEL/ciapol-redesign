"use client";

import { useState } from "react";
import { Play, Quote } from "lucide-react";
import TransitionLink from "@/components/ui/TransitionLink";
import Button from "@/components/ui/Button";
import { Reveal, SplitReveal } from "@/motion/primitives";
import type { Video } from "@/lib/home";

/* « Mot du directeur » + « Vidéos » de l'ancienne colonne latérale, réunis
   en un diptyque. Les vidéos YouTube ne se chargent qu'au clic (aucun
   traceur tiers avant consentement implicite), via youtube-nocookie. */
export default function Voices({ videos, director }: { videos: Video[]; director?: { title: string; href: string; excerpt?: string } }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [main, ...others] = videos;

  return (
    <section className="surface--nuit section voices" aria-labelledby="voices-title">
      <div className="shell voices__grid">
        <div className="voices__dir">
          <Reveal><span className="tag voices__tag">Mot du directeur</span></Reveal>
          <Quote className="voices__q" size={64} strokeWidth={1.2} aria-hidden="true" />
          <SplitReveal as="h2" id="voices-title" mode="lines" className="voices__title display">
            {director?.title ?? "La parole du Directeur"}
          </SplitReveal>
          {director?.excerpt ? <Reveal delay={0.1}><p className="voices__ex">{director.excerpt}</p></Reveal> : null}
          <Reveal delay={0.2}>
            <Button href={director?.href ?? "/mot-du-directeur/"} variant="light">Lire le mot du directeur</Button>
          </Reveal>
        </div>

        {main ? (
          <div className="voices__vid">
            <div className="voices__head">
              <span className="tag voices__tag">Vidéos</span>
              <TransitionLink href="/videos/" className="voices__all">Toutes les vidéos</TransitionLink>
            </div>
            <div className="voices__player">
              {playing === main.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${main.id}?autoplay=1&rel=0`}
                  title={main.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="voices__facade" onClick={() => setPlaying(main.id)} aria-label={`Lire la vidéo : ${main.title}`}>
                  {main.thumb ? <img src={main.thumb} alt="" loading="lazy" /> : null}
                  <span className="voices__play"><Play size={26} fill="currentColor" /></span>
                  <span className="voices__cap">{main.title === "Vidéo YouTube" ? "Le CIAPOL en vidéo" : main.title}</span>
                </button>
              )}
            </div>
            <ul className="voices__list">
              {others.map((v) => (
                <li key={v.id}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="voices__item">
                    {v.thumb ? <img src={v.thumb} alt="" loading="lazy" /> : null}
                    <span>{v.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
