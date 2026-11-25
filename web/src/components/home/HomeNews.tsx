import ArticleCard from "@/components/ui/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Reveal } from "@/motion/primitives";
import type { ArticleMeta } from "@/lib/content";

/* « Actualités » : les dernières publications (même bloc que l'ancien
   accueil, qui en affichait 3 avec « Voir plus d'articles »). Mise en page
   éditoriale asymétrique : un grand article + une colonne. */
export default function HomeNews({ articles }: { articles: ArticleMeta[] }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;
  return (
    <section className="surface--white section hnews" aria-labelledby="hnews-title">
      <div className="shell">
        <SectionHeading
          id="hnews-title"
          tag="Actualités"
          title="Dernières publications"
          action={<Button href="/actualites/" variant="primary">Voir plus d&apos;articles</Button>}
        />
        <Reveal className="hnews__grid">
          <div data-reveal-item className="hnews__lead">
            <ArticleCard article={lead} size="lg" />
          </div>
          <div className="hnews__col">
            {rest.slice(0, 3).map((a) => (
              <div data-reveal-item key={a.slug}>
                <ArticleCard article={a} size="sm" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
