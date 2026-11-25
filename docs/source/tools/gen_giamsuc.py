import json, sys, os, re, html

root = sys.argv[1]
G = os.path.join(root, 'raw', 'giamsuc')
OUT = os.path.join(root, 'build', 'pages')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tomd import convert

pages = {p['slug']: p for p in json.load(open(os.path.join(G, 'pages.json'), encoding='utf-8'))}
posts = json.load(open(os.path.join(G, 'posts.json'), encoding='utf-8'))
media = {m['id']: m for m in json.load(open(os.path.join(G, 'media.json'), encoding='utf-8')) + json.load(open(os.path.join(G, 'media2.json'), encoding='utf-8'))}
cvs = json.load(open(os.path.join(G, 'cv.json'), encoding='utf-8'))
rapports = json.load(open(os.path.join(G, 'rapport.json'), encoding='utf-8'))
GU = 'https://giamsuc.ciapol.ci/wp-content/uploads/'
LOGOS = [('Logo CONVENTION D\'ABIDJAN', GU + '2024/11/Logo-CONVENTION-DABIDJAN.png'), ('Logo CIAPOL', GU + '2024/11/Logo-CIAPOL.png'),
         ('Logo CSE', GU + '2024/11/Logo-CSE.png'), ('Logo UE', GU + '2024/11/Logo-UE.png'), ('Logo ACP', GU + '2024/11/Logo-ACP.png')]
STATUS = ("<!-- ÉTAT DU SOUS-SITE : https://giamsuc.ciapol.ci/ renvoie actuellement une ERREUR 500 sur toutes les pages "
          "(« Fatal error: Call to undefined function neve_body_attrs() » dans le thème Neve). Contenu reconstitué via l'API REST publique "
          "(wp-json/wp/v2) du sous-site. Les widgets Elementor Pro (cartes « call-to-action », grilles « loop-grid ») sont vides dans l'API : "
          "leur contenu n'a pas pu être récupéré. Wayback Machine : seule une page « En construction » (14/11/2024) est archivée. -->\n")


def t(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


def fm(slug, title, route, src, desc):
    return f'---\ntitle: "{title}"\nroute: "{route}"\nsourceUrl: "{src}"\ndescription: "{desc}"\n---\n\n'


def body(slug):
    md = convert('<main>' + pages[slug]['content']['rendered'] + '</main>')
    md = re.sub(r'!\[([^\]]*)\]\(https://giamsuc\.ciapol\.ci/wp-content/uploads/elementor/thumbs/(Logo-[A-Z-]+?)-q[a-z0-9]+\.png\)',
                lambda m: f'![{m.group(1)}]({GU}2024/11/{m.group(2)}.png)', md)
    return md


def featured(p):
    m = media.get(p.get('featured_media') or 0)
    return m['source_url'] if m else None


def write(name, text):
    open(os.path.join(OUT, name + '.md'), 'w', encoding='utf-8', newline='\n').write(text)


nav = ('<!-- Navigation du sous-site (bloc « Navigation » wp_navigation, liste de pages par ordre alphabétique) : A-propos, Accueil, Activités, Contact, '
       'Médiathèques, Organes, Rapports d’activités, Sample Page. Le menu principal réel du thème n\'est pas récupérable (API menus : 401). -->\n')

# ---- home
h = fm('projets-giamsuc', 'GIAMSUC', '/projets/giamsuc', 'https://giamsuc.ciapol.ci/',
       'GIAMSUC - Gestion Intégrée de l’Aire Marine et Côtière du Sud - Comoé')
h += STATUS + '\n' + nav + '\n'
h += '<!-- Identité du sous-site : nom « GIAMSUC », slogan « Gestion Intégrée de l’Aire Marine et Côtière du Sud - Comoé », logo ci-dessous. -->\n\n'
h += f'![Logo GIAMSUC]({GU}2024/11/Logo_GIAMSUC.png)\n\n'
b = body('acceuil')
b = b.replace('# pour une meilleure gestion du littoral', '<!-- section: hero -->\n\n# pour une meilleure gestion du littoral', 1)
b = b.replace('GIAMSUC\n\nPROJET\n\n## GESTION INTEGREE', '<!-- section: presentation -->\n\nGIAMSUC\n\nPROJET\n\n## GESTION INTEGREE', 1)
b = b.replace("GIAMSUC\n\nPROJET\n\n## NOS OBJECTIFS", "<!-- section: objectifs -->\n\nGIAMSUC\n\nPROJET\n\n## NOS OBJECTIFS", 1)
b = b.replace("## NOS OBJECTIFS ET AXES D'INTERVENTIONS\n", "## NOS OBJECTIFS ET AXES D'INTERVENTIONS\n\n<!-- Contenu non récupérable (cartes Elementor Pro vides dans l'API). -->\n", 1)
b = b.replace('GIAMSUC\n\n## NOS ARTICLES', '<!-- section: articles-recents -->\n\nGIAMSUC\n\n## NOS ARTICLES', 1)
lst = '\n'.join(f'- [{t(p["title"]["rendered"])}]({p["link"]}) — {p["date"][:10]}' for p in posts[:3])
b = b.replace("[Voir plus d'articles](#)", "<!-- Grille dynamique (loop-grid Pro, vide dans l'API) ; derniers articles à date : -->\n\n" + lst + "\n\n[Voir plus d'articles](#)", 1)
b = b.replace('GIAMSUC\n\n## NOS PARTENAIRES', '<!-- section: partenaires -->\n\nGIAMSUC\n\n## NOS PARTENAIRES', 1)
write('projets-giamsuc', h + b)

# ---- a-propos
b = body('a-propos')
b = b.replace('abrite:\n', 'abrite:\n\n<!-- Liste non récupérable : 6 cartes Elementor Pro « call-to-action » vides dans l\'API. -->\n', 1)
b = b.replace('quatre objectifs majeurs:\n', 'quatre objectifs majeurs:\n\n<!-- Liste non récupérable : cartes Elementor Pro vides dans l\'API. -->\n', 1)
write('projets-giamsuc-a-propos', fm('', 'A-propos', '/projets/giamsuc/a-propos', 'https://giamsuc.ciapol.ci/a-propos/', 'A-propos du projet GIAMSUC') + STATUS + '\n' + b)

# ---- organes
b = body('organes')
b += '\n<!-- Grille dynamique (loop-grid) des CV non rendue dans l\'API ; membres publiés (type de contenu « curriculum-vitae », contenu non exposé) : -->\n\n'
for c in sorted(cvs, key=lambda x: x['id']):
    b += f'- [{t(c["title"]["rendered"])}]({c["link"]})\n'
b += ('\n<!-- Documents CV présents dans la médiathèque du sous-site : CV-actualise-de-Gnae.pdf, CV-BANZIOGIAMSUC.pdf, CV-Francais-SYLLA.doc, '
      'Alimata-FOFANA-epouse-DIOMANDE-CV.pdf (2 versions), meledjearmel_cv.pdf. -->\n')
write('projets-giamsuc-organes', fm('', 'Organes', '/projets/giamsuc/organes', 'https://giamsuc.ciapol.ci/organes/', 'Notre équipe – projet GIAMSUC') + STATUS + '\n' + b)

# ---- activites
write('projets-giamsuc-activites', fm('', 'Activités', '/projets/giamsuc/activites', 'https://giamsuc.ciapol.ci/activites/', 'Activités du projet GIAMSUC') + STATUS +
      '\n# Activités\n\n<!-- PAGE VIDE : aucun contenu dans WordPress (contenu vide dans l\'API). Les activités sont publiées comme articles : voir /projets/giamsuc/actualites -->\n')

# ---- contact
b = body('contact')
b = b[:b.find('Support Form (#3)')]
b += ('<!-- Formulaire Fluent Forms « Support Form (#3) » (protection anti-spam Akismet, champ honeypot caché). -->\n\n'
      '| Libellé | name | Type | Obligatoire | Placeholder / options |\n|---|---|---|---|---|\n'
      '| Prénoms | names[first_name] | text | oui | |\n'
      '| Nom | names[last_name] | text | non | |\n'
      '| Email | email | email | oui | you@domain.com |\n'
      '| Téléphone | input_text | text | non | 07 00 000 000 |\n'
      '| Sujet de votre message | department | select | oui | « - Sélectionner le sujet - » ; Informations sur le projet GIAMSUC ; Propositions de collaboration ; '
      'Partage de connaissances locales ; Couverture médiatique ; Signalement d\'un problème environnemental ; Demande de documentation ; Autre |\n'
      '| Votre message | description | textarea (4 lignes) | non | |\n\nBouton d\'envoi : **Envoyer mon message**\n')
write('projets-giamsuc-contact', fm('', 'Contact', '/projets/giamsuc/contact', 'https://giamsuc.ciapol.ci/contact/', 'Contactez le projet GIAMSUC') + STATUS + '\n' + b)

# ---- mediatheque
b = body('mediatheque')
b = re.sub(r'\n- \[1\]\(https://giamsuc[^\n]*\n- \[2\]\([^\n]*\n?', '\n', b)
b += ('\n<!-- Galerie d\'articles (widget « bdt-post-gallery ») avec pagination 1, 2. ANOMALIE : l\'extrait de la page contient du faux texte '
      '(« Quid iudicant sensus? Lorem … ») issu d\'un modèle. Les vignettes « placeholder » signifient que l\'article n\'a pas d\'image à la une. -->\n')
write('projets-giamsuc-mediatheque', fm('', 'Médiathèques', '/projets/giamsuc/mediatheque', 'https://giamsuc.ciapol.ci/mediatheque/', 'Notre médiathèque – projet GIAMSUC') + STATUS + '\n' + b)

# ---- rapports
b = body('rapport-dactivite')
b += '\n<!-- Grille dynamique (loop-grid) non rendue ; rapport publié (type « rapport-dactivite ») : -->\n\n'
for r in rapports:
    b += f'### [{t(r["title"]["rendered"])}]({r["link"]})\n\n{r["date"][:10]} — extrait : {t(r["excerpt"]["rendered"])}\n\n'
b += ('<!-- ANOMALIE : extrait « Lorem Ipsum » (texte de remplissage). Document lié présent dans la médiathèque : -->\n\n'
      f'- [RAPPORT DE L\'ATELIER DE LANCEMENT DU PROJET GIAMSUC (PDF)]({GU}2024/11/RAPPORT-DE-LATELIER-DE-LANCEMENT-DU-PROJET-GIAMSUC-VS.pdf)\n'
      f'- [Fraternité Matin – article lancement GIAMSUC (PDF)]({GU}2025/04/Fraternite-matin-article-lancement-GIAMSUC.pdf)\n'
      f'- [Fiche d\'inscription (PDF)]({GU}2024/11/FICHE-DINSCRIPTION.pdf)\n')
write('projets-giamsuc-rapports-d-activite', fm('', 'Rapports d’activités', '/projets/giamsuc/rapports-d-activite', 'https://giamsuc.ciapol.ci/rapport-dactivite/', 'Documentations et rapports d’activités – projet GIAMSUC') + STATUS + '\n' + b)

# ---- actualites (posts list + full bodies)
b = '# Actualités du projet GIAMSUC\n\n<!-- section: liste -->\n\n<!-- 7 articles publiés (catégorie « Uncategorized »), du plus récent au plus ancien. Corps complet repris de l\'API REST. -->\n\n'
for p in posts:
    b += f'- [{t(p["title"]["rendered"])}]({p["link"]}) — {p["date"][:10]}\n'
for p in posts:
    title = t(p['title']['rendered'])
    b += f'\n<!-- section: article {p["slug"]} -->\n\n## {title}\n\n<!-- Source : {p["link"]} — publié le {p["date"]} (modifié le {p["modified"]}) -->\n\n'
    f = featured(p)
    if f:
        b += f'![{title}]({f})\n\n'
    b += '**Extrait :** ' + t(p['excerpt']['rendered']) + '\n\n'
    body_md = convert('<main>' + p['content']['rendered'] + '</main>')
    body_md = re.sub(r'^(#{1,5}) ', lambda m: '#' * min(len(m.group(1)) + 2, 6) + ' ', body_md, flags=re.M)
    b += body_md + '\n'
write('projets-giamsuc-actualites', fm('', 'Actualités GIAMSUC', '/projets/giamsuc/actualites', 'https://giamsuc.ciapol.ci/', 'Articles publiés sur le sous-site GIAMSUC') + STATUS + '\n' + b)
print('ok')
