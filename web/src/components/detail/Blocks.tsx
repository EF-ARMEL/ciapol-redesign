import { Reveal, ImageReveal } from "@/motion/primitives";
import type { Block } from "./parse";

/* Rendu générique d'une suite de blocs officiels. Les listes deviennent des
   rangées aérées (lecture ligne à ligne), les tableaux restent des tableaux. */
export default function Blocks({
  blocks,
  headingLevel = 3,
  rows = true,
}: {
  blocks: Block[];
  headingLevel?: 3 | 4;
  rows?: boolean;
}) {
  const H = `h${headingLevel}` as "h3" | "h4";
  return (
    <div className="blocks">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "heading":
            return (
              <H key={i} className="blocks__h display">
                {b.text}
              </H>
            );
          case "html":
            return <div key={i} className="blocks__p prose-ciapol" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "list":
            return <Rows key={i} items={b.items} ordered={b.ordered} plain={!rows} />;
          case "table":
            return (
              <div key={i} className="blocks__table prose-ciapol">
                <table>
                  <thead>
                    <tr>
                      {b.header.map((h, j) => (
                        <th key={j} scope="col" dangerouslySetInnerHTML={{ __html: h }} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k} dangerouslySetInnerHTML={{ __html: c }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "image":
            return (
              <ImageReveal key={i} className="blocks__img">
                <img src={b.img.src} alt={b.img.alt} loading="lazy" decoding="async" />
              </ImageReveal>
            );
        }
      })}
    </div>
  );
}

/* Liste de missions / pièces : une rangée par élément, qui se dépose comme un
   sédiment (flou → net) à l'entrée dans l'écran. */
export function Rows({ items, ordered = false, plain = false }: { items: string[]; ordered?: boolean; plain?: boolean }) {
  const L = ordered ? "ol" : "ul";
  return (
    <Reveal as={L} className={`rows ${ordered ? "rows--ordered" : ""} ${plain ? "rows--plain" : ""}`} y={18} stagger={0.06}>
      {items.map((it, i) => (
        <li key={i} data-reveal-item className="rows__item" dangerouslySetInnerHTML={{ __html: it }} />
      ))}
    </Reveal>
  );
}
