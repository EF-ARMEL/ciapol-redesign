import { test as base, expect } from "@playwright/test";

/* Chaque test démarre sans l'intro animée (considérée comme déjà vue) et
   échoue si la page lève une erreur JavaScript. */
export const test = base.extend<{ jsErrors: string[] }>({
  jsErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.addInitScript(() => {
        try {
          sessionStorage.setItem("ciapol:intro", "1");
        } catch {}
      });
      await use(errors);
      expect(errors, "erreurs JavaScript sur la page").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
