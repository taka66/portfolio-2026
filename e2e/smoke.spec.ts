import { test, expect } from "@playwright/test";
import { EDGES, ENTITIES } from "../src/data/ontology";

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

    // desktop shows the whole graph: no saved query is preselected
    await expect(page.locator(".queries button.on")).toHaveCount(0);

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

    // instance labels themselves link out when an href exists
    await expect(panel.locator(".i-row .it a").first()).toHaveAttribute("href", /^https?:/);

    // related chip navigates to another entity
    await panel.locator(".chips button").first().click();
    await expect(panel.locator(".e-uri")).not.toHaveText(":wealthpark");

    // Escape closes
    await page.keyboard.press("Escape");
    await expect(page.locator(".entity.open")).toHaveCount(0);
  });

  test("rail exposes the external profile links", async ({ page }) => {
    await page.goto("/en");
    const links = page.locator(".head-links a");
    await expect(links).toHaveCount(3);
    await expect(links.filter({ hasText: ":note" })).toHaveAttribute("href", "https://note.com/takahirofujii");
    await expect(links.filter({ hasText: ":github" })).toHaveAttribute("href", "https://github.com/taka66");
  });

  test("gallery renders real illustration images", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByTestId("triples")).toHaveText(String(EDGES.length), { timeout: 15_000 });
    await page.evaluate(() => (window as unknown as { __open: (id: string) => void }).__open("illustration"));
    const images = page.locator(".gallery img");
    await expect(images).toHaveCount((ENTITIES.illustration.gallery ?? []).length);
    for (const img of await images.all()) {
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
  });
});

test("full profile CTA leads to the story renderer and links back into the graph", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("profile-cta").click();
  await expect(page).toHaveURL("/en/story");
  await expect(page.locator(".s-title")).toHaveText("Takahiro Fujii");
  await expect(page.locator(".story")).toContainText("Career");

  // a linked term opens the derived popover
  await page.locator('b[data-e="wealthpark"]').first().hover();
  const pop = page.getByTestId("story-pop");
  await expect(pop).toHaveClass(/show/);
  await expect(pop).toContainText(":wealthpark");

  // and the popover jumps into the graph with the panel open
  await pop.locator(".open").click();
  await expect(page).toHaveURL(/\/en\?e=wealthpark$/);
  await expect(page.locator(".entity.open .e-uri")).toHaveText(":wealthpark");
});

test.describe("japanese locale", () => {
  test.use({ locale: "ja-JP" });

  test("renders localized UI and the Japanese story", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("profile-cta")).toContainText("プロフィール全文");
    await expect(page.locator(".rail .head")).toContainText("プロダクトエンジニア");

    await page.getByTestId("profile-cta").click();
    await expect(page).toHaveURL("/story");
    await expect(page.locator(".s-title")).toHaveText("藤井 貴浩");
    await expect(page.locator(".story")).toContainText("経歴");
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
    await page.locator('.top a[hreflang="en"]').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("locale switch from an English browser", () => {
  // Regression: without the NEXT_LOCALE cookie the proxy falls back to
  // Accept-Language and bounces あ clicks straight back to /en.
  test("あ switches the top page to Japanese", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(800);
    await page.locator('.top a[hreflang="ja"]').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });

  test("あ switches a query view to Japanese and back", async ({ page }) => {
    await page.goto("/en/works");
    await page.locator('.top a[hreflang="ja"]').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL("/works");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");

    await page.locator('.top a[hreflang="en"]').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL("/en/works");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("seo surface", () => {
  test("sitemap, robots, OGP image and favicon are served", async ({ page, request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    const xml = await sitemap.text();
    for (const route of ["/works", "/design", "/story"]) expect(xml).toContain(route);
    expect(xml).toContain("/en/story");

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap:");

    await page.goto("/en");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /ogp\.png/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    expect((await request.get("/ogp.png")).ok()).toBe(true);
    expect((await request.get("/favicon.ico")).ok()).toBe(true);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow and the panel opens as a bottom sheet", async ({ page }) => {
    await page.goto("/en");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // no dead strip below the stage (regression: fixed-svh field height)
    const verticalGap = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    expect(verticalGap).toBeLessThanOrEqual(1);

    await page.evaluate(() => (window as unknown as { __open: (id: string) => void }).__open("koiki"));
    await expect(page.locator(".entity.open")).toBeVisible();
    await expect(page.locator(".entity.open")).toContainText("Koiki.fm");
  });

  test("mobile starts query-first with ?career preselected", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator(".queries button", { hasText: "?career" })).toHaveClass(/on/);
  });

  test("graph seeds sanely even when the field gets its size late", async ({ page }) => {
    // Regression: on iOS Safari the canvas could be measured at ~0 height,
    // piling every node onto one point — the sim exploded and clamped
    // node clusters into the four corners.
    await page.setViewportSize({ width: 390, height: 150 });
    await page.goto("/en");
    await page.waitForTimeout(600);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1500);

    type Rect = { x: number; y: number; w: number; h: number };
    type G = {
      w: number;
      h: number;
      nodes: { id: string; x: number; y: number; vx: number; vy: number; hidden: boolean }[];
      labels: Record<string, Rect>;
    };
    const g = await page.evaluate(() => (window as unknown as { __graph: () => G }).__graph());
    expect(g.w).toBeGreaterThan(200);
    expect(g.h).toBeGreaterThan(200);
    for (const n of g.nodes) {
      expect(n.x).toBeGreaterThanOrEqual(39);
      expect(n.x).toBeLessThanOrEqual(g.w - 39);
      expect(n.y).toBeGreaterThanOrEqual(65);
      expect(n.y).toBeLessThanOrEqual(g.h - 39);
      expect(Math.hypot(n.vx, n.vy)).toBeLessThanOrEqual(7.01);
    }
    // no pileups among what is actually on screen
    const shown = g.nodes.filter((n) => !n.hidden);
    expect(shown.length).toBeGreaterThan(5);
    let overlapping = 0;
    for (let i = 0; i < shown.length; i++)
      for (let j = i + 1; j < shown.length; j++) {
        if (Math.hypot(shown[i].x - shown[j].x, shown[i].y - shown[j].y) < 6) overlapping++;
      }
    expect(overlapping).toBe(0);

    // labels stay legible: no two visible labels may mash together,
    // and none may hide under the WHERE chips overlay at the top
    const rects = shown.map((n) => g.labels[n.id]).filter(Boolean);
    expect(rects.length).toBe(shown.length);
    for (const r of rects) expect(r.y).toBeGreaterThanOrEqual(54);
    let mashed = 0;
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const b = rects[j];
        const ov =
          Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
          Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
        if (ov > 0.4 * Math.min(a.w * a.h, b.w * b.h)) mashed++;
      }
    expect(mashed).toBe(0);
  });
});
