import json, os, sys

root = sys.argv[1]  # docs/source
web = sys.argv[2]
T = json.load(open(os.path.join(root, 'raw', 'tax', 'taxonomies.json'), encoding='utf-8'))
S = '/media/site/'


def item(label, href, src, children=None, note=None):
    d = {'label': label, 'href': href, 'sourceUrl': src}
    if children is not None:
        d['children'] = children
    if note:
        d['note'] = note
    return d


site = {
    '_meta': {
        'extractedAt': '2026-11-24',
        'source': 'https://ciapol.ci/ (live) + Wayback Machine snapshots 2024-05/06/07 and 2026-02-03 for Elementor Pro content no longer rendered live',
        'note': "Le site en ligne n'affiche plus les éléments Elementor Pro (en-tête avec barre supérieure, pied de page riche, formulaires, galeries, carrousels). Les champs 'archive' décrivent ces éléments d'après la Wayback Machine.",
    },
    'site': {
        'name': 'Centre Ivoirien Antipollution / CIAPOL',
        'tagline': 'La lutte contre la pollution, notre priorité',
        'htmlTitle': 'Centre Ivoirien Antipollution / CIAPOL – La lutte contre la pollution, notre priorité',
        'language': 'fr-FR',
        'favicon': {'32': S + 'favicon-32.png', '192': S + 'favicon-192.png', 'source': S + 'favicon-source.png',
                    'sourceUrl': 'https://ciapol.ci/wp-content/uploads/2022/07/Logo_extract-removebg-preview.png'},
        'fonts': ['Oswald (Google Fonts)', 'Montserrat (Google Fonts)', "Brandon Grotesque (fichier d'essai HvDTrial_Brandon_Grotesque_regular .otf/.woff hébergé sur ciapol.ci, licence d'essai)"],
    },
    'topbar': {
        'live': None,
        'liveNote': "Aucune barre supérieure sur le site en ligne actuel.",
        'archive': {
            'snapshot': '2026-02-03',
            'address': {'text': 'Immeuble Grand Siège, Carrefour Kaiser, Cocody Riviera Bonoumin – Abidjan', 'icon': 'map-marker',
                        'href': 'https://maps.app.goo.gl/kLt4uJBDzn37i6Ty7'},
            'social': [{'network': 'facebook', 'url': 'https://fr-fr.facebook.com/ciapol.ci'},
                       {'network': 'youtube', 'url': 'https://www.youtube.com/@centreivoirienantipollutio4434'},
                       {'network': 'linkedin', 'url': 'https://www.linkedin.com/in/centre-ivoirien-antipollution-b95953253/'}],
            'visitorCounter': {'labels': ['Total de visiteurs:', 'Visiteurs actuels:'], 'values2026_02': [188457, 11], 'plugin': 'wps-visitor-counter'},
            'previousAddress2024': 'Immeuble Noguès 2ème Etage Abidjan Plateau',
        },
    },
    'logo': {'src': S + 'logo-header.png', 'sourceUrl': 'https://ciapol.ci/wp-content/uploads/2022/07/logo.png', 'width': 768, 'height': 407,
             'alt': '', 'title': '← Centre Ivoirien Antipollution / CIAPOL', 'href': '/'},
    'nav': [
        item('Accueil', '/', 'https://ciapol.ci/'),
        item('Présentation', '/presentation', 'https://ciapol.ci/presentation/'),
        item('Services', '/services', '#', [
            item('CIPOMAR', '/services/cipomar', 'https://ciapol.ci/cipomar/'),
            item('LCE', '/services/lce', 'https://ciapol.ci/lce/'),
            item('UNIPOL', '/services/unipol', 'https://ciapol.ci/unipol/'),
            item('SDIIC', '/services/sdiic', 'https://ciapol.ci/sdiic/'),
            item('SDGSP-VAE', '/services/sdgsp-vae', 'https://ciapol.ci/sdgsp-vae/'),
        ], note="Parent sans lien (« # ») sur le site ; la page https://ciapol.ci/services/ existe mais n'est pas dans le menu."),
        item('Projets', '/projets', '#', [
            item('RNO', '/projets/rno', 'https://ciapol.ci/rno/'),
            item('GIAMSUC', '/projets/giamsuc', 'https://giamsuc.ciapol.ci/', note='Sous-site externe, actuellement en erreur 500. En 2024 cette entrée était « GIAMAA » -> https://giamaa-ci.net/'),
            item('ONE HEALTH', '/projets/one-health', '#', note="Lien « # » : aucune page. Route proposée alimentée par la catégorie https://ciapol.ci/category/one-health/"),
            item('UCP LAC YAKRO', '/projets/ucp-lac-yakro', '#', note="Lien « # » dans le menu alors que la page https://ciapol.ci/ucp-lac-yakro/ existe (vide)."),
            item('CCAC', '/projets/ccac', 'https://ciapol.ci/ciapol/'),
        ], note='Parent sans lien (« # »).'),
        item("Qualité de l’Air", '/qualite-de-lair', 'https://ciapol.ci/qualite-de-lair/'),
        item('Nous contactez', '/contact', 'https://ciapol.ci/contactez-nous/', note='Libellé tel quel sur le site (sic).'),
    ],
    'navHiddenPages': [
        item('Décret de création', '/decret-de-creation', 'https://ciapol.ci/decret-de-creation/', note='Accessible seulement via bouton de la page Présentation (lien « # » en ligne)'),
        item('Nos articles / Actualités', '/actualites', 'https://ciapol.ci/nos-articles/', note="Via « Voir plus d'articles » sur l'accueil"),
        item('Galerie', '/galerie', 'https://ciapol.ci/gallerie/', note="Via le pied de page (archive) ; page vide en ligne"),
        item('Mot du directeur', '/mot-du-directeur', 'https://ciapol.ci/mot-du-directeur/', note='Articles, pas une page'),
    ],
    'header': {'search': None, 'mobile': 'Menu hamburger (« Menu de navigation »), panneau coulissant à gauche reprenant le même menu.',
               'skipLink': 'Aller au contenu'},
    'footer': {
        'live': {'columns': [], 'credit': 'Neve | Propulsé par WordPress', 'creditLinks': [
            {'label': 'Neve', 'url': 'https://themeisle.com/themes/neve/'}, {'label': 'WordPress', 'url': 'https://wordpress.org'}]},
        'archive': {
            'snapshot': '2026-02-03 (structure identique en 2024)',
            'columns': [
                {'title': 'Siège', 'lines': ['Immeuble Grand Siège, Carrefour Kaiser, Cocody Riviera Bonoumin – Abidjan',
                                             '– Tel: (225) 27 22 52 43 34 – Fax: (225) 27 22 52 43 34 – Email: courrier@ciapol.ci'],
                 'mapUrl': 'https://maps.app.goo.gl/kLt4uJBDzn37i6Ty7'},
                {'title': 'Partenaires', 'links': [{'label': 'Voie des femmes', 'url': 'https://voiedefemme.net/category/environnement/'}]},
                {'title': 'BUREAU ANNEXE', 'lines': ['Plateau Avenue Noguès, Immeuble Noguès, 2 ème Etage – Tel: (225) 27 20 22 54 44 – Fax: (225) 27 20 32 22 16']},
                {'title': 'Daloa', 'lines': ['– Tel: (225) 27 32 700 583', '– Tel: (225) 07 07 89 04 15', '– Tel: (225) 07 48 60 59 82']},
                {'title': 'SAN-PÉDRO', 'lines': ['– Tel: (225) 01 01 27 44 00 – Tel: (225) 07 58 91 09 73']},
                {'title': 'MAN', 'lines': ['– Tel: (225) 01 03 682 757 – Tel: (225) 07 48 991 660']},
                {'title': 'Korhogo', 'lines': ['– Tel: (225) 07 58 91 09 73']},
                {'title': 'Abengourou', 'lines': ['– Tel: (225) 07 07 33 85 33']},
                {'title': 'SERVICES', 'links': [{'label': x, 'href': '/services/' + x.lower(), 'url': f'https://ciapol.ci/{x.lower()}/'} for x in ['CIPOMAR', 'LCE', 'SDIIC', 'UNIPOL', 'SDGSP-VAE']]},
                {'title': 'Autres', 'links': [{'label': 'Gallerie', 'href': '/galerie', 'url': 'https://ciapol.ci/gallerie/'}]},
            ],
            'bottom': {'copyright': 'Copyright © 2022 Centre Ivoirien Antipollution',
                       'links': [{'label': 'Accueil', 'href': '/'}, {'label': 'Présentation', 'href': '/presentation'}, {'label': 'Galerie', 'href': '/galerie'}]},
            'note2024': "En 2024 : Siège « Riviera Attoban non loin du 30 ème Arrondissement » ; numéros de Daloa et MAN intervertis (Daloa : 27 32 700 583, 01 03 682 757, 07 48 991 660 ; MAN : 07 07 89 04 15, 07 48 60 59 82).",
        },
    },
    'social': [
        {'network': 'facebook', 'url': 'https://fr-fr.facebook.com/ciapol.ci', 'alt': 'https://facebook.com/ciapol.ci (widget page Facebook accueil)'},
        {'network': 'youtube', 'url': 'https://www.youtube.com/@centreivoirienantipollutio4434'},
        {'network': 'linkedin', 'url': 'https://www.linkedin.com/in/centre-ivoirien-antipollution-b95953253/'},
    ],
    'socialNote': "Aucun lien social visible sur le site en ligne actuel ; liens issus des archives (barre supérieure).",
    'contact': {
        'addresses': [
            {'label': 'Siège', 'text': 'Immeuble Grand Siège, Carrefour Kaiser, Cocody Riviera Bonoumin – Abidjan', 'map': 'https://maps.app.goo.gl/kLt4uJBDzn37i6Ty7', 'source': 'archive 2026-02'},
            {'label': 'Siège (précision, PV GIAMSUC déc. 2024)', 'text': 'Cocody, Riviera-Bonoumin, Boulevard de la Paix, rue L128'},
            {'label': 'BUREAU ANNEXE', 'text': 'Plateau Avenue Noguès, Immeuble Noguès, 2 ème Etage', 'source': 'archive'},
            {'label': 'Antennes régionales (page Présentation)', 'text': 'Daloa, San-Pedro, Yamoussoukro'},
            {'label': 'Antennes (pied de page archivé)', 'text': 'Daloa, SAN-PÉDRO, MAN, Korhogo, Abengourou'},
        ],
        'phones': [
            {'label': 'Siège – Tel', 'number': '(225) 27 22 52 43 34'}, {'label': 'Siège – Fax', 'number': '(225) 27 22 52 43 34'},
            {'label': 'Bureau annexe – Tel', 'number': '(225) 27 20 22 54 44'}, {'label': 'Bureau annexe – Fax', 'number': '(225) 27 20 32 22 16'},
            {'label': 'Daloa', 'number': '(225) 27 32 700 583'}, {'label': 'Daloa', 'number': '(225) 07 07 89 04 15', 'tel': '+2250707890415'},
            {'label': 'Daloa', 'number': '(225) 07 48 60 59 82', 'tel': '+2250748605982'},
            {'label': 'San-Pédro', 'number': '(225) 01 01 27 44 00'}, {'label': 'San-Pédro', 'number': '(225) 07 58 91 09 73'},
            {'label': 'Man', 'number': '(225) 01 03 682 757'}, {'label': 'Man', 'number': '(225) 07 48 991 660'},
            {'label': 'Korhogo', 'number': '(225) 07 58 91 09 73'}, {'label': 'Abengourou', 'number': '(225) 07 07 33 85 33'},
        ],
        'emails': ['courrier@ciapol.ci'],
        'hours': None,
        'hoursNote': "Aucun horaire d'ouverture publié sur le site (ni en ligne, ni dans les archives).",
        'map': {'embed': 'https://www.google.com/maps/d/embed?mid=182OVWpEDdaw9QFhG9UrkCkBDPFo', 'page': '/contact',
                'link': 'https://maps.app.goo.gl/kLt4uJBDzn37i6Ty7'},
        'form': {'page': '/contact', 'status': 'archive only (absent en ligne)',
                 'fields': [
                     {'label': 'Name', 'name': 'form_fields[name]', 'type': 'text', 'required': True, 'placeholder': 'Nom et prenom'},
                     {'label': 'Email', 'name': 'form_fields[email]', 'type': 'email', 'required': True, 'placeholder': 'Email'},
                     {'label': 'Téléphone', 'name': 'form_fields[field_e2802ee]', 'type': 'tel', 'required': True, 'placeholder': 'Téléphone', 'pattern': '[0-9()#&+*-=.]+'},
                     {'label': 'Message', 'name': 'form_fields[message]', 'type': 'textarea', 'rows': 4, 'required': False, 'placeholder': 'Message'}],
                 'submit': 'Envoyer'},
    },
    'structures': [
        {'name': "Ministère de l'Environnement et de la transition écologique", 'logo': S + 'structure-ministere-environnement-transition-ecologique.jpeg',
         'url': 'https://environnement.gouv.ci/', 'sourceLogo': 'https://ciapol.ci/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-17-at-09.00.44.jpeg',
         'note': "Version mobile : « Ministère de l'Environnement et du Développement Durable » + ancien logo " + S + 'structure-minedd-ancien-logo.jpg'},
        {'name': "Agence Nationale De l'Environnement", 'logo': S + 'structure-ande.png', 'url': 'http://www.ande-ci.com/'},
        {'name': 'Office Ivoirien des Parcs et Réserves', 'logo': S + 'structure-oipr.jpg', 'url': 'https://www.oipr.ci/'},
    ],
    'partners': [
        {'name': 'CODINORM', 'logo': S + 'partenaire-codinorm.png', 'url': 'https://codinorm.ci/'},
        {'name': "CENTRE DE PROMOTION DES INVESTISSEMENTS EN COTE D'IVOIRE", 'logo': S + 'partenaire-cepici.png', 'url': 'https://cepici.ci/', 'note': 'Logo blanc sur fond transparent (invisible sur fond blanc)'},
        {'name': '225INVEST', 'logo': S + 'partenaire-225invest.png', 'url': 'https://www.225invest.ci/', 'note': 'Logo blanc sur fond transparent (invisible sur fond blanc)'},
        {'name': 'Voie des femmes', 'logo': S + 'partenaire-voie-des-femmes.png', 'url': 'https://voiedefemme.net/category/environnement/', 'note': 'Version mobile et pied de page archivé uniquement'},
    ],
    'giamsucPartners': [{'name': n, 'logo': f'/media/pages/projets-giamsuc/{f}'} for n, f in [
        ("Convention d'Abidjan", 'logo-convention-dabidjan.png'), ('CIAPOL', 'logo-ciapol.png'), ('CSE', 'logo-cse.png'), ('UE', 'logo-ue.png'), ('ACP', 'logo-acp.png')]],
    'categories': [{'name': t['name'], 'slug': t['slug'], 'count': t['count'], 'parent': t['parent'],
                    'href': '/actualites/categorie/' + t['slug'], 'sourceUrl': t['sourceUrl']} for t in T if t['kind'] == 'category'],
    'tags': [{'name': t['name'], 'slug': t['slug'], 'count': t['count'], 'href': '/actualites/tag/' + t['slug'], 'sourceUrl': t['sourceUrl']}
             for t in T if t['kind'] == 'tag'],
    'blogSidebar': {'appliesTo': 'articles (single posts)', 'widgets': ['Rechercher (recherche WordPress, champ « s », bouton « Rechercher »)',
                    'Articles récents (5 derniers)', 'Commentaires récents (« Aucun commentaire à afficher. »)'],
                    'comments': 'Formulaire « Laisser un commentaire » : Commentaire*, Nom*, E-mail*, Site web, case « Enregistrer mon nom, mon e-mail et mon site… »'},
    'cookieBanner': None, 'newsletter': None,
    'documents': [
        {'label': 'Magazine CIAPOL (CIAPOL\'Publication)', 'href': '/media/documents/MAGAZINE-CIAPOL-2.pdf', 'sourceUrl': 'https://ciapol.ci/wp-content/uploads/2022/07/MAGAZINE-CIAPOL-2.pdf', 'page': '/', 'note': 'lien du site cassé : /ciapol/wp-content/... (404)'},
        {'label': 'DÉCRET N° 91-662 DU 9 OCTOBRE 1991 … [PDF]', 'href': '/media/documents/DECRET-DE-CREATION-CIAPOL.pdf', 'sourceUrl': 'https://environnement.gouv.ci/wp-content/uploads/2022/01/DECRET-DE-CREATION-CIAPOL.pdf', 'page': '/decret-de-creation', 'note': '404 sur le site source ; récupéré via Wayback'},
        {'label': 'Annexe fiscale à la loi de finance N°2015 840 du 18 Décembre 2001', 'href': '/media/documents/Annexe-fiscale-a-la-loi-de-finance-n2015-840-du-18-Dec-2001.pdf', 'sourceUrl': 'https://ciapol.ci//wp-content/uploads/2022/08/Annexe-fiscale-a-la-loi-de-finance-n2015-840-du-18-Dec-2001.pdf', 'page': '/decret-de-creation'},
        {'label': 'Loi de finance N84-1367 du 26 Dec 1984 portant loi des f0001', 'href': '/media/documents/Loi-de-finance-N84-1367-du-26-Dec-1984-portant-loi-des-f0001.pdf', 'sourceUrl': 'https://ciapol.ci//wp-content/uploads/2022/08/Loi-de-finance-N84-1367-du-26-Dec-1984-portant-loi-des-f0001.pdf', 'page': '/decret-de-creation'},
        {'label': "Code de l'environnement", 'href': '/media/documents/CODE-DE-ENVIRONNEMENT-KJP.pdf', 'sourceUrl': 'https://ciapol.ci//wp-content/uploads/2022/08/CODE-DE-ENVIRONNEMENT-KJP.pdf', 'page': '/decret-de-creation'},
        {'label': "RAPPORT DE L'ATELIER DE LANCEMENT DU PROJET GIAMSUC", 'href': '/media/documents/RAPPORT-DE-LATELIER-DE-LANCEMENT-DU-PROJET-GIAMSUC-VS.pdf', 'sourceUrl': 'https://giamsuc.ciapol.ci/wp-content/uploads/2024/11/RAPPORT-DE-LATELIER-DE-LANCEMENT-DU-PROJET-GIAMSUC-VS.pdf', 'page': '/projets/giamsuc/rapports-d-activite', 'note': 'médiathèque GIAMSUC, lien non visible dans les pages'},
        {'label': 'Fraternité Matin – article lancement GIAMSUC', 'href': '/media/documents/Fraternite-matin-article-lancement-GIAMSUC.pdf', 'sourceUrl': 'https://giamsuc.ciapol.ci/wp-content/uploads/2025/04/Fraternite-matin-article-lancement-GIAMSUC.pdf', 'page': '/projets/giamsuc/rapports-d-activite'},
        {'label': "Fiche d'inscription", 'href': '/media/documents/FICHE-DINSCRIPTION.pdf', 'sourceUrl': 'https://giamsuc.ciapol.ci/wp-content/uploads/2024/11/FICHE-DINSCRIPTION.pdf', 'page': '/projets/giamsuc/rapports-d-activite'},
    ],
    'embeds': [
        {'type': 'iframe', 'url': 'https://www.google.com/maps/d/embed?mid=182OVWpEDdaw9QFhG9UrkCkBDPFo', 'page': '/contact'},
        {'type': 'iframe', 'url': 'https://monitoring.atmoivoir.com/website', 'title': "Surveillance de la Qualité de l'Air - CIAPOL", 'page': '/qualite-de-lair', 'note': 'serveur injoignable lors de l\'extraction (échec TLS/connexion)'},
        {'type': 'iframe', 'url': 'https://maps.google.com/maps?q=Si%C3%A8ge%20social%20centre%20ivoirien%20antipollution%20%28CIAPOL%29&t=m&z=18&output=embed&iwloc=near', 'page': '/projets/giamsuc/contact'},
        {'type': 'youtube', 'url': 'https://www.youtube.com/watch?v=SVzNOjfLhEY', 'page': '/', 'note': 'archive 2026-02'},
        {'type': 'youtube', 'urls': ['https://www.youtube.com/watch?v=3A1xL_6EK-E', 'https://www.youtube.com/watch?v=KPCsTFIiBIM', 'https://www.youtube.com/watch?v=EQsFgZgpuUY', 'https://www.youtube.com/watch?v=Cv6TJxdEJek'], 'page': '/', 'note': 'archive 2024'},
        {'type': 'facebook-page', 'url': 'https://facebook.com/ciapol.ci', 'page': '/', 'note': 'archive'},
    ],
}
out = os.path.join(web, 'content', 'site.json')
json.dump(site, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok', len(site['categories']), len(site['tags']))
