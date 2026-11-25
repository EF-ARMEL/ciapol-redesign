"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/* Façade « clic pour charger » : aucune requête vers YouTube tant que la
   personne n'a pas choisi de lancer la vidéo ; le lecteur est ensuite servi
   par youtube-nocookie.com (mode confidentialité renforcée). La vignette est
   une image locale (couverture d'article ou vignette archivée). */
export default function VideoFacade({
  id,
  title,
  poster,
  className = "",
}: {
  id: string;
  title: string;
  poster?: string;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <div className={`vfac ${on ? "is-on" : ""} ${className}`}>
      {on ? (
        <iframe
          className="vfac__frame"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className="vfac__btn" onClick={() => setOn(true)}>
          {poster ? (
            <img src={poster} alt="" loading="lazy" decoding="async" className="vfac__poster" />
          ) : (
            <span className="vfac__poster vfac__poster--empty" aria-hidden="true" />
          )}
          <span className="vfac__shade" aria-hidden="true" />
          <span className="vfac__play" aria-hidden="true">
            <Play size={26} fill="currentColor" />
          </span>
          <span className="sr-only">Lire la vidéo : {title}</span>
          <span className="vfac__note eyebrow" aria-hidden="true">
            Lecture via YouTube
          </span>
        </button>
      )}
    </div>
  );
}
