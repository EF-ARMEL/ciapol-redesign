"""Create staging pages from converted drafts (frontmatter + body)."""
import os, sys

root = sys.argv[1]
P = [
    # slug, title, route, sourceUrl, description, draft
    ('presentation', 'Présentation', '/presentation', 'https://ciapol.ci/presentation/', 'Présentation du Centre Ivoirien Antipollution (CIAPOL)', 'md_wayback/presentation.md'),
    ('services', 'Services', '/services', 'https://ciapol.ci/services/', 'Les sous-directions techniques du CIAPOL', 'md_wayback/services.md'),
    ('services-cipomar', 'CIPOMAR', '/services/cipomar', 'https://ciapol.ci/cipomar/', 'Compagnie d’Intervention contre les Pollutions du Milieu Marin et Lagunaire', 'md_wayback/cipomar.md'),
    ('services-lce', 'LCE', '/services/lce', 'https://ciapol.ci/lce/', 'Laboratoire Central de l’Environnement', 'md_wayback/lce.md'),
    ('services-unipol', 'UNIPOL', '/services/unipol', 'https://ciapol.ci/unipol/', 'Unité de Police Antipollution', 'md_wayback/unipol.md'),
    ('services-sdiic', 'SDIIC', '/services/sdiic', 'https://ciapol.ci/sdiic/', "Sous Direction de l'Inspection des Installations Classées", 'md_wayback/sdiic.md'),
    ('services-sdgsp-vae', 'SDGSP-VAE', '/services/sdgsp-vae', 'https://ciapol.ci/sdgsp-vae/', 'Sous-direction de la Gestion des Sites Pollués et la lutte contre les Végétaux Aquatiques Envahissant', 'md_wayback/sdgsp-vae.md'),
    ('projets-rno', 'RNO', '/projets/rno', 'https://ciapol.ci/rno/', "Réseau National d'Observation", 'md/rno.md'),
    ('projets-ccac', 'CCAC', '/projets/ccac', 'https://ciapol.ci/ciapol/', 'Climate & Clean Air Coalition', 'md/ciapol.md'),
    ('projets-ucp-lac-yakro', 'UCP LAC YAKRO', '/projets/ucp-lac-yakro', 'https://ciapol.ci/ucp-lac-yakro/', 'UCP LAC YAKRO', 'md/ucp-lac-yakro.md'),
    ('qualite-de-lair', "Qualité de l'Air", '/qualite-de-lair', 'https://ciapol.ci/qualite-de-lair/', "Surveillance de la Qualité de l'Air - CIAPOL", 'md/qualite-de-lair.md'),
    ('contact', 'Contactez nous', '/contact', 'https://ciapol.ci/contactez-nous/', 'Vous avez une préoccupation ? Veuillez contactez le support via ce formulaire.', 'md_wayback/contactez-nous.md'),
    ('galerie', 'Galerie', '/galerie', 'https://ciapol.ci/gallerie/', 'Galerie photos du CIAPOL', 'md_wayback/gallerie.md'),
    ('decret-de-creation', 'Décret de création', '/decret-de-creation', 'https://ciapol.ci/decret-de-creation/', 'Décret N° 91-662 du 9 octobre 1991 portant création du CIAPOL', 'md_wayback/decret-de-creation.md'),
    ('actualites', 'Nos articles', '/actualites', 'https://ciapol.ci/nos-articles/', 'Toutes les actualités du CIAPOL', 'md_wayback/nos-articles.md'),
    ('exercice-plan-pollumar', 'Exercice Plan POLLUMAR', '/actualites/exercice-plan-pollumar', 'https://ciapol.ci/exercice-plan-pollumar/', 'Exercice Plan POLLUMAR (article de démonstration Lorem ipsum)', 'md/exercice-plan-pollumar.md'),
]
for slug, title, route, src, desc, draft in P:
    body = open(os.path.join(root, 'raw', draft), encoding='utf-8').read()
    fm = f'---\ntitle: "{title}"\nroute: "{route}"\nsourceUrl: "{src}"\ndescription: "{desc}"\n---\n\n'
    open(os.path.join(root, 'build', 'pages', slug + '.md'), 'w', encoding='utf-8', newline='\n').write(fm + body)
    print(slug, len(body))
