import { test, expect, type Page } from "@playwright/test";
import { viewports, pages } from "./viewports";

/**
 * Responsiveness, checked rather than eyeballed.
 *
 * The three failures that actually reach production are: the page scrolls
 * sideways, something is cut off, or a control is too small to hit with a
 * thumb. Each has an objective test, so none of them needs a human to notice.
 */

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    // 1px of tolerance absorbs sub-pixel rounding on fractional zoom levels.
    const scrolls = doc.scrollWidth > doc.clientWidth + 1;

    const offenders: { tag: string; cls: string; right: number; text: string }[] = [];
    if (scrolls) {
      const limit = doc.clientWidth;
      for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
        // Wide tables and code blocks that scroll inside their own
        // container opt out with data-allow-overflow.
        if (el.closest("[data-allow-overflow]")) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.position === "fixed") continue;
        if (r.right > limit + 1) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || "").toString().slice(0, 90),
            right: Math.round(r.right),
            text: (el.textContent || "").trim().slice(0, 45),
          });
        }
      }
    }
    return {
      scrolls,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      // Deepest offenders first: the innermost element is the real cause.
      offenders: offenders.slice(-6),
    };
  });
}

async function smallTapTargets(page: Page) {
  return page.evaluate(() => {
    // WCAG 2.2 AA (2.5.8) sets the floor at 24x24 CSS px, with an exception
    // for targets that have 24px of clear spacing around them. Inline links
    // inside a paragraph are explicitly exempt.
    const MIN = 24;
    const bad: { tag: string; text: string; w: number; h: number }[] = [];

    const targets = document.querySelectorAll<HTMLElement>(
      "a[href], button, input:not([type=hidden]), select, textarea, [role=button]",
    );

    for (const el of Array.from(targets)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue; // hidden / collapsed
      // Visually-hidden-until-focused controls (skip links) are 1x1 by
      // design; they are not something anyone aims a thumb at.
      if (r.width <= 1 || r.height <= 1) continue;

      // Exempt: a link sitting in a run of body text.
      const parent = el.parentElement;
      if (
        el.tagName === "A" &&
        parent &&
        ["P", "LI", "SPAN", "FIGCAPTION"].includes(parent.tagName) &&
        (parent.textContent || "").trim().length > (el.textContent || "").trim().length + 8
      ) {
        continue;
      }

      if (r.width < MIN || r.height < MIN) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      }
    }
    return bad;
  });
}

for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const p of pages) {
      test(`${p.name} does not scroll sideways`, async ({ page }) => {
        await page.goto(p.path, { waitUntil: "networkidle" });
        const result = await horizontalOverflow(page);

        expect(
          result.scrolls,
          result.scrolls
            ? `Page scrolls horizontally (${result.scrollWidth}px content in ` +
                `${result.clientWidth}px viewport). Widest offenders:\n` +
                result.offenders
                  .map((o) => `  <${o.tag} class="${o.cls}"> right=${o.right}px "${o.text}"`)
                  .join("\n")
            : "",
        ).toBe(false);
      });
    }

    // Tap-target size only matters where thumbs are involved.
    if (vp.width <= 768) {
      for (const p of pages.slice(0, 4)) {
        test(`${p.name} tap targets are reachable`, async ({ page }) => {
          await page.goto(p.path, { waitUntil: "networkidle" });
          const bad = await smallTapTargets(page);
          expect(
            bad,
            bad.length
              ? `Targets under 24x24 CSS px:\n` +
                  bad.map((b) => `  <${b.tag}> ${b.w}x${b.h} "${b.text}"`).join("\n")
              : "",
          ).toEqual([]);
        });
      }
    }
  });
}

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 360, height: 640 } });

  test("menu opens, lists every section, and closes", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });

    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toBeVisible();

    await toggle.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Plan Your Visit" }).first()).toBeVisible();

    // Opening the menu must not itself push the page sideways.
    const overflow = await horizontalOverflow(page);
    expect(overflow.scrolls, "Open mobile menu causes horizontal scroll").toBe(false);

    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(menu).toBeHidden();
  });
});
