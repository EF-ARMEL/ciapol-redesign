import TransitionLink from "@/components/ui/TransitionLink";
import { Reveal } from "@/motion/primitives";
import { formatFr, type GiamsucPost } from "./giamsuc";

/* Articles du sous-site : la première carte s'étale, les suivantes s'alignent
   en colonne décalée (pas de grille de cartes identiques). */
export default function GiamsucPosts({ posts, headingLevel = "h3" }: { posts: GiamsucPost[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Reveal as="ul" className="gposts" y={30} stagger={0.08}>
      {posts.map((p, i) => (
        <li key={p.slug} data-reveal-item className={`gpost ${i === 0 ? "gpost--lead" : ""}`}>
          <TransitionLink href={`/projets/giamsuc/actualites/${p.slug}/`} className="gpost__link">
            <span className="gpost__media">
              {p.cover ? (
                <img src={p.cover.src} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              ) : (
                <img src="/media/pages/projets-giamsuc/logo-giamsuc.png" alt="" className="gpost__placeholder" loading="lazy" decoding="async" />
              )}
            </span>
            <span className="gpost__body">
              {p.date ? (
                <time className="eyebrow gpost__date" dateTime={p.date}>
                  {formatFr(p.date)}
                </time>
              ) : null}
              <H className="gpost__title">{p.title}</H>
              {p.excerpt ? <span className="gpost__excerpt">{p.excerpt}</span> : null}
            </span>
          </TransitionLink>
        </li>
      ))}
    </Reveal>
  );
}
