/* Informations institutionnelles transverses (pied de page, contact, SEO).
   Source : web/content/site.json (pied de page et barre supérieure du site
   officiel, récupérés dans ses archives de février 2026). Aucun horaire
   d'ouverture n'est publié par le CIAPOL : on n'en affiche pas. */

export type Antenna = { city: string; phones: string[] };

export const SITE = {
  name: "CIAPOL",
  fullName: "Centre Ivoirien Antipollution",
  motto: "La lutte contre la pollution, notre priorité",
  url: "https://ciapol.ci",
  about:
    "Établissement Public à caractère Administratif (EPA) créé par le décret n°91-662 du 9 octobre 1991, placé sous la tutelle du Ministère en charge de l'Environnement.",
  contact: {
    address: ["Immeuble Grand Siège, Carrefour Kaiser", "Cocody Riviera Bonoumin, Abidjan"] as string[],
    annex: "Bureau annexe : Plateau, avenue Noguès, immeuble Noguès, 2e étage",
    mapUrl: "https://maps.app.goo.gl/kLt4uJBDzn37i6Ty7",
    phones: ["(225) 27 22 52 43 34"] as string[],
    annexPhone: "(225) 27 20 22 54 44",
    emails: ["courrier@ciapol.ci"] as string[],
    hours: "" as string,
  },
  antennas: [
    { city: "Daloa", phones: ["(225) 27 32 700 583", "(225) 07 07 89 04 15", "(225) 07 48 60 59 82"] },
    { city: "San-Pédro", phones: ["(225) 01 01 27 44 00", "(225) 07 58 91 09 73"] },
    { city: "Man", phones: ["(225) 01 03 682 757", "(225) 07 48 991 660"] },
    { city: "Korhogo", phones: ["(225) 07 58 91 09 73"] },
    { city: "Abengourou", phones: ["(225) 07 07 33 85 33"] },
  ] as Antenna[],
  social: [
    { network: "Facebook", url: "https://fr-fr.facebook.com/ciapol.ci" },
    { network: "YouTube", url: "https://www.youtube.com/@centreivoirienantipollutio4434" },
    { network: "LinkedIn", url: "https://www.linkedin.com/in/centre-ivoirien-antipollution-b95953253/" },
  ] as { network: string; url: string }[],
};

/** Numéro composable pour un lien tel: */
export const telHref = (n: string) => "tel:+" + n.replace(/[^\d]/g, "");
