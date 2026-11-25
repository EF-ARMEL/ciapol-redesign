import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import TransitionLink from "@/components/ui/TransitionLink";
import WaterWindow from "@/motion/WaterWindow";
import { Counter, ImageReveal, Reveal, SplitReveal } from "@/motion/primitives";
import { getPage } from "@/lib/content";
import { images, inline, links, listItems, paragraphs, stripComments } from "@/components/institution/md";
import "@/components/institution/institution.css";
import "./presentation.css";

export const metadata: Metadata = {
  title: "Présentation",
  description:
    "Le Centre Ivoirien Antipollution (CIAPOL) : établissement public à caractère administratif créé par le décret n°91-662 du 09 octobre 1991, ses tutelles, ses sous-directions techniques et ses antennes régionales.",
};

/* Sous-directions citées dans le texte officiel → pages services de la refonte. */
const SERVICE_OF: [RegExp, string, string][] = [
  [/\(LCE\)/, "lce", "LCE"],
  [/\(CIPOMAR\)/, "cipomar", "CIPOMAR"],
  [/\(DIIC\)/, "sdiic", "DIIC"],
  [/\(UNIPOL\)/, "unipol", "UNIPOL"],
  [/\(SDGSP-VAE\)/, "sdgsp-vae", "SDGSP-VAE"],
];

const ALT: Record<string, string> = {
  "15043.jpg": "Poubelle de tri bleue marquée du symbole du recyclage, entourée de feuillages",
  "vertical-shot-of-rising-smoke-making-the-air-polluted-and-hayricks-in-the-field.jpg":
    "Fumées d'une centrale industrielle au-dessus d'un champ de bottes de foin",
  "img-20220720-231832.png": "Main gantée tenant un sac poubelle fermé",
  "presentation-4.jpg": "Visuel CIAPOL, Centre Ivoirien Antipollution : main signant un document officiel",
};
const altOf = (src: string) => ALT[src.split("/").pop() ?? ""] ?? "";

export default function PresentationPage() {
  const page = getPage("presentation");
  if (!page) notFound();
  const sec = (n: string) => page.sections.find((s) => s.name.startsWith(n))?.markdown ?? "";

  const hero = stripComments(sec("hero"));
  const heroTitle = hero.match(/^#\s+(.+)$/m)?.[1] ?? "CIAPOL";
  const heroSub = hero.match(/^###\s+(.+)$/m)?.[1] ?? "Centre Ivoirien Antipollution";

  const intro = sec("introduction");
  const introP = paragraphs(intro);
  const introImgs = images(intro);

  const statut = sec("statut-et-organisation");
  const [statutP, antennesP] = paragraphs(statut);
  const cut = statutP.indexOf("Pour réusisir");
  const statutMain = cut > 0 ? statutP.slice(0, cut).trim() : statutP;
  const statutOrg = cut > 0 ? statutP.slice(cut).trim() : "";
  const items = listItems(statut);
  const sousDirections = items.slice(0, 5);
  const antennes = items.slice(5);
  const statutImg = images(statut)[0];

  const buttons = links(sec("boutons"));

  return (
    <>
      <PageHero
        eyebrow="Présentation"
        title={heroTitle}
        crumbs={[{ label: "Présentation" }]}
        lead={heroSub}
      />

      {/* Introduction : les trois piliers, puis le cadre juridique */}
      <section className="surface surface--white section prs-intro" aria-labelledby="prs-intro-t">
        <div className="shell prs-intro__grid">
          <div className="prs-intro__text">
            <Reveal>
              <span className="tag">Pourquoi le CIAPOL</span>
            </Reveal>
            <h2 id="prs-intro-t" className="sr-only">
              Pourquoi le CIAPOL
            </h2>
            <Reveal className="prs-statement">
              {introP.slice(0, 2).map((p) => (
                <p key={p} data-reveal-item className="prs-statement__p" dangerouslySetInnerHTML={{ __html: inline(p) }} />
              ))}
            </Reveal>
            <Reveal className="inst-body prs-intro__body">
              {introP.slice(2).map((p) => (
                <p key={p} data-reveal-item dangerouslySetInnerHTML={{ __html: inline(p) }} />
              ))}
            </Reveal>
          </div>
          <div className="prs-intro__media">
            {introImgs.map((img, i) => (
              <ImageReveal key={img.src} className={`prs-intro__img prs-intro__img--${i + 1}`} from={i === 1 ? "right" : "bottom"}>
                <img src={img.src} alt={img.alt || altOf(img.src)} loading="lazy" decoding="async" />
              </ImageReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Repères : fenêtre d'eau, les dates citées par le texte officiel */}
      <WaterWindow className="section prs-marks" aria-labelledby="prs-marks-t">
        <div className="shell">
          <Reveal>
            <span className="tag">Repères</span>
          </Reveal>
          <SplitReveal as="h2" id="prs-marks-t" className="display inst-h2 prs-marks__title">
            Des textes à faire appliquer
          </SplitReveal>
          <Reveal as="ol" className="prs-marks__list">
            <li data-reveal-item className="prs-mark">
              <p className="prs-mark__year eyebrow">1991</p>
              <p className="prs-mark__fig display" aria-hidden="true">n°91-662</p>
              <p className="prs-mark__txt">
                Créé par décret n°91-662 du 09 octobre 1991, le Centre Ivoirien Antipollution (CIAPOL) est un
                Etablissement Public à caractère Administratif (EPA).
              </p>
            </li>
            <li data-reveal-item className="prs-mark">
              <p className="prs-mark__year eyebrow">1994</p>
              <p className="prs-mark__fig display">
                <Counter value={662} /> <span className="prs-mark__unit">textes</span>
              </p>
              <p className="prs-mark__txt">Déjà en 1994, le PNAE a recensé plus de 662 textes applicables à l’Environnement.</p>
            </li>
            <li data-reveal-item className="prs-mark">
              <p className="prs-mark__year eyebrow">Aujourd’hui</p>
              <p className="prs-mark__fig display">presque mille</p>
              <p className="prs-mark__txt">
                A la date d’Aujourd’hui, si un recensement est fait, on sera à presque mille textes plus les conventions
                auxquelles l’Etat est partie.
              </p>
            </li>
          </Reveal>
        </div>
      </WaterWindow>

      {/* Statut et tutelles */}
      <section className="surface section prs-statut" aria-labelledby="prs-statut-t">
        <div className="shell prs-statut__grid">
          {statutImg ? (
            <ImageReveal className="prs-statut__img" from="left">
              <img src={statutImg.src} alt={altOf(statutImg.src)} loading="lazy" decoding="async" />
            </ImageReveal>
          ) : null}
          <div className="prs-statut__text">
            <Reveal>
              <span className="tag">Statut</span>
            </Reveal>
            <SplitReveal as="h2" id="prs-statut-t" className="display inst-h2">
              Un établissement public à caractère administratif
            </SplitReveal>
            <Reveal className="inst-body">
              <p dangerouslySetInnerHTML={{ __html: inline(statutMain) }} />
            </Reveal>
            <Reveal as="dl" className="prs-tutelles">
              <div data-reveal-item>
                <dt>Tutelle administrative et technique</dt>
                <dd>Ministère de l’Environnement et du Développement Durable</dd>
              </div>
              <div data-reveal-item>
                <dt>Tutelle économique et financière</dt>
                <dd>Ministère du Budget et du Portefeuille de l’Etat</dd>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Organisation : sous-directions techniques et antennes régionales */}
      <section className="surface surface--white section prs-org" aria-labelledby="prs-org-t">
        <div className="shell">
          <div className="prs-org__head">
            <Reveal>
              <span className="tag">Organisation</span>
            </Reveal>
            <SplitReveal as="h2" id="prs-org-t" className="display inst-h2">
              Cinq sous-directions techniques, trois antennes régionales
            </SplitReveal>
            {statutOrg ? (
              <Reveal className="inst-body">
                <p dangerouslySetInnerHTML={{ __html: inline(statutOrg) }} />
              </Reveal>
            ) : null}
          </div>

          <div className="prs-chart">
            <Reveal className="prs-chart__root">
              <p className="prs-chart__root-name display">CIAPOL</p>
              <p className="prs-chart__root-sub">Direction</p>
            </Reveal>
            <Reveal as="ul" className="prs-chart__units" stagger={0.07}>
              {sousDirections.map((sd) => {
                const svc = SERVICE_OF.find(([re]) => re.test(sd));
                const body = <span className="prs-unit__txt" dangerouslySetInnerHTML={{ __html: inline(sd) }} />;
                return (
                  <li key={sd} data-reveal-item className="prs-unit">
                    {svc ? (
                      <TransitionLink href={`/services/${svc[1]}/`} className="prs-unit__link">
                        <span className="prs-unit__code display">{svc[2]}</span>
                        {body}
                        <span className="prs-unit__more">Voir la sous-direction</span>
                      </TransitionLink>
                    ) : (
                      <div className="prs-unit__link">{body}</div>
                    )}
                  </li>
                );
              })}
            </Reveal>
          </div>

          <div className="prs-antennes">
            <Reveal className="inst-body">
              <p dangerouslySetInnerHTML={{ __html: inline(antennesP ?? "") }} />
            </Reveal>
            <Reveal as="ul" className="prs-antennes__list">
              {antennes.map((a) => (
                <li key={a} data-reveal-item className="display">
                  {a}
                </li>
              ))}
            </Reveal>
          </div>

          {buttons.length ? (
            <Reveal className="inst-actions prs-org__actions">
              {buttons.map((b) => (
                <Button key={b.href} href={b.href.replace(/\/?$/, "/")} variant="primary">
                  {b.label}
                </Button>
              ))}
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
