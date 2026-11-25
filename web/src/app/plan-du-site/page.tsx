import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import TransitionLink from "@/components/ui/TransitionLink";
import { Reveal, SplitReveal } from "@/motion/primitives";
import { NAV, CTA, type NavItem } from "@/lib/nav";
import { formatDate, getArticleMetas, getPage, listPages } from "@/lib/content";
import "@/components/institution/institution.css";
import "./plan-du-site.css";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Plan complet du site du Centre Ivoirien Antipollution (CIAPOL) : rubriques, services, projets et liste de toutes les actualités par année.",
};

const norm = (h: string) => (h.endsWith("/") ? h : `${h}/`);

/* Sous-pages GIAMSUC : lues dans le contenu officiel (champ route). */
function giamsucPages(): NavItem[] {
  return listPages()
    .filter((s) => s.startsWith("projets-giamsuc-"))
    .map((s) => getPage(s))
    .filter((p): p is NonNullable<typeof p> => !!p && !!p.route)
    .map((p) => ({ label: p.title, href: norm(p.route as string) }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export default function PlanDuSitePage() {
  const giamsuc = giamsucPages();
  const groups: { title: string; items: NavItem[] }[] = NAV.filter((n) => n.href !== "/").map((n) => {
    const own = { label: n.children ? `${n.label} : vue d'ensemble` : n.label, href: n.href };
    const kids = (n.children ?? [])
      .filter((c) => c.href !== n.href)
      .map((c) => ({
        ...c,
        children: c.href === "/projets/giamsuc/" ? giamsuc : undefined,
      }));
    // « Qui sommes-nous » pointe sur la même route que la rubrique : on garde son libellé.
    const same = (n.children ?? []).find((c) => c.href === n.href);
    return { title: n.label, items: [same ? { ...own, label: same.label } : own, ...kids] };
  });

  const extra: NavItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Vidéos", href: "/videos/" },
    { label: CTA.label, href: norm(CTA.href) },
    { label: "Plan du site", href: "/plan-du-site/" },
  ];
  // Rubriques citées par le cahier des routes, ajoutées si absentes du menu.
  const listed = new Set([...groups.flatMap((g) => g.items.map((i) => i.href)), ...extra.map((e) => e.href)]);
  for (const r of [
    { label: "Actualités", href: "/actualites/" },
    { label: "Galerie", href: "/galerie/" },
    { label: "Décret de création", href: "/decret-de-creation/" },
    { label: "Mot du directeur", href: "/mot-du-directeur/" },
  ])
    if (!listed.has(r.href)) extra.push(r);

  const articles = getArticleMetas();
  const byYear = new Map<number, typeof articles>();
  for (const a of articles) {
    const y = new Date(a.date).getFullYear();
    byYear.set(y, [...(byYear.get(y) ?? []), a]);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <>
      <PageHero
        eyebrow="Accessibilité"
        title="Plan du site"
        crumbs={[{ label: "Plan du site" }]}
        lead={`Toutes les pages du site du CIAPOL, ainsi que les ${articles.length} actualités publiées, classées par année.`}
      />

      <section className="surface surface--white section pds" aria-labelledby="pds-t">
        <div className="shell">
          <Reveal>
            <span className="tag">Rubriques</span>
          </Reveal>
          <SplitReveal as="h2" id="pds-t" className="display inst-h2 pds__h2">
            Les pages du site
          </SplitReveal>
          <div className="pds__grid">
            <Reveal className="pds__group" as="div">
              <h3 className="display pds__gt">Général</h3>
              <ul className="pds__list">
                {extra.map((i) => (
                  <li key={i.href}>
                    <TransitionLink href={i.href} className="pds__link">
                      {i.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </Reveal>
            {groups.map((g) => (
              <Reveal key={g.title} className="pds__group" as="div">
                <h3 className="display pds__gt">{g.title}</h3>
                <ul className="pds__list">
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <TransitionLink href={i.href} className="pds__link">
                        {i.code ? <span className="pds__code eyebrow">{i.code}</span> : null}
                        <span>{i.label}</span>
                      </TransitionLink>
                      {i.children?.length ? (
                        <ul className="pds__sub">
                          {i.children.map((c) => (
                            <li key={c.href}>
                              <TransitionLink href={c.href} className="pds__link pds__link--sub">
                                {c.label}
                              </TransitionLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="surface section pds-news" aria-labelledby="pds-news-t">
        <div className="shell">
          <Reveal>
            <span className="tag">Actualités</span>
          </Reveal>
          <SplitReveal as="h2" id="pds-news-t" className="display inst-h2 pds__h2">
            Toutes les actualités
          </SplitReveal>
          <nav className="pds-years" aria-label="Années">
            {years.map((y) => (
              <a key={y} href={`#annee-${y}`} className="pds-years__a">
                {y} <span className="pds-years__n">{byYear.get(y)?.length}</span>
              </a>
            ))}
          </nav>
          {years.map((y) => (
            <div key={y} className="pds-year" id={`annee-${y}`}>
              <h3 className="display pds-year__t">
                {y}
                <span className="pds-year__n eyebrow">{byYear.get(y)?.length} articles</span>
              </h3>
              <ul className="pds-year__list">
                {(byYear.get(y) ?? []).map((a) => (
                  <li key={a.slug}>
                    <TransitionLink href={`/actualites/${a.slug}/`} className="pds-art">
                      <time dateTime={a.date} className="pds-art__d">
                        {formatDate(a.date, { day: "2-digit", month: "short" })}
                      </time>
                      <span className="pds-art__t">{a.title}</span>
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
