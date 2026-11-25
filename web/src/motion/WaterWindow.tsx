"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { lagoon } from "./lagoon-store";

type Props<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/* Section transparente qui laisse voir la lagune fixe en dessous.
   Elle se déclare visible auprès du moteur : tant qu'aucune fenêtre n'est à
   l'écran, le shader ne calcule rien. */
export default function WaterWindow<T extends ElementType = "section">({ as, children, className = "", ...rest }: Props<T>) {
  const Tag = (as ?? "section") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) { visible = true; lagoon.windows++; }
        else if (!entry.isIntersecting && visible) { visible = false; lagoon.windows--; }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (visible) lagoon.windows--;
    };
  }, []);

  return (
    <Tag ref={ref} data-water="" className={`water-window ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
