import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnitDetail, { altFor, type SectionRender } from "@/components/detail/UnitDetail";
import Blocks from "@/components/detail/Blocks";
import { DetailSection } from "@/components/detail/Detail";
import SpillScene from "@/components/detail/scenes/SpillScene";
import SampleColumns from "@/components/detail/scenes/SampleColumns";
import MilieuxTabs from "@/components/detail/scenes/MilieuxTabs";
import { SplitReveal } from "@/motion/primitives";
import {
  cardsOf,
  groupBy,
  imagesIn,
  loadDetail,
  nestedGroups,
  sectionOf,
  splitTitle,
  type Block,
} from "@/components/detail/parse";
import "@/components/detail/detail.css";
import "../services.css";

const SLUGS = ["cipomar", "lce", "unipol", "sdiic", "sdgsp-vae"] as const;
type Slug = (typeof SLUGS)[number];

export const dynamicParams = false;
export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!SLUGS.includes(slug as Slug)) return {};
  const doc = loadDetail(`services-${slug}`);
  return {
    title: `${doc.code} · ${doc.page.description ?? ""}`,
    description: `${doc.code}, ${doc.page.description}. Sous-direction du Centre Ivoirien Antipollution (CIAPOL).`,
    alternates: { canonical: `/services/${slug}/` },
  };
}

/* ------------------------------------------------------------------ rendus propres à chaque sujet */

/* CIPOMAR : Lutte / Perspectives accompagnés du confinement d'une nappe. */
const cipomarLutte: SectionRender = (s) => (
  <section id={s.id} aria-labelledby={`${s.id}-titre`} className="dsec">
    <SplitReveal as="h2" id={`${s.id}-titre`} className="display dsec__title">
      Lutte et perspectives
    </SplitReveal>
    <div className="dsec__body dsec__body--wide">
      <SpillScene>
        {groupBy(s.blocks).map((g) => (
          <div key={g.title}>
            <h3 className="display duo__title">{g.title}</h3>
            <Blocks blocks={g.blocks} />
          </div>
        ))}
      </SpillScene>
    </div>
  </section>
);

/* LCE : le tableau officiel des analyses, en trois éprouvettes. */
const lceTable: SectionRender = (s) => {
  const t = s.blocks.find((b): b is Extract<Block, { kind: "table" }> => b.kind === "table");
  if (!t) return null;
  const strip = (h: string) => h.replace(/<[^>]+>/g, "").trim();
  const columns = t.header.map((h, i) => ({
    title: strip(h),
    items: t.rows
      .flatMap((r) => r[i].split(/<br\s*\/?>/i))
      .map((x) => strip(x).replace(/^•\s*/, ""))
      .filter(Boolean),
  }));
  return (
    <section id={s.id} aria-labelledby={`${s.id}-titre`} className="dsec">
      <h2 id={`${s.id}-titre`} className="sr-only">
        Liste des analyses offertes
      </h2>
      <SampleColumns columns={columns} caption="Liste des analyses offertes par le LCE" />
    </section>
  );
};

/* UNIPOL : les milieux récepteurs en onglets. */
const unipolMissions: SectionRender = (s, { title }) => {
  const { rest } = splitTitle(s);
  const intro = rest.filter((b) => b.kind === "html");
  const img = imagesIn(rest)[0];
  return (
    <DetailSection id={s.id} title={title} media={img ? { ...img, alt: altFor("UNIPOL", title) } : undefined}>
      <Blocks blocks={intro} />
      <MilieuxTabs milieux={nestedGroups(s.markdown)} />
    </DetailSection>
  );
};

/* SDIIC : les deux procédures côte à côte, comme deux dossiers. */
const sdiicProcedures: SectionRender = (s) => (
  <section id={s.id} aria-labelledby={`${s.id}-titre`} className="dsec">
    <SplitReveal as="h2" id={`${s.id}-titre`} className="display dsec__title">
      Déclaration ou autorisation
    </SplitReveal>
    <div className="procs dsec__body dsec__body--wide">
      {groupBy(s.blocks).map((g) => (
        <article key={g.title} className="procs__card">
          <h3 className="display procs__title">{g.title}</h3>
          <Blocks blocks={g.blocks} />
        </article>
      ))}
    </div>
  </section>
);

/* SDGSP-VAE : les deux services en regard. */
const sdgspServices: SectionRender = (s) => (
  <section id={s.id} aria-labelledby={`${s.id}-titre`} className="dsec">
    <SplitReveal as="h2" id={`${s.id}-titre`} className="display dsec__title">
      Les services
    </SplitReveal>
    <div className="duo dsec__body dsec__body--wide">
      {groupBy(s.blocks).map((g) => (
        <div key={g.title}>
          <h3 className="display duo__title">{g.title}</h3>
          <Blocks blocks={g.blocks} />
        </div>
      ))}
    </div>
  </section>
);

const CONFIG: Record<Slug, { renders?: Record<string, SectionRender>; labels?: Record<string, string> }> = {
  cipomar: { renders: { "lutte-et-perspectives": cipomarLutte }, labels: { "lutte-et-perspectives": "Lutte et perspectives" } },
  lce: { renders: { "tableau-analyses": lceTable }, labels: { "tableau-analyses": "Liste des analyses" } },
  unipol: { renders: { missions: unipolMissions } },
  sdiic: { renders: { procedures: sdiicProcedures }, labels: { procedures: "Procédures" } },
  "sdgsp-vae": { renders: { services: sdgspServices }, labels: { services: "Les services" } },
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as Slug)) notFound();
  const doc = loadDetail(`services-${slug}`);
  const cfg = CONFIG[slug as Slug];

  const siblings = cardsOf(sectionOf(doc, "autres-services")).map((c) => ({
    code: c.code,
    text: c.text,
    href: c.href,
    img: c.img,
  }));

  return (
    <div className="detail detail--service">
      <UnitDetail
        doc={doc}
        kicker="Sous-direction du CIAPOL"
        crumbs={[{ label: "Services", href: "/services/" }, { label: doc.code }]}
        siblings={siblings}
        siblingsTitle="Autres services du CIAPOL"
        renders={cfg.renders}
        labels={cfg.labels}
      />
    </div>
  );
}

