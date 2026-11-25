# CIAPOL v2 : guide de conception (à lire avant de toucher au code)

Refonte du site officiel https://ciapol.ci (Centre Ivoirien Antipollution, établissement public de Côte d'Ivoire).
Stack : **Next.js 16 (App Router, export statique `output: "export"`) + React 19 + TypeScript + Tailwind v4 + GSAP 3 (ScrollTrigger, SplitText) + Lenis + lucide-react**. Aucun backend : formulaires = état local + message de confirmation (+ lien `mailto:` de repli vers courrier@ciapol.ci).

## Concept : « la lagune qu'on dépollue en lisant »
Un shader WebGL fixe (`src/motion/Lagoon.tsx`) dessine une eau **polluée** (vase, nappe d'hydrocarbure irisée, déchets) qui devient une **lagune claire** (bleu CIAPOL, caustiques) au fil du scroll de chaque page. Il n'est visible qu'à travers les sections **`<WaterWindow>`** (fond transparent, texte blanc). Toutes les autres sections sont **opaques** (`className="surface section"`, `surface--white`, `surface--nuit`).
- Chaque page commence par un `<PageHero>` (= WaterWindow) : eau encore trouble en haut, elle se clarifie en descendant.
- Alterner surfaces opaques et 1 à 2 fenêtres d'eau par page maximum (respiration).
- Une section peut prendre la main sur la pureté via `lagoon.override` (voir `components/home/Parcours.tsx`), réservé aux moments forts.
- Le rendu doit refléter le sujet (pollution, dépollution, eau qui se clarifie, institution d'État), jamais une interface générique.

## Interdits (traits « IA / template »)
1. **Aucune flèche ni icône devant ou après un lien ou un bouton** : pas de → ↗ › », pas d'icônes lucide `Arrow*`/`Chevron*` dans les liens et boutons. Une icône n'est admise que si elle porte un sens propre (lecture d'une vidéo, fermeture d'une fenêtre).
2. **Aucun tiret cadratin ou demi-cadratin (— –) dans les textes que nous rédigeons** (titres, chapeaux, boutons, métadonnées, titres de page). Utiliser virgule, deux-points, point ou « · ». Le contenu officiel reste verbatim.
3. Pas de grilles de 3 cartes identiques ni de cartes blanches à ombre légère « template SaaS ».

## Règles non négociables
1. **Contenu officiel intégral** : tout texte vient de `web/content/` (pages/*.md, articles/*.md, site.json). Ne rien inventer, ne rien résumer à la place du texte officiel. Les commentaires HTML des .md sont des notes du scraping : à lire, jamais à afficher.
2. **Charte** : bleu CIAPOL `ciapol` #003f8c, `nuit` #04173a, `abysse`, `ciapol-500/300/100/50`, vert `salubre` #0f9d58 / `salubre-400`, orange drapeau `ci-orange` (uniquement alerte / signalement / focus). Les teintes `vase`, `limon`, `hydrocarbure` sont réservées aux visuels « pollution ». Jamais de couleur hors `@theme` (`src/app/globals.css`).
3. **Typo** : `.display` (Anton capitales) pour les titres, Inter pour le texte, `.eyebrow` / `.tag` (JetBrains Mono) pour les repères. Tailles fluides : `var(--text-mega|hero|h1|h2|h3|lead)`.
4. **Mise en page** : conteneur `.shell` ; sections `.section` (ou `.section--tight`). Asymétrie contrôlée. Rayons : `--radius-card` 28px, `--radius-panel` 40px, pilules.
5. **Mouvement** (`src/motion/primitives.tsx`) : `SplitReveal`, `Reveal` (enfants `data-reveal-item` échelonnés), `ImageReveal`, `Parallax`, `Counter` (uniquement pour un chiffre présent dans le texte officiel), `Magnetic`. Easing `expo.out` / `expo.inOut` / CSS `var(--ease-out-expo)`. Tout est coupé sous `prefers-reduced-motion`.
6. **Liens internes** : toujours `TransitionLink`. Boutons : `<Button href variant="primary|ghost|light|alert">` (libellé seul). Liens externes : `target="_blank" rel="noopener noreferrer"`.
7. **Responsive** : tester 375, 768, 1440 px. Aucun débordement horizontal. Effets lourds dégradés proprement sur mobile.
8. **Accessibilité** : un seul `<h1>` par page (fourni par `PageHero`), hiérarchie h2/h3, `alt` pertinents, focus visibles, cibles ≥ 44 px, contraste AA.
9. **Images** : servies depuis `/media/...`. `loading="lazy"` sauf au-dessus de la ligne de flottaison.
10. **Fichiers** : UTF-8. Composant > ~300 lignes : découper. CSS spécifique dans un `.css` à côté du composant. Ne pas modifier les fichiers partagés (`src/motion/*`, `src/components/ui/*`, `src/components/chrome/*`, `src/app/*.css`, `src/lib/content.ts`, `src/lib/site.ts`, `src/lib/nav.ts`) sans le signaler.

## Composants disponibles
- `PageHero({ eyebrow, title, lead, crumbs, code?, children?, aside? })` (`kicker` accepté comme alias de `eyebrow`).
- `SectionHeading({ tag, title, lead?, action?, tone: "dark"|"light", id? })` (`kicker` alias de `tag`).
- `ArticleCard({ article, size: "sm"|"md"|"lg" })`, `Prose({ html })` (classe `.prose-ciapol`).
- `Breadcrumb`, `Button`, `TransitionLink`, `WaterWindow`.
- Données : `src/lib/content.ts` (`getArticles`, `getArticleMetas`, `getArticle`, `getCategories`, `getPage` avec `sections`, `getSite`, `formatDate`), `src/lib/site.ts` (coordonnées officielles, antennes, réseaux, `telHref`), `src/lib/nav.ts`.

## Routes de la refonte
`/` · `/presentation/` · `/mot-du-directeur/` · `/decret-de-creation/` · `/galerie/` · `/videos/` · `/services/` + `/services/{cipomar,lce,unipol,sdiic,sdgsp-vae}/` · `/projets/` + `/projets/{rno,giamsuc,one-health,ucp-lac-yakro,ccac}/` (+ sous-pages GIAMSUC) · `/qualite-de-lair/` · `/actualites/` + `/actualites/[slug]/` · `/contact/` · `/signaler/` · `/plan-du-site/`.
Routes dynamiques : `generateStaticParams` obligatoire ; `params` est une Promise en Next 16 (`const { slug } = await params`).
