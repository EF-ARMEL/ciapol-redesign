"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Carte des postes d'observation : une sonde parcourt les stations une à une,
   marque chaque prélèvement (la station passe au vert, une onde se propage)
   et laisse une trace du parcours. Coordonnées dans le repère de l'image
   (900 × 793), placées sur les triangles de la carte officielle. */
const W = 900;
const H = 793;
const STATIONS: [number, number][] = [
  [210, 595], [198, 558], [203, 474], [325, 546], [408, 533], [517, 525], [548, 540], [580, 540],
  [583, 508], [527, 467], [495, 469], [438, 471], [389, 476], [336, 449], [385, 429], [450, 402],
  [560, 398], [586, 362], [624, 280], [605, 172], [474, 250], [415, 308], [372, 314], [290, 385],
  [290, 340], [272, 289], [316, 281], [398, 226], [409, 189], [405, 142], [408, 109], [367, 158],
  [290, 149], [297, 64], [191, 152], [181, 259], [196, 337], [139, 351], [117, 411], [201, 413],
];

export default function RnoMap({ src, alt }: { src: string; alt: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const probe = el.querySelector<SVGGElement>(".rno-map__probe")!;
    const trail = el.querySelector<SVGPolylineElement>(".rno-map__trail")!;
    const dots = Array.from(el.querySelectorAll<SVGCircleElement>(".rno-map__dot"));
    const rings = Array.from(el.querySelectorAll<SVGCircleElement>(".rno-map__ring"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dots.forEach((d) => d.classList.add("is-on"));
      trail.setAttribute("points", STATIONS.map((p) => p.join(",")).join(" "));
      gsap.set(probe, { x: STATIONS[0][0], y: STATIONS[0][1] });
      // Préférence lue au navigateur seulement : l'état final est posé ici.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(STATIONS.length);
      return;
    }

    const pts: string[] = [];
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
    tl.call(() => {
      pts.length = 0;
      trail.setAttribute("points", "");
      dots.forEach((d) => d.classList.remove("is-on"));
      setCount(0);
    });
    tl.set(probe, { x: STATIONS[0][0], y: STATIONS[0][1], autoAlpha: 1 });
    STATIONS.forEach(([x, y], i) => {
      if (i > 0) tl.to(probe, { x, y, duration: 0.55, ease: "power2.inOut" });
      tl.call(() => {
        pts.push(`${x},${y}`);
        trail.setAttribute("points", pts.join(" "));
        dots[i].classList.add("is-on");
        setCount(i + 1);
      });
      tl.fromTo(rings[i], { attr: { r: 6 }, autoAlpha: 0.9 }, { attr: { r: 30 }, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, "<");
      tl.to({}, { duration: 0.18 });
    });
    tl.to(probe, { autoAlpha: 0, duration: 0.4 }, "+=0.8");

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      end: "bottom 10%",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <figure ref={root} className="rno-map">
      <div className="rno-map__stage">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <polyline className="rno-map__trail" points="" />
          {STATIONS.map(([x, y], i) => (
            <g key={i}>
              <circle className="rno-map__ring" cx={x} cy={y} r="6" />
              <circle className="rno-map__dot" cx={x} cy={y} r="7" />
            </g>
          ))}
          <g className="rno-map__probe">
            <circle r="16" className="rno-map__probe-halo" />
            <circle r="8" className="rno-map__probe-core" />
          </g>
        </svg>
      </div>
      <figcaption className="rno-map__cap">
        <span className="eyebrow">Tournée d&apos;observation</span>
        <span className="rno-map__count" aria-live="off">
          <b>{String(count).padStart(2, "0")}</b> / {STATIONS.length} stations
        </span>
      </figcaption>
    </figure>
  );
}
