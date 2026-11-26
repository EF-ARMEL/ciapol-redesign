import { test, expect } from "./fixtures";

/* Chaque rubrique principale s'ouvre, a un titre et son style est chargé. */
const PAGES = [
  "/",
  "/presentation/",
  "/mot-du-directeur/",
  "/decret-de-creation/",
  "/services/",
  "/services/cipomar/",
  "/projets/",
  "/projets/rno/",
  "/actualites/",
  "/galerie/",
  "/videos/",
  "/qualite-de-lair/",
  "/signaler/",
  "/contact/",
  "/plan-du-site/",
];

for (const url of PAGES) {
  test(`la page ${url} s'affiche`, async ({ page }) => {
    const res = await page.goto(url);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    // Style chargé : l'en-tête est positionné, pas laissé en flux brut.
    const pos = await page.locator("header").first().evaluate((el) => getComputedStyle(el).position);
    expect(pos).not.toBe("static");
  });
}

test("une adresse inconnue renvoie la page 404", async ({ page }) => {
  const res = await page.goto("/cette-page-n-existe-pas/");
  expect(res?.status()).toBe(404);
});
