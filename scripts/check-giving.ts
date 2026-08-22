/**
 * Assertions about the two pieces of giving that can be wrong silently.
 *
 *   node --experimental-strip-types scripts/check-giving.ts
 *
 * Run in CI beside the compose check, for the same reason that one exists: both
 * guard a failure that is invisible until it costs something real. A phone
 * parser that accepts a landline sends a payment request nobody can answer. An
 * amount parser that goes through a float turns 1500.10 into 1500.09 and leaves
 * a ledger that will not reconcile — off by one shilling, every time, and
 * nobody notices until the treasurer does.
 *
 * Both are pure functions of a string, so there is no excuse for not executing
 * them. The last block deliberately breaks each one and asserts that this file
 * NOTICES: a check that cannot fail is worse than no check, because it
 * manufactures confidence.
 */
import {
  normalizeKenyanMobile,
  parseAmountToMinor,
  GIVING_MIN_MINOR,
  GIVING_MAX_MINOR,
} from "../src/lib/money.ts";

let failures = 0;
function check(label: string, got: unknown, want: unknown): void {
  const ok = got === want;
  if (!ok) failures += 1;
  const line = `${ok ? "  ok  " : "  FAIL"}  ${label}`;
  console.log(ok ? line : `${line}  → got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`);
}

console.log("Phone — the four ways one person writes their own number:");
for (const written of [
  "0722000111",
  "722000111",
  "254722000111",
  "+254722000111",
  "+254 722 000 111",
  "0722-000-111",
]) {
  check(written, normalizeKenyanMobile(written), "+254722000111");
}
check("0110000111 (the 01 range)", normalizeKenyanMobile("0110000111"), "+254110000111");

console.log("\nPhone — numbers that must never receive a payment request:");
for (const junk of [
  "", // empty
  "020 123456", // Nairobi landline
  "0722000", // too short
  "07220001111", // too long
  "+1 555 0100", // not Kenyan
  "0822000111", // no such mobile prefix
  "abc",
  "12345678901234",
]) {
  check(`reject ${JSON.stringify(junk)}`, normalizeKenyanMobile(junk), null);
}

console.log("\nAmount — integer minor units, never a float:");
check("500", parseAmountToMinor("500"), 50_000);
check("1,500", parseAmountToMinor("1,500"), 150_000);
check("1 500", parseAmountToMinor("1 500"), 150_000);
check("1500.50", parseAmountToMinor("1500.50"), 150_050);
check("1500.5", parseAmountToMinor("1500.5"), 150_050);
check("0.10", parseAmountToMinor("0.10"), 10);
// The float trap, with values chosen by SEARCHING for ones that actually
// spring it rather than by picking a plausible-looking decimal. `1500.10`
// looks like the classic example and is not: 1500.1 * 100 rounds UP to
// 150010.00000000003, so a float implementation passes that case and the check
// proves nothing. These three are genuinely wrong under `Number(s) * 100`:
//   2.01   → 200.99999999999997 → truncates to 200, a cent short
//   10.03  → 1002.9999999999999 → 1002
//   512.05 → 51204.99999999999  → 51204
check("2.01 — float gives 200", parseAmountToMinor("2.01"), 201);
check("10.03 — float gives 1002", parseAmountToMinor("10.03"), 1003);
check("512.05 — float gives 51204", parseAmountToMinor("512.05"), 51_205);
check("1500.10", parseAmountToMinor("1500.10"), 150_010);
check("150000 at the M-Pesa ceiling", parseAmountToMinor("150000"), GIVING_MAX_MINOR);
check("10 at the floor", parseAmountToMinor("10"), GIVING_MIN_MINOR);

console.log("\nAmount — refused rather than guessed at:");
for (const junk of ["", "0", "0.00", "-5", "1.234", "1e5", "abc", "1,00,0.5.5", "١٢٣"]) {
  check(`reject ${JSON.stringify(junk)}`, parseAmountToMinor(junk), null);
}

// ---------------------------------------------------------------------------
// Prove this file can fail.
// ---------------------------------------------------------------------------
console.log("\nSelf-test — the checks above must be capable of failing:");
{
  const before = failures;
  check("(deliberately wrong) 500 → 1", parseAmountToMinor("500"), 1);
  check("(deliberately wrong) landline accepted", normalizeKenyanMobile("020 123456"), "+254201234");
  const detected = failures - before;
  failures = before; // the two deliberate failures are not real ones
  if (detected !== 2) {
    console.log(`  FAIL  self-test caught ${detected} of 2 planted failures — this file cannot be trusted`);
    failures += 1;
  } else {
    console.log("  ok    both planted failures were caught");
  }
}

console.log(
  failures === 0
    ? "\nGiving parsers: all checks pass."
    : `\nGiving parsers: ${failures} FAILURE(S).`,
);
process.exit(failures === 0 ? 0 : 1);
