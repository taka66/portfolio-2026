import { defineConfig } from "@playwright/test";

// Dedicated port so local runs don't collide with other dev servers.
// CI runs against the production build (next start); local runs use the
// dev server so no build step is required.
const PORT = 3200;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Single worker on CI: canvas rendering on the shared runner starves
  // parallel pages (lesson learned in portfolio-2025).
  workers: process.env.CI ? 1 : undefined,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: "on-first-retry",
  },
  webServer: {
    command: process.env.CI ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
