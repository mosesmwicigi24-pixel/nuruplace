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
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3100",
    trace: "on-first-retry",
    launchOptions: { executablePath },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : [
        // A stand-in for the Pathway API, started FIRST so the site can read
        // the funds list while it renders. Without it PATHWAY_API_URL is unset,
        // /give falls back to its "not switched on yet" panel, and the
        // accessibility and responsive checks pass having never seen an input —
        // a green report about a page that was not the page under test.
        {
          command: "node tests/stub-pathway.mjs",
          url: "http://127.0.0.1:3111/v1/giving/funds",
          reuseExistingServer: false,
          timeout: 30_000,
        },
        {
          command: "npm run build && npm run start -- --port 3100",
          url: "http://127.0.0.1:3100/en",
          // Never reuse: a server left running from an earlier build serves stale
          // HTML against a fresh .next, which produces failures that look like
          // real regressions and are not. The suite has to tell the truth.
          reuseExistingServer: false,
          timeout: 240_000,
          env: {
            PATHWAY_API_URL: "http://127.0.0.1:3111/v1",
            PATHWAY_GIVING_SECRET: "playwright-giving-secret",
          },
        },
      ],
});
