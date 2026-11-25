"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type LightboxItem = { src: string; alt: string; caption?: string };

/* Visionneuse accessible : fenêtre modale (aria-modal), focus piégé puis
   rendu au déclencheur, Échap pour fermer, flèches gauche/droite, glisser
   au doigt suivi 1:1. Lenis est neutralisé dans la modale (data-lenis-prevent). */
export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  label = "Visionneuse de photos",
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  label?: string;
}) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [dx, setDx] = useState(0);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (step: number) => {
      if (index === null || items.length < 2) return;
      onIndex((index + step + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  // Ouverture : mémorise le déclencheur, bloque le défilement, focus sur « Fermer ».
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    root.classList.add("lenis-stopped");
    closeRef.current?.focus();
    return () => {
      root.style.overflow = prev;
      root.classList.remove("lenis-stopped");
      opener.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
        if (!f || !f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const down = (e: RPointerEvent) => {
    if (e.pointerType === "mouse") return;
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const move = (e: RPointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    let d = e.clientX - drag.current.x;
    if (items.length < 2) d *= 0.25; // résistance quand il n'y a rien à côté
    setDx(d);
  };
  const up = () => {
    if (!drag.current) return;
    const d = dx;
    drag.current = null;
    setDx(0);
    if (Math.abs(d) > 60) go(d < 0 ? 1 : -1);
  };

  if (!mounted || !open || index === null) return null;
  const item = items[index];

  return createPortal(
    <div className="lbx" data-lenis-prevent="">
      <div className="lbx__scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="lbx__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-describedby="lbx-caption"
      >
        <div className="lbx__bar">
          <p className="lbx__count" aria-live="polite">
            Photo {index + 1} sur {items.length}
          </p>
          <button ref={closeRef} type="button" className="lbx__btn" onClick={onClose} aria-label="Fermer la visionneuse">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <figure
          className="lbx__stage"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className="lbx__img"
            style={dx ? { transform: `translateX(${dx}px)`, transition: "none" } : undefined}
            draggable={false}
          />
          <figcaption id="lbx-caption" className="lbx__caption">
            {item.caption ?? item.alt}
          </figcaption>
        </figure>
        {items.length > 1 ? (
          <div className="lbx__nav">
            <button type="button" className="lbx__btn lbx__btn--txt" onClick={() => go(-1)} aria-label="Photo précédente">
              Précédente
            </button>
            <button type="button" className="lbx__btn lbx__btn--txt" onClick={() => go(1)} aria-label="Photo suivante">
              Suivante
            </button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
