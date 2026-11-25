"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import TransitionLink from "@/components/ui/TransitionLink";
import Logo from "./Logo";
import { CTA, NAV, type NavItem } from "@/lib/nav";
import { getLenis } from "@/motion/SmoothScroll";

const norm = (s: string) => s.replace(/\/+$/, "") || "/";

/* En-tête : bandeau institutionnel (République de Côte d'Ivoire + tutelle),
   puis barre flottante en verre dépoli. Elle se rétracte en descendant et
   réapparaît dès qu'on remonte. Méga-menus au survol / focus / clic,
   tiroir plein écran sur mobile. */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const hdrRef = useRef<HTMLElement>(null);

  /* Bas réel de l'en-tête (il replie son bandeau, se cache au défilement et
     change de taille selon l'écran) : exposé en --hdr-bottom pour que les
     barres collées en dessous (chapitres, onglets GIAMSUC) ne le chevauchent
     jamais. */
  useEffect(() => {
    const el = hdrRef.current;
    if (!el) return;
    const root = document.documentElement;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const bar = el.querySelector<HTMLElement>(".hdr__bar") ?? el;
        root.style.setProperty("--hdr-bottom", `${Math.max(0, Math.round(bar.getBoundingClientRect().bottom))}px`);
      });
    };
    // Pendant les transitions de l'en-tête, on suit image par image.
    let follow = 0;
    const track = () => {
      const t0 = performance.now();
      const step = () => {
        measure();
        if (performance.now() - t0 < 800) follow = requestAnimationFrame(step);
      };
      cancelAnimationFrame(follow);
      follow = requestAnimationFrame(step);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const mo = new MutationObserver(track);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(follow);
    };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    const onSame = () => {
      setOpen(null);
      setDrawer(false);
      const lenis = getLenis();
      // Le tiroir relance Lenis à sa fermeture : on remonte juste après.
      window.setTimeout(() => {
        if (lenis) lenis.scrollTo(0, { duration: 1 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 60);
    };
    window.addEventListener("ciapol:same-page", onSame);
    return () => window.removeEventListener("ciapol:same-page", onSame);
  }, []);

  // Tiroir mobile : bloque le scroll, anime l'entrée des liens, Échap ferme.
  useEffect(() => {
    const lenis = getLenis();
    if (drawer) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      const el = drawerRef.current;
      if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(el, { clipPath: "circle(0% at calc(100% - 44px) 44px)" }, { clipPath: "circle(150% at calc(100% - 44px) 44px)", duration: 0.9, ease: "expo.inOut" });
        gsap.from(el.querySelectorAll("[data-drawer-item]"), { yPercent: 120, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.25 });
      }
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setDrawer(false); setOpen(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const isActive = (item: NavItem) =>
    norm(item.href) === "/" ? norm(pathname) === "/" : norm(pathname).startsWith(norm(item.href)) ||
      !!item.children?.some((c) => norm(pathname).startsWith(norm(c.href)));

  const enter = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 180);
  };

  return (
    <>
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <header ref={hdrRef} className={`hdr ${hidden && !open ? "is-hidden" : ""} ${scrolled ? "is-scrolled" : ""}`}>
        <div className="hdr__gov">
          <div className="shell hdr__gov-inner">
            <span className="hdr__gov-id">
              <span className="hdr__flag" aria-hidden="true"><i /><i /><i /></span>
              République de Côte d&apos;Ivoire
              <span className="hdr__gov-sep" aria-hidden="true">/</span>
              <span className="hdr__gov-min">Ministère de l&apos;Environnement et de la Transition Écologique</span>
            </span>
            <span className="hdr__gov-links">
              <a href="https://environnement.gouv.ci/" target="_blank" rel="noopener noreferrer">environnement.gouv.ci</a>
              <TransitionLink href="/contact/">Nous écrire</TransitionLink>
            </span>
          </div>
        </div>

        <div className="shell">
          <div className="hdr__bar">
            <TransitionLink href="/" className="hdr__brand" aria-label="CIAPOL, Centre Ivoirien Antipollution, accueil">
              <Logo />
            </TransitionLink>

            <nav className="hdr__nav" aria-label="Navigation principale">
              <ul>
                {NAV.map((item) => (
                  <li
                    key={item.label}
                    onMouseEnter={() => item.children && enter(item.label)}
                    onMouseLeave={() => item.children && leave()}
                  >
                    {item.children ? (
                      <button
                        type="button"
                        className={`hdr__link ${isActive(item) ? "is-active" : ""}`}
                        aria-expanded={open === item.label}
                        aria-controls={`mega-${item.label}`}
                        onClick={() => setOpen(open === item.label ? null : item.label)}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <TransitionLink href={item.href} className={`hdr__link ${isActive(item) ? "is-active" : ""}`} aria-current={isActive(item) ? "page" : undefined}>
                        {item.label}
                      </TransitionLink>
                    )}

                    {item.children && (
                      <div id={`mega-${item.label}`} className={`mega ${open === item.label ? "is-open" : ""}`} onFocus={() => enter(item.label)} onBlur={leave}>
                        <div className="mega__inner">
                          <div className="mega__intro">
                            <span className="eyebrow">{item.label}</span>
                            <TransitionLink href={item.href} className="mega__all">
                              Vue d&apos;ensemble
                            </TransitionLink>
                          </div>
                          <ul className="mega__list">
                            {item.children.map((c, i) => (
                              <li key={c.href} style={{ ["--i" as string]: i }}>
                                <TransitionLink href={c.href} className="mega__item">
                                  {c.code ? <span className="mega__code">{c.code}</span> : null}
                                  <span className="mega__label">{c.label}</span>
                                  {c.description ? <span className="mega__desc">{c.description}</span> : null}
                                </TransitionLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <TransitionLink href={CTA.href} className="hdr__cta">
              <span className="hdr__cta-long">{CTA.label}</span>
              <span className="hdr__cta-short" aria-hidden="true">Signaler</span>
            </TransitionLink>

            <button type="button" className="hdr__burger" aria-label={drawer ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={drawer} onClick={() => setDrawer(!drawer)}>
              {drawer ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {drawer && (
        <div ref={drawerRef} className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__scroll" data-lenis-prevent>
            <ul className="drawer__list">
              {NAV.map((item) => (
                <li key={item.label} className="drawer__group">
                  <span className="drawer__mask">
                    <TransitionLink href={item.href} className="drawer__top display" data-drawer-item>
                      {item.label}
                    </TransitionLink>
                  </span>
                  {item.children && (
                    <ul className="drawer__sub">
                      {item.children.map((c) => (
                        <li key={c.href} data-drawer-item>
                          <TransitionLink href={c.href}>
                            {c.code ? <b>{c.code}</b> : null}
                            <span>{c.label}</span>
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <TransitionLink href={CTA.href} className="drawer__cta" data-drawer-item>
              {CTA.label}
            </TransitionLink>
          </div>
        </div>
      )}
    </>
  );
}
