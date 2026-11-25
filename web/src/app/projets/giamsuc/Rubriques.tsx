import type { ReactNode } from "react";
import Blocks from "@/components/detail/Blocks";
import { DetailBody, DetailSection } from "@/components/detail/Detail";
import { slugify, type Block, type Img } from "@/components/detail/parse";
import Partners from "./Partners";
import type { Rubrique } from "./giamsuc";

/* Une liste annoncée par « : » mais non récupérable sur le sous-site : on le
   signale sobrement plutôt que de laisser une phrase en suspens. */
function withMissingNotes(blocks: Block[]): ReactNode[] {
  const out: ReactNode[] = [];
  let buf: Block[] = [];
  const flush = () => {
    if (buf.length) out.push(<Blocks key={`b${out.length}`} blocks={buf} />);
    buf = [];
  };
  blocks.forEach((b, i) => {
    buf.push(b);
    const next = blocks[i + 1];
    if (b.kind === "html" && /:\s*$/.test(b.text) && (!next || next.kind !== "list")) {
      flush();
      out.push(
        <p key={`n${i}`} className="dnote">
          Le détail de cette liste n&apos;est pas encore disponible en ligne.
        </p>,
      );
    }
  });
  flush();
  return out;
}

export default function Rubriques({
  items,
  media = [],
  extra,
}: {
  items: Rubrique[];
  media?: (Img | undefined)[];
  extra?: Record<string, ReactNode>;
}) {
  const toc = items.filter((r) => r.title).map((r) => ({ id: slugify(r.title!), label: r.title! }));
  let k = 0;
  return (
    <DetailBody toc={toc}>
      {items.map((r, i) => {
        const id = r.title ? slugify(r.title) : `rubrique-${i}`;
        const logos = r.blocks.length > 0 && r.blocks.every((b) => b.kind === "image" && /^Logo/i.test(b.img.alt));
        if (logos) {
          return (
            <section key={id} id={id} aria-labelledby={`${id}-titre`} className="dsec">
              {r.kicker ? <p className="eyebrow dsec__kicker">{r.kicker}</p> : null}
              <h2 id={`${id}-titre`} className="display dsec__title">
                {r.title}
              </h2>
              <Partners logos={r.blocks.map((b) => (b as Extract<Block, { kind: "image" }>).img)} />
            </section>
          );
        }
        const m = media[k];
        if (m) k++;
        return (
          <DetailSection key={id} id={id} kicker={r.kicker} title={r.title} media={m} flip={i % 2 === 1}>
            {extra?.[id] ? <Blocks blocks={r.blocks} /> : withMissingNotes(r.blocks)}
            {extra?.[id]}
          </DetailSection>
        );
      })}
    </DetailBody>
  );
}
