import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import EmbedFacade from "@/components/institution/EmbedFacade";
import { Reveal, SplitReveal } from "@/motion/primitives";
import { getPage, getSite } from "@/lib/content";
import { SITE, telHref } from "@/lib/site";
import { stripComments } from "@/components/institution/md";
import ContactForm from "./ContactForm";
import "@/components/institution/institution.css";
import "./contact.css";

export const metadata: Metadata = {
  title: "Nous contacter",
  description:
    "Coordonnées officielles du Centre Ivoirien Antipollution (CIAPOL) : siège de Cocody Riviera Bonoumin, bureau annexe du Plateau, antennes régionales, téléphones, courriel et formulaire de contact.",
};

type SiteJson = {
  contact?: {
    addresses?: { label: string; text: string }[];
    phones?: { label: string; number: string }[];
    map?: { embed?: string; link?: string };
  };
};

export default function ContactPage() {
  const page = getPage("contact");
  if (!page) notFound();
  const site = getSite<SiteJson>();
  const c = site.contact ?? {};
  const phone = (label: string) => c.phones?.find((p) => p.label === label)?.number;
  const precise = c.addresses?.find((a) => a.label.startsWith("Siège (précision"))?.text;

  const form = stripComments(page.sections.find((s) => s.name === "formulaire")?.markdown ?? "");
  const title = form.match(/^#\s+(.+)$/m)?.[1] ?? "Contactez nous";
  const introLines = (form.split(/\n(?=\|)/)[0] ?? "")
    .replace(/^#.*$/m, "")
    .trim()
    .split(/\s*\n\s*/)
    .map((l) => l.replace(/\s{2,}$/, "").trim())
    .filter(Boolean);

  const mapEmbed = c.map?.embed ?? page.markdown.match(/<iframe src="([^"]+)"/)?.[1];
  const mapViewer = mapEmbed?.replace("/maps/d/embed?", "/maps/d/viewer?");
  const email = SITE.contact.emails[0];

  const siegeTel = phone("Siège – Tel") ?? SITE.contact.phones[0];
  const siegeFax = phone("Siège – Fax");
  const annexTel = phone("Bureau annexe – Tel") ?? SITE.contact.annexPhone;
  const annexFax = phone("Bureau annexe – Fax");
  const annexText = SITE.contact.annex.replace(/^Bureau annexe\s*:\s*/i, "");

  return (
    <>
      <PageHero
        eyebrow="Nous contacter"
        title={title}
        crumbs={[{ label: "Nous contacter" }]}
        lead={
          <>
            {introLines.map((l, i) => (
              <span key={l} className="ct-lead-line">
                {l}
                {i < introLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </>
        }
      />

      <section className="surface surface--white section ct" aria-labelledby="ct-form-t">
        <div className="shell ct__grid">
          <div className="ct__form">
            <Reveal>
              <span className="tag">Formulaire</span>
            </Reveal>
            <SplitReveal as="h2" id="ct-form-t" className="display inst-h2 ct__h2">
              Écrire au CIAPOL
            </SplitReveal>
            <Reveal delay={0.1}>
              <ContactForm email={email} />
            </Reveal>
          </div>

          <Reveal as="aside" className="ct__aside" aria-labelledby="ct-coord-t">
            <h2 id="ct-coord-t" className="display inst-h3" data-reveal-item>
              Coordonnées
            </h2>

            <div className="ct-block" data-reveal-item>
              <h3 className="ct-block__t">Siège</h3>
              <address className="ct-block__addr">
                {SITE.contact.address.map((l) => (
                  <span key={l}>{l}</span>
                ))}
                {precise ? <span className="ct-block__sub">{precise}</span> : null}
              </address>
              <dl className="ct-dl">
                {siegeTel ? (
                  <div>
                    <dt>Téléphone</dt>
                    <dd>
                      <a className="link" href={telHref(siegeTel)}>{siegeTel}</a>
                    </dd>
                  </div>
                ) : null}
                {siegeFax ? (
                  <div>
                    <dt>Fax</dt>
                    <dd>{siegeFax}</dd>
                  </div>
                ) : null}
              </dl>
              <a className="link ct-block__map" href={SITE.contact.mapUrl} target="_blank" rel="noopener noreferrer">
                Ouvrir l&apos;itinéraire dans Google Maps
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </div>

            {email ? (
              <div className="ct-block" data-reveal-item>
                <h3 className="ct-block__t">Courriel</h3>
                <a className="link ct-block__big" href={`mailto:${email}`}>{email}</a>
              </div>
            ) : null}

            <div className="ct-block" data-reveal-item>
              <h3 className="ct-block__t">Bureau annexe</h3>
              <address className="ct-block__addr">
                <span>{annexText}</span>
              </address>
              <dl className="ct-dl">
                {annexTel ? (
                  <div>
                    <dt>Téléphone</dt>
                    <dd>
                      <a className="link" href={telHref(annexTel)}>{annexTel}</a>
                    </dd>
                  </div>
                ) : null}
                {annexFax ? (
                  <div>
                    <dt>Fax</dt>
                    <dd>{annexFax}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {SITE.social.length ? (
              <div className="ct-block" data-reveal-item>
                <h3 className="ct-block__t">Réseaux sociaux</h3>
                <ul className="ct-social">
                  {SITE.social.map((s) => (
                    <li key={s.network}>
                      <a className="link" href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.network}
                        <span className="sr-only"> (nouvel onglet)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="surface section ct-net" aria-labelledby="ct-net-t">
        <div className="shell ct-net__grid">
          <div>
            <Reveal>
              <span className="tag">Sur le territoire</span>
            </Reveal>
            <SplitReveal as="h2" id="ct-net-t" className="display inst-h2">
              Antennes régionales
            </SplitReveal>
            <Reveal as="ul" className="ct-antennas">
              {SITE.antennas.map((a) => (
                <li key={a.city} data-reveal-item className="ct-antenna">
                  <h3 className="ct-antenna__city display">{a.city}</h3>
                  <ul className="ct-antenna__phones">
                    {a.phones.map((p) => (
                      <li key={p}>
                        <a className="link" href={telHref(p)}>{p}</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </Reveal>
          </div>
          {mapEmbed ? (
            <Reveal className="ct-map">
              <EmbedFacade
                src={mapEmbed}
                title="Carte CIAPOL"
                provider="Google Maps"
                openHref={mapViewer ?? SITE.contact.mapUrl}
                openLabel="Ouvrir la carte dans Google Maps"
                ratio="4 / 3"
              >
                <p className="ct-map__label display">Carte CIAPOL</p>
                <p className="ct-map__addr">{SITE.contact.address.join(", ")}</p>
              </EmbedFacade>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
