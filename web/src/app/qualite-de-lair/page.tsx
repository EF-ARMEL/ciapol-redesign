import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import TransitionLink from "@/components/ui/TransitionLink";
import EmbedFacade from "@/components/institution/EmbedFacade";
import { Reveal, SplitReveal } from "@/motion/primitives";
import { getPage } from "@/lib/content";
import { links, stripComments } from "@/components/institution/md";
import "@/components/institution/institution.css";
import "./qualite-de-lair.css";

export const metadata: Metadata = {
  title: "Qualité de l'Air",
  description:
    "Surveillance de la qualité de l'air en Côte d'Ivoire : accès à la plateforme de surveillance utilisée par le CIAPOL.",
};

/* La page officielle ne contient qu'un cadre vers la plateforme de
   surveillance : on la présente telle quelle, sans aucune mesure inventée. */
export default function QualiteAirPage() {
  const page = getPage("qualite-de-lair");
  if (!page) notFound();
  const md = stripComments(page.markdown);
  const frame = page.markdown.match(/<iframe src="([^"]+)" title="([^"]+)"/);
  const src = frame?.[1] ?? "https://monitoring.atmoivoir.com/website";
  const frameTitle = frame?.[2] ?? page.description ?? page.title;
  const fallback = links(md).find((l) => l.href.startsWith("http"));
  const host = new URL(src).host;

  return (
    <>
      <PageHero
        eyebrow="Surveillance"
        title={page.title}
        crumbs={[{ label: page.title }]}
        lead={page.description}
      />
      <section className="surface surface--white section aq" aria-labelledby="aq-t">
        <div className="shell">
          <div className="aq__head">
            <div>
              <Reveal>
                <span className="tag">Plateforme de surveillance</span>
              </Reveal>
              <SplitReveal as="h2" id="aq-t" className="display inst-h2">
                Surveiller la qualité de l&apos;air
              </SplitReveal>
            </div>
            <Reveal className="aq__intro">
              <p>
                Les données de qualité de l&apos;air sont publiées sur la plateforme de surveillance externe{" "}
                <span className="aq__host">{host}</span>. Elle s&apos;affiche ci-dessous à votre demande.
              </p>
              {fallback ? (
                <a className="inst-link aq__direct" href={fallback.href} target="_blank" rel="noopener noreferrer">
                  {fallback.label}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              ) : null}
            </Reveal>
          </div>
          <Reveal className="aq__frame">
            <EmbedFacade
              src={src}
              title={frameTitle}
              provider={host}
              openHref={src}
              openLabel="Ouvrir la plateforme dans un nouvel onglet"
              ratio="16 / 10"
            >
              <p className="display aq__label">{frameTitle}</p>
            </EmbedFacade>
          </Reveal>
          <Reveal className="aq__more">
            <p>
              Voir aussi le projet{" "}
              <TransitionLink href="/projets/ccac/" className="inst-link">
                CCAC, Coalition pour le Climat et l&apos;Air Pur
              </TransitionLink>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
