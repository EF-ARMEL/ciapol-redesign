# Site du CIAPOL (refonte)

Refonte du site officiel du Centre Ivoirien Antipollution. Le site est **100 % statique** : `next build` produit un dossier `out/` de fichiers HTML, CSS et JS, sans serveur ni base de données.

- En ligne : https://ciapol-redesign.vercel.app
- Stack : Next.js 16 (export statique), React 19, TypeScript, Tailwind v4, GSAP, Lenis
- Règles de design et de contenu : **[DESIGN.md](DESIGN.md), à lire avant de toucher au code**

## Démarrer

Prérequis : Node.js 22.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Export statique dans `out/` (puis `scripts/flatten-segments.mjs`, voir plus bas) |
| `npm run start` | Sert `out/` sur le port 3000 |
| `npm run typecheck` | Vérification des types (TypeScript 7) |
| `npm run lint` | ESLint (règles Next.js et React) |
| `npm run deadcode` | Knip : fichiers, exports et dépendances inutilisés |
| `npm test` | Tests de parcours Playwright sur `out/` (faire `npm run build` avant) |
| `npm run check` | Tout enchaîner : types, lint, code mort, build, tests. **À lancer avant chaque push.** |

Première fois pour les tests : `npx playwright install chromium webkit`.

## Mettre en ligne

Vercel est relié au dépôt GitHub : **chaque push sur `main` déclenche un déploiement de production**, chaque autre branche une préversion. Réglages du projet Vercel : dossier racine `web`, commande `npm run build`, dossier de sortie `out`.

## Où sont les choses

```
content/              Contenus officiels (repris de ciapol.ci)
  articles/*.md       Une actualité par fichier (en-tête YAML + texte)
  pages/*.md          Textes des pages institutionnelles
  site.json           Coordonnées, réseaux, antennes
public/media/         Images, vidéos, documents
src/app/              Une route par dossier (page.tsx + son .css)
src/components/       Blocs réutilisables (chrome = en-tête/pied, detail = fiches services/projets, ui = boutons, liens…)
src/lib/              Lecture des contenus (content.ts), navigation (nav.ts), coordonnées (site.ts)
src/motion/           Animations : lagune WebGL, rideau de transition, défilement Lenis, primitives GSAP
tests/                Tests Playwright et petit serveur statique de test
scripts/              flatten-segments.mjs (après build), optimize-media.mjs (compression des images)
```

## Publier ou corriger un contenu

- **Corriger un texte** : modifier le `.md` concerné dans `content/`, puis pousser.
- **Ajouter une actualité** : copier un fichier de `content/articles/`, changer l'en-tête (`title`, `slug` = nom du fichier, `date`, `excerpt`, `cover`, `categories`) et le texte. Déposer les images dans `public/media/articles/<slug>/`, puis lancer `node scripts/optimize-media.mjs public/media/articles/<slug>` pour les alléger.
- Il n'y a pas encore d'interface d'édition : publier demande un commit. Pour une équipe non technique, il faudra brancher un CMS sur `content/`.

## Points à connaître avant de modifier

**Animations.** Elles reposent sur trois outils qui interagissent :
- **Lagune WebGL** (`src/motion/Lagoon.tsx`) : elle mesure ses propres images par seconde. Si l'appareil est trop lent, elle passe en qualité réduite, puis s'arrête et laisse un fond statique (classe `lagoon-off`).
- **Lenis** (`src/motion/SmoothScroll.tsx`) : il prend en charge le défilement. Pour défiler par code, utiliser `getLenis()?.scrollTo(y)` avec une **valeur en pixels**. Si on lui passe un élément, Lenis retire aussi `scroll-margin-top` et `scroll-padding-top`, et la cible tombe trop bas.
- **En-tête qui se replie** : sa hauteur est publiée dans la variable CSS `--hdr-bottom`. Les barres collées (chapitres des fiches) s'en servent.
- **Mouvement réduit** : tout doit fonctionner sous `prefers-reduced-motion` (animations coupées, contenu visible).

**Navigation.** Les liens internes passent par `TransitionLink`, qui déclenche le rideau d'eau (`PageCurtain`). Un clic sur la page courante émet l'événement `ciapol:same-page` : l'en-tête referme alors son menu.

**Export statique.**
- `trailingSlash: true` : toutes les URL finissent par `/`.
- Pas de `searchParams` côté serveur : les filtres des actualités lisent l'URL dans le navigateur.
- Next écrit les fichiers de préchargement dans des sous-dossiers, alors que le navigateur les demande à plat. `scripts/flatten-segments.mjs` crée les copies attendues. Sans lui, chaque préchargement renvoie une erreur 404 en ligne. Il n'a rien à faire sous Linux, d'où « 0 fichier(s) » dans les journaux Vercel.

**Formulaires.** Il n'y a pas de serveur : le signalement et le contact préparent un courriel prérempli (`mailto:`) que l'utilisateur envoie lui-même.

**TypeScript.**
- `typescript` pointe vers `@typescript/typescript6`, la compatibilité 6.0 dont ESLint a besoin.
- Le compilateur 7 est installé sous `@typescript/native` : c'est lui que lancent `tsc` et `npm run typecheck`.
- Ne pas « corriger » ce double alias.

**Images.** `<img>` est utilisé volontairement : `next/image` n'optimise rien en export statique. Les médias sont compressés en amont.
