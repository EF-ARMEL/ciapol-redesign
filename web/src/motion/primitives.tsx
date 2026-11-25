"use client";

/* ==========================================================================
   Primitives de mouvement — la grammaire commune du site.
   Une seule signature d'easing (expo.out pour les entrées, quart pour les
   transitions), une seule amplitude de translation (yPercent 110 sur masque).
   Tout est neutralisé sous prefers-reduced-motion.
   ========================================================================== */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Poly<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style">;

/* ------------------------------------------------------------ SplitReveal
   Titre révélé ligne par ligne (masques) puis caractère par caractère. */
export function SplitReveal<T extends ElementType = "h2">({
  as,
  children,
  className = "",
  style,
  mode = "lines",
  delay = 0,
  immediate = false,
  ...rest
}: Poly<T> & { mode?: "lines" | "chars" | "words"; delay?: number; immediate?: boolean }) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useIso(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: mode === "lines" ? "lines" : mode === "words" ? "words,lines" : "chars,words,lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          const targets = mode === "lines" ? self.lines : mode === "words" ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: 115,
            rotate: mode === "chars" ? 4 : 0,
            duration: mode === "chars" ? 1.1 : 1.25,
            ease: "expo.out",
            stagger: mode === "chars" ? 0.022 : mode === "words" ? 0.05 : 0.11,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          });
        },
      });
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [mode, delay, immediate]);

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ Reveal
   Bloc qui monte depuis un léger flou — l'eau qui se clarifie. Les enfants
   directs marqués data-reveal-item sont échelonnés. */
export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className = "",
  style,
  delay = 0,
  y = 46,
  stagger = 0.09,
  ...rest
}: Poly<T> & { delay?: number; y?: number; stagger?: number }) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useIso(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
      const targets = items.length ? Array.from(items) : [el];
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 1.3,
        ease: "expo.out",
        stagger,
        delay,
        clearProps: "filter",
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger]);

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ Parallax */
export function Parallax({
  children,
  className = "",
  amount = 12,
  scale = 1.14,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -amount, scale },
        {
          yPercent: amount,
          scale,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [amount, scale]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ ImageReveal
   Rideau qui se retire (clip-path) + léger dézoom : la photo émerge. */
export function ImageReveal({
  children,
  className = "",
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const start =
      from === "left" ? "inset(0 100% 0 0)" : from === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      tl.fromTo(el, { clipPath: start }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
      const media = el.querySelector("img, video");
      if (media) tl.fromTo(media, { scale: 1.35 }, { scale: 1, duration: 1.9, ease: "expo.out" }, 0.1);
    }, el);
    return () => ctx.revert();
  }, [from]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ Counter */
export function Counter({
  value,
  suffix = "",
  className = "",
  duration = 2.2,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      el.textContent = value.toLocaleString("fr-FR") + suffix;
      return;
    }
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: value,
        duration,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toLocaleString("fr-FR") + suffix;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [value, suffix, duration]);
  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------ Magnetic
   Attraction douce vers le curseur (boutons d'action principaux). */
export function Magnetic({ children, strength = 0.32 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  );
}
