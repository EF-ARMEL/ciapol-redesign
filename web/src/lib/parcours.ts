import type { Step } from "@/components/home/Parcours";

/* Chaîne d'action du CIAPOL — formulations reprises des pages officielles
   des sous-directions et du RNO (ciapol.ci). */
export const PARCOURS: Step[] = [
  {
    verb: "Surveiller",
    code: "RNO",
    unit: "Réseau National d'Observation",
    text: "Outil d'évaluation des niveaux et des tendances de la contamination chimique des milieux aquatiques : littoral, lagunes, fleuves et rivières.",
    href: "/projets/rno/",
    state: "Eaux chargées",
  },
  {
    verb: "Analyser",
    code: "LCE",
    unit: "Laboratoire Central de l'Environnement",
    text: "Créé en 1985, le laboratoire réalise les analyses physico-chimiques, chimiques et microbiologiques des eaux, de l'air, des sols et des rejets.",
    href: "/services/lce/",
    state: "Prélèvements en cours",
  },
  {
    verb: "Contrôler",
    code: "SDIIC",
    unit: "Inspection des Installations Classées",
    text: "Réduire sensiblement la pollution industrielle dans les grandes zones industrielles : inspection, autorisation et suivi des établissements classés.",
    href: "/services/sdiic/",
    state: "Sources identifiées",
  },
  {
    verb: "Intervenir",
    code: "CIPOMAR",
    unit: "Pollutions Marines et Lagunaires",
    text: "Lutte et prévention contre les déversements d'hydrocarbures et de produits dangereux en mer, en lagune et en zone côtière, et mise en œuvre du Plan POLLUMAR.",
    href: "/services/cipomar/",
    state: "Confinement",
  },
  {
    verb: "Sanctionner",
    code: "UNIPOL",
    unit: "Unité de Police Antipollution",
    text: "Constat des infractions au Code de l'environnement et application de la législation auprès des pollueurs.",
    href: "/services/unipol/",
    state: "Rejets stoppés",
  },
  {
    verb: "Restaurer",
    code: "SDGSP-VAE",
    unit: "Sites pollués & végétaux envahissants",
    text: "Gestion des sites pollués et lutte contre les végétaux aquatiques envahissants pour rendre aux plans d'eau leur salubrité.",
    href: "/services/sdgsp-vae/",
    state: "Milieu restauré",
  },
];
