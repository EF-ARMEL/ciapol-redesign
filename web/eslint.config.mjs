import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Export statique : next/image n'optimise rien ici (images.unoptimized).
      // Les médias sont compressés en amont par scripts/optimize-media.mjs.
      "@next/next/no-img-element": "off",
      // Préfixe « _ » : variable volontairement ignorée (ex. déstructuration).
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
    },
  },
  globalIgnores([".next/**", "out/**", "node_modules/**", "public/**", "next-env.d.ts", "test-results/**", "playwright-report/**"]),
]);
