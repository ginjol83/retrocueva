import { expect, test } from "@playwright/test";

test.describe("portada", () => {
  test("muestra el H1 con la keyword del sitio", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText("RETROCUEVA");
    await expect(page.getByText("Hardware", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Software", { exact: true }).first()).toBeVisible();
  });

  test("el buscador filtra en vivo y sincroniza ?q= en la URL", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Buscar en la colección").fill("casio");
    await expect(page).toHaveURL(/q=casio/);

    const results = page.getByRole("status");
    await expect(results).toContainText("Resultados para «casio»");
    await expect(results).toContainText("Casio MX-10");
  });

  test("resultados compartibles abriendo /?q= directamente", async ({
    page,
  }) => {
    await page.goto(`/?q=${encodeURIComponent("space invaders")}`);
    const results = page.getByRole("status");
    await expect(results).toContainText("Resultados para");
    await expect(results).toContainText("Space Invaders");
  });

  test("sin coincidencias muestra el estado vacío", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Buscar en la colección").fill("zzzzzzz");
    await expect(page.getByRole("status")).toContainText(
      "Nada coincide con esa búsqueda",
    );
  });
});
