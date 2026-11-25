/* Arborescence de navigation — reprend à l'identique les entrées du menu
   officiel de ciapol.ci (Accueil, Présentation, Services, Projets,
   Qualité de l'Air, Nous contactez) et y ajoute les rubriques que l'ancien
   site n'exposait que dans sa colonne latérale (Mot du directeur, Vidéos,
   Actualités, Galerie, Décret). */

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  code?: string;
  children?: NavItem[];
  external?: boolean;
};

export const NAV: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Présentation",
    href: "/presentation/",
    children: [
      { label: "Qui sommes-nous", href: "/presentation/", description: "Statut, tutelles, missions et organisation du CIAPOL." },
      { label: "Mot du directeur", href: "/mot-du-directeur/", description: "La parole du Directeur du CIAPOL." },
      { label: "Décret de création", href: "/decret-de-creation/", description: "Décret n°91-662 du 9 octobre 1991." },
      { label: "Galerie", href: "/galerie/", description: "Le CIAPOL en images, sur le terrain." },
    ],
  },
  {
    label: "Services",
    href: "/services/",
    children: [
      { code: "CIPOMAR", label: "Compagnie d'Intervention contre les Pollutions Marines et Lagunaires", href: "/services/cipomar/" },
      { code: "LCE", label: "Laboratoire Central de l'Environnement", href: "/services/lce/" },
      { code: "UNIPOL", label: "Unité de Police Antipollution", href: "/services/unipol/" },
      { code: "SDIIC", label: "Sous-Direction de l'Inspection des Installations Classées", href: "/services/sdiic/" },
      { code: "SDGSP-VAE", label: "Gestion des Sites Pollués et Végétaux Aquatiques Envahissants", href: "/services/sdgsp-vae/" },
    ],
  },
  {
    label: "Projets",
    href: "/projets/",
    children: [
      { code: "RNO", label: "Réseau National d'Observation", href: "/projets/rno/" },
      { code: "GIAMSUC", label: "Gestion Intégrée de l'Aire Marine et Côtière du Sud-Comoé", href: "/projets/giamsuc/" },
      { code: "ONE HEALTH", label: "Une seule santé", href: "/projets/one-health/" },
      { code: "UCP LAC YAKRO", label: "Réhabilitation des lacs de Yamoussoukro", href: "/projets/ucp-lac-yakro/" },
      { code: "CCAC", label: "Coalition pour le Climat et l'Air Pur", href: "/projets/ccac/" },
    ],
  },
  { label: "Qualité de l'Air", href: "/qualite-de-lair/" },
  { label: "Actualités", href: "/actualites/" },
  { label: "Nous contacter", href: "/contact/" },
];

export const CTA = { label: "Signaler une pollution", href: "/signaler/" };
