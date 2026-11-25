import type { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import type { Crumb } from "@/components/ui/Breadcrumb";
import { ImageReveal, Parallax, Reveal, SplitReveal } from "@/motion/primitives";
import Toc, { type TocItem } from "./Toc";
import type { Img } from "./parse";
import "./detail.css";

/* ==========================================================================
   Gabarit « détail » commun aux sous-directions et aux projets.
   Hero (fenêtre d'eau) → sommaire collant + sections opaques alternées →
   voisins (carrousel) → appel à l'action.
   ========================================================================== */

export function DetailHero({
  code,
  title,
  kicker,
  crumbs,
  lead,
  image,
  children,
}: {
  code?: string;
  title: string;
  kicker?: string;
  crumbs: Crumb[];
  lead?: ReactNode;
  image?: Img;
  children?: ReactNode;
}) {
  return (
    <PageHero
      eyebrow={kicker}
      code={code}
      title={title}
      lead={lead}
      crumbs={crumbs}
      aside={
        image ? (
          <figure className="dhero__figure">
            <img src={image.src} alt={image.alt} decoding="async" />
          </figure>
        ) : undefined
      }
    >
      {children}
    </PageHero>
  );
}

/* Corps de page : rail de sommaire à gauche (≥ 1100 px), contenu à droite. */
export function DetailBody({ toc, children, tocLabel }: { toc: TocItem[]; children: ReactNode; tocLabel?: string }) {
  return (
    <div className={`surface dbody ${toc.length < 2 ? "dbody--solo" : ""}`}>
      <div className="shell dbody__grid">
        {toc.length >= 2 ? (
          <aside className="dbody__rail">
            <Toc items={toc} label={tocLabel} />
          </aside>
        ) : null}
        <div className="dbody__main">{children}</div>
      </div>
    </div>
  );
}

/* Section de lecture. `media` à droite (ou à gauche avec `flip`). */
export function DetailSection({
  id,
  kicker,
  title,
  children,
  media,
  flip = false,
  wide = false,
  tone,
}: {
  id: string;
  kicker?: string;
  title?: string;
  children: ReactNode;
  media?: Img | Img[];
  flip?: boolean;
  wide?: boolean;
  tone?: "tint" | "white";
}) {
  const imgs = media ? (Array.isArray(media) ? media : [media]) : [];
  const headingId = `${id}-titre`;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={`dsec ${imgs.length ? "dsec--split" : ""} ${flip ? "dsec--flip" : ""} ${wide ? "dsec--wide" : ""} ${tone ? `dsec--${tone}` : ""}`}
    >
      <div className="dsec__text">
        {kicker ? <p className="eyebrow dsec__kicker">{kicker}</p> : null}
        {title ? (
          <SplitReveal as="h2" id={headingId} className="display dsec__title">
            {title}
          </SplitReveal>
        ) : null}
        <div className="dsec__body">{children}</div>
      </div>
      {imgs.length ? (
        <div className="dsec__media">
          {imgs.map((im, i) => (
            <ImageReveal key={im.src + i} className={`dsec__frame ${i ? "dsec__frame--2" : ""}`} from={flip ? "left" : "right"}>
              <Parallax amount={8} scale={1.12}>
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" />
              </Parallax>
            </ImageReveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/* « Bon à savoir » : panneau teinté, premier paragraphe en serif. */
export function KnowPanel({ id, title = "Bon à savoir", children, image }: { id: string; title?: string; children: ReactNode; image?: Img }) {
  return (
    <section id={id} aria-labelledby={`${id}-titre`} className={`know ${image ? "know--img" : ""}`}>
      <div className="know__text">
        <h2 id={`${id}-titre`} className="eyebrow know__kicker">
          {title}
        </h2>
        <Reveal className="know__body">{children}</Reveal>
      </div>
      {image ? (
        <ImageReveal className="know__media" from="bottom">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
        </ImageReveal>
      ) : null}
    </section>
  );
}

/* Galerie en mosaïque asymétrique. */
export function Mosaic({ images, label }: { images: Img[]; label: string }) {
  if (!images.length) return null;
  return (
    <ul className={`mosaic mosaic--${Math.min(images.length, 6)}`} aria-label={label}>
      {images.map((im, i) => (
        <li key={im.src + i} className="mosaic__cell">
          <ImageReveal from={i % 2 ? "left" : "bottom"} className="mosaic__frame">
            <img src={im.src} alt={im.alt} loading="lazy" decoding="async" />
          </ImageReveal>
        </li>
      ))}
    </ul>
  );
}

/* Bandeau photo plein cadre, opaque (respiration entre deux lectures). */
export function PhotoBand({ image, children }: { image: Img; children?: ReactNode }) {
  return (
    <section className="band" aria-label={children ? undefined : image.alt || "Illustration"}>
      <Parallax className="band__media" amount={10} scale={1.18}>
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
      </Parallax>
      {children ? <div className="band__content shell">{children}</div> : null}
    </section>
  );
}

/* Appel à l'action de fin de page. */
export function DetailCta({ title, lead, actions }: { title: string; lead?: string; actions: { href: string; label: string; variant?: "primary" | "ghost" | "light" | "alert" }[] }) {
  return (
    <section className="surface--nuit section dcta" aria-labelledby="dcta-titre">
      <div className="shell dcta__inner">
        <SplitReveal as="h2" id="dcta-titre" className="display dcta__title">
          {title}
        </SplitReveal>
        <Reveal className="dcta__side">
          {lead ? <p className="dcta__lead">{lead}</p> : null}
          <div className="dcta__actions">
            {actions.map((a) => (
              <Button key={a.href} href={a.href} variant={a.variant ?? "light"}>
                {a.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
