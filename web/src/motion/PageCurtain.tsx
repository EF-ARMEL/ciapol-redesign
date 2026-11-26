"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

/* Transition entre pages : une vague bleue CIAPOL monte, la page change sous
   l'eau, puis l'eau se retire par le haut. Déclenchée par TransitionLink via
   l'événement « ciapol:navigate ». Le bord de la vague est un chemin SVG animé. */

const FLAT = "M0 0 H100 V0 Q50 0 0 0 Z";

export default function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef<string | null>(null);
  const safety = useRef<number | undefined>(undefined);

  // Nouvelle page montée : l'eau se retire vers le haut.
  const retreat = () => {
    const el = root.current;
    if (!el) return;
    window.clearTimeout(safety.current);
    const label = el.querySelector<HTMLElement>(".curtain__label")!;
    gsap.killTweensOf(el);
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
        pending.current = null;
        gsap.set(el, { visibility: "hidden", yPercent: 100 });
      },
    });
    tl.to(label, { autoAlpha: 0, y: -24, duration: 0.2, ease: "power3.in" })
      .to(el, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, 0.05);
  };

  useEffect(() => {
    const onNav = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      const el = root.current;
      if (!el || busy.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = href;
      // La page est demandée dès le clic : elle charge pendant que l'eau monte.
      router.prefetch(href);
      // Sécurité : si la navigation n'aboutit pas, l'eau se retire quand même.
      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => {
        if (busy.current) retreat();
      }, 4000);
      const wave = el.querySelector<SVGPathElement>(".curtain__wave")!;
      const label = el.querySelector<HTMLElement>(".curtain__label")!;
      gsap.set(el, { visibility: "visible" });
      const tl = gsap.timeline();
      tl.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: "power3.inOut" })
        .fromTo(wave, { attr: { d: "M0 100 H100 V100 Q50 100 0 100 Z" } }, { attr: { d: "M0 100 H100 V0 Q50 -60 0 0 Z" }, duration: 0.45, ease: "power3.inOut" }, 0)
        .fromTo(label, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "expo.out" }, 0.15)
        // La navigation part avant que l'eau ait fini de monter.
        .add(() => router.push(href), 0.3);
    };
    window.addEventListener("ciapol:navigate", onNav);
    return () => window.removeEventListener("ciapol:navigate", onNav);
  }, [router]);

  useEffect(() => {
    if (busy.current) retreat();
  }, [pathname]);

  return (
    <div ref={root} className="curtain" aria-hidden="true">
      <svg className="curtain__edge" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="curtain__wave" d={FLAT} />
      </svg>
      <div className="curtain__body">
        <p className="curtain__label display">CIAPOL</p>
      </div>
    </div>
  );
}
