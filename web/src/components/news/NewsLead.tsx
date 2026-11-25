import TransitionLink from "@/components/ui/TransitionLink";
import { ImageReveal, Reveal } from "@/motion/primitives";
import type { ArticleMeta } from "@/lib/content";
import { fmtDate } from "./news-utils";

/* Article phare du hub : la dernière publication, en grand format
   (photo 7/12 révélée par rideau, du terne au net, texte décalé 5/12). */
export default function NewsLead({ article, labels }: { article: ArticleMeta; labels: string[] }) {
  const href = `/actualites/${article.slug}/`;
  return (
    <article className="lead-news" aria-labelledby="lead-news-title">
      <TransitionLink href={href} className="lead-news__media" tabIndex={-1} aria-hidden="true">
        <ImageReveal className="lead-news__frame">
          {article.cover ? (
            <img src={article.cover} alt="" loading="eager" decoding="async" fetchPriority="high" />
          ) : (
            <div className="acard__placeholder">
              <span className="display">CIAPOL</span>
            </div>
          )}
        </ImageReveal>
        <span className="lead-news__stamp display" aria-hidden="true">
          01
        </span>
      </TransitionLink>

      <Reveal className="lead-news__body" delay={0.2}>
        <p className="eyebrow lead-news__kicker" data-reveal-item>
          <span className="lead-news__dot" aria-hidden="true" />
          Dernière publication
        </p>
        <p className="eyebrow lead-news__meta" data-reveal-item>
          <time dateTime={article.date}>{fmtDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} min de lecture</span>
        </p>
        <h2 id="lead-news-title" className="lead-news__title" data-reveal-item>
          <TransitionLink href={href}>
            <span>{article.title}</span>
          </TransitionLink>
        </h2>
        {article.excerpt ? (
          <p className="lead-news__excerpt" data-reveal-item>
            {article.excerpt}
          </p>
        ) : null}
        <div className="lead-news__foot" data-reveal-item>
          {labels.length ? (
            <ul className="lead-news__cats" aria-label="Rubriques">
              {labels.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : null}
          <TransitionLink href={href} className="lead-news__cta" aria-describedby="lead-news-title">
            Lire l&apos;article
          </TransitionLink>
        </div>
      </Reveal>
    </article>
  );
}
