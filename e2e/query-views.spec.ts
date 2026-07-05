import { test, expect } from "@playwright/test";
import { worksRows } from "../src/lib/queries";
import { ENTITIES } from "../src/data/ontology";

test.describe("?works view", () => {
  test("renders the executed query with all instances", async ({ page }) => {
    await page.goto("/en/works");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator(".qhead")).toContainText("?works");
    await expect(page.getByTestId("works-count")).toHaveText(String(worksRows().length));
    await expect(page.locator(".qrow").first()).toBeVisible();
  });

  test("WHERE chips filter the result set", async ({ page }) => {
    await page.goto("/en/works");
    const total = worksRows().length;
    const talksOnly = worksRows().filter((r) => r.source === "talks").length;

    await page.locator(".where button", { hasText: ":talks" }).click();
    await expect(page.getByTestId("works-count")).toHaveText(String(talksOnly));
    await expect(page.locator(".qrow")).toHaveCount(talksOnly);

    await page.locator(".where button", { hasText: "ALL" }).click();
    await expect(page.locator(".qrow")).toHaveCount(total);
  });

  test("the note cross-link jumps to the :note entity in the graph", async ({ page }) => {
    await page.goto("/en/works");
    await expect(page.locator(".qxnote")).toContainText(":writes");
    await page.locator(".qxnote a", { hasText: "open :note" }).click();
    await expect(page).toHaveURL(/\/en\?e=note$/);
    await expect(page.locator(".entity.open .e-uri")).toHaveText(":note");
  });

  test("source chip jumps into the graph and opens the entity panel", async ({ page }) => {
    await page.goto("/en/works");
    await page.locator('.qrow .src', { hasText: ":talks" }).first().click();
    await expect(page).toHaveURL(/\/en\?e=talks$/);
    await expect(page.locator(".entity.open .e-uri")).toHaveText(":talks");
  });
});

test.describe("?design view", () => {
  test("renders every gallery work with loaded images", async ({ page }) => {
    await page.goto("/en/design");
    const count = (ENTITIES.illustration.gallery ?? []).length;
    await expect(page.locator(".qhead")).toContainText("?design");
    const images = page.locator(".qgrid img");
    await expect(images).toHaveCount(count);
    for (const img of (await images.all()).slice(0, 3)) {
      await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  });
});

test.describe("navigation between views", () => {
  test.use({ locale: "ja-JP" });

  test("stage links to ?works, top nav returns to :fujii, all in Japanese", async ({ page }) => {
    await page.goto("/");
    await page.locator('.top nav a', { hasText: "?works" }).click();
    await expect(page).toHaveURL("/works");
    await expect(page.locator(".qsub")).toContainText("講演");

    await page.locator(".top nav a", { hasText: ":fujii" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId("profile-cta")).toBeVisible();
  });
});
