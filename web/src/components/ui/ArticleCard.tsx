import TransitionLink from "./TransitionLink";
import type { ArticleMeta } from "@/lib/content";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));

/* Carte d'actualité : l'image passe du sépia « trouble » à la couleur au
   survol (l'eau se clarifie), le titre se souligne par un trait vert. */
export default function ArticleCard({
  article,
  size = "md",
  priority = false,
}: {
  article: ArticleMeta;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const cat = article.categories.find((c) => c !== "Non classé" && c !== "Vedette");
  return (
    <article className={`acard acard--${size}`}>
      <TransitionLink href={`/actualites/${article.slug}/`} className="acard__link">
        <div className="acard__media">
          {article.cover ? (
            <img src={article.cover} alt="" loading={priority ? "eager" : "lazy"} decoding="async" />
          ) : (
            <div className="acard__placeholder" aria-hidden="true">
              <span className="display">CIAPOL</span>
            </div>
          )}
          {cat ? <span className="acard__cat">{cat}</span> : null}
        </div>
        <div className="acard__body">
          <p className="acard__meta eyebrow">
            <time dateTime={article.date}>{fmt(article.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min</span>
          </p>
          <h3 className="acard__title">
            <span>{article.title}</span>
          </h3>
          {size !== "sm" && article.excerpt ? <p className="acard__excerpt">{article.excerpt}</p> : null}
        </div>
      </TransitionLink>
    </article>
  );
}
