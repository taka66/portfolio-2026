import { test, expect } from "@playwright/test";
import { EDGES } from "../src/data/ontology";

test.describe("ontology stage (desktop)", () => {
  test("loads, parses the full ontology, and reports no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.location().url.includes("/_vercel/")) return;
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(String(error)));

    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#graph")).toBeVisible();

    // the parse log commits every triple
    await expect(page.getByTestId("triples")).toHaveText(String(EDGES.length), { timeout: 15_000 });
    expect(errors).toEqual([]);
  });

  test("entity panel opens, translates, and navigates via related chips", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByTestId("triples")).toHaveText(String(EDGES.length), { timeout: 15_000 });

    // __open is the stable hook for canvas nodes (positions are simulated)
    await page.evaluate(() => (window as unknown as { __open: (id: string) => void }).__open("wealthpark"));
    const panel = page.locator(".entity.open");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("WealthPark");
    await expect(panel).toContainText(":VPoE → :SVP → :CTO");

    // related chip navigates to another entity
    await panel.locator(".chips button").first().click();
    await expect(panel.locator(".e-uri")).not.toHaveText(":wealthpark");

    // Escape closes
    await page.keyboard.press("Escape");
    await expect(page.locator(".entity.open")).toHaveCount(0);
  });

  test("gallery renders real illustration images", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByTestId("triples")).toHaveText(String(EDGES.length), { timeout: 15_000 });
    await page.evaluate(() => (window as unknown as { __open: (id: string) => void }).__open("illustration"));
    const images = page.locator(".gallery img");
    await expect(images).toHaveCount(3);
    for (const img of await images.all()) {
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
  });
});

test.describe("i18n routing", () => {
  test.use({ locale: "ja-JP" });

  test("default locale is served unprefixed with lang=ja", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });

  test("/ja redirects to the canonical unprefixed URL", async ({ page }) => {
    await page.goto("/ja");
    await expect(page).toHaveURL("/");
  });

  test("locale switch is a full page navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1200); // let any prefetch settle
    await page.locator('.topbar a[hreflang="en"]').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow and the panel opens as a bottom sheet", async ({ page }) => {
    await page.goto("/en");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    await page.evaluate(() => (window as unknown as { __open: (id: string) => void }).__open("koiki"));
    await expect(page.locator(".entity.open")).toBeVisible();
    await expect(page.locator(".entity.open")).toContainText("Koiki.fm");
  });
});
