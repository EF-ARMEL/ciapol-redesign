"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SearchX, X, RotateCcw, Plus } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArticleCard from "@/components/ui/ArticleCard";
import { Reveal } from "@/motion/primitives";
import type { ArticleMeta } from "@/lib/content";
import { categoryLabel, displayCategories, normalize } from "./news-utils";
import NewsLead from "./NewsLead";

export type HubFacet = { value: string; label: string; count: number };

const PAGE = 12;
/* Rythme éditorial asymétrique sur 7 cartes : [7|5] [4|4|4] [5|7] (grille de 12). */
const RHYTHM = ["a", "b", "c", "d", "e", "f", "g"] as const;
const SIZE: Record<(typeof RHYTHM)[number], "sm" | "md" | "lg"> = { a: "lg", b: "md", c: "sm", d: "sm", e: "sm", f: "md", g: "lg" };

type Props = { items: ArticleMeta[]; categories: HubFacet[]; years: HubFacet[] };

/* Hub des actualités : filtres (rubrique, année, recherche plein texte)
   reflétés dans l'URL (?categorie=&annee=&q=), pagination « Charger plus ».
   Le HTML statique contient déjà l'article phare et les 12 suivants : la page
   reste lisible sans JavaScript. */
export default function NewsHub({ items, categories, years }: Props) {
  const [cat, setCat] = useState("");
  const [year, setYear] = useState("");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE);
  const ready = useRef(false);
  const focusFrom = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Lecture initiale de l'URL (export statique : pas de searchParams serveur).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("categorie") ?? "";
    const y = p.get("annee") ?? "";
    if (categories.some((f) => f.value === c)) setCat(c);
    if (years.some((f) => f.value === y)) setYear(y);
    setQ(p.get("q") ?? "");
    ready.current = true;
  }, [categories, years]);

  // Écriture de l'état dans l'URL (sans navigation ni rechargement).
  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    if (cat) p.set("categorie", cat);
    if (year) p.set("annee", year);
    if (q.trim()) p.set("q", q.trim());
    const qs = p.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, [cat, year, q]);

  const filtered = Boolean(cat || year || q.trim());

  const results = useMemo(() => {
    const needle = normalize(q.trim());
    const words = needle.split(/\s+/).filter(Boolean);
    return items.filter((a) => {
      if (cat && !a.categories.includes(cat)) return false;
      if (year && a.date.slice(0, 4) !== year) return false;
      if (words.length) {
        const hay = normalize(`${a.title} ${a.excerpt}`);
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [items, cat, year, q]);

  // Réinitialise la pagination à chaque changement de critère.
  useEffect(() => setVisible(PAGE), [cat, year, q]);

  const lead = !filtered ? results[0] : undefined;
  const pool = lead ? results.slice(1) : results;
  const shown = pool.slice(0, visible);
  const remaining = pool.length - shown.length;

  // Les positions des déclencheurs changent quand la liste change.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [shown.length, cat, year, q]);

  // Après « Charger plus », le focus va à la première carte ajoutée.
  useEffect(() => {
    if (focusFrom.current === null) return;
    const li = listRef.current?.children[focusFrom.current] as HTMLElement | undefined;
    li?.querySelector<HTMLElement>("a")?.focus({ preventScroll: false });
    focusFrom.current = null;
  }, [visible]);

  const reset = () => {
    setCat("");
    setYear("");
    setQ("");
  };

  const asCard = (a: ArticleMeta): ArticleMeta => ({
    ...a,
    categories: displayCategories(a.categories).map(categoryLabel),
  });

  return (
    <div className="hub">
      <div className="hub__bar" role="search" aria-label="Filtrer les actualités">
        <div className="hub__search">
          <label htmlFor="hub-q" className="eyebrow hub__label">
            Rechercher
          </label>
          <div className="hub__field">
            <Search size={20} aria-hidden="true" className="hub__field-icon" />
            <input
              id="hub-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Un mot du titre ou du résumé…"
              autoComplete="off"
              spellCheck={false}
            />
            {q ? (
              <button type="button" className="hub__clear" onClick={() => setQ("")} aria-label="Effacer la recherche">
                <X size={18} />
              </button>
            ) : null}
          </div>
        </div>

        <FacetGroup id="hub-cat" legend="Rubrique" all="Toutes" facets={categories} value={cat} onChange={setCat} />
        <FacetGroup id="hub-year" legend="Année" all="Toutes" facets={years} value={year} onChange={setYear} />

        <div className="hub__status">
          <p className="hub__count" aria-live="polite" aria-atomic="true">
            <span className="display">{results.length}</span>
            <span>
              {results.length > 1 ? "articles" : "article"}
              {filtered ? (results.length > 1 ? " correspondants" : " correspondant") : " publiés"}
            </span>
          </p>
          {filtered ? (
            <button type="button" className="hub__reset" onClick={reset}>
              <RotateCcw size={16} aria-hidden="true" />
              Réinitialiser
            </button>
          ) : null}
        </div>
      </div>

      {lead ? <NewsLead article={lead} labels={displayCategories(lead.categories).map(categoryLabel)} /> : null}

      <h2 className="sr-only">{filtered ? "Résultats" : "Toutes les publications"}</h2>

      {results.length === 0 ? (
        <div className="hub__empty" role="status">
          <SearchX size={40} strokeWidth={1.5} aria-hidden="true" />
          <p className="hub__empty-title">Aucun article ne correspond à ces critères.</p>
          <p>Essayez un autre mot-clé, une autre rubrique ou une autre année.</p>
          <button type="button" className="hub__more" onClick={reset}>
            <RotateCcw size={18} aria-hidden="true" />
            Afficher toutes les actualités
          </button>
        </div>
      ) : (
        <ul ref={listRef} className="hub__grid">
          {shown.map((a, i) => {
            const r = RHYTHM[i % RHYTHM.length];
            return (
              <Reveal as="li" key={a.slug} className={`hub__cell hub__cell--${r}`} y={36}>
                <ArticleCard article={asCard(a)} size={SIZE[r]} priority={i < 2} />
              </Reveal>
            );
          })}
        </ul>
      )}

      {remaining > 0 ? (
        <div className="hub__pager">
          <p className="eyebrow">
            {shown.length + (lead ? 1 : 0)} / {results.length} affichés
          </p>
          <button
            type="button"
            className="hub__more"
            onClick={() => {
              focusFrom.current = shown.length;
              setVisible((v) => v + PAGE);
            }}
          >
            <Plus size={18} aria-hidden="true" />
            Charger plus
            <span className="hub__more-n">+{Math.min(PAGE, remaining)}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FacetGroup({
  id,
  legend,
  all,
  facets,
  value,
  onChange,
}: {
  id: string;
  legend: string;
  all: string;
  facets: HubFacet[];
  value: string;
  onChange: (v: string) => void;
}) {
  const total = facets.reduce((n, f) => n + f.count, 0);
  return (
    <div className="hub__group" role="group" aria-labelledby={`${id}-legend`}>
      <p id={`${id}-legend`} className="eyebrow hub__label">
        {legend}
      </p>
      <div className="hub__chips" data-lenis-prevent-horizontal>
        <button type="button" className="hub__chip" aria-pressed={value === ""} onClick={() => onChange("")}>
          {all}
          {legend === "Année" ? <span className="hub__chip-n">{total}</span> : null}
        </button>
        {facets.map((f) => (
          <button
            key={f.value}
            type="button"
            className="hub__chip"
            aria-pressed={value === f.value}
            onClick={() => onChange(value === f.value ? "" : f.value)}
          >
            {f.label}
            <span className="hub__chip-n">
              <span className="sr-only">, </span>
              {f.count}
              <span className="sr-only"> {f.count > 1 ? "articles" : "article"}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
