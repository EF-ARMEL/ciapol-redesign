"""Apply targeted edits (section names, banners, archive notes) to staged pages."""
import os, sys

root = sys.argv[1]
B = os.path.join(root, 'build', 'pages')
U = 'https://ciapol.ci/wp-content/uploads/'
ARCH_CTA = ('<!-- ARCHIVE : les cartes ci-dessous (widget Elementor Pro « call-to-action », image de fond + titre + description + bouton) '
            'proviennent des snapshots Wayback 2024 ; sur le site en ligne actuel la rangée « Autres sercives du CIAPOL » est vide (4 colonnes sans contenu). -->')
BANNER = '<!-- bandeau-titre : bandeau bleu « CENTRE IVOIRIEN ANTIPOLLUTION » + bouton -->'


def cta_imgs(text, mapping):
    for name, img in mapping.items():
        key = f'## {name}\n\n'
        i = text.rfind(key)
        if i >= 0:
            text = text[:i + len(key)] + f'![{name}]({U}2022/07/{img})\n\n' + text[i + len(key):]
    return text


CARDS = {'CIPOMAR': 'banner3.jpg', 'LCE': 'banner5.jpg', 'UNIPOL': 'banner4.jpg', 'SDIIC': 'banner6.jpg', 'SDGSP-VAE': 'banner5.jpg'}


def ed(slug, pairs, cards=False, prepend=None):
    p = os.path.join(B, slug + '.md')
    t = open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in t:
            print('!! not found in', slug, ':', old[:60])
            continue
        t = t.replace(old, new, 1)
    if cards:
        t = cta_imgs(t, CARDS)
    open(p, 'w', encoding='utf-8', newline='\n').write(t)


SEC1 = '<!-- section -->\n\n'


def hero(name, img):
    return f'<!-- section: hero -->\n\n<!-- bg: {img} -->\n\n'


# --- presentation
ed('presentation', [
    (SEC1 + '# CIAPOL', hero('CIAPOL', U + '2022/07/87960859285134.jpg') + '# CIAPOL'),
    ('### Centre Ivoirien Antipollution\n\n', '### Centre Ivoirien Antipollution\n\n<!-- section: introduction (texte + 3 images en colonne droite) -->\n\n'),
    (SEC1 + '![](' + U + '2022/08/4.jpg)', '<!-- section: statut-et-organisation -->\n\n![](' + U + '2022/08/4.jpg)'),
    ('<b>&nbsp;</b>', ''),
    (SEC1 + '[Cliquez pour voir les services]', '<!-- section: boutons -->\n\n<!-- En ligne ces deux boutons pointent vers « # » ; liens d\'origine (archive 2024) ci-dessous -->\n\n[Cliquez pour voir les services]'),
])

# --- services
ed('services', [
    (SEC1 + '# SERVICES', hero('SERVICES', '') .replace('<!-- bg:  -->\n\n', '') + '# SERVICES'),
    (SEC1 + '# CENTRE IVOIRIEN ANTIPOLLUTION', '<!-- section: bandeau-titre -->\n\n# CENTRE IVOIRIEN ANTIPOLLUTION'),
    ('[Présentation](https://ciapol.ci/presentation/)\n\n' + SEC1,
     '[Présentation](https://ciapol.ci/presentation/)\n\n<!-- En ligne ce bouton pointe vers « # ». -->\n\n<!-- section: cartes-services -->\n\n'
     '<!-- ARCHIVE : cartes Elementor Pro « call-to-action » (Wayback 2024-05-28). Sur le site en ligne actuel, la page ne contient plus que les titres : les 5 cartes ont disparu (Elementor Pro désactivé). Disposition : 3 cartes puis 2. -->\n\n'),
], cards=True)

SERV = {
    'services-cipomar': ('CIPOMAR', U + '2022/07/BANNIERE-CIPOMAR.jpg'),
    'services-lce': ('LCE', U + '2022/07/BANNIERE-LCE.jpg'),
    'services-unipol': ('UNIPOL', U + '2022/07/BANNIERE-UNIPOL.jpg'),
    'services-sdiic': ('SDIIC', U + '2022/07/BANNIERE-SDIIC.jpg'),
    'services-sdgsp-vae': ('SDGSP-VAE', U + '2022/07/BANNIERE-GSP-VAE.jpg'),
}
for slug, (name, img) in SERV.items():
    pairs = [
        (SEC1 + '# ' + name, hero(name, img) + '# ' + name),
        (SEC1 + '# CENTRE IVOIRIEN ANTIPOLLUTION', '<!-- section: bandeau-titre -->\n\n# CENTRE IVOIRIEN ANTIPOLLUTION'),
        ('## Autres sercives du CIAPOL\n\n', '## Autres sercives du CIAPOL\n\n' + ARCH_CTA + '\n\n'),
    ]
    ed(slug, pairs, cards=True)

# per-page section names / Pro flip boxes
ed('services-cipomar', [
    ('[Présentation](#)\n\n' + SEC1, '[Présentation](#)\n\n<!-- section: bon-a-savoir -->\n\n'),
    (SEC1 + '## Missions', '<!-- section: missions -->\n\n## Missions'),
    (SEC1 + '![](' + U + '2022/07/4.jpg)', '<!-- section: activites -->\n\n![](' + U + '2022/07/4.jpg)'),
    (SEC1 + '### Lutte', '<!-- section: lutte-et-perspectives -->\n\n<!-- ARCHIVE : 2 « flip-box » Elementor Pro (recto : « Lutte » / « Perspectives » ; verso : texte). Absentes du site en ligne actuel (section vide). -->\n\n### Lutte'),
    (SEC1 + '## Autres sercives', '<!-- section: autres-services -->\n\n## Autres sercives'),
])
ed('services-lce', [
    ('[Présentation](#)\n\n' + SEC1, '[Présentation](#)\n\n<!-- section: bon-a-savoir -->\n\n'),
    (SEC1 + '## Missions', '<!-- section: missions -->\n\n## Missions'),
    (SEC1 + '![](' + U + '2022/07/7.jpg)', '<!-- section: analyses -->\n\n![](' + U + '2022/07/7.jpg)'),
    (SEC1 + '| Analyses', '<!-- section: tableau-analyses -->\n\n| Analyses'),
    (SEC1 + '## Autres sercives', '<!-- section: autres-services -->\n\n## Autres sercives'),
])
ed('services-unipol', [
    ('[Présentation](#)\n\n' + SEC1, '[Présentation](#)\n\n<!-- section: bon-a-savoir -->\n\n'),
    (SEC1 + '## Missions', '<!-- section: missions -->\n\n## Missions'),
    (SEC1 + '## Autres sercives', '<!-- section: autres-services -->\n\n## Autres sercives'),
])
ed('services-sdiic', [
    ('[Devenir Une ICPE](#)\n\n' + SEC1, '[Devenir Une ICPE](#)\n\n<!-- Bouton « Devenir Une ICPE » : lien « # » (aucune cible), en ligne comme dans l\'archive. -->\n\n<!-- section: bon-a-savoir -->\n\n'),
    (SEC1 + '## Qu’appelle', '<!-- section: installations-classees -->\n\n## Qu’appelle'),
    (SEC1 + '### Procédure de déclaration', '<!-- section: procedures -->\n\n<!-- ARCHIVE : 2 « flip-box » Elementor Pro (recto : titre ; verso : texte). Absentes du site en ligne actuel. -->\n\n### Procédure de déclaration'),
    (SEC1 + '## Autres sercives', '<!-- section: autres-services -->\n\n## Autres sercives'),
])
ed('services-sdgsp-vae', [
    ('[Présentation](#)\n\n' + SEC1, '[Présentation](#)\n\n<!-- section: bon-a-savoir -->\n\n'),
    (SEC1 + '### Le Service chargé de la Gestion', '<!-- section: services -->\n\n<!-- ARCHIVE : 2 « flip-box » Elementor Pro. Absentes du site en ligne actuel. -->\n\n### Le Service chargé de la Gestion'),
    (SEC1 + '## Autres sercives', '<!-- section: autres-services -->\n\n## Autres sercives'),
])

# --- projets
ed('projets-rno', [
    (SEC1 + '# rno', hero('RNO', U + '2022/08/BANNIERE-RNO.jpg') + '# rno'),
    (SEC1 + '# CENTRE IVOIRIEN ANTIPOLLUTION', '<!-- section: bandeau-titre -->\n\n# CENTRE IVOIRIEN ANTIPOLLUTION'),
    ('[Présentation](#)\n\n' + SEC1, '[Présentation](#)\n\n<!-- section: bon-a-savoir -->\n\n'),
    (SEC1 + '## Programmes', '<!-- section: programmes -->\n\n## Programmes'),
    (SEC1 + '![](' + U + '2022/08/1.jpg)', '<!-- section: resultats-attendus -->\n\n![](' + U + '2022/08/1.jpg)'),
])
ed('projets-ccac', [
    (SEC1 + '# CCAC', hero('CCAC', U + '2024/11/abidjan_AdobeStock_106549160-scaled.jpeg') + '# CCAC'),
    (SEC1 + '# CENTRE IVOIRIEN ANTIPOLLUTION', '<!-- section: bandeau-titre -->\n\n# CENTRE IVOIRIEN ANTIPOLLUTION'),
    ('[Présentation](#)\n\n' + SEC1, '[Présentation](#)\n\n<!-- section: presentation-ccac -->\n\n'
     '<!-- ARCHIVE/CSS : la feuille de style de la page (post-3308.css) définit aussi un diaporama Elementor Pro (2 diapositives, images ci-dessous) qui n\'est plus rendu en ligne ; son texte n\'a pas pu être récupéré (aucune archive Wayback de cette page). -->\n\n'
     '![Diapositive CCAC 1](' + U + '2024/12/annual-meeting-group-2023.jpg.webp)\n\n![Diapositive CCAC 2](' + U + '2024/12/AdobeStock_984494700.jpeg.webp)\n\n'),
    (SEC1 + '## HISTOIRE', '<!-- section: histoire -->\n\n## HISTOIRE'),
    (SEC1 + '![](' + U + '2024/12/ci.png)', '<!-- section: cote-divoire -->\n\n<!-- bg: ' + U + '2024/12/DJI_0539-min-scaled-1.jpg -->\n\n![](' + U + '2024/12/ci.png)'),
    (SEC1 + '## ARTICLES Recents', '<!-- section: articles-recents -->\n\n## ARTICLES Recents\n\n<!-- Titre + séparateur seuls : la liste d\'articles (widget Elementor Pro) n\'est plus rendue. Articles liés au tag CCAC : /actualites/tag/ccac -->'),
])
ed('projets-ucp-lac-yakro', [
    (SEC1 + '# UCP LAC YAKRO', hero('UCP', U + '2022/08/BANNIERE-RNO.jpg') + '# UCP LAC YAKRO'),
    ('### Réseau National d\'Observation', "### Réseau National d'Observation\n\n<!-- ANOMALIE : sous-titre et bannière copiés de la page RNO. -->"),
    (SEC1 + '# CENTRE IVOIRIEN ANTIPOLLUTION', '<!-- section: bandeau-titre -->\n\n# CENTRE IVOIRIEN ANTIPOLLUTION'),
])
open(os.path.join(B, 'projets-ucp-lac-yakro.md'), 'a', encoding='utf-8').write(
    "\n<!-- PAGE VIDE : aucun contenu au-delà du bandeau (en ligne comme dans l'archive 2024-06-22). La page n'est pas reliée au menu (l'entrée « UCP LAC YAKRO » pointe vers « # »). -->\n")

# --- qualite de l'air
ed('qualite-de-lair', [
    ('<iframe', '<!-- section: iframe-surveillance -->\n\n<!-- Page pleine largeur sans en-tête ni pied de page (gabarit vierge) : uniquement un iframe vers la plateforme de surveillance. -->\n\n<iframe'),
])
open(os.path.join(B, 'qualite-de-lair.md'), 'a', encoding='utf-8').write(
    "\nVotre navigateur ne supporte pas les iframes. [Cliquez ici pour accéder au système de surveillance](https://monitoring.atmoivoir.com/website)\n")

# --- galerie
open(os.path.join(B, 'galerie.md'), 'w', encoding='utf-8', newline='\n').write(
    '---\ntitle: "Galerie"\nroute: "/galerie"\nsourceUrl: "https://ciapol.ci/gallerie/"\ndescription: "Galerie photos du CIAPOL"\n---\n\n'
    "<!-- section: galerie -->\n\n<!-- En ligne : la page est VIDE (widget Elementor Pro « gallery » non rendu). Contenu ci-dessous = archive Wayback 2024-06-22 : galerie maçonnerie 4 colonnes, filtrable par 3 onglets, lightbox. -->\n\n"
    '# Galerie\n\nFiltres : **COMITÉ DE GESTION** · **GIAMAA** · **PLAN POLLUMAR**\n\n'
    '## COMITÉ DE GESTION\n\n' + ''.join(f'![{n}]({U}2022/07/{n}.jpg)\n\n' for n in ['project5', 'project3', 'project2', 'project4']) +
    '## GIAMAA\n\n' + ''.join(f'![{n}]({U}2022/07/{n}.jpg)\n\n' for n in ['d97cef5b-3c8e-387b-8bf7-54916bf2bced', 'bf65ad1a-e7c6-36f8-81f2-4da25c4eb3d0', '3886d915-74d9-3d55-87e1-95af6a301c93']) +
    '## PLAN POLLUMAR\n\n' + ''.join(f'![{n}]({U}2022/07/{n}.jpg)\n\n' for n in ['journee-terre-hotel-ivoire-0003', 'service2', 'project1', 'bf65ad1a-e7c6-36f8-81f2-4da25c4eb3d0', 'bg2', 'bg1']) +
    "<!-- Ordre d'affichage d'origine (onglet « Tous ») : project5, journee-terre-hotel-ivoire-0003, service2, project1, d97cef5b…, project3, bf65ad1a… (GIAMAA + PLAN POLLUMAR), bg2, bg1, 3886d915…, project2, project4. -->\n")
print('done')
