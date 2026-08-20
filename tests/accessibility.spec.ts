import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pages } from "./viewports";

/**
 * Accessibility is checked at a narrow and a wide viewport, because several
 * failures only appear at one of them — contrast is layout-independent, but
 * reflow, focus order and hidden-content bugs are not.
 */
for (const vp of [
  { name: "mobile-360", width: 360, height: 640 },
  { name: "desktop-1280", width: 1280, height: 800 },
]) {
  test.describe(`${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const p of pages) {
      test(`${p.name} has no accessibility violations`, async ({ page }) => {
        await page.goto(p.path, { waitUntil: "networkidle" });
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        expect(
          results.violations,
          results.violations.length
            ? results.violations
                .map(
                  (v) =>
                    `[${v.impact}] ${v.id}: ${v.help}\n` +
                    v.nodes.slice(0, 3).map((n) => `    ${n.target.join(" ")}`).join("\n"),
                )
                .join("\n")
            : "",
        ).toEqual([]);
      });
    }
  });
}
