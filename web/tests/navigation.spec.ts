import { test, expect } from "./fixtures";

test.describe("menu mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "menu tiroir réservé au mobile");

  test("le tiroir ouvre une page puis se referme", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu" });
    await expect(drawer).toBeVisible();
    await drawer.locator('a[href="/contact/"]').first().click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(drawer).toBeHidden();
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("un lien vers la page courante referme le tiroir", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu" });
    await expect(drawer).toBeVisible();
    await drawer.locator('a[href="/contact/"]').first().click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/contact\/$/);
  });
});

test("la barre de chapitres d'une fiche mène au bon chapitre", async ({ page }) => {
  await page.goto("/services/cipomar/");
  const links = page.locator(".dbody__bar .toc a");
  expect(await links.count()).toBeGreaterThan(1);
  const last = links.last();
  const id = (await last.getAttribute("href"))!.slice(1);
  await last.click();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect(last).toHaveAttribute("aria-current", "location");
  // Défilement fini (position stable), le haut du chapitre est dans la moitié
  // haute de l'écran, sauf si la page ne peut plus descendre.
  let prevY = NaN;
  await expect
    .poll(async () => {
      const y = await page.evaluate(() => window.scrollY);
      const stable = y === prevY;
      prevY = y;
      return stable;
    }, { intervals: [300], timeout: 6_000 })
    .toBe(true);
  const { top, vh, atEnd } = await page.evaluate((sel) => ({
    top: document.querySelector(sel)!.getBoundingClientRect().top,
    vh: window.innerHeight,
    atEnd: Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2,
  }), `#${id}`);
  expect(top).toBeGreaterThanOrEqual(0);
  if (!atEnd) expect(top).toBeLessThan(vh * 0.5);
});

test("la navigation principale change de page", async ({ page, isMobile }) => {
  test.skip(isMobile, "couvert par le menu mobile");
  await page.goto("/");
  await page.locator('header a[href="/actualites/"]').first().click();
  await expect(page).toHaveURL(/\/actualites\/$/);
  await expect(page.locator("h1").first()).toBeVisible();
});
