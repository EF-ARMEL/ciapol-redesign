import type { Metadata } from "next";
import { PhoneCall, ShieldCheck, Timer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SignalForm from "@/components/forms/SignalForm";
import { Reveal } from "@/motion/primitives";
import { SITE, telHref } from "@/lib/site";
import "@/components/forms/forms.css";
import "./signaler.css";

export const metadata: Metadata = {
  title: "Signaler une pollution",
  description:
    "Déversement d'hydrocarbures, rejet industriel, nuisances olfactives, mortalité de poissons, dépôt sauvage : signalez une pollution au Centre Ivoirien Antipollution.",
};

export default function SignalerPage() {
  const email = SITE.contact.emails[0];
  const phone = SITE.contact.phones[0];
  return (
    <>
      <PageHero
        eyebrow="Vigilance citoyenne"
        title="Signaler une pollution"
        crumbs={[{ label: "Signaler une pollution" }]}
        lead="Vous constatez une pollution de l'eau, de l'air ou des sols ? Décrivez-la en trois étapes : votre signalement aide les équipes du CIAPOL à intervenir."
      />
      <section className="surface section signaler">
        <div className="shell signaler__grid">
          <SignalForm email={email} />
          <Reveal as="aside" className="signaler__aside" aria-label="Informations utiles">
            <div data-reveal-item className="signaler__card signaler__card--alert">
              <PhoneCall size={22} aria-hidden="true" />
              <p className="signaler__t">Urgence ou pollution en cours ?</p>
              <p>
                Ne vous mettez pas en danger. Contactez directement le CIAPOL
                {phone ? (
                  <>
                    {" "}au <a href={telHref(phone)}>{phone}</a>
                  </>
                ) : null}
                .
              </p>
            </div>
            <div data-reveal-item className="signaler__card">
              <Timer size={22} aria-hidden="true" />
              <p className="signaler__t">Soyez précis</p>
              <p>Lieu exact, heure du constat, étendue, odeur ou couleur : ces détails orientent l&apos;intervention.</p>
            </div>
            <div data-reveal-item className="signaler__card">
              <ShieldCheck size={22} aria-hidden="true" />
              <p className="signaler__t">Vos données</p>
              <p>Vos coordonnées sont facultatives et ne servent qu&apos;au traitement du signalement.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
