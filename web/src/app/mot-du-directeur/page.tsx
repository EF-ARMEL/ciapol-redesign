import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import TransitionLink from "@/components/ui/TransitionLink";
import WaterWindow from "@/motion/WaterWindow";
import { ImageReveal, Reveal, SplitReveal } from "@/motion/primitives";
import { formatDate, getArticle, getArticleMetas, getPage } from "@/lib/content";
import { images, inline, links, paragraphs, stripComments } from "@/components/institution/md";
import ZoomImage from "@/components/institution/ZoomImage";
import "@/components/institution/institution.css";
import "./mot-du-directeur.css";

export const metadata: Metadata = {
  title: "Mot du directeur",
  description:
    "La rubrique « Mot du directeur » du Centre Ivoirien Antipollution : la parole du Directeur du CIAPOL, Professeur Bernard Ossey Yapo, sur la lutte contre la pollution.",
};

/* Transcription fidèle du texte imprimé sur chaque affiche officielle
   (les articles d'origine ne contiennent que l'image). Elle rend la parole
   du Directeur lisible par tous, y compris par les lecteurs d'écran. */
const POSTERS: Record<string, { quote: string; signature: string; role: string; motto?: string }> = {
  "mot-du-directeur-1.jpeg": {
    quote:
      "En Côte d’Ivoire, les actes de pollution sont passibles de 1 à 6 ans d’emprisonnement et d’un million à cent milliards de FCFA d’amendes",
    signature: "Prof. Bernard Yapo Ossey",
    role: "Directeur du CIAPOL",
  },
  "whatsapp-image-2024-10-06-at-22-24-41.jpeg": {
    quote:
      "La pollution de l’air n’est certes pas visible, mais on la sent au travers de ses conséquences qui sont très nombreuses, notamment les différentes infections respiratoires dont souffrent les populations.",
    signature: "Prof. Bernard Yapo Ossey",
    role: "Directeur du CIAPOL",
  },
  "whatsapp-image-2024-10-14-at-00-34-57.jpeg": {
    quote:
      "La question de la pollution plastique transcende aujourd’hui les frontières terrestres et maritimes, si bien qu’elle est devenue une problématique mondiale.",
    signature: "Prof. Bernard Yapo Ossey",
    role: "Directeur du CIAPOL",
  },
  "affiche-jeune.png": {
    quote:
      "En cette période de prière, de pénitence et de partage pendant laquelle le monde entier observe, pour certains le jeûne musulman ( Ramadan ) et pour d’autres, le jeûne chrétien ( Carême ), qu’il plaise à Dieu de donner à tous la paix et l’élévation spirituelle afin que les prières des uns et des autres nourissent nos cœurs d’amour, de tolérance et davantage de solidarité. Demeurez tous dans la bénédiction divine !!!",
    signature: "Prof. Bernard Ossey Yapo",
    role: "Directeur du CIAPOL",
    motto: "La lutte contre la pollution, notre priorité !",
  },
};
const fileOf = (src: string) => src.split("/").pop() ?? "";
const slugOf = (href: string) => href.replace(/^\/actualites\//, "").replace(/\/$/, "");

export default function MotDuDirecteurPage() {
  const page = getPage("mot-du-directeur");
  if (!page) notFound();

  // Rubrique (texte de présentation)
  const rub = page.sections.find((s) => s.name === "presentation-rubrique")?.markdown ?? "";
  const rubTitle = stripComments(rub).match(/^#\s+(.+)$/m)?.[1] ?? "MOT DU DIRECTEUR…";
  const rubImg = images(rub)[0];
  const rubP = paragraphs(rub);
  const rubIntro = rubP.filter((p) => !p.startsWith("-"));
  const rubGoals = rubP.filter((p) => p.startsWith("-")).map((p) => p.replace(/^-/, ""));
  const rubLink = links(rub)[0];
  const rubArticle = rubLink ? getArticle(slugOf(rubLink.href)) : undefined;
  const lead = POSTERS[fileOf(rubImg?.src ?? "")];

  // Messages (une affiche par article)
  const msgMd = stripComments(page.sections.find((s) => s.name === "messages")?.markdown ?? "");
  const messages = msgMd
    .split(/^##\s+/m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      const title = chunk.slice(0, nl).trim();
      const img = images(chunk)[0];
      const link = links(chunk)[0];
      const art = link ? getArticle(slugOf(link.href)) : undefined;
      return { title, img, link, art, poster: POSTERS[fileOf(img?.src ?? "")] };
    });

  // Le Directeur dans l'actualité (articles officiels qui le citent)
  const own = new Set([rubArticle?.slug, ...messages.map((m) => m.art?.slug)]);
  const related = getArticleMetas()
    .filter((a) => /directeur/i.test(a.title) && !own.has(a.slug))
    .slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow="Présentation"
        title={page.title}
        crumbs={[{ label: "Présentation", href: "/presentation/" }, { label: page.title }]}
        lead={page.description}
      />

      {/* La rubrique */}
      <section className="surface surface--white section mdd-rub" aria-labelledby="mdd-rub-t">
        <div className="shell mdd-rub__grid">
          {rubImg ? (
            <ImageReveal className="mdd-rub__img" from="left">
              <ZoomImage
                src={rubImg.src}
                alt={`${rubImg.alt || "Mot du Directeur"} : affiche${lead ? `, « ${lead.quote} », ${lead.signature}, ${lead.role}` : ""}`}
                eager
              />
            </ImageReveal>
          ) : null}
          <div className="mdd-rub__text">
            <Reveal>
              <span className="tag">La rubrique</span>
            </Reveal>
            <SplitReveal as="h2" id="mdd-rub-t" className="display inst-h2">
              {rubTitle}
            </SplitReveal>
            {rubArticle ? (
              <p className="mdd-byline eyebrow">
                {rubArticle.author ? `Par ${rubArticle.author} · ` : ""}
                <time dateTime={rubArticle.date}>{formatDate(rubArticle.date)}</time>
              </p>
            ) : null}
            <Reveal className="inst-body mdd-rub__body">
              {rubIntro.map((p) => (
                <p key={p} data-reveal-item dangerouslySetInnerHTML={{ __html: inline(p) }} />
              ))}
            </Reveal>
            {rubGoals.length ? (
              <Reveal as="ul" className="mdd-goals" aria-label="Objectifs de la rubrique">
                {rubGoals.map((g) => {
                  const [word, ...rest] = g.split(/\s(?=\()/);
                  return (
                    <li key={g} data-reveal-item>
                      <span className="display mdd-goals__w">{word}</span>
                      {rest.length ? <span className="mdd-goals__more"> {rest.join(" ")}</span> : null}
                    </li>
                  );
                })}
              </Reveal>
            ) : null}
            {rubLink ? (
              <TransitionLink href={rubLink.href.replace(/\/?$/, "/")} className="inst-link mdd-read">
                {rubLink.label}
                <span className="sr-only"> : {rubTitle}</span>
              </TransitionLink>
            ) : null}
          </div>
        </div>
      </section>

      {/* La parole : fenêtre d'eau, citation transcrite de l'affiche */}
      {lead ? (
        <WaterWindow className="section mdd-quote" aria-label="Citation du Directeur">
          <div className="shell">
            <Reveal>
              <span className="tag">Extrait de l&apos;affiche du {rubArticle ? formatDate(rubArticle.date) : "30 septembre 2024"}</span>
            </Reveal>
            <figure className="mdd-quote__fig">
              <SplitReveal as="blockquote" mode="words" className="display mdd-quote__text">
                {`« ${lead.quote} »`}
              </SplitReveal>
              <Reveal as="figcaption" className="mdd-sign">
                <span className="mdd-sign__name">{lead.signature}</span>
                <span className="mdd-sign__role">{lead.role}</span>
              </Reveal>
            </figure>
          </div>
        </WaterWindow>
      ) : null}

      {/* Les messages */}
      <section className="surface section mdd-msgs" aria-labelledby="mdd-msgs-t">
        <div className="shell">
          <div className="mdd-msgs__head">
            <Reveal>
              <span className="tag">Les messages</span>
            </Reveal>
            <SplitReveal as="h2" id="mdd-msgs-t" className="display inst-h2">
              La parole du Directeur
            </SplitReveal>
          </div>
          <ol className="mdd-list">
            {messages.map((m, i) => (
              <li key={`${m.title}-${i}`} className={`mdd-msg ${i % 2 ? "mdd-msg--alt" : ""}`}>
                {m.img ? (
                  <ImageReveal className="mdd-msg__img" from={i % 2 ? "right" : "left"}>
                    <ZoomImage
                      src={m.img.src}
                      alt={`${m.img.alt} : affiche${m.poster ? `, ${m.poster.signature}, ${m.poster.role}` : ""}`}
                      caption={m.img.alt}
                    />
                  </ImageReveal>
                ) : null}
                <Reveal className="mdd-msg__text">
                  {m.art ? (
                    <p data-reveal-item className="eyebrow mdd-msg__date">
                      <time dateTime={m.art.date}>{formatDate(m.art.date)}</time>
                    </p>
                  ) : null}
                  <h3 data-reveal-item className="display mdd-msg__t">
                    {m.title}
                  </h3>
                  {m.poster ? (
                    <figure data-reveal-item className="mdd-msg__fig">
                      <blockquote className="mdd-msg__q">
                        <p>« {m.poster.quote} »</p>
                        {m.poster.motto ? <p className="mdd-msg__motto">{m.poster.motto}</p> : null}
                      </blockquote>
                      <figcaption className="mdd-sign mdd-sign--dark">
                        <span className="mdd-sign__name">{m.poster.signature}</span>
                        <span className="mdd-sign__role">{m.poster.role}</span>
                      </figcaption>
                      <p className="mdd-msg__note">Texte transcrit de l&apos;affiche officielle.</p>
                    </figure>
                  ) : null}
                  {m.link ? (
                    <p data-reveal-item>
                      <TransitionLink href={m.link.href.replace(/\/?$/, "/")} className="inst-link mdd-read">
                        {m.link.label}
                        <span className="sr-only"> : {m.title}</span>
                      </TransitionLink>
                    </p>
                  ) : null}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length ? (
        <section className="surface surface--white section--tight mdd-rel" aria-labelledby="mdd-rel-t">
          <div className="shell mdd-rel__grid">
            <div>
              <Reveal>
                <span className="tag">Actualités</span>
              </Reveal>
              <SplitReveal as="h2" id="mdd-rel-t" className="display inst-h3 mdd-rel__t">
                Le Directeur dans l&apos;actualité
              </SplitReveal>
            </div>
            <Reveal as="ul" className="mdd-rel__list" stagger={0.05}>
              {related.map((a) => (
                <li key={a.slug} data-reveal-item>
                  <TransitionLink href={`/actualites/${a.slug}/`} className="mdd-rel__link">
                    <time dateTime={a.date} className="eyebrow">
                      {formatDate(a.date)}
                    </time>
                    <span className="mdd-rel__title">{a.title}</span>
                  </TransitionLink>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
