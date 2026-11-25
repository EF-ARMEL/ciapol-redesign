"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

/* Image agrandissable : un bouton qui ouvre la visionneuse accessible. */
export default function ZoomImage({
  src,
  alt,
  caption,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  eager?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <button type="button" className={`zoom ${className}`} onClick={() => setOpen(0)} aria-label={`Agrandir l'image : ${alt}`}>
        <img src={src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
      </button>
      <Lightbox items={[{ src, alt, caption }]} index={open} onClose={() => setOpen(null)} onIndex={setOpen} label={alt} />
    </>
  );
}
