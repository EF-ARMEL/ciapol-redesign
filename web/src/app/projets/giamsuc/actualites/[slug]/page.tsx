import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TransitionLink from "@/components/ui/TransitionLink";
import Blocks from "@/components/detail/Blocks";
import { Mosaic } from "@/components/detail/Detail";
import { Reveal } from "@/motion/primitives";
import GiamsucShell from "../../GiamsucShell";
import { formatFr, getGiamsucPosts } from "../../giamsuc";

export const dynamicParams = false;
export function generateStaticParams() {
  return getGiamsucPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getGiamsucPosts().find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title.length > 90 ? `${p.title.slice(0, 88)}…` : p.title,
    description: p.excerpt?.slice(0, 180),
    alternates: { canonical: `/projets/giamsuc/actualites/${slug}/` },
  };
}

/* Article du sous-site GIAMSUC, repris intégralement (corps récupéré via
   l'API publique du sous-site, aujourd'hui hors service). */
export default async function GiamsucPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getGiamsucPosts();
  const i = posts.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = posts[i];
  const prev = posts[i + 1];
  const next = posts[i - 1];
  const gallery = p.gallery.map((g, j) => ({ ...g, alt: g.alt || `${p.title}, photo ${j + 1}` }));

  return (
    <GiamsucShell variant="post" current="Article" title={p.title} section="Actualités" lead={p.date ? `Publié le ${formatFr(p.date)}` : undefined}>
      <article className="surface section gart">
        <div className="shell gart__grid">
          <div className="gart__body">
            {p.excerpt ? <p className="gart__excerpt">{p.excerpt}</p> : null}
            <Blocks blocks={p.body.map((b) => (b.kind === "image" && !b.img.alt ? { ...b, img: { ...b.img, alt: p.title } } : b))} rows={false} />
          </div>
          <aside className="gart__aside" aria-label="Informations">
            <p className="eyebrow">Projet GIAMSUC</p>
            {p.date ? (
              <p className="gart__date">
                <time dateTime={p.date}>{formatFr(p.date)}</time>
              </p>
            ) : null}
            <p>
              <TransitionLink href="/projets/giamsuc/actualites/" className="link">
                Tous les articles du projet
              </TransitionLink>
            </p>
          </aside>
        </div>
        {gallery.length ? (
          <div className="shell gart__gallery">
            <h2 className="display gart__gtitle">En images</h2>
            <Mosaic images={gallery} label={`Photos : ${p.title}`} />
          </div>
        ) : null}
        <nav className="shell gart__pager" aria-label="Articles voisins">
          <Reveal className="gart__pager-inner">
            {prev ? (
              <TransitionLink href={`/projets/giamsuc/actualites/${prev.slug}/`} className="gart__pl">
                <span className="eyebrow">Article précédent</span>
                <span className="gart__pt">{prev.title}</span>
              </TransitionLink>
            ) : <span />}
            {next ? (
              <TransitionLink href={`/projets/giamsuc/actualites/${next.slug}/`} className="gart__pl gart__pl--next">
                <span className="eyebrow">Article suivant</span>
                <span className="gart__pt">{next.title}</span>
              </TransitionLink>
            ) : null}
          </Reveal>
        </nav>
      </article>
    </GiamsucShell>
  );
}
