import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import TransitionLink from "@/components/ui/TransitionLink";
import { getPage } from "@/lib/content";
import { block, links, stripComments } from "@/components/institution/md";
import DecreeNav, { type DecreeToc } from "./DecreeNav";
import PrintButton from "./PrintButton";
import "@/components/institution/institution.css";
import "./decret.css";

export const metadata: Metadata = {
  title: "Décret de création",
  description:
    "Texte intégral du décret n° 91-662 du 9 octobre 1991 portant création du Centre Ivoirien Antipollution (CIAPOL) et déterminant ses attributions, son organisation et son fonctionnement.",
};

type Article = { id: string; label: string; sub?: string; html: string };
type Titre = { id: string; label: string; articles: Article[] };

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function parseDecree(md: string) {
  const text = stripComments(md);
  // Intitulé du décret : « # [ … [PDF]](lien) » sur deux lignes.
  const head = text.match(/^#\s+\[([\s\S]+?)\]\(([^)\s]+)\)/m);
  const headLines = (head?.[1] ?? "")
    .replace(/\s*\[PDF\]\s*$/, "")
    .split(/\s*\n\s*/)
    .map((l) => l.trim())
    .filter(Boolean);
  const pdf = head?.[2];

  const titres: Titre[] = [];
  const chunks = text.split(/^##\s+/m).slice(1);
  for (const chunk of chunks) {
    const nl = chunk.indexOf("\n");
    const heading = (nl < 0 ? chunk : chunk.slice(0, nl)).trim();
    const body = nl < 0 ? "" : chunk.slice(nl + 1).trim();
    if (/^TITRE\b/i.test(heading)) {
      titres.push({ id: slug(heading.split(":")[0]), label: heading, articles: [] });
      continue;
    }
    const m = heading.match(/^ARTICLE\s+([^:]+?)\s*:\s*(.*)$/i);
    if (!m) continue;
    const num = m[1].trim();
    const n = /premier/i.test(num) ? "1" : num;
    const current = titres[titres.length - 1];
    current?.articles.push({
      id: `article-${n}`,
      label: `ARTICLE ${num}`,
      sub: m[2]?.trim() || undefined,
      html: block(body),
    });
  }
  return { headLines, pdf, titres };
}

function fileSize(href: string) {
  try {
    const p = path.join(process.cwd(), "public", decodeURI(href));
    const b = fs.statSync(p).size;
    return b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace(".", ",")} Mo` : `${Math.round(b / 1024)} Ko`;
  } catch {
    return undefined;
  }
}

const artLabel = (label: string) => label.replace(/^ARTICLE\s+/i, "Art. ").replace(/^Art\. PREMIER$/i, "Art. 1er");

export default function DecretPage() {
  const page = getPage("decret-de-creation");
  if (!page) notFound();
  const main = page.sections.find((s) => s.name.startsWith("texte-du-decret"))?.markdown ?? "";
  const side = page.sections.find((s) => s.name.startsWith("colonne-laterale"))?.markdown ?? "";
  const pageTitle = stripComments(page.sections.find((s) => s.name === "titre")?.markdown ?? "").replace(/^#\s+/, "");
  const { headLines, pdf, titres } = parseDecree(main);
  const localPdf = pdf && pdf.startsWith("/media/") ? pdf : undefined;
  const pdfSize = localPdf ? fileSize(localPdf) : undefined;

  // Colonne latérale officielle : deux listes sous des titres « ### ».
  const sideGroups = stripComments(side)
    .split(/^###\s+/m)
    .slice(1)
    .map((g) => {
      const nl = g.indexOf("\n");
      return { title: g.slice(0, nl).trim(), links: links(g.slice(nl + 1)) };
    });

  const toc: DecreeToc = titres.map((t) => ({
    id: t.id,
    label: t.label.split(":")[0].trim(),
    articles: t.articles.map((a) => ({ id: a.id, label: artLabel(a.label) })),
  }));
  const count = titres.reduce((n, t) => n + t.articles.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Présentation"
        title={pageTitle ? pageTitle.charAt(0) + pageTitle.slice(1).toLowerCase() : page.title}
        crumbs={[{ label: "Présentation", href: "/presentation/" }, { label: page.title }]}
        lead={page.description}
      />

      <section className="surface surface--white dec" aria-label="Texte du décret">
        <div className="shell dec__grid">
          <aside className="dec__rail">
            <DecreeNav toc={toc} />
          </aside>

          <article className="dec__doc" aria-labelledby="dec-intitule">
            <header className="dec__head">
              <p className="dec__meta eyebrow">
                {titres.length} titres, {count} articles
              </p>
              <h2 id="dec-intitule" className="dec__intitule">
                <span className="dec__intitule-1 display">{headLines[0]}</span>
                {headLines.slice(1).map((l) => (
                  <span key={l} className="dec__intitule-2">
                    {l}
                  </span>
                ))}
              </h2>
              <div className="dec__tools">
                {localPdf ? (
                  <a className="inst-btn" href={localPdf} target="_blank" rel="noopener noreferrer" type="application/pdf">
                    Version PDF du décret
                    <span className="dec__pdf-size">PDF{pdfSize ? `, ${pdfSize}` : ""}</span>
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                ) : null}
                <PrintButton />
              </div>
            </header>

            {titres.map((t) => (
              <section key={t.id} className="dec__titre" aria-labelledby={t.id}>
                <h3 id={t.id} className="dec__titre-h display">
                  {t.label}
                </h3>
                {t.articles.map((a) => (
                  <section key={a.id} id={a.id} className="dec__art" aria-labelledby={`${a.id}-h`}>
                    <h4 id={`${a.id}-h`} className="dec__art-h">
                      <a href={`#${a.id}`} className="dec__anchor">
                        {a.label}
                        {a.sub ? <span className="dec__art-sub"> : {a.sub}</span> : null}
                      </a>
                    </h4>
                    <div className="dec__art-body" dangerouslySetInnerHTML={{ __html: a.html }} />
                  </section>
                ))}
              </section>
            ))}
          </article>
        </div>
      </section>

      {sideGroups.length ? (
        <section className="surface section--tight dec-more" aria-label="Pour aller plus loin">
          <div className="shell dec-more__grid">
            {sideGroups.map((g) => (
              <div key={g.title} className="dec-more__group">
                <h2 className="display inst-h3">{g.title.charAt(0) + g.title.slice(1).toLowerCase()}</h2>
                <ul className="dec-more__list">
                  {g.links.map((l) => {
                    const isPdf = /\.pdf$/i.test(l.href);
                    if (isPdf) {
                      const size = fileSize(l.href);
                      return (
                        <li key={l.href}>
                          <a className="dec-doc" href={l.href} target="_blank" rel="noopener noreferrer" type="application/pdf">
                            <span className="dec-doc__t">{l.label}</span>
                            <span className="dec-doc__m">PDF{size ? `, ${size}` : ""}</span>
                            <span className="sr-only"> (nouvel onglet)</span>
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={l.href}>
                        <TransitionLink href={l.href.replace(/\/?$/, "/")} className="link dec-more__link">
                          {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
                        </TransitionLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
