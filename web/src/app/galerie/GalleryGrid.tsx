"use client";

import { useMemo, useRef, useState } from "react";
import Lightbox from "@/components/institution/Lightbox";

export type GalleryPhoto = { src: string; alt: string; albums: string[] };

/* Galerie maçonnerie filtrable (albums officiels) + visionneuse. */
export default function GalleryGrid({ photos, albums, labels }: { photos: GalleryPhoto[]; albums: string[]; labels: Record<string, string> }) {
  const L = (a: string) => labels[a] ?? a;
  const [album, setAlbum] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  const shown = useMemo(() => (album ? photos.filter((p) => p.albums.includes(album)) : photos), [album, photos]);
  const items = useMemo(
    () => shown.map((p) => ({ src: p.src, alt: p.alt, caption: `${p.alt}. Album : ${p.albums.map(L).join(", ")}` })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- L ne dépend que de labels (props stables)
    [shown],
  );

  return (
    <div className="gal">
      <div className="gal__filters" role="group" aria-label="Filtrer par album">
        {[null, ...albums].map((a) => {
          const count = a ? photos.filter((p) => p.albums.includes(a)).length : photos.length;
          const on = album === a;
          return (
            <button
              key={a ?? "tous"}
              type="button"
              className={`gal__filter ${on ? "is-on" : ""}`}
              aria-pressed={on}
              onClick={() => setAlbum(a)}
            >
              {a ? L(a) : "Tous"} <span className="gal__count">{count}</span>
            </button>
          );
        })}
      </div>

      <h2 className="display gal__h" aria-live="polite">
        {album ? L(album) : "Toutes les photos"}
      </h2>

      <ul ref={gridRef} className="gal__grid" key={album ?? "tous"}>
        {shown.map((p, i) => (
          <li key={`${p.src}-${i}`} className="gal__item" style={{ animationDelay: `${Math.min(i, 10) * 60}ms` }}>
            <button type="button" className="gal__btn" onClick={() => setOpen(i)} aria-label={`Agrandir : ${p.alt}`}>
              <img src={p.src} alt="" loading="eager" decoding="async" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} label="Galerie photos du CIAPOL" />
    </div>
  );
}
