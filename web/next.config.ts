import type { NextConfig } from "next";

/* Site 100 % statique : aucune connexion serveur derrière (voir brief).
   `next build` produit le dossier out/ déployable sur n'importe quel hébergeur. */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: __dirname },
  // Pas de bouton flottant Next.js pendant le développement.
  devIndicators: false,
};

export default nextConfig;
