import type { Metadata } from "next";
import Blocks from "@/components/detail/Blocks";
import { DetailBody, DetailSection } from "@/components/detail/Detail";
import type { Block } from "@/components/detail/parse";
import { SITE } from "@/lib/site";
import GiamsucShell from "../GiamsucShell";
import { giamsucPage, rubriques } from "../giamsuc";
import ContactForm, { type Field } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacter le projet GIAMSUC",
  description:
    "Une question, une suggestion ou une préoccupation sur l'environnement marin et côtier du Sud-Comoé : écrivez au projet GIAMSUC.",
  alternates: { canonical: "/projets/giamsuc/contact/" },
};

const txt = (h: string) =>
  h
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

/* Champs du formulaire officiel, lus dans le tableau du contenu. */
function fieldsFrom(blocks: Block[]): Field[] {
  const t = blocks.find((b): b is Extract<Block, { kind: "table" }> => b.kind === "table");
  if (!t) return [];
  return t.rows.map((r) => {
    const [label, name, type, req, ph] = r.map(txt);
    const kind = type.split(" ")[0];
    const options = kind === "select" ? ph.split(" ; ").map((o) => o.replace(/^«\s*|\s*»$/g, "")) : undefined;
    return { label, name, type: kind, required: req === "oui", placeholder: kind === "select" ? undefined : ph || undefined, options };
  });
}

export default function GiamsucContactPage() {
  const { page, blocks, bg } = giamsucPage("projets-giamsuc-contact");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  const [r] = rubriques(blocks);
  const isIframe = (b: Block) => b.kind === "html" && /<iframe/.test(b.html);
  const isSubmit = (b: Block) => b.kind === "html" && /Bouton d.envoi/.test(b.text);
  const intro = (r?.blocks ?? []).filter((b) => b.kind === "html" && !isIframe(b) && !isSubmit(b));
  const iframe = blocks.find((b): b is Extract<Block, { kind: "html" }> => isIframe(b));
  const src = iframe?.html.match(/src="([^"]+)"/)?.[1]?.replace(/&amp;/g, "&");
  const mapTitle = iframe?.html.match(/title="([^"]+)"/)?.[1] ?? "Carte";
  const submit = blocks.find((b): b is Extract<Block, { kind: "html" }> => isSubmit(b));
  const submitLabel = submit?.html.match(/<strong>([^<]+)<\/strong>/)?.[1] ?? "Envoyer";
  const email = SITE.contact.emails[0] ?? "courrier@ciapol.ci";

  return (
    <GiamsucShell title={h1} section="Contact">
      <DetailBody
        toc={[
          { id: "echangeons", label: r?.title ?? "Echangeons" },
          { id: "plan", label: "Plan d'accès" },
        ]}
      >
        <DetailSection id="echangeons" kicker={r?.kicker} title={r?.title} wide>
          <div className="gcontact">
            <div className="gcontact__intro">
              <Blocks blocks={intro} />
              <p className="gcontact__mail">
                Par courriel :{" "}
                <a className="link" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
            </div>
            <ContactForm fields={fieldsFrom(blocks)} submitLabel={submitLabel} email={email} />
          </div>
        </DetailSection>
        {src ? (
          <section id="plan" aria-labelledby="plan-titre" className="dsec">
            <h2 id="plan-titre" className="display dsec__title">
              Plan d&apos;accès
            </h2>
            <div className="gmap" style={bg[0] ? { backgroundImage: `url(${bg[0]})` } : undefined}>
              <iframe src={src} title={mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>
        ) : null}
      </DetailBody>
    </GiamsucShell>
  );
}
