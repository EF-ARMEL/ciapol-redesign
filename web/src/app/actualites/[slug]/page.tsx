import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Download, FileText, UserRound } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import ArticleCard from "@/components/ui/ArticleCard";
import TransitionLink from "@/components/ui/TransitionLink";
import Button from "@/components/ui/Button";
import Gallery from "@/components/news/Gallery";
import ShareRail from "@/components/news/ShareRail";
import VideoFacade from "@/components/news/VideoFacade";
import ReadingProgress from "@/components/news/ReadingProgress";
import { prepareBody } from "@/components/news/article-body";
import { categoryLabel, displayCategories, fmtDate, hostLabel, youtubeId } from "@/components/news/news-utils";
import { ImageReveal, Reveal } from "@/motion/primitives";
import { getArticle, getArticleMetas, type ArticleMeta } from "@/lib/content";
import { SITE } from "@/lib/site";
import "@/components/news/video-facade.css";
import "./article.css";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleMetas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const url = `/actualites/${a.slug}/`;
  return {
    title: a.title,
    description: a.excerpt || undefined,
    alternates: { canonical: url },
    authors: a.author ? [{ name: a.author }] : undefined,
    openGraph: {
      type: "article",
      url,
      title: a.title,
      description: a.excerpt || undefined,
      publishedTime: a.date,
      modifiedTime: a.updated,
      authors: a.author ? [a.author] : undefined,
      images: a.cover ? [{ url: a.cover }] : undefined,
    },
    twitter: { card: a.cover ? "summary_large_image" : "summary", title: a.title, description: a.excerpt || undefined },
  };
}

const crumbLabel = (t: string) => (t.length > 56 ? `${t.slice(0, 54).trimEnd()}…` : t);
const card = (a: ArticleMeta): ArticleMeta => ({ ...a, categories: displayCategories(a.categories).map(categoryLabel) });

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const all = getArticleMetas();
  const i = all.findIndex((a) => a.slug === slug);
  const newer = i > 0 ? all[i - 1] : undefined;
  const older = i < all.length - 1 ? all[i + 1] : undefined;

  // Articles liés : même rubrique éditoriale (hors « Non classé »), sinon les plus récents.
  const own = article.categories.filter((c) => c !== "Non classé");
  const others = all.filter((a) => a.slug !== slug);
  const related = [
    ...others.filter((a) => a.categories.some((c) => own.includes(c))),
    ...others,
  ].filter((a, k, arr) => arr.findIndex((b) => b.slug === a.slug) === k).slice(0, 3);

  const { html, gallery } = prepareBody(article.html, article.images, article.cover);
  const labels = displayCategories(article.categories).map(categoryLabel);
  const videos = article.videos.map((url) => ({ url, id: youtubeId(url) }));
  const absUrl = `${SITE.url}/actualites/${article.slug}/`;
  const long = article.title.length > 70;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title.slice(0, 110),
    description: article.excerpt || undefined,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    image: article.cover ? [`${SITE.url}${article.cover}`] : undefined,
    author: article.author ? { "@type": "Person", name: article.author } : { "@type": "Organization", name: SITE.fullName },
    publisher: {
      "@type": "GovernmentOrganization",
      name: `${SITE.fullName} (${SITE.name})`,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/media/site/logo-ciapol.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absUrl },
    articleSection: labels.length ? labels : undefined,
    isBasedOn: article.sourceUrl,
    inLanguage: "fr-CI",
  };

  return (
    <>
      <ReadingProgress target="#article-corps" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={`art-hero ${long ? "art-hero--long" : ""} ${article.cover ? "art-hero--cover" : ""}`}>
        <PageHero
          eyebrow={labels[0] ?? "Actualités"}
          title={article.title}
          crumbs={[{ label: "Actualités", href: "/actualites/" }, { label: crumbLabel(article.title) }]}
        >
          <ul className="art-meta" aria-label="Informations sur l'article">
            <li>
              <CalendarDays size={16} aria-hidden="true" />
              <span className="sr-only">Publié le </span>
              <time dateTime={article.date}>{fmtDate(article.date)}</time>
            </li>
            {article.author ? (
              <li>
                <UserRound size={16} aria-hidden="true" />
                <span className="sr-only">Auteur : </span>
                {article.author}
              </li>
            ) : null}
            <li>
              <Clock size={16} aria-hidden="true" />
              {article.readingMinutes} min de lecture
            </li>
            {labels.slice(1).map((l) => (
              <li key={l} className="art-meta__cat">{l}</li>
            ))}
          </ul>
        </PageHero>
      </div>

      <article className="surface surface--white art">
        {article.cover ? (
          <div className="shell art-cover-wrap">
            <ImageReveal className="art-cover">
              <img src={article.cover} alt="" loading="eager" decoding="async" fetchPriority="high" />
            </ImageReveal>
          </div>
        ) : null}

        <div className="shell art-layout">
          <aside className="art-rail" aria-label="Partage et source">
            <div className="art-rail__sticky">
              <ShareRail url={absUrl} title={article.title} sourceUrl={article.sourceUrl} />
            </div>
          </aside>

          <div id="article-corps" className="art-main">
            <Reveal y={30}>
              <Prose html={html} className="art-prose" />
            </Reveal>

            {videos.length ? (
              <section className="art-block" aria-labelledby="art-videos">
                <h2 id="art-videos" className="art-block__title">
                  {videos.length > 1 ? "Vidéos" : "Vidéo"}
                </h2>
                <div className="art-videos">
                  {videos.map((v) =>
                    v.id ? (
                      <VideoFacade key={v.url} id={v.id} title={article.title} poster={article.cover} />
                    ) : (
                      <p key={v.url}>
                        <a className="link art-link" href={v.url} target="_blank" rel="noopener noreferrer">
                          Voir la vidéo sur {hostLabel(v.url)}
                          <span className="sr-only"> (nouvel onglet)</span>
                        </a>
                      </p>
                    ),
                  )}
                </div>
              </section>
            ) : null}

            {article.documents.length ? (
              <section className="art-block" aria-labelledby="art-docs">
                <h2 id="art-docs" className="art-block__title">Documents</h2>
                <ul className="art-docs">
                  {article.documents.map((d) => (
                    <li key={d.url}>
                      <a href={d.url} className="art-doc" download target="_blank" rel="noopener noreferrer">
                        <FileText size={22} aria-hidden="true" className="art-doc__icon" />
                        <span className="art-doc__label">{d.label}</span>
                        <span className="art-doc__ext eyebrow">{(d.url.split(".").pop() ?? "").toUpperCase()}</span>
                        <Download size={18} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>

        {gallery.length ? (
          <section className="shell art-gallery" aria-labelledby="art-gal">
            <div className="art-gallery__head">
              <h2 id="art-gal" className="art-block__title">Photos</h2>
              <p className="eyebrow">{gallery.length} {gallery.length > 1 ? "images" : "image"}</p>
            </div>
            <Gallery images={gallery} title={article.title} />
          </section>
        ) : null}

        <nav className="shell art-pager" aria-label="Articles précédent et suivant">
          {older ? (
            <TransitionLink href={`/actualites/${older.slug}/`} className="art-pager__link art-pager__link--prev" rel="prev">
              <span className="eyebrow">Article précédent</span>
              <span className="art-pager__title">{older.title}</span>
              <time className="art-pager__date" dateTime={older.date}>{fmtDate(older.date)}</time>
            </TransitionLink>
          ) : <span />}
          {newer ? (
            <TransitionLink href={`/actualites/${newer.slug}/`} className="art-pager__link art-pager__link--next" rel="next">
              <span className="eyebrow">Article suivant</span>
              <span className="art-pager__title">{newer.title}</span>
              <time className="art-pager__date" dateTime={newer.date}>{fmtDate(newer.date)}</time>
            </TransitionLink>
          ) : <span />}
        </nav>
      </article>

      {related.length ? (
        <section className="surface section art-related" aria-labelledby="art-related-title">
          <div className="shell">
            <div className="art-related__head">
              <h2 id="art-related-title" className="display art-related__title">À lire aussi</h2>
              <Button href="/actualites/" variant="ghost">Toutes les actualités</Button>
            </div>
            <Reveal className="art-related__grid">
              {related.map((a, k) => (
                <div key={a.slug} data-reveal-item className={`art-related__cell art-related__cell--${k}`}>
                  <ArticleCard article={card(a)} size={k === 0 ? "lg" : "md"} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
