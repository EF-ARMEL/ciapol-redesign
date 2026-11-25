import HomeHero from "@/components/home/HomeHero";
import ALaUne from "@/components/home/ALaUne";
import Missions from "@/components/home/Missions";
import Parcours from "@/components/home/Parcours";
import Voices from "@/components/home/Voices";
import HomeNews from "@/components/home/HomeNews";
import Economies from "@/components/home/Economies";
import Publication from "@/components/home/Publication";
import Ecosysteme from "@/components/home/Ecosysteme";
import Signal from "@/components/home/Signal";
import "@/components/home/home.css";
import "@/components/home/parcours.css";
import "@/components/home/sections.css";
import { PARCOURS } from "@/lib/parcours";
import { getArticleMetas, getPage } from "@/lib/content";
import {
  getEconomies,
  getFacebook,
  getHomeVideos,
  getMissions,
  getPartners,
  getPublication,
  getStructures,
} from "@/lib/home";

/* Accueil — reprend TOUS les blocs de l'accueil officiel (diaporama des
   missions, À la une, Actualités, Mot du directeur, Vidéos, Structures,
   Partenaires, Réseau social, Économies, CIAPOL'Publication) dans un récit
   « de l'eau trouble à l'eau claire ». */
export default function Home() {
  const articles = getArticleMetas();
  const vedette = articles.filter((a) => a.categories.includes("Vedette"));
  const slides = (vedette.length ? vedette : articles.slice(0, 12)).map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    cover: a.cover,
    category: a.categories.find((c) => c !== "Vedette" && c !== "Non classé"),
  }));
  const top = slides[0];
  const latest = articles.filter((a) => !a.categories.includes("Vedette"));

  const dirPage = getPage("mot-du-directeur");
  const dirExcerpt = dirPage?.markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/[#>*_`[\]()!]/g, "")
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => l.length > 80);

  const pub = getPublication();

  return (
    <>
      <HomeHero featured={top ? { title: top.title, href: `/actualites/${top.slug}/`, date: top.date, image: top.cover } : undefined} />
      <ALaUne slides={slides} />
      <Missions items={getMissions()} />
      <Parcours steps={PARCOURS} />
      <HomeNews articles={latest.slice(0, 4)} />
      <Voices
        videos={getHomeVideos()}
        director={{ title: "La parole du Directeur", href: "/mot-du-directeur/", excerpt: dirExcerpt ? dirExcerpt.slice(0, 260) + (dirExcerpt.length > 260 ? "…" : "") : undefined }}
      />
      <Economies items={getEconomies()} />
      <Publication pages={pub.pages} pdf={pub.pdf} />
      <Ecosysteme structures={getStructures()} partners={getPartners()} facebook={getFacebook()} />
      <Signal />
    </>
  );
}
