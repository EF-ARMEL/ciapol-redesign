import { defineConfig, devices } from "@playwright/test";

/* Tests de parcours sur le site exporté (out/). Lancer `npm run build` avant
   `npm test` : les tests vérifient ce qui sera réellement mis en ligne. */
export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    // BASE_URL=https://… permet de tester le site en ligne.
    baseURL: process.env.BASE_URL ?? "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "ordinateur", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "node tests/serve.mjs",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
  },
});
