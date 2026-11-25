"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lagoon } from "./lagoon-store";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/* Lenis lisse le scroll (sans le détourner : la molette, le clavier, la barre
   et le tactile restent natifs) et alimente ScrollTrigger + la lagune. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      lagoon.progress = window.scrollY / max;
    };

    if (reduced) {
      const onScroll = () => { update(); };
      window.addEventListener("scroll", onScroll, { passive: true });
      update();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisInstance = lenis;
    lenis.on("scroll", (e: Lenis) => {
      lagoon.velocity = e.velocity * 60;
      update();
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    update();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Changement de page : retour en haut, recalcul des déclencheurs.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    lagoon.override = null;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
