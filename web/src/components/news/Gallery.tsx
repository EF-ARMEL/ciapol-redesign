"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { X, Expand } from "lucide-react";
import { getLenis } from "@/motion/SmoothScroll";

/* Galerie de l'article : mosaïque (colonnes CSS) + visionneuse accessible
   (<dialog> modal : Échap ferme, flèches naviguent, focus piégé puis rendu
   à la vignette d'origine). */
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const n = images.length;

  const open = (i: number, btn: HTMLButtonElement) => {
    opener.current = btn;
    setIndex(i);
  };
  const close = useCallback(() => dlg.current?.close(), []);
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    const d = dlg.current;
    if (!d || index === null || d.open) return;
    d.showModal();
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
  }, [index]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => {
      setIndex(null);
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      opener.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Tab") {
      const f = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <>
      <ul className="gal" aria-label={`Photos (${n})`}>
        {images.map((src, i) => (
          <li key={src} className="gal__item">
            <button type="button" className="gal__btn" onClick={(e) => open(i, e.currentTarget)}>
              <img src={src} alt="" loading="lazy" decoding="async" />
              <span className="gal__zoom" aria-hidden="true">
                <Expand size={18} />
              </span>
              <span className="sr-only">
                Agrandir la photo {i + 1} sur {n}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dlg}
        className="lbox"
        aria-modal="true"
        aria-label={`Visionneuse de photos : ${title}`}
        onKeyDown={onKey}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        data-lenis-prevent
      >
        {index !== null ? (
          <div className="lbox__inner">
            <div className="lbox__top">
              <p className="eyebrow lbox__count" aria-live="polite">
                Photo {index + 1} / {n}
              </p>
              <button type="button" className="lbox__btn" onClick={close} aria-label="Fermer la visionneuse" autoFocus>
                <X size={22} />
              </button>
            </div>
            <figure className="lbox__fig" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
              <img key={images[index]} src={images[index]} alt={`Photo ${index + 1} sur ${n}, ${title}`} />
            </figure>
            {n > 1 ? (
              <div className="lbox__nav">
                <button type="button" className="lbox__step" onClick={() => go(-1)} aria-label="Photo précédente">
                  Précédente
                </button>
                <button type="button" className="lbox__step" onClick={() => go(1)} aria-label="Photo suivante">
                  Suivante
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
