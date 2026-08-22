"use client";

import { useActionState, useId, useState } from "react";
import { CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { submitGift, type GiveState } from "@/app/actions/give";
import { getDictionary } from "@/i18n/dictionary";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";

const initial: GiveState = { status: "idle" };

/** Amounts people actually give, in whole shillings. Any other amount is typed. */
const QUICK = [200, 500, 1000, 2000, 5000] as const;

type Fund = { code: string; name: string };

/**
 * One idempotency key per attempt at giving, and that is the whole point.
 *
 * Two failure modes sit on either side of this value:
 *
 *  - Mint a key per SUBMIT and an impatient double-click becomes two STK
 *    pushes and two debits.
 *  - Derive a key from the amount and number, and someone who genuinely means
 *    to give KES 500 twice is charged once and told nothing.
 *
 * A key that lives exactly as long as one filled-in form gets both right: a
 * retry after an error reuses it, and "Give again" remounts the form, minting
 * a new one.
 */
function newKey(): string {
  // randomUUID needs a secure context; over plain http in local dev it is
  // undefined, and the form still has to work there.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 10)).join("");
}

/**
 * The key lives HERE, on a wrapper, rather than on the `<form>` element inside
 * the component that owns `useActionState`.
 *
 * A `key` on the form element would remount the DOM node and leave the hook
 * untouched — `state.status` would stay "ok", the success branch would return
 * early forever, and "Give again" would appear to do nothing. Remounting the
 * component that HOLDS the hook is what actually resets it.
 */
export function GiveForm({ locale, funds }: { locale: Locale; funds: Fund[] }) {
  const [attempt, setAttempt] = useState(newKey);
  return (
    <GiveAttempt
      key={attempt}
      locale={locale}
      funds={funds}
      idempotencyKey={attempt}
      onGiveAgain={() => setAttempt(newKey())}
    />
  );
}

function GiveAttempt({
  locale,
  funds,
  idempotencyKey,
  onGiveAgain,
}: {
  locale: Locale;
  funds: Fund[];
  idempotencyKey: string;
  onGiveAgain: () => void;
}) {
  const { give } = getDictionary(locale);
  const [state, action, pending] = useActionState(submitGift, initial);
  const [amount, setAmount] = useState("");
  const uid = useId();

  const errorText: Record<string, string> = {
    amountRequired: give.errAmountRequired,
    amountRange: give.errAmountRange,
    phoneRequired: give.errPhoneRequired,
    fundRequired: give.errFundRequired,
    tooLong: give.errTooLong,
    notConfigured: give.errNotConfigured,
    failed: give.errFailed,
  };

  if (state.status === "ok") {
    return (
      <div className="form-sent">
        <CheckCircle2 className="icon-lg" style={{ margin: "0 auto" }} aria-hidden />
        <p className="t-sub strong" style={{ marginTop: "var(--s-4)" }}>
          {give.sent}
        </p>
        <p className="t-small" style={{ marginTop: "var(--s-2)" }}>
          {give.sentBody.replace("{phone}", state.sentTo ?? "")}
        </p>
        <p className="hint" style={{ marginTop: "var(--s-4)" }}>
          {give.sentNote}
        </p>
        <button type="button" className="btn btn-outline" style={{ marginTop: "var(--s-6)" }} onClick={onGiveAgain}>
          {give.giveAgain}
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="form">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="honeypot" aria-hidden>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label htmlFor={`${uid}-fund`}>
          {give.fund} <span className="req">*</span>
        </label>
        <select id={`${uid}-fund`} name="fund" required className="input" defaultValue={funds[0]?.code}>
          {funds.map((f) => (
            <option key={f.code} value={f.code}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="give-amounts">
        <legend className="t-small strong">{give.quickAmounts}</legend>
        <div className="give-chips">
          {QUICK.map((v) => (
            <button
              key={v}
              type="button"
              className={`give-chip${amount === String(v) ? " is-current" : ""}`}
              aria-pressed={amount === String(v)}
              onClick={() => setAmount(String(v))}
            >
              {v.toLocaleString("en-KE")}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field" style={{ marginTop: "var(--s-4)" }}>
        <label htmlFor={`${uid}-amount`}>
          {give.amount} <span className="req">*</span>
        </label>
        <div className="input-prefixed">
          <span className="input-prefix" aria-hidden>
            KES
          </span>
          {/* `inputMode` rather than type=number: a numeric keypad on a phone,
              without the spinner, the scroll-wheel accidents, or the browsers
              that silently discard a value they consider malformed. */}
          <input
            id={`${uid}-amount`}
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            required
            maxLength={12}
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <p className="hint">{give.amountHint}</p>
      </div>

      <div className="field" style={{ marginTop: "var(--s-4)" }}>
        <label htmlFor={`${uid}-phone`}>
          {give.phone} <span className="req">*</span>
        </label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={20}
          placeholder="0722 000 111"
          className="input"
        />
        <p className="hint">{give.phoneHint}</p>
      </div>

      <div className="form-grid" style={{ marginTop: "var(--s-4)" }}>
        <div className="field">
          <label htmlFor={`${uid}-name`}>{give.name}</label>
          <input id={`${uid}-name`} name="name" type="text" autoComplete="name" maxLength={120} className="input" />
          <p className="hint">{give.nameHint}</p>
        </div>
        <div className="field">
          <label htmlFor={`${uid}-email`}>{give.email}</label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" maxLength={255} className="input" />
          <p className="hint">{give.emailHint}</p>
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="alert">
          <AlertCircle className="icon" aria-hidden />
          <span>
            {state.message === "throttled"
              ? give.errThrottled.replace("{minutes}", String(state.waitMinutes ?? 10))
              : state.message === "rejected"
                ? (state.detail ?? give.errFailed)
                : errorText[state.message]}
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary btn-block"
        style={{ marginTop: "var(--s-6)" }}
      >
        <Smartphone className="icon" aria-hidden />
        <span>{pending ? give.submitting : give.submit}</span>
      </button>

      <p className="hint" style={{ marginTop: "var(--s-4)" }}>
        {give.privacy}
      </p>
      <p className="hint" style={{ marginTop: "var(--s-2)" }}>
        <a href={site.contact.phoneHref} className="link-inline">
          {site.contact.phone}
        </a>
      </p>
    </form>
  );
}
