import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./chrome.css";
import "./footer.css";
import "./intro.css";
import "./ui.css";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import Lagoon from "@/motion/Lagoon";
import SmoothScroll from "@/motion/SmoothScroll";
import PageCurtain from "@/motion/PageCurtain";
import Preloader from "@/motion/Preloader";
import { SITE } from "@/lib/site";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} (${SITE.name}) · ${SITE.motto}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Le CIAPOL surveille, analyse et protège les eaux marines, lagunaires et continentales, l'air et les sols de Côte d'Ivoire. Établissement public créé par le décret n°91-662 du 9 octobre 1991.",
  icons: { icon: "/media/site/logo-ciapol.png" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: `${SITE.name}, ${SITE.fullName}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#003f8c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Avant le premier rendu : masque l'intro si déjà vue dans cette session
            ou si l'utilisateur préfère moins d'animations (évite tout flash).
            Note : en local, Kaspersky injecte son propre <script> en tête de
            <head>, d'où un avertissement d'hydratation sans effet, absent en ligne. */}
        <Script
          id="intro-flag"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;if(sessionStorage.getItem('ciapol:intro')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body>
        <Preloader />
        <Lagoon />
        <SmoothScroll />
        <PageCurtain />
        <div className="site">
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
