"use client";

import { useState, type ReactNode } from "react";

/* Façade « cliquer pour charger » : aucun contenu tiers (et donc aucun
   traceur) n'est chargé avant l'action explicite du visiteur. Le lien
   direct reste toujours disponible. */
export default function EmbedFacade({
  src,
  title,
  provider,
  openHref,
  openLabel,
  children,
  ratio = "16 / 10",
}: {
  src: string;
  title: string;
  provider: string;
  openHref: string;
  openLabel: string;
  children?: ReactNode;
  ratio?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <div className="embed" style={{ aspectRatio: ratio }}>
      {on ? (
        <iframe src={src} title={title} className="embed__frame" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="embed__facade">
          {children}
          <p className="embed__note">
            Ce contenu est fourni par {provider}. Il ne se charge qu&apos;à votre demande.
          </p>
          <div className="embed__actions">
            <button type="button" className="embed__load" onClick={() => setOn(true)}>
              Afficher ici
            </button>
            <a className="link embed__open" href={openHref} target="_blank" rel="noopener noreferrer">
              {openLabel}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
