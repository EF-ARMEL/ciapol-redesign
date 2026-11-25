import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/motion/primitives";
import GiamsucShell from "../GiamsucShell";
import Rubriques from "../Rubriques";
import { giamsucPage, rubriques } from "../giamsuc";
import { slugify, type Block } from "@/components/detail/parse";

export const metadata: Metadata = {
  title: "Organes du projet GIAMSUC",
  description: "Composition de l'équipe de coordination du projet GIAMSUC.",
  alternates: { canonical: "/projets/giamsuc/organes/" },
};

/* L'équipe : les noms publiés sur le sous-site (les fiches détaillées n'y sont
   pas exposées), présentés comme un registre. */
export default function GiamsucOrganesPage() {
  const { page, blocks, bg } = giamsucPage("projets-giamsuc-organes");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  const items = rubriques(blocks).map((r) => {
    const list = r.blocks.find((b): b is Extract<Block, { kind: "list" }> => b.kind === "list");
    return { ...r, blocks: r.blocks.filter((b) => b !== list), list };
  });
  const extra: Record<string, ReactNode> = {};
  for (const r of items) {
    if (!r.list || !r.title) continue;
    extra[slugify(r.title)] = (
      <Reveal as="ul" className="team" y={20} stagger={0.06}>
        {r.list.items.map((html) => {
          const name = html.replace(/<[^>]+>/g, "").trim();
          const anchor = html.match(/#([^"]+)"/)?.[1] ?? slugify(name);
          return (
            <li key={anchor} id={anchor} data-reveal-item className="team__member">
              <span className="team__initials" aria-hidden="true">
                {name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
              </span>
              <span className="team__name">{name}</span>
            </li>
          );
        })}
      </Reveal>
    );
  }
  return (
    <GiamsucShell title={h1} section="Organes">
      <Rubriques items={items} media={bg.map((src) => ({ src, alt: "Vue aérienne prise par drone" }))} extra={extra} />
    </GiamsucShell>
  );
}
