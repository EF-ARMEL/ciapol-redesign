import { test, expect } from "./fixtures";

/* Parcours complet du signalement citoyen en 3 étapes. */
test("signaler une pollution de bout en bout", async ({ page }) => {
  await page.goto("/signaler/");
  const form = page.locator("form.sig");
  const next = form.getByRole("button", { name: "Continuer" });

  // Étape 1 : impossible d'avancer sans choisir un type.
  await next.click();
  await expect(form.getByRole("alert")).toContainText("type de pollution");
  await form.getByText("Rejet industriel").click();
  await next.click();

  // Étape 2 : champs obligatoires, le focus va au premier champ fautif.
  await expect(form.getByText("Où et quand ?")).toBeVisible();
  await next.click();
  await expect(form.locator("#lieu")).toBeFocused();
  await form.locator("#lieu").fill("Berge de la lagune, près du pont");
  await form.locator("#commune").fill("Marcory");
  await form.locator("#description").fill("Effluent coloré et mousse rejetés directement dans la lagune.");

  // Retour puis Continuer ne doit jamais envoyer le formulaire.
  await next.click();
  await form.getByRole("button", { name: "Retour" }).click();
  await expect(form.getByText("Où et quand ?")).toBeVisible();
  await next.click();
  await expect(form.getByText("Vos coordonnées")).toBeVisible();
  await expect(page.getByText("Signalement prêt")).toHaveCount(0);

  // Étape 3 : l'accord est requis.
  const submit = form.getByRole("button", { name: "Préparer le signalement" });
  await submit.click();
  await expect(form.getByRole("alert")).toContainText("accord");
  await form.getByRole("checkbox").check();
  await submit.click();

  // Écran final : référence et récapitulatif prêts à envoyer.
  await expect(page.getByRole("heading", { name: "Signalement prêt" })).toBeVisible();
  await expect(page.locator(".sig__recap")).toContainText(/SIG-\d{4}-[A-Z0-9]{5}/);
  await expect(page.locator(".sig__recap")).toContainText("Marcory");
});
