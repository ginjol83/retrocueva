import { expect, test } from "@playwright/test";

test.describe("buscador de placa", () => {
  test("/placas redirige (308) a /base-de-datos", async ({ page }) => {
    await page.goto("/placas");
    await expect(page).toHaveURL(/\/base-de-datos$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Base de datos",
    );
  });

  test("unidad propia con conflicto GH documentado", async ({ page }) => {
    await page.goto("/base-de-datos/placas");
    await page
      .getByLabel("Número de serie de una Game Boy DMG")
      .fill("GH3783310");

    await expect(page.getByText("Tu unidad · verificado")).toBeVisible();
    await expect(page.getByText("GH3783310")).toBeVisible();
    await expect(page.getByText("placa observada es")).toBeVisible();
    await expect(page.locator("p").filter({ hasText: /^DMG CPU-07$/ })).toBeVisible();
    await expect(page.getByText("Rango de fábrica · GH").first()).toBeVisible();
  });

  test("serial solo en rangos, sin unidad propia", async ({ page }) => {
    await page.goto("/base-de-datos/placas");
    await page
      .getByLabel("Número de serie de una Game Boy DMG")
      .fill("GH1100000");

    await expect(page.getByText("Rango de fábrica · GH").first()).toBeVisible();
    await expect(page.getByText("Tu unidad · verificado")).toHaveCount(0);
  });

  test("serial desconocido muestra el estado de error", async ({ page }) => {
    await page.goto("/base-de-datos/placas");
    await page
      .getByLabel("Número de serie de una Game Boy DMG")
      .fill("ZZ999");

    await expect(
      page.getByText("Ningún rango ni unidad propia coincide"),
    ).toBeVisible();
  });

  test("Limpiar vuelve al mensaje inicial", async ({ page }) => {
    await page.goto("/base-de-datos/placas");
    const input = page.getByLabel("Número de serie de una Game Boy DMG");
    await input.fill("GH3783310");
    await expect(page.getByText("Rango de fábrica · GH").first()).toBeVisible();

    await page.getByRole("button", { name: "Limpiar" }).click();
    await expect(
      page.getByText("Introduce el número de serie"),
    ).toBeVisible();
    await expect(input).toHaveValue("");
  });
});
