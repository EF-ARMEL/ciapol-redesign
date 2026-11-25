import json, sys, os

root = sys.argv[1]
slides = json.load(open(os.path.join(root, 'raw', 'home_slides.json'), encoding='utf-8'))
L = []
a = L.append
a('---\ntitle: "Accueil"\nroute: "/"\nsourceUrl: "https://ciapol.ci/"\n'
  'description: "Centre Ivoirien Antipollution / CIAPOL – La lutte contre la pollution, notre priorité"\n---\n')
a('<!-- Titre du site (balise title) : « Centre Ivoirien Antipollution / CIAPOL – La lutte contre la pollution, notre priorité » -->\n')

a('<!-- section: hero-slider -->\n')
a('<!-- ARCHIVE (Wayback 2024-06-22 et 2026-02-03) : diaporama Elementor Pro « slides » (fondu, autoplay 5 s, flèches) en tête de page. '
  'ABSENT du site en ligne actuel (Elementor Pro désactivé). Les 4 diapositives ont un bouton « En savoir + » sans lien. -->\n')
for t, img in [("Collecte et la capitalisation des données environnementales", "https://ciapol.ci/wp-content/uploads/2022/07/collecte-et-capitalisation.jpg"),
               ("Surveillance continue du milieu marin et lagunaire", "https://ciapol.ci/wp-content/uploads/2022/07/SURVEILLANCE-CONTINUE.jpg"),
               ("Evaluation des pollutions et nuisances", "https://ciapol.ci/wp-content/uploads/2022/07/EVALUATION-1.jpg"),
               ("Réseau national d'Observation de Côte d'ivoire (RNO-CI)", "https://ciapol.ci/wp-content/uploads/2022/07/RNO.jpg")]:
    a(f'### {t}\n\n![{t}]({img})\n\nEn savoir +\n')

a('<!-- section: bandeau-titre -->\n')
a('# CENTRE IVOIRIEN ANTIPOLLUTION\n')
a('[Présentation](https://ciapol.ci/presentation/)\n')
a("<!-- En ligne le bouton « Présentation » pointe vers « # » ; dans l'archive il pointait vers la page Présentation. -->\n")

a('<!-- section: colonne-gauche-mot-du-directeur -->\n')
a('## Mot du directeur\n')
a('<!-- Titre seul : aucun contenu ni lien sous ce bloc (ni en ligne, ni dans les archives). Les textes « Mot du directeur » existent comme articles : voir la page /mot-du-directeur -->\n')

a('<!-- section: colonne-gauche-videos -->\n')
a('## Videos\n')
a("<!-- En ligne : titre seul, le carrousel vidéo (Elementor Pro media-carousel) n'est plus affiché. ARCHIVE 2026-02-03 : 1 vidéo YouTube. -->\n")
a('- [Vidéo YouTube](https://www.youtube.com/watch?v=SVzNOjfLhEY) — vignette :\n\n  ![Vignette vidéo](https://ciapol.ci/wp-content/uploads/2024/03/IMG_3458-scaled.jpg)\n')
a('<!-- ARCHIVE 2024-06-22 : 4 vidéos YouTube -->\n')
for vid, title, img in [("3A1xL_6EK-E", "ciapol organise un dejeuner debat avec les operateurs economiques", "ciapol-organise-un-dejeuner-debat-avec-les-operateurs-economiques.jpg"),
                        ("KPCsTFIiBIM", "dejeuner debat avec les operateurs economiques", "dejeuner-debat-avec-les-operateurs-economiques.jpg"),
                        ("EQsFgZgpuUY", "pollution hydrocarbures en mer le ciapol", "pollution-hydrocarbures-en-mer-le-ciapol.jpg"),
                        ("Cv6TJxdEJek", "CIAPOL nettoie la lagune Ebrié", "CIAPOL-nettoie-la-lagune-Ebrie.jpg")]:
    a(f'- [{title}](https://www.youtube.com/watch?v={vid}) — vignette :\n\n  ![{title}](https://ciapol.ci/wp-content/uploads/2022/07/{img})\n')

a('<!-- section: colonne-gauche-structures -->\n')
a('## Structures\n')
for img, href, name in [("https://ciapol.ci/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-17-at-09.00.44.jpeg", "https://environnement.gouv.ci/", "Ministère de l'Environnement et de la transition écologique"),
                        ("https://ciapol.ci/wp-content/uploads/2022/08/ANDE.png", "http://www.ande-ci.com/", "Agence Nationale De l'Environnement"),
                        ("https://ciapol.ci/wp-content/uploads/2022/08/OIPR.jpg", "https://www.oipr.ci/", "Office Ivoirien des Parcs et Réserves")]:
    a(f'### [{name}]({href})\n\n[![{name}]({img})]({href})\n')
a("<!-- Version mobile du site : le 1er bloc s'intitule « Ministère de l'Environnement et du Développement Durable » avec l'ancien logo ci-dessous -->\n")
a("![Logo MINEDD (ancien)](https://ciapol.ci/wp-content/uploads/2022/08/LOGO-MINEDD-88x100-1.jpg)\n")

a('<!-- section: colonne-gauche-partenaires -->\n')
a('## Partenaires\n')
a('<!-- Version mobile uniquement (et archives) : « Voie des femmes » en tête de liste ; absent de la version bureau actuelle -->\n')
a('### [Voie des femmes](https://voiedefemme.net/category/environnement/)\n\n[![Voie des femmes](https://ciapol.ci/wp-content/uploads/2023/12/voie-de-femme.png)](https://voiedefemme.net/category/environnement/)\n')
for img, href, name in [("https://ciapol.ci/wp-content/uploads/2023/12/codinorm.png", "https://codinorm.ci/", "CODINORM"),
                        ("https://ciapol.ci/wp-content/uploads/2024/11/logo_cepici.png", "https://cepici.ci/", "CENTRE DE PROMOTION DES INVESTISSEMENTS EN COTE D'IVOIRE"),
                        ("https://ciapol.ci/wp-content/uploads/2024/11/logo225.png", "https://www.225invest.ci/", "225INVEST")]:
    a(f'### [{name}]({href})\n\n[![{name}]({img})]({href})\n')

a('<!-- section: a-la-une-slider -->\n')
a('## A la une\n')
a(f"<!-- Carrousel « slick » (flèches Previous/Next + {len(slides)} points), {len(slides)} diapositives : image de fond, titre, chapeau éventuel, bouton « EN SAVOIR + » vers l'article. -->\n")
for i, s in enumerate(slides, 1):
    a(f'### Diapositive {i:02d} — {s["title"]}\n')
    a(f'![{s["title"]}]({s["image"]})\n')
    for t in s['text']:
        a(t + '\n')
    a(f'[{s["cta"]}]({s["href"]})\n')

a('<!-- section: actualites -->\n')
a('## Actualités\n')
a("<!-- Bloc dynamique : les 3 derniers articles (image, titre tronqué, date « AAAA-MM-JJ hh:mm:ss », bouton « Voir l'article >> »). État au moment de l'extraction : -->\n")
for img, title, date, href in [
    ("https://ciapol.ci/wp-content/uploads/2026/03/654168671_1339818374847997_1254613907516060104_n.jpg", "𝐉𝐈𝐅 𝟐𝟎𝟐𝟔 : 𝐀𝐮 𝐜œ𝐮𝐫 𝐝𝐮 𝐁𝐚𝐧𝐜𝐨, 𝐥𝐞𝐬 𝐟𝐞𝐦𝐦𝐞𝐬 𝐝𝐮 𝐂𝐈𝐀𝐏𝐎𝐋 𝐦𝐚𝐫𝐜𝐡𝐞𝐧𝐭 𝐩𝐨𝐮𝐫 𝐥𝐚 𝐩𝐥𝐚𝐧è𝐭𝐞 𝐞𝐭 𝐥𝐞𝐮𝐫𝐬 𝐝𝐫𝐨𝐢𝐭𝐬", "2026-03-30 13:40:52", "https://ciapol.ci/%f0%9d%90%89%f0%9d%90%88%f0%9d%90%85-%f0%9d%9f%90%f0%9d%9f%8e%f0%9d%9f%90%f0%9d%9f%94-%f0%9d%90%80%f0%9d%90%ae-%f0%9d%90%9coe%f0%9d%90%ae%f0%9d%90%ab-%f0%9d%90%9d%f0%9d%90%ae-%f0%9d%90%81/"),
    ("https://ciapol.ci/wp-content/uploads/2026/03/656968926_1348834723946362_5410781888831974048_n.jpg", "𝐃𝐞 𝐧𝐨𝐦𝐛𝐫𝐞𝐮𝐬𝐞𝐬 𝐢𝐧𝐟𝐫𝐚𝐬𝐭𝐫𝐮𝐜𝐭𝐮𝐫𝐞𝐬 𝐯𝐢𝐬𝐢𝐭é𝐞𝐬 𝐞𝐭 𝐩𝐫ê𝐭𝐞𝐬 à 𝐚𝐜𝐜𝐮𝐞𝐢𝐥𝐥𝐢𝐫 𝐥’𝐞𝐱𝐞𝐫𝐜𝐢𝐜𝐞 𝐧𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐝𝐮 𝐏𝐥𝐚𝐧 𝐏𝐎𝐋𝐋𝐔𝐌𝐀𝐑 𝟐𝟎𝟐𝟔 dans le Sud Ouest", "2026-03-30 13:32:15", "https://ciapol.ci/%f0%9d%90%83%f0%9d%90%9e-%f0%9d%90%a7%f0%9d%90%a8%f0%9d%90%a6%f0%9d%90%9b%f0%9d%90%ab%f0%9d%90%9e%f0%9d%90%ae%f0%9d%90%ac%f0%9d%90%9e%f0%9d%90%ac-%f0%9d%90%a2%f0%9d%90%a7%f0%9d%90%9f%f0%9d%90%ab/"),
    ("https://ciapol.ci/wp-content/uploads/2026/03/658186043_1348735480622953_698403310477787358_n.jpg", "É𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 𝐞𝐧𝐯𝐢𝐫𝐨𝐧𝐧𝐞𝐦𝐞𝐧𝐭𝐚𝐥𝐞 : 𝐋𝐞𝐬 é𝐥è𝐯𝐞𝐬 𝐝'𝐮𝐧𝐞 é𝐜𝐨𝐥𝐞 𝐩𝐫𝐢𝐦𝐚𝐢𝐫𝐞 𝐝𝐞 𝐂𝐨𝐜𝐨𝐝𝐲 𝐞𝐧 𝐢𝐦𝐦𝐞𝐫𝐬𝐢𝐨𝐧 𝐚𝐮 𝐂𝐈𝐀𝐏𝐎𝐋", "2026-03-30 13:25:04", "https://ciapol.ci/e%f0%9d%90%9d%f0%9d%90%ae%f0%9d%90%9c%f0%9d%90%9a%f0%9d%90%ad%f0%9d%90%a2%f0%9d%90%a8%f0%9d%90%a7-%f0%9d%90%9e%f0%9d%90%a7%f0%9d%90%af%f0%9d%90%a2%f0%9d%90%ab%f0%9d%90%a8%f0%9d%90%a7%f0%9d%90%a7/")]:
    a(f"### {title}\n\n![post-image]({img})\n\n{date}\n\n[Voir l'article >>]({href})\n")
a("[Voir plus d'articles](https://ciapol.ci/nos-articles/)\n")

a('<!-- section: reseau-social -->\n')
a('## Reseau social\n')
a('<!-- En ligne : titre seul, colonne vide. ARCHIVE (2024 et 2026-02) : widget « Facebook Page » (Elementor Pro) affichant https://facebook.com/ciapol.ci -->\n')
a('[Page Facebook du CIAPOL](https://facebook.com/ciapol.ci)\n')

a('<!-- section: economies -->\n')
for img, href, name in [("https://ciapol.ci/wp-content/uploads/2022/08/eco-circulaire.jpg", "https://fr.wikipedia.org/wiki/%C3%89conomie_circulaire", "Economie circulaire"),
                        ("https://ciapol.ci/wp-content/uploads/2022/07/4161657-1.jpg", "https://fr.wikipedia.org/wiki/%C3%89conomie_bleue", "Economie bleue"),
                        ("https://ciapol.ci/wp-content/uploads/2022/07/close-up-picture-of-the-sapling-of-the-plant-is-growing-acs.jpg", "https://fr.wikipedia.org/wiki/%C3%89conomie_verte", "Economie verte")]:
    a(f'### [{name}]({href})\n\n[![{name}]({img})]({href})\n')

a('<!-- section: publication -->\n')
a("## CIAPOL'Publication\n")
a('![Couverture du magazine CIAPOL](https://ciapol.ci/wp-content/uploads/2022/07/Scan-2.jpg)\n')
a('[Télécharger le magazine (PDF)](https://ciapol.ci/wp-content/uploads/2022/07/MAGAZINE-CIAPOL-2.pdf)\n')
a("<!-- Bouton à icône « download » ; lien d'origine cassé « /ciapol/wp-content/uploads/2022/07/MAGAZINE-CIAPOL-2.pdf » (404). Le PDF existe à l'adresse corrigée. -->\n")
a("<!-- Carrousel d'images (5 visibles, autoplay 5 s, sans navigation) : pages du magazine -->\n")
for n in ['Scan-2', 'Scan', 'Scan-1', 'Scan-3', 'Scan-4', 'Scan-5', 'Scan-6', 'Scan-7']:
    a(f'![Magazine CIAPOL – {n}](https://ciapol.ci/wp-content/uploads/2022/07/{n}.jpg)\n')
open(os.path.join(root, 'build', 'pages', 'accueil.md'), 'w', encoding='utf-8', newline='\n').write('\n'.join(L))
