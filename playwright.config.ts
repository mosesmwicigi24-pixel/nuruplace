import { defineConfig, devices } from "@playwright/test";

/**
 * CI runs `npx playwright install chromium` and lets Playwright resolve its own
 * matching build. Set CHROMIUM_PATH only when running against a browser that
 * is already on the machine (a sandbox or an air-gapped runner).
 */
const executablePath = process.env.CHROMIUM_PATH || undefined;

/**
 * The responsive suite builds the site and serves the production output, so
 * what it measures is what visitors get — not the dev server, which ships
 * different CSS and no minification.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
    launchOptions: { executablePath },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: "http://127.0.0.1:3000/en",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
