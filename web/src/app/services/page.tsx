import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import UnitIndex, { type Unit } from "@/components/detail/UnitIndex";
import { DetailCta } from "@/components/detail/Detail";
import { cardsOf, loadDetail, officialSentence, sectionOf } from "@/components/detail/parse";
import "@/components/detail/detail.css";
import "./services.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Les sous-directions techniques du CIAPOL : CIPOMAR, LCE, SDIIC, UNIPOL et SDGSP-VAE. Surveillance des milieux marins et lagunaires, analyses, police antipollution, installations classées et sites pollués.",
  alternates: { canonical: "/services/" },
};

/* Une phrase officielle par sous-direction, reprise mot pour mot de sa page
   (vérifiée au build par officialSentence). */
const SENTENCES: Record<string, [string, string]> = {
  CIPOMAR: ["services-cipomar", "La CIPOMAR effectue des travaux de faucardage"],
  LCE: ["services-lce", "Conformément au décret N°91-662 du 09 octobre 1991 portant création du CIAPOL,le LCE"],
  SDIIC: ["services-sdiic", "Le CIAPOL est attentif à cette politique nationale"],
  UNIPOL: ["services-unipol", "Conformément à la loi n°96-766"],
  "SDGSP-VAE": ["services-sdgsp-vae", "Assurer la gestion des sites pollués"],
};

export default function ServicesPage() {
  const doc = loadDetail("services");
  const cards = cardsOf(sectionOf(doc, "cartes-services"));
  const units: Unit[] = cards.map((c) => {
    const s = SENTENCES[c.code];
    return {
      code: c.code,
      name: c.text,
      sentence: s ? officialSentence(s[0], s[1]) : undefined,
      href: c.href,
      img: c.img ? { src: c.img.src, alt: c.img.alt } : undefined,
    };
  });

  return (
    <>
      <PageHero
        eyebrow="Sous-directions du CIAPOL"
        title="Services"
        crumbs={[{ label: "Services" }]}
        lead={doc.page.description}
      >
        <p className="svc-count">
          <span className="display">{units.length}</span> sous-directions techniques, de la lagune au laboratoire.
        </p>
      </PageHero>

      <section className="surface section svc" aria-labelledby="svc-titre">
        <div className="shell">
          <SectionHeading
            id="svc-titre"
            tag="Organisation"
            title="Cinq sous-directions, une même mission"
            lead="Chaque sous-direction porte une part de la lutte contre la pollution : intervenir, analyser, contrôler, réprimer, assainir."
          />
          <UnitIndex units={units} label="Sous-directions du CIAPOL" />
        </div>
      </section>

      <DetailCta
        title="Une pollution constatée ?"
        lead="Déversement, rejet, dépôt sauvage, végétaux envahissants : signalez-le au CIAPOL."
        actions={[
          { href: "/signaler/", label: "Signaler une pollution", variant: "alert" },
          { href: "/contact/", label: "Nous contacter", variant: "light" },
        ]}
      />
    </>
  );
}
