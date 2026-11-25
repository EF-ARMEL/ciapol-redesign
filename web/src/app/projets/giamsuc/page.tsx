import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Blocks from "@/components/detail/Blocks";
import { DetailBody, DetailSection, PhotoBand } from "@/components/detail/Detail";
import { loadDetail, imagesIn } from "@/components/detail/parse";
import GiamsucShell from "./GiamsucShell";
import GiamsucPosts from "./GiamsucPosts";
import { getGiamsucPosts, rubriques } from "./giamsuc";
import Partners from "./Partners";

export const metadata: Metadata = {
  title: "GIAMSUC · Gestion Intégrée de l'Aire Marine et Côtière du Sud-Comoé",
  description:
    "Le projet GIAMSUC protège et gère durablement l'espace marin et côtier de la région du Sud-Comoé, à la frontière du Ghana, en vue de la création d'une Aire Marine Protégée.",
  alternates: { canonical: "/projets/giamsuc/" },
};

export default function GiamsucPage() {
  const doc = loadDetail("projets-giamsuc");
  const hero = doc.page.sections.find((s) => s.name === "hero");
  const h1 = hero?.markdown.match(/^#\s+(.+)$/m)?.[1] ?? "GIAMSUC";
  const bgs = [...doc.page.markdown.matchAll(/<!--\s*bg:\s*(\S+)\s*-->/g)].map((m) => m[1]);
  const sec = (n: string) => doc.sections.find((s) => s.name === n);
  const pres = rubriques(sec("presentation")?.blocks ?? [])[0];
  const obj = rubriques(sec("objectifs")?.blocks ?? [])[0];
  const rec = rubriques(sec("articles-recents")?.blocks ?? [])[0];
  const part = rubriques(sec("partenaires")?.blocks ?? [])[0];
  const posts = getGiamsucPosts();

  const toc = [
    { id: "presentation", label: "Le projet" },
    { id: "objectifs", label: "Objectifs" },
    { id: "articles-recents", label: "Articles récents" },
    { id: "partenaires", label: "Partenaires" },
  ];

  return (
    <GiamsucShell title={h1} siblings>
      <DetailBody toc={toc}>
        <DetailSection
          id="presentation"
          kicker={pres?.kicker}
          title={pres?.title}
          media={bgs[0] ? { src: bgs[0], alt: "Vue aérienne prise par drone" } : undefined}
        >
          <Blocks blocks={pres?.blocks ?? []} />
        </DetailSection>
        <DetailSection id="objectifs" kicker={obj?.kicker} title={obj?.title}>
          <p className="dnote">Le détail des objectifs et des axes d&apos;intervention n&apos;est pas encore disponible en ligne.</p>
        </DetailSection>
        <DetailSection id="articles-recents" kicker={rec?.kicker} title={rec?.title} wide>
          <GiamsucPosts posts={posts.slice(0, 3)} />
          <div className="g-more">
            <Button href="/projets/giamsuc/actualites/" variant="primary">
              Voir plus d&apos;articles
            </Button>
          </div>
        </DetailSection>
        <section id="partenaires" aria-labelledby="partenaires-titre" className="dsec">
          {part?.kicker ? <p className="eyebrow dsec__kicker">{part.kicker}</p> : null}
          <h2 id="partenaires-titre" className="display dsec__title">
            {part?.title}
          </h2>
          <Partners logos={imagesIn(part?.blocks ?? [])} />
        </section>
      </DetailBody>
      {bgs[1] ? <PhotoBand image={{ src: bgs[1], alt: "" }} /> : null}
    </GiamsucShell>
  );
}

