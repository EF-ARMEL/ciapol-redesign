# Inventaire du site officiel ciapol.ci

Extraction réalisée le 24/11/2026 à partir de https://ciapol.ci/ (en ligne), de la Wayback Machine (instantanés 2024-05 à 2024-07 et 2026-02-03) et de l'API REST publique du sous-site https://giamsuc.ciapol.ci/.

Fichiers produits :

- `web/content/site.json` : éléments communes à tout le site (menu, logo, pied de page, réseaux sociaux, coordonnées, partenaires, catégories, étiquettes, documents, contenus intégrés).
- `web/content/pages/<route-slug>.md` : 27 pages en Markdown. Chaque fichier a un en-tête (`title`, `route`, `sourceUrl`, `description`, `images`). Les blocs sont délimités par des commentaires `<!-- section: … -->`.
- `web/public/media/pages/<route-slug>/` : 223 images. `web/public/media/site/` : 14 images communes ajoutées. Le fichier `logo-ciapol.png`, déjà présent, n'a pas été modifié.
- `web/public/media/documents/` : 8 PDF.
- `docs/source/` : pages brutes (`raw/`), scripts de traitement (`tools/`), pages intermédiaires (`build/pages/`), liste des médias téléchargés (`raw/media_manifest.json`) et taxonomies (`raw/tax/taxonomies.json`).

> **Point essentiel.** Le site en ligne n'exécute plus Elementor Pro. Plusieurs éléments ont donc disparu de l'affichage : l'en-tête avec barre supérieure, le pied de page détaillé, le diaporama de l'accueil, le carrousel vidéo, le module Facebook, le formulaire de contact, la galerie, les cartes « Autres services », les cartes retournables (*flip-box*), la liste des articles et la recherche. Leur contenu a été récupéré dans les archives de la Wayback Machine. Dans les fichiers, il est signalé par un commentaire `<!-- ARCHIVE … -->`.

---

## 1. Arborescence du menu (en-tête, identique sur ordinateur et sur mobile)

| Menu | Sous-menu | URL d'origine | Route proposée |
|---|---|---|---|
| Accueil | | https://ciapol.ci/ | `/` |
| Présentation | | https://ciapol.ci/presentation/ | `/presentation` |
| Services (lien `#`) | CIPOMAR | https://ciapol.ci/cipomar/ | `/services/cipomar` |
| | LCE | https://ciapol.ci/lce/ | `/services/lce` |
| | UNIPOL | https://ciapol.ci/unipol/ | `/services/unipol` |
| | SDIIC | https://ciapol.ci/sdiic/ | `/services/sdiic` |
| | SDGSP-VAE | https://ciapol.ci/sdgsp-vae/ | `/services/sdgsp-vae` |
| Projets (lien `#`) | RNO | https://ciapol.ci/rno/ | `/projets/rno` |
| | GIAMSUC | https://giamsuc.ciapol.ci/ (sous-site, erreur 500) | `/projets/giamsuc` |
| | ONE HEALTH | `#` (aucune page) | `/projets/one-health` |
| | UCP LAC YAKRO | `#` (la page /ucp-lac-yakro/ existe mais n'est pas reliée) | `/projets/ucp-lac-yakro` |
| | CCAC | https://ciapol.ci/ciapol/ | `/projets/ccac` |
| Qualité de l'Air | | https://ciapol.ci/qualite-de-lair/ | `/qualite-de-lair` |
| Nous contactez (sic) | | https://ciapol.ci/contactez-nous/ | `/contact` |

Le menu ne contient pas d'entrée « Actualités », « Galerie », « Décret » ni « Mot du directeur ». Ces pages existent, mais on n'y accède que par des boutons ou par le pied de page archivé.

En 2024, le menu affichait « Acceuil » (sic) et l'entrée « GIAMAA », qui pointait vers https://giamaa-ci.net/. Les entrées CCAC et Qualité de l'Air n'existaient pas encore.

## 2. Éléments communs à toutes les pages

- **Logo** : `2022/07/logo.png` (768×407), lien vers l'accueil, attribut title « ← Centre Ivoirien Antipollution / CIAPOL ». Fichier local : `/media/site/logo-header.png`.
- **Icône du site (favicon)** : `Logo_extract-removebg-preview` en 150 et 300 px. Titre du site : « Centre Ivoirien Antipollution / CIAPOL – La lutte contre la pollution, notre priorité ».
- **Barre supérieure** : aucune en ligne. Dans l'archive de 2026-02, elle contenait :
  - l'adresse « Immeuble Grand Siège, Carrefour Kaiser, Cocody Riviera Bonoumin – Abidjan », avec un lien Google Maps ;
  - les icônes Facebook, YouTube et LinkedIn ;
  - le compteur « Total de visiteurs: 188457 / Visiteurs actuels: 11 ».
- **Pied de page en ligne** : uniquement « Neve | Propulsé par WordPress ».
- **Pied de page archivé** : colonnes Siège (Tél./Fax/Email), Partenaires (Voie des femmes), Bureau annexe, Daloa, San-Pédro, Man, Korhogo, Abengourou, SERVICES (5 liens) et Autres (Gallerie). En bas : « Copyright © 2022 Centre Ivoirien Antipollution » et les liens Accueil / Présentation / Galerie. Le détail est dans `site.json > footer.archive`.
- **Réseaux sociaux (archive)** :
  - https://fr-fr.facebook.com/ciapol.ci
  - https://www.youtube.com/@centreivoirienantipollutio4434
  - https://www.linkedin.com/in/centre-ivoirien-antipollution-b95953253/
- **Coordonnées (archive)** :
  - courriel : courrier@ciapol.ci ;
  - siège : Tél. et Fax (225) 27 22 52 43 34 ;
  - bureau annexe au Plateau : Tél. (225) 27 20 22 54 44, Fax (225) 27 20 32 22 16 ;
  - les numéros des 5 antennes sont dans `site.json` ;
  - aucun horaire d'ouverture n'est publié.
- **Recherche** : aucune dans l'en-tête. La barre latérale des articles contient un champ de recherche.
- **Bannière cookies et newsletter** : aucune.
- **Barre latérale des articles (blog)** : Rechercher, Articles récents, Commentaires récents, plus un formulaire de commentaire.
- **Polices** : Oswald et Montserrat (Google Fonts), ainsi que Brandon Grotesque. Pour cette dernière, le site utilise un fichier de version d'essai (« Trial »), ce qui pose une question de licence.

## 3. Pages et sections

Le nombre d'images correspond aux fichiers téléchargés dans `public/media/pages/<slug>/`.

| Fichier | Route | Source | Sections | Images |
|---|---|---|---|---|
| accueil.md | `/` | https://ciapol.ci/ | voir le détail ci-dessous | 53 |
| presentation.md | `/presentation` | /presentation/ | hero (fond 87960859285134.jpg), introduction (texte + 3 images), statut et organisation (5 sous-directions, 3 antennes), boutons « Cliquez pour voir les services / le décret de création » | 5 |
| services.md | `/services` | /services/ | hero, bandeau-titre, cartes-services (5 cartes, archive) | 4 |
| services-cipomar.md | `/services/cipomar` | /cipomar/ | hero (BANNIERE-CIPOMAR), bandeau, bon à savoir, missions, activités, lutte et perspectives (*flip-box*, archive), autres services (4 cartes, archive) | 7 |
| services-lce.md | `/services/lce` | /lce/ | hero, bandeau, bon à savoir, missions, analyses, tableau des analyses (3 colonnes), autres services | 8 |
| services-unipol.md | `/services/unipol` | /unipol/ | hero, bandeau, bon à savoir, missions (listes imbriquées sol / air / zones côtières), autres services | 6 |
| services-sdiic.md | `/services/sdiic` | /sdiic/ | hero, bandeau avec bouton « Devenir Une ICPE » (`#`), bon à savoir, installations classées, procédures déclaration / autorisation (*flip-box*, archive), autres services | 6 |
| services-sdgsp-vae.md | `/services/sdgsp-vae` | /sdgsp-vae/ | hero, bandeau, bon à savoir, 2 services (*flip-box*, archive), autres services | 6 |
| projets-rno.md | `/projets/rno` | /rno/ | hero, bandeau, bon à savoir, programmes en cours, résultats attendus | 4 |
| projets-ccac.md | `/projets/ccac` | /ciapol/ | hero, bandeau, présentation CCAC (+ 2 images du diaporama retrouvées dans la feuille de style), histoire, Côte d'Ivoire, articles récents (vide) | 5 |
| projets-ucp-lac-yakro.md | `/projets/ucp-lac-yakro` | /ucp-lac-yakro/ | hero, bandeau ; **page vide** | 1 |
| projets-one-health.md | `/projets/one-health` | /category/one-health/ | titre, liste des articles (1) ; **aucune page d'origine** | 0 |
| projets-giamsuc.md | `/projets/giamsuc` | giamsuc.ciapol.ci | hero, présentation, objectifs (vide), articles récents, partenaires (5 logos) | 8 |
| projets-giamsuc-a-propos.md | `/projets/giamsuc/a-propos` | /a-propos/ | présentation, mission, objectifs, partenaires | 7 |
| projets-giamsuc-organes.md | `/projets/giamsuc/organes` | /organes/ | composition de l'équipe + 6 membres (CV) | 1 |
| projets-giamsuc-activites.md | `/projets/giamsuc/activites` | /activites/ | **page vide** | 0 |
| projets-giamsuc-contact.md | `/projets/giamsuc/contact` | /contact/ | texte, carte, formulaire | 1 |
| projets-giamsuc-mediatheque.md | `/projets/giamsuc/mediatheque` | /mediatheque/ | galerie de 6 articles | 4 |
| projets-giamsuc-rapports-d-activite.md | `/projets/giamsuc/rapports-d-activite` | /rapport-dactivite/ | présentation, 1 rapport, 3 PDF | 1 |
| projets-giamsuc-actualites.md | `/projets/giamsuc/actualites` | (articles) | liste + texte intégral des 7 articles | 79 |
| qualite-de-lair.md | `/qualite-de-lair` | /qualite-de-lair/ | iframe vers https://monitoring.atmoivoir.com/website (page sans en-tête ni pied de page) | 0 |
| contact.md | `/contact` | /contactez-nous/ | carte (iframe Google My Maps), formulaire (archive) | 0 |
| galerie.md | `/galerie` | /gallerie/ | galerie filtrable (archive), 12 photos | 12 |
| decret-de-creation.md | `/decret-de-creation` | /decret-de-creation/ | titre, texte intégral du décret (articles 1 à 21), colonne latérale (« Pour en savoir plus », « Textes de lois » : 3 PDF) | 0 (+4 PDF) |
| actualites.md | `/actualites` | /nos-articles/ | titre, recherche (archive), liste des articles (archive, alimentée par `content/articles`), catégories, étiquettes | 0 |
| mot-du-directeur.md | `/mot-du-directeur` | 4 articles « Mot du directeur » | présentation de la rubrique + 3 messages illustrés | 4 |
| exercice-plan-pollumar.md | `/actualites/exercice-plan-pollumar` | /exercice-plan-pollumar/ | article de démonstration en Lorem ipsum | 1 |

La page https://ciapol.ci/page-d-exemple/ (« Page d'exemple » de WordPress, avec un lien vers `localhost/ciapol/wp-admin`) a été volontairement ignorée. La page « Sample Page » de GIAMSUC l'a été aussi.

### Détail de l'accueil (dans l'ordre d'affichage)

1. `hero-slider` (archive) : 4 diapositives avec bouton « En savoir + » sans lien :
   - Collecte et la capitalisation des données environnementales ;
   - Surveillance continue du milieu marin et lagunaire ;
   - Evaluation des pollutions et nuisances ;
   - Réseau national d'Observation de Côte d'ivoire (RNO-CI).
2. `bandeau-titre` : « CENTRE IVOIRIEN ANTIPOLLUTION » + bouton « Présentation » (lien `#` en ligne).
3. `colonne-gauche-mot-du-directeur` : titre seul.
4. `colonne-gauche-videos` : titre seul en ligne. L'archive contient 1 vidéo YouTube en 2026 et 4 en 2024.
5. `colonne-gauche-structures` : Ministère de l'Environnement et de la transition écologique, ANDE, OIPR.
6. `colonne-gauche-partenaires` :
   - sur ordinateur : CODINORM, CEPICI, 225INVEST ;
   - sur mobile, en plus : Voie des femmes.
7. `a-la-une-slider` : 26 diapositives (image, titre, chapeau éventuel, bouton « EN SAVOIR + » vers l'article).
8. `actualites` : les 3 derniers articles + bouton « Voir plus d'articles ».
9. `reseau-social` : titre seul. L'archive contenait le module de page Facebook.
10. `economies` : Economie circulaire / bleue / verte, avec liens vers Wikipédia.
11. `publication` : « CIAPOL'Publication », couverture, bouton de téléchargement du magazine en PDF, carrousel de 8 pages scannées.

## 4. Formulaires

### Contact CIAPOL (`/contact`) — archive uniquement

Formulaire Elementor Pro « New Form », méthode POST. Les libellés sont masqués visuellement (seuls les textes indicatifs s'affichent).

| Libellé | Nom du champ | Type | Obligatoire | Texte indicatif |
|---|---|---|---|---|
| Name | form_fields[name] | text | oui | Nom et prenom |
| Email | form_fields[email] | email | oui | Email |
| Téléphone | form_fields[field_e2802ee] | tel | oui | Téléphone (format `[0-9()#&+*-=.]+`) |
| Message | form_fields[message] | textarea (4 lignes) | non | Message |

Bouton d'envoi : « Envoyer ».

### Contact GIAMSUC (`/projets/giamsuc/contact`)

Module Fluent Forms « Support Form (#3) », avec Akismet et un champ anti-robot caché.

| Libellé | Nom du champ | Type | Obligatoire | Texte indicatif / options |
|---|---|---|---|---|
| Prénoms | names[first_name] | text | oui | |
| Nom | names[last_name] | text | non | |
| Email | email | email | oui | you@domain.com |
| Téléphone | input_text | text | non | 07 00 000 000 |
| Sujet de votre message | department | select | oui | voir la liste ci-dessous |
| Votre message | description | textarea | non | |

Options de « Sujet de votre message » :

- « - Sélectionner le sujet - »
- Informations sur le projet GIAMSUC
- Propositions de collaboration
- Partage de connaissances locales
- Couverture médiatique
- Signalement d'un problème environnemental
- Demande de documentation
- Autre

Bouton d'envoi : « Envoyer mon message ».

### Autres formulaires

- **Recherche des articles** (archive) : GET vers `/?s=`, texte indicatif « Recherche... ».
- **Recherche de la barre latérale** : champ `s`, bouton « Rechercher ».
- **Commentaires des articles** : Commentaire*, Nom*, E-mail*, Site web, case « Enregistrer mon nom… ».
- **Signalement de pollution** : **il n'existe aucun formulaire de ce type sur ciapol.ci.**

## 5. Documents et liens externes

| Document / lien | URL d'origine | Page | État |
|---|---|---|---|
| Magazine CIAPOL (PDF) | /ciapol/wp-content/uploads/2022/07/MAGAZINE-CIAPOL-2.pdf | Accueil | **lien cassé (404)** ; le fichier existe à l'adresse /wp-content/uploads/2022/07/MAGAZINE-CIAPOL-2.pdf (téléchargé) |
| Décret n°91-662 (PDF) | https://environnement.gouv.ci/wp-content/uploads/2022/01/DECRET-DE-CREATION-CIAPOL.pdf | Décret | **404** ; copie récupérée via la Wayback Machine (2025-01-27) |
| Annexe fiscale loi de finance N°2015 840 du 18 Décembre 2001 | ciapol.ci//wp-content/uploads/2022/08/Annexe-fiscale-…pdf | Décret | OK (téléchargé) |
| Loi de finance N84-1367 du 26 Dec 1984 | ciapol.ci//wp-content/uploads/2022/08/Loi-de-finance-…pdf | Décret | OK |
| Code de l'environnement | ciapol.ci//wp-content/uploads/2022/08/CODE-DE-ENVIRONNEMENT-KJP.pdf | Décret | OK |
| Rapport de l'atelier de lancement GIAMSUC, article de Fraternité Matin, fiche d'inscription | giamsuc.ciapol.ci/wp-content/uploads/… | GIAMSUC | OK (médiathèque, pas de lien visible dans les pages) |
| CV GIAMSUC (5 PDF + 1 DOC) et 1 fichier audio .ogg | giamsuc.ciapol.ci/wp-content/uploads/… | médiathèque GIAMSUC | non téléchargés : données personnelles, simplement répertoriées |
| Carte Google My Maps | https://www.google.com/maps/d/embed?mid=182OVWpEDdaw9QFhG9UrkCkBDPFo | Contact | OK |
| Plateforme qualité de l'air | https://monitoring.atmoivoir.com/website | Qualité de l'air | **injoignable** pendant l'extraction (échec TLS/connexion) |
| CCAC Côte d'Ivoire | https://www.ccacoalition.org/partners/cote-divoire?fbclid=… | CCAC | externe |
| Structures et partenaires | environnement.gouv.ci, ande-ci.com, oipr.ci, codinorm.ci, cepici.ci, 225invest.ci, voiedefemme.net | Accueil | externes |
| Wikipédia (économies circulaire, bleue, verte) | fr.wikipedia.org | Accueil | externes |
| YouTube (archive) | 3A1xL_6EK-E, KPCsTFIiBIM, EQsFgZgpuUY, Cv6TJxdEJek (2024) ; SVzNOjfLhEY (2026) | Accueil | |

## 6. Catégories et étiquettes

Les nombres d'articles ont été obtenus en parcourant les pages d'archives.

**Catégories (10)** :

- Non classé (102)
- Vedette (26)
  - ATELIER DE VALIDATION (3), sous-catégorie de Vedette
- DISTINCTION (1)
- PLAN POLLUMAR (1)
- REUNION DE PRISE DE CONTACT (1)
- ONE HEALTH (1)
- COHESION SOCIALE (1)
- VISITE MINISTERIELLE (2)
- VISITE DE CHANTIER (1)

**Étiquettes (9)** : cordon sableux (1), CCAC (2), FORMATION (1), EXCELLENCE (1), RESTITUTION AUDIT-DIAGNOSTIC (1), ATELIER (1), CAMPAGNE DE SENSIBILISATION ET D'INFORMATION (1), REUNION (2), SIGNATURE DE CONVENTION (1).

**GIAMSUC** : 1 catégorie (« Uncategorized », 7 articles), 2 types de contenus personnalisés (curriculum-vitae : 6 ; rapport-dactivite : 1).

## 7. Sous-site GIAMSUC

- **État** : toutes les URL renvoient une erreur 500 (« Fatal error: Call to undefined function neve_body_attrs() »).
- **Source utilisée** : contenu récupéré via `wp-json/wp/v2` (pages, articles, médias, CV, rapports).
- **Menu réel** : non récupérable (réponse 401). Le bloc de navigation liste les pages suivantes : A-propos, Accueil, Activités, Contact, Médiathèques, Organes, Rapports d'activités, Sample Page.
- **7 articles** (tous en un seul fichier `projets-giamsuc-actualites.md`, avec résumé et texte intégral) :
  - 2025-11-21 : Atelier de validation des rapports d'études AMP transfrontalière Côte d'Ivoire – Ghana ;
  - 2025-11-21 : Campagne de sensibilisation aux dangers du plastique ;
  - 2025-04-23 : Atelier de prévalidation du plan de gestion spatiale maritime de Grand Bassam ;
  - 2025-04-16 : PV d'analyse des offres (consultant) ;
  - 2025-04-16 : Projet GIAMSUC ;
  - 2025-04-16 : Projet « Gestion Intégrée de l'Aire Marine et côtière de la Région du Sud Comoé » ;
  - 2025-04-16 : Atelier de lancement.
- **Équipe (CV)** :
  - KOUADIO Marguerite Epouse BEKOIN ;
  - FOFANA Alimata Epouse DIOMANDE ;
  - SYLLA Soumaïla ;
  - BANZIO Peais Marie-Agathe ;
  - GNAE DADAN Charles Le Bon ;
  - BAKAYOKO Nogona Aïcha.

## 8. Anomalies relevées

- **Elementor Pro désactivé en ligne.** De nombreux blocs sont vides : galerie, formulaire de contact, cartes de services, carrousels, liste des articles, recherche, en-tête et pied de page. Les liens dynamiques sont devenus `#` (boutons « Présentation », « Cliquez pour voir… », « HISTORIQUE / MISSIONS »).
- **Sous-site GIAMSUC** hors service (erreur 500).
- **Pages vides** : `/gallerie/` (en ligne), `/ucp-lac-yakro/`, GIAMSUC `/activites/`, « Mot du directeur » / « Videos » / « Reseau social » sur l'accueil.
- **Lorem ipsum** :
  - l'article `/exercice-plan-pollumar/` ;
  - l'extrait du rapport GIAMSUC « Lancement des activités » ;
  - l'extrait de la médiathèque GIAMSUC (« Quid iudicant sensus? Lorem… ») ;
  - les « Page d'exemple » et « Sample Page » de WordPress.
- **Liens cassés** :
  - magazine PDF (chemin `/ciapol/wp-content/…`) ;
  - décret PDF sur environnement.gouv.ci ;
  - entrées de menu ONE HEALTH et UCP LAC YAKRO (`#`) ;
  - « Voir plus d'articles » de GIAMSUC (`#`) ;
  - lien `localhost` dans la page d'exemple ;
  - plateforme de qualité de l'air injoignable.
- **Copier-coller** :
  - la page UCP LAC YAKRO reprend le sous-titre « Réseau National d'Observation » et la bannière du RNO ;
  - la page CCAC a pour adresse `/ciapol/` ;
  - la page RNO a pour titre « rno » en minuscules.
- **Fautes visibles** :
  - « Autres sercives du CIAPOL » ;
  - « Nous contactez » ;
  - « Gallerie » ;
  - « réusisir » ;
  - « composé de x sous-directions » (page Présentation) ;
  - « SousGestion des Sites Pollués » (carte Services) ;
  - « CÔTE D'IVOITRE » (diapositive) ;
  - « Installation Classées » dans le sous-titre SDIIC.
- **Décret de création** : les listes des articles 10 et 11 sont interverties ; l'article 2 cite un ancien intitulé de ministère.
- **Incohérences** :
  - la page Présentation annonce 3 antennes (Daloa, San-Pedro, Yamoussoukro), alors que le pied de page archivé liste Daloa, San-Pédro, Man, Korhogo et Abengourou ;
  - le siège était « Riviera Attoban » en 2024, puis « Grand Siège, Carrefour Kaiser, Cocody Riviera Bonoumin » en 2026 ;
  - les numéros de Daloa et de Man ont été intervertis entre les deux archives ;
  - le ministère porte un nom différent sur ordinateur et sur mobile ;
  - « Voie des femmes » n'apparaît que sur mobile.
- **Logos CEPICI et 225INVEST** : blancs sur fond transparent, donc invisibles sur le fond blanc de l'accueil.
- **Doublons** :
  - les sections de l'accueil existent en double (versions ordinateur et mobile) ;
  - le slider « A la une » utilise 6 fois le logo `ciapol-logo.png` comme image de remplacement ;
  - quatre articles « Mot du directeur », dont trois ne contiennent qu'une image.
- **Police Brandon Grotesque** : fichier de version d'essai.

### Éléments non récupérés, et pourquoi

- **Diaporama de la page CCAC** (2 diapositives) : les textes manquent, car aucune archive Wayback n'existe pour cette page. Seules les images ont été retrouvées dans la feuille de style.
- **Liste « ARTICLES Recents » de la page CCAC** : widget Elementor Pro non rendu, sans archive.
- **GIAMSUC** : contenu des cartes « call-to-action » (mission, objectifs, axes d'intervention), grilles de CV et de rapports, menu réel du thème, contenu détaillé des 6 CV. L'API renvoie des widgets Pro vides, et l'accès au menu est refusé (401).
- **Texte de la section « Mot du directeur » de l'accueil** : il n'en a jamais existé, ni en ligne ni dans les archives.
- **Contenu de la plateforme monitoring.atmoivoir.com** : le serveur était injoignable.
- **Galerie** : seule la version 2024 est archivée ; un contenu plus récent peut exister.

---

## Écarts avec la maquette actuelle

La comparaison porte sur la maquette statique : `index.html`, `presentation.html`, `structures.html`, `services.html`, `rno.html`, `actualites.html`, `contact.html`.

### Pages présentes sur ciapol.ci mais absentes de la maquette

- **Pages d'information** : Qualité de l'Air (iframe de surveillance), CCAC, ONE HEALTH, UCP LAC YAKRO, Décret de création (texte intégral), Galerie, Mot du directeur.
- **Projet GIAMSUC** : le projet entier (accueil, à-propos, équipe, contact, médiathèque, rapports, 7 articles).
- **Actualités** : pages par article (130 articles), pages de catégories et d'étiquettes.
- **Services** : pas de page par sous-direction (la maquette regroupe tout dans `structures.html` avec des ancres) et pas de page « Services » sous forme de cartes.

### Menu et éléments communs

- **Menu** : la maquette affiche Accueil, Présentation, Structures, Services, RNO-CI, Actualités, Contact. Il lui manque le menu Projets (RNO, GIAMSUC, ONE HEALTH, UCP LAC YAKRO, CCAC) et Qualité de l'Air. « Structures » et « Actualités » ne figurent pas dans le menu officiel.
- **Barre supérieure** : il manque l'adresse du siège, les liens Facebook, YouTube et LinkedIn, ainsi que le compteur de visiteurs (archive).
- **Pied de page** :
  - il manque les coordonnées réelles : Tél./Fax (225) 27 22 52 43 34, courrier@ciapol.ci, bureau annexe du Plateau, antennes et numéros de Daloa, San-Pédro, Man, Korhogo et Abengourou ;
  - il manque le lien vers la Galerie ;
  - le copyright « Copyright © 2022 Centre Ivoirien Antipollution » est remplacé par « © 2026 CIAPOL — République de Côte d'Ivoire ».
- **Réseaux sociaux** : absents de la maquette.

### Accueil

- **Contenus absents de la maquette** :
  - slider « A la une » (26 articles) ;
  - blocs « Mot du directeur », « Videos » et « Reseau social » (Facebook) ;
  - section des trois économies (circulaire, bleue, verte) ;
  - section « CIAPOL'Publication » avec le magazine PDF et le carrousel de scans ;
  - partenaire « Voie des femmes » ;
  - diaporama d'accueil (4 thèmes, archive).
- **Contenus inventés par la maquette** :
  - chiffre « 500 km de côtes » présenté comme statistique principale ;
  - section « Trois mandats » ;
  - bloc « Signaler une pollution » avec un numéro vert et un courriel « à confirmer » ;
  - titres et chapeaux d'actualités reformulés (par exemple « JIF 2026 : au cœur du Banco, les femmes s'engagent pour l'environnement », au lieu du titre officiel « …les femmes du CIAPOL marchent pour la planète et leurs droits ») ;
  - articles fictifs (« Patrouilles conjointes avec la Marine nationale… » du 12 février 2026, « Intercalibration des laboratoires… » du 20 janvier 2026, « Installations classées : campagne d'inspection… » du 8 janvier 2026), absents de ciapol.ci.
- **Images** : les visuels de la maquette (`assets/img/hero.jpg`, `news1-3.jpg`, `water.jpg`, etc.) ne sont pas ceux du site. Les vraies images sont dans `web/public/media/pages/accueil/`.

### Contradictions avec le site officiel

1. **Siège** : la maquette indique « Abidjan — Riviera Angré » (accueil, contact, pied de page). Le site officiel indique « Immeuble Grand Siège, Carrefour Kaiser, Cocody Riviera Bonoumin – Abidjan » (archive 2026), avec un bureau annexe au Plateau (Immeuble Noguès). Ce n'est pas Riviera Angré.
2. **Téléphone et courriel** : la maquette les note « à confirmer ». Le site officiel publie (225) 27 22 52 43 34 et courrier@ciapol.ci.
3. **Horaires** : la maquette affiche « Lundi – vendredi, heures ouvrables ». Le site officiel ne publie aucun horaire.
4. **Formulaire de contact** :
   - la maquette propose Nom & prénom, Téléphone, Courriel, Objet (6 options), Lieu concerné, Message ;
   - le formulaire officiel propose Name*, Email*, Téléphone*, Message, avec le bouton « Envoyer » ;
   - la maquette ajoute un parcours de signalement de pollution qui n'existe pas sur le site.
5. **Tutelle** :
   - la barre de la maquette indique « Ministère de l'Environnement et de la Transition écologique » ;
   - la page Présentation de la maquette indique « Ministère de l'Environnement et du Développement Durable », ce qui reprend la page officielle ;
   - le site officiel emploie aussi « Ministère de l'Environnement, du Développement Durable et de la Transition Écologique » ;
   - il faut harmoniser ces intitulés.
6. **Antennes** : la maquette indique 3 antennes (Daloa, San-Pedro, Yamoussoukro), en reprenant la page Présentation. Le pied de page officiel archivé en liste 5 (Daloa, San-Pédro, Man, Korhogo, Abengourou), sans Yamoussoukro. Il faut le faire valider par le CIAPOL.
7. **Historique (presentation.html)** :
   - la frise de la maquette (1985, 1991, 1996, 1998) et la mention « Quarante ans de construction » sont des reformulations ;
   - le texte officiel situe la création du LCE en 1985 sous la tutelle de la commission nationale de l'environnement présidée par le ministère de la marine ;
   - il attribue le décret 85-949 (12/09/1985) au Plan POLLUMAR ;
   - la maquette rattache la CIPOMAR et le LCE à l'entrée « 1985 Décret n°85-949 », ce qui est une simplification à faire valider ;
   - aucune frise chronologique n'existe sur le site officiel.
8. **Liens de documents** : la maquette (`services.html`) reprend les deux liens cassés, le décret sur environnement.gouv.ci (404) et le magazine `/ciapol/wp-content/…` (404). Il faut utiliser `/media/documents/DECRET-DE-CREATION-CIAPOL.pdf` et `/media/documents/MAGAZINE-CIAPOL-2.pdf`.
9. **SDIIC** : la maquette décrit un parcours en 4 étapes (classer, constituer, instruire, arrêté) qui n'existe pas sur le site. Le contenu officiel liste les pièces des dossiers de déclaration et d'autorisation (archive).
10. **Services (services.html)** :
    - les étapes « Faire analyser un prélèvement » et « Demander une prestation / analyse » sont des contenus inventés ;
    - le tableau officiel des analyses du LCE (microbiologiques, chimiques inorganiques, chimiques organiques) est absent.
11. **RNO** : la maquette reformule correctement le contenu, mais il manque les « Résultats attendus » (4 points) et le texte officiel n'est pas repris mot pour mot.
12. **Actualités** : la maquette présente un « Journal de l'établissement » avec des catégories inventées (Événement, Infrastructures, Sensibilisation, Intervention, Laboratoire, Industrie). Les catégories réelles sont celles de la section 6.

### Informations officielles absentes de la maquette (à reprendre)

- **Présentation** : texte intégral sur les trois piliers (Économie, Social, Environnement), le PNAE de 1994 (662 textes) et la liste des 5 sous-directions avec leurs intitulés exacts.
- **Sous-directions** :
  - CIPOMAR : Missions, Activités, « Lutte », « Perspectives » ;
  - UNIPOL : missions détaillées sol / air / zones côtières ;
  - SDGSP-VAE : liste des 5 services et missions des 2 services ;
  - LCE : missions (10 points) et tableau des analyses.
- **Décret de création** : texte intégral et liens vers les textes de lois (Code de l'environnement, lois de finances).
- **CCAC** : partenariat depuis 2013, histoire de la coalition, chiffre de 34 000 décès prématurés en 2016, plan d'action national 2019, décharge d'Akouédo.
- **Liens institutionnels** : ANDE, OIPR, CODINORM, CEPICI, 225INVEST, Voie des femmes (la maquette affiche des logos sans liens).
