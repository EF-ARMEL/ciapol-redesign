import type { ReactNode } from "react";
import TransitionLink from "./TransitionLink";
import { Magnetic } from "@/motion/primitives";

type Variant = "primary" | "ghost" | "light" | "alert" | "quiet";

/* Bouton pilule : au survol, un niveau d'eau remonte dans le bouton
   (remplissage par le bas). Libellé seul, sans flèche ni icône. */
export default function Button({
  href,
  children,
  variant = "primary",
  magnetic = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** @deprecated plus d'icônes dans les boutons */
  icon?: ReactNode;
  magnetic?: boolean;
  className?: string;
}) {
  const v = variant === "quiet" ? "ghost" : variant;
  const inner = (
    <TransitionLink href={href} className={`btn btn--${v} ${className}`}>
      <span className="btn__fill" aria-hidden="true" />
      <span className="btn__label">{children}</span>
    </TransitionLink>
  );
  return magnetic ? <Magnetic>{inner}</Magnetic> : inner;
}
