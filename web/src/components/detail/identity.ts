/* Fiche d'identité des sous-directions et des projets : photo de terrain
   officielle (reportages du CIAPOL), verbe d'action (le même que dans le
   parcours de l'accueil) et repères tirés des intitulés et textes officiels. */
export type Identity = {
  photo: string;
  photoAlt: string;
  /** Point d'intérêt de la photo pour le recadrage de l'ouverture. */
  focus?: string;
  verb: string;
  facts: { k: string; v: string }[];
};

const A = "/media/articles";

export const IDENTITY: Record<string, Identity> = {
  cipomar: {
    photo: `${A}/lutte-contre-les-pollutions-par-hydrocarbures/IMG_0288.jpg`,
    photoAlt: "Agents déployant un barrage flottant contre les hydrocarbures sur une plage",
    focus: "45% 60%",
    verb: "Intervenir",
    facts: [
      { k: "Milieu", v: "Eaux marines et lagunaires" },
      { k: "Action", v: "Intervention contre les pollutions" },
      { k: "Dispositif", v: "Plan POLLUMAR" },
    ],
  },
  lce: {
    photo: `${A}/repousse-de-vegetaux-des-lacs-de-yamoussoukro-le-ciapol-depeche-des-experts/DSC05706.jpg`,
    photoAlt: "Agents du CIAPOL réalisant des prélèvements d'eau au bord d'un lac",
    focus: "50% 45%",
    verb: "Analyser",
    facts: [
      { k: "Milieux", v: "Eau, air, sols" },
      { k: "Action", v: "Analyses de laboratoire" },
      { k: "Rôle", v: "Laboratoire central de l'environnement" },
    ],
  },
  unipol: {
    photo: `${A}/lutte-contre-les-nuisances-environnementales-en-cote-divoire-monsieur-le/whatsapp-image-2025-04-16-at-20-05-14.jpeg`,
    photoAlt: "Agents de police de l'environnement lors d'une opération de contrôle",
    focus: "50% 35%",
    verb: "Sanctionner",
    facts: [
      { k: "Rôle", v: "Police antipollution" },
      { k: "Action", v: "Constat des infractions" },
      { k: "Cadre", v: "Code de l'environnement" },
    ],
  },
  sdiic: {
    photo: `${A}/visite-de-travail-du-ministre-jean-luc-assi-a-san-pedro-les-09-et-10-mars-2023/DSC05214.jpg`,
    photoAlt: "Visite d'inspection d'un site industriel, casques et gilets de sécurité",
    focus: "55% 40%",
    verb: "Contrôler",
    facts: [
      { k: "Domaine", v: "Installations classées" },
      { k: "Action", v: "Inspection et autorisation" },
      { k: "Public", v: "Opérateurs industriels" },
    ],
  },
  "sdgsp-vae": {
    photo: `${A}/etat-davancement-des-travaux-de-rehabilitation-des-lacs-de-yamoussoukro/329896696_699890515020566_7869837156099970463_n.jpg`,
    photoAlt: "Engin dégageant les végétaux aquatiques envahissants d'un plan d'eau",
    focus: "50% 55%",
    verb: "Restaurer",
    facts: [
      { k: "Domaine", v: "Sites pollués" },
      { k: "Action", v: "Lutte contre les végétaux envahissants" },
      { k: "Objectif", v: "Assainir les plans d'eau" },
    ],
  },
  rno: {
    photo: `${A}/repousse-de-vegetaux-des-lacs-de-yamoussoukro-le-ciapol-depeche-des-experts/DSC05584-1.jpg`,
    photoAlt: "Agent du CIAPOL mesurant la qualité de l'eau avec une sonde",
    focus: "45% 40%",
    verb: "Surveiller",
    facts: [
      { k: "Objet", v: "Qualité des milieux aquatiques" },
      { k: "Milieux", v: "Littoral, lagune, fleuves, rivières" },
      { k: "Création", v: "1981" },
    ],
  },
  ccac: {
    photo: "/media/pages/projets-ccac/abidjan-adobestock-106549160-scaled.jpeg",
    photoAlt: "Vue aérienne d'Abidjan et de sa lagune",
    focus: "50% 50%",
    verb: "Coopérer",
    facts: [
      { k: "Coalition", v: "Climat et air pur" },
      { k: "Cible", v: "Polluants climatiques de courte durée" },
      { k: "Partenaire", v: "Depuis 2013" },
    ],
  },
  "one-health": {
    photo: `${A}/installation-dune-equipe-one-health-au-ciapol-quand-la-protection-de/whatsapp-image-2026-02-10-at-11-41-03.jpeg`,
    photoAlt: "Installation de l'équipe One Health au CIAPOL",
    focus: "50% 35%",
    verb: "Protéger",
    facts: [
      { k: "Approche", v: "Une seule santé" },
      { k: "Lien", v: "Santé humaine, animale, environnement" },
      { k: "Équipe", v: "Installée au CIAPOL" },
    ],
  },
  "ucp-lac-yakro": {
    photo: `${A}/etat-davancement-des-travaux-de-rehabilitation-des-lacs-de-yamoussoukro/329896696_699890515020566_7869837156099970463_n.jpg`,
    photoAlt: "Travaux de réhabilitation d'un lac de Yamoussoukro",
    focus: "50% 55%",
    verb: "Réhabiliter",
    facts: [
      { k: "Projet", v: "Réhabilitation des lacs" },
      { k: "Lieu", v: "Yamoussoukro" },
      { k: "Ampleur", v: "Treize lacs" },
    ],
  },
};
