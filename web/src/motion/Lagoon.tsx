"use client";

import { useEffect, useRef } from "react";
import { FRAG, VERT } from "./lagoon-shader";
import { lagoon, targetPurity } from "./lagoon-store";

/* Fond fixe plein écran. Visible uniquement à travers les sections marquées
   data-water (fenêtres transparentes) ; ailleurs, le contenu opaque le couvre
   et la boucle de rendu se met en pause. */
export default function Lagoon() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const root = document.documentElement;
    root.classList.remove("lagoon-off", "lagoon-live");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 820px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) {
      lagoon.mode = "off";
      document.documentElement.classList.add("lagoon-off");
      return;
    }
    lagoon.mode = coarse || small ? "lite" : "full";

    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) {
      document.documentElement.classList.add("lagoon-off");
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("[lagune]", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      document.documentElement.classList.add("lagoon-off");
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      purity: gl.getUniformLocation(prog, "uPurity"),
      agit: gl.getUniformLocation(prog, "uAgitation"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      mouseOn: gl.getUniformLocation(prog, "uMouseOn"),
      density: gl.getUniformLocation(prog, "uDensity"),
    };

    /* Résolution interne volontairement basse : l'eau est floue par nature,
       le canvas est mis à l'échelle en CSS. Coût GPU divisé par 4 à 9. */
    let scale = lagoon.mode === "lite" ? 0.33 : 0.5;
    let W = 0, H = 0;
    let vw = 0, vh = 0;
    /* Redimensionner un canvas l'efface. Sur iPhone, la barre d'adresse qui se
       replie change la hauteur à chaque défilement : on l'ignore (le canvas est
       étiré en CSS) et on redessine aussitôt après un vrai redimensionnement. */
    let dirty = true;
    const resize = (force?: unknown) => {
      const w = window.innerWidth, h = window.innerHeight;
      if (force !== true && w === vw && Math.abs(h - vh) < 160) return;
      vw = w; vh = h;
      W = Math.max(2, Math.round(w * scale));
      H = Math.max(2, Math.round(h * scale));
      cv.width = W;
      cv.height = H;
      gl.viewport(0, 0, W, H);
      gl.uniform2f(u.res, W, H);
      dirty = true;
    };
    resize(true);
    gl.uniform1f(u.density, lagoon.mode === "lite" ? 0.4 : 1);

    const mouse = { x: -9999, y: -9999, on: 0, target: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.x = e.clientX * scale;
      mouse.y = (window.innerHeight - e.clientY) * scale;
      mouse.target = 1;
    };
    const onLeave = () => { mouse.target = 0; };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    /* Contexte WebGL perdu (mémoire saturée, pilote) : on bascule sur le
       dégradé de repli au lieu de laisser un canvas noir. */
    let lost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      root.classList.remove("lagoon-live");
      root.classList.add("lagoon-off");
    };
    cv.addEventListener("webglcontextlost", onLost);

    let purity = targetPurity();
    let agit = 0;
    let raf = 0;
    let last = performance.now();
    const t0 = last;

    /* 30 images/s suffisent à un liquide lent et divisent le coût par deux.
       Si la machine peine (moyenne > 45 ms par image), la résolution baisse ;
       si elle peine encore au minimum, l'eau ralentit à 8 images/s (sans
       jamais s'arrêter : une image effacée resterait noire). */
    let STEP = 1000 / 30;
    let acc = 0, frames = 0, sum = 0, frozen = false;
    const degrade = () => {
      if (scale > 0.26) {
        scale = scale > 0.4 ? 0.33 : 0.25;
        gl.uniform1f(u.density, 0.4);
        resize(true);
      } else {
        frozen = true;
        STEP = 1000 / 8;
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const real = now - last;
      acc += real;
      if (acc < STEP - 2) return;
      acc = 0;
      const dt = Math.min(real / 1000, 0.05);
      last = now;
      if (!frozen && !document.hidden && lagoon.windows > 0) {
        frames++;
        sum += real;
        if (frames >= 45) {
          if (sum / frames > 45) degrade();
          frames = 0; sum = 0;
        }
      }
      // Inertie liquide : la pureté rejoint sa cible comme un niveau d'eau.
      purity += (targetPurity() - purity) * Math.min(1, dt * 3.2);
      agit += (Math.min(Math.abs(lagoon.velocity) / 2500, 1) - agit) * Math.min(1, dt * 4);
      mouse.on += (mouse.target - mouse.on) * Math.min(1, dt * 5);

      if (lost || document.hidden) return;
      if (!dirty && lagoon.windows <= 0 && root.dataset.lagoonAlways !== "1") return;
      dirty = false;

      gl.uniform1f(u.time, reduced ? 12 : (now - t0) / 1000);
      gl.uniform1f(u.purity, purity);
      gl.uniform1f(u.agit, reduced ? 0 : agit);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.mouseOn, reduced ? 0 : mouse.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      root.style.setProperty("--purity", purity.toFixed(3));
      if (!root.classList.contains("lagoon-live")) root.classList.add("lagoon-live");
    };

    if (reduced) {
      // Une seule image fixe, mise à jour seulement quand la pureté change nettement.
      let lastDrawn = -1;
      const still = () => {
        raf = requestAnimationFrame(still);
        if (lost) return;
        if (dirty) { lastDrawn = -1; dirty = false; }
        const p = targetPurity();
        if (Math.abs(p - lastDrawn) < 0.02) return;
        lastDrawn = p;
        purity = p;
        gl.uniform1f(u.time, 12);
        gl.uniform1f(u.purity, p);
        gl.uniform1f(u.agit, 0);
        gl.uniform1f(u.mouseOn, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        root.classList.add("lagoon-live");
      };
      raf = requestAnimationFrame(still);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cv.removeEventListener("webglcontextlost", onLost);
      root.classList.remove("lagoon-live");
      /* Pas de loseContext() : un re-montage (StrictMode, HMR) récupérerait
         le même contexte, mort. On libère seulement nos ressources. */
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="lagoon">
      <canvas ref={ref} className="lagoon__canvas" />
    </div>
  );
}
