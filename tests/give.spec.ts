import { test, expect } from "@playwright/test";

/**
 * The give flow, in a browser, against the stub Pathway API (tests/stub-pathway.mjs).
 *
 * What is worth testing here is not that a form submits — it is the handful of
 * moments where this page could take someone's decision to give and lose it:
 *
 *  - a mistyped number that would ring nobody, caught before it is sent;
 *  - a throttled attempt, which must say "wait a few minutes" rather than
 *    "something went wrong";
 *  - a double submit, which must not become two payment requests;
 *  - and the confirmation, which must name the number it actually went to, so
 *    a person who typed the wrong one can see that they did.
 *
 * The stub verifies the HMAC, so every pass here also proves the signing code
 * ran and produced something the receiver accepts.
 */

const GIVE = "/en/give";

/**
 * The form's own error line.
 *
 * NOT `getByRole("alert")`: Next renders a permanently-present, empty
 * `#__next-route-announcer__` with role="alert" on every page, so the role
 * selector matches two elements and Playwright refuses to guess which. Scoping
 * to the form's element is both unambiguous and what a visitor actually reads.
 */
const alertOf = (page: import("@playwright/test").Page) => page.locator("p.alert");

async function fill(
  page: import("@playwright/test").Page,
  { amount, phone }: { amount: string; phone: string },
) {
  await page.getByLabel(/^Amount/).fill(amount);
  await page.getByLabel(/^M-Pesa number/).fill(phone);
}

test.describe("giving from the website", () => {
  test("the form renders the funds the API offers", async ({ page }) => {
    await page.goto(GIVE, { waitUntil: "networkidle" });
    const fund = page.getByLabel(/What is this gift for/);
    await expect(fund).toBeVisible();
    await expect(fund.locator("option")).toHaveText(["Offering", "Tithe", "Missions"]);
  });

  test("a quick-amount chip fills the amount field", async ({ page }) => {
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "1,000", exact: true }).click();
    await expect(page.getByLabel(/^Amount/)).toHaveValue("1000");
  });

  test("a successful gift names the number it went to", async ({ page }) => {
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "0722000111" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(page.getByText("Check your phone")).toBeVisible();
    // The normalised number, so someone who typed a wrong digit can see it.
    await expect(page.getByText("+254722000111")).toBeVisible();
  });

  test("the flow CLOSES — it thanks the giver once the gift settles", async ({ page }) => {
    // The gap this fixes: the page used to stop at "check your phone" and stay
    // there forever. Someone paid and the site never acknowledged it.
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "0722000111" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(page.getByText("Check your phone")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Thank you" })).toBeVisible({ timeout: 15_000 });
    // Their own figure, in the units they typed.
    await expect(page.getByText(/KES 500\.00/)).toBeVisible();
    await expect(page.getByText(/Offering/)).toBeVisible();
    // The M-Pesa code, so it can be matched against Safaricom's message.
    await expect(page.getByText(/SJ12ABC345/)).toBeVisible();
    await expect(page.getByText(/2 Corinthians 9:8/)).toBeVisible();
  });

  test("a cancelled gift says so, and does not claim money was taken", async ({ page }) => {
    // …777 makes the stub report a failed gift.
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "0722000777" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(page.getByRole("heading", { name: /did not go through/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Nothing has been taken/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("a gift that never resolves keeps waiting rather than claiming failure", async ({ page }) => {
    // …666 stays processing forever. Someone whose money may yet leave must not
    // be told it failed.
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "0722000666" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(page.getByText(/Waiting for your confirmation/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Thank you" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /did not go through/i })).toHaveCount(0);
  });

  test("Swahili closes the loop too", async ({ page }) => {
    await page.goto("/sw/give", { waitUntil: "networkidle" });
    await page.getByLabel(/^Kiasi/).fill("500");
    await page.getByLabel(/Nambari ya M-Pesa/).fill("0722000111");
    await page.getByRole("button", { name: /^Toa$/ }).click();
    await expect(page.getByRole("heading", { name: "Asante" })).toBeVisible({ timeout: 15_000 });
  });

  test("a number that is not a Kenyan mobile is refused before anything is sent", async ({ page }) => {
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "020 123456" }); // a landline
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(alertOf(page)).toContainText("Kenyan mobile number");
    await expect(page.getByText("Check your phone")).toHaveCount(0);
  });

  test("an amount above the M-Pesa ceiling is refused", async ({ page }) => {
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "200000", phone: "0722000111" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(alertOf(page)).toContainText("150,000");
  });

  test("a throttled attempt says how long to wait, not 'something went wrong'", async ({ page }) => {
    // The stub returns 429 with Retry-After: 540 for a number ending 999.
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "0722000999" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(alertOf(page)).toContainText("9 minutes");
  });

  test("the API's own reason reaches the visitor rather than being flattened", async ({ page }) => {
    // The stub returns a 400 with a human sentence for a number ending 888.
    await page.goto(GIVE, { waitUntil: "networkidle" });
    await fill(page, { amount: "500", phone: "0722000888" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(alertOf(page)).toContainText("above the M-Pesa limit");
  });

  test("the idempotency key is stable across a retry and NEW after a success", async ({ page }) => {
    // This is the difference between "a double-click charged me twice" and
    // "I meant to give again and it silently did nothing".
    const keys: string[] = [];
    await page.goto(GIVE, { waitUntil: "networkidle" });

    const keyNow = () => page.locator('input[name="idempotencyKey"]').inputValue();

    // A failed attempt keeps the key: a retry is the same gift.
    keys.push(await keyNow());
    await fill(page, { amount: "500", phone: "020 123456" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(alertOf(page)).toBeVisible();
    keys.push(await keyNow());
    expect(keys[1]).toBe(keys[0]);

    // A success followed by "Give again" mints a new one: a second gift is a
    // second gift, not a replay of the first.
    await fill(page, { amount: "500", phone: "0722000111" });
    await page.getByRole("button", { name: /^Give$/ }).click();
    await expect(page.getByText("Check your phone")).toBeVisible();
    await page.getByRole("button", { name: "Give again" }).click();
    await expect(page.getByLabel(/^Amount/)).toBeVisible();
    const afterAgain = await keyNow();
    expect(afterAgain).not.toBe(keys[0]);
    expect(afterAgain).toMatch(/^[a-zA-Z0-9_-]{8,64}$/);
  });

  test("Swahili renders the Swahili form, not a fallback", async ({ page }) => {
    await page.goto("/sw/give", { waitUntil: "networkidle" });
    await expect(page.getByLabel(/Nambari ya M-Pesa/)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Toa$/ })).toBeVisible();
  });

  test("the header Give button reaches this page in the current language", async ({ page }) => {
    await page.goto("/sw", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Toa", exact: true }).first().click();
    await expect(page).toHaveURL(/\/sw\/give$/);
  });
});
