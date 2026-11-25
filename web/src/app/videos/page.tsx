import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import TransitionLink from "@/components/ui/TransitionLink";
import VideoFacade from "@/components/news/VideoFacade";
import { fmtDate, hostLabel, youtubeId } from "@/components/news/news-utils";
import { Reveal } from "@/motion/primitives";
import { getArticleMetas, getPage, getSite } from "@/lib/content";
import "@/components/news/video-facade.css";
import "./videos.css";

export const metadata: Metadata = {
  title: "Vidéos",
  description:
    "Les vidéos du Centre Ivoirien Antipollution (CIAPOL) : vidéos institutionnelles et reportages liés aux actualités (Plan POLLUMAR, ateliers, interventions).",
  alternates: { canonical: "/videos/" },
};

type Clip = { url: string; id: string | null; title: string; poster?: string };
type ArticleClip = Clip & { slug: string; date: string; articleTitle: string };

/* Liens vidéo d'un bloc Markdown : « [titre](url) — vignette : ![](image) ». */
function parseClips(md: string): Clip[] {
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)[^\n]*(?:\n[ \t]*\n?[ \t]*!\[[^\]]*\]\(([^)\s]+)\))?/g;
  const out: Clip[] = [];
  for (const m of md.matchAll(re)) {
    const id = youtubeId(m[2]);
    if (!id && !/facebook\.com\/.+\/videos|vimeo\.com/.test(m[2])) continue;
    out.push({ url: m[2], id, title: m[1].trim(), poster: m[3] });
  }
  return out;
}

function institutionalClips(): Clip[] {
  const clips: Clip[] = [];
  const home = getPage("accueil");
  const block = home?.sections.find((s) => /videos?/i.test(s.name));
  if (block) clips.push(...parseClips(block.markdown));
  // Sources complémentaires éventuelles (page dédiée, site.json).
  const page = getPage("videos");
  if (page) clips.push(...parseClips(page.markdown));
  const site = getSite<{ videos?: unknown }>();
  if (Array.isArray(site.videos)) {
    for (const v of site.videos) {
      const url = typeof v === "string" ? v : (v as { url?: string })?.url;
      if (!url) continue;
      const o = typeof v === "object" && v ? (v as { title?: string; thumbnail?: string; poster?: string }) : {};
      clips.push({ url, id: youtubeId(url), title: o.title ?? "Vidéo CIAPOL", poster: o.thumbnail ?? o.poster });
    }
  }
  return clips.filter((c, i, a) => a.findIndex((d) => (d.id ?? d.url) === (c.id ?? c.url)) === i);
}

export default function VideosPage() {
  const inst = institutionalClips();
  const seen = new Set(inst.map((c) => c.id ?? c.url));
  const fromArticles: ArticleClip[] = [];
  for (const a of getArticleMetas()) {
    for (const url of a.videos) {
      const id = youtubeId(url);
      if (seen.has(id ?? url)) continue;
      seen.add(id ?? url);
      fromArticles.push({ url, id, title: a.title, poster: a.cover, slug: a.slug, date: a.date, articleTitle: a.title });
    }
  }
  const total = inst.length + fromArticles.length;
  const [first, ...rest] = inst;

  return (
    <>
      <PageHero
        eyebrow="Médiathèque"
        title="Vidéos"
        crumbs={[{ label: "Vidéos" }]}
        aside={
          <p className="vid-total">
            <span className="display">{total}</span>
            <span className="eyebrow">{total > 1 ? "vidéos" : "vidéo"}</span>
          </p>
        }
        lead="Vidéos institutionnelles et reportages accompagnant les actualités du Centre Ivoirien Antipollution. Les vidéos sont hébergées sur YouTube et ne se chargent qu'au clic."
      />

      {first ? (
        <section className="surface section vid-section" aria-labelledby="vid-inst">
          <div className="shell">
            <SectionHeading id="vid-inst" tag="Médiathèque" title="Vidéos institutionnelles" />
            <Reveal className="vid-inst">
              <figure className="vid-inst__lead" data-reveal-item>
                <ClipPlayer clip={first} />
                <figcaption className="vid-cap vid-cap--lg">{first.title}</figcaption>
              </figure>
              {rest.length ? (
                <ul className="vid-inst__list">
                  {rest.map((c) => (
                    <li key={c.id ?? c.url} data-reveal-item>
                      <figure>
                        <ClipPlayer clip={c} />
                        <figcaption className="vid-cap">{c.title}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {fromArticles.length ? (
        <section className="surface surface--white section vid-section" aria-labelledby="vid-art">
          <div className="shell">
            <SectionHeading
              id="vid-art"
              tag="Actualités"
              title="Vidéos des actualités"
              lead="Chaque vidéo renvoie à l'article qu'elle accompagne."
            />
            <Reveal as="ul" className="vid-grid">
              {fromArticles.map((c, k) => (
                <li key={c.id ?? c.url} data-reveal-item className={`vid-card ${k % 3 === 1 ? "vid-card--offset" : ""}`}>
                  <ClipPlayer clip={c} />
                  <div className="vid-card__body">
                    <time className="eyebrow vid-card__date" dateTime={c.date}>{fmtDate(c.date)}</time>
                    <h3 className="vid-card__title">
                      <TransitionLink href={`/actualites/${c.slug}/`}>
                        <span>{c.articleTitle}</span>
                      </TransitionLink>
                    </h3>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {total === 0 ? (
        <section className="surface section">
          <div className="shell">
            <p className="lead">Aucune vidéo n&apos;est disponible pour le moment.</p>
          </div>
        </section>
      ) : null}
    </>
  );
}

function ClipPlayer({ clip }: { clip: Clip }) {
  if (clip.id) return <VideoFacade id={clip.id} title={clip.title} poster={clip.poster} />;
  return (
    <a className="vfac vid-ext" href={clip.url} target="_blank" rel="noopener noreferrer">
      {clip.poster ? <img src={clip.poster} alt="" loading="lazy" decoding="async" className="vfac__poster" /> : <span className="vfac__poster vfac__poster--empty" aria-hidden="true" />}
      <span className="vfac__shade" aria-hidden="true" />
      <span className="vid-ext__label">
        Voir la vidéo sur {hostLabel(clip.url)}
        <span className="sr-only"> (nouvel onglet) : {clip.title}</span>
      </span>
    </a>
  );
}
