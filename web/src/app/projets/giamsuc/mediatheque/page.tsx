import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";
import FitImage from "@/components/ui/FitImage";
import { DetailBody, DetailSection, PhotoBand } from "@/components/detail/Detail";
import { ImageReveal, Reveal } from "@/motion/primitives";
import type { Block, Img } from "@/components/detail/parse";
import GiamsucShell from "../GiamsucShell";
import { getGiamsucPosts, giamsucPage } from "../giamsuc";

export const metadata: Metadata = {
  title: "Médiathèque du projet GIAMSUC",
  description: "La médiathèque du projet GIAMSUC : images des ateliers, campagnes et réunions du projet.",
  alternates: { canonical: "/projets/giamsuc/mediatheque/" },
};

/* Médiathèque : chaque vignette ouvre l'article correspondant. Les vignettes
   « placeholder » du sous-site (article sans image à la une) deviennent une
   surface teintée portant le logo du projet. */
export default function GiamsucMediathequePage() {
  const { page, blocks, bg } = giamsucPage("projets-giamsuc-mediatheque");
  const h1 = page.markdown.match(/^#\s+(.+)$/m)?.[1] ?? page.title;
  const posts = getGiamsucPosts();
  const items: { img: Img; title: string }[] = [];
  blocks.forEach((b, i) => {
    const next = blocks[i + 1];
    if (b.kind === "image" && next?.kind === "heading") items.push({ img: b.img, title: (next as Extract<Block, { kind: "heading" }>).text });
  });
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9à-ÿ]/g, "");
  return (
    <GiamsucShell title={h1} section="Médiathèques">
      <DetailBody toc={[]}>
        <DetailSection id="galerie" kicker="GIAMSUC" title="En images" wide>
          <Reveal as="ul" className="gmedia" y={30} stagger={0.07}>
            {items.map((it, i) => {
              const post = posts.find((p) => norm(p.title) === norm(it.title));
              /* Vignette « placeholder » du sous-site d'origine : on prend la photo
                 de l'article lié (première de sa galerie), sinon le logo du projet. */
              const placeholder = /placeholder\.png$/.test(it.img.src);
              const photo = placeholder ? post?.cover?.src ?? post?.gallery[0]?.src : it.img.src;
              const inner = (
                <>
                  <ImageReveal className={`gmedia__frame ${photo ? "" : "gmedia__frame--logo"}`} from={i % 2 ? "left" : "bottom"}>
                    {photo ? (
                      <FitImage src={photo} alt={placeholder ? "" : it.img.alt} />
                    ) : (
                      <img src="/media/pages/projets-giamsuc/logo-giamsuc.png" alt="" className="gmedia__logo" loading="lazy" decoding="async" />
                    )}
                  </ImageReveal>
                  <h3 className="gmedia__title">{it.title}</h3>
                </>
              );
              return (
                <li key={it.title} data-reveal-item className={`gmedia__item ${i === 0 ? "gmedia__item--lead" : ""}`}>
                  {post ? (
                    <TransitionLink href={`/projets/giamsuc/actualites/${post.slug}/`} className="gmedia__link">
                      {inner}
                    </TransitionLink>
                  ) : (
                    <div className="gmedia__link">{inner}</div>
                  )}
                </li>
              );
            })}
          </Reveal>
        </DetailSection>
      </DetailBody>
      {bg[0] ? <PhotoBand image={{ src: bg[0], alt: "" }} /> : null}
    </GiamsucShell>
  );
}
