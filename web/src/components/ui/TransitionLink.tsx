"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Props = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { children: ReactNode };

/* Lien interne qui joue la transition « vague » avant de changer de page.
   Les clics modifiés (nouvel onglet, etc.) et les liens externes restent natifs.
   Préchargement à l'intention (survol, focus, toucher) plutôt qu'à l'affichage :
   le menu contient une trentaine de liens, les précharger tous au chargement
   saturait les connexions sur les machines et réseaux modestes. */
export default function TransitionLink({ href, onClick, onMouseEnter, onFocus, onTouchStart, prefetch, children, ...rest }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const warmed = useRef(false);
  const target = typeof href === "string" ? href : href.pathname ?? "/";
  const external = /^(https?:|mailto:|tel:)/.test(target);

  const warm = () => {
    if (warmed.current || external || prefetch === false) return;
    warmed.current = true;
    try { router.prefetch(target); } catch {}
  };

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || external) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target === "_blank") return;
    const clean = target.split("#")[0];
    const norm = (s: string) => s.replace(/\/+$/, "") || "/";
    if (target.includes("#") && norm(clean) === norm(pathname)) return; // ancre locale
    if (norm(clean) === norm(pathname)) {
      // Lien vers la page courante : pas de navigation, mais on ferme les
      // menus ouverts et on remonte en haut de page.
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("ciapol:same-page"));
      return;
    }
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("ciapol:navigate", { detail: target }));
  };

  if (external) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={handle}
      onMouseEnter={(e) => { warm(); onMouseEnter?.(e); }}
      onFocus={(e) => { warm(); onFocus?.(e); }}
      onTouchStart={(e) => { warm(); onTouchStart?.(e); }}
      {...rest}
    >
      {children}
    </Link>
  );
}
