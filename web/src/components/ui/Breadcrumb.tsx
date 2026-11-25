import TransitionLink from "./TransitionLink";

export type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="crumbs">
      <ol>
        {all.map((c, i) => (
          <li key={`${c.label}-${i}`}>
            {c.href && i < all.length - 1 ? (
              <TransitionLink href={c.href}>{c.label}</TransitionLink>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: c.href })),
          }),
        }}
      />
    </nav>
  );
}
