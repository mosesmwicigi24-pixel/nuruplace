"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitContact, type FormState } from "@/app/actions/contact";
import { getDictionary } from "@/i18n/dictionary";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";

const initial: FormState = { status: "idle" };

export function ConnectionCard({
  locale,
  kind = "connection-card",
}: {
  locale: Locale;
  kind?: "connection-card" | "message";
}) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const { form } = getDictionary(locale);

  const errorText: Record<string, string> = {
    required: form.errRequired,
    contactRequired: form.errContactRequired,
    tooLong: form.errTooLong,
    notConfigured: form.errNotConfigured,
    failed: form.errFailed,
  };

  if (state.status === "ok") {
    return (
      <div className="form-sent">
        <CheckCircle2 className="icon-lg" style={{ margin: "0 auto" }} aria-hidden />
        <p className="t-sub strong" style={{ marginTop: "var(--s-4)" }}>
          {form.sent}
        </p>
        <p className="t-small" style={{ marginTop: "var(--s-2)" }}>
          {form.sentBody}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="form">
      <h2 className="t-sub">{form.heading}</h2>
      <p className="t-small" style={{ marginTop: "var(--s-2)" }}>
        {form.lede}
      </p>

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="kind" value={kind} />

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="honeypot" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-grid">
        <Field id="name" name="name" label={form.name} required autoComplete="name" />
        <Field id="phone" name="phone" label={form.phone} type="tel" autoComplete="tel" />
      </div>

      <div className="field" style={{ marginTop: "var(--s-4)" }}>
        <label htmlFor="email">{form.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          className="input"
        />
        <p className="hint">{form.contactHint}</p>
      </div>

      <div className="field" style={{ marginTop: "var(--s-4)" }}>
        <label htmlFor="message">
          {form.message} <span className="req">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder={form.messagePlaceholder}
          className="textarea"
        />
      </div>

      <fieldset className="checks">
        <label className="check">
          <input type="checkbox" name="planningVisit" />
          <span>{form.planningVisit}</span>
        </label>
        <label className="check">
          <input type="checkbox" name="wantsPrayer" />
          <span>{form.wantsPrayer}</span>
        </label>
      </fieldset>

      {state.status === "error" && state.message && (
        <p role="alert" className="alert">
          <AlertCircle className="icon" aria-hidden />
          <span>{errorText[state.message]}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary btn-block"
        style={{ marginTop: "var(--s-6)" }}
      >
        {pending ? form.submitting : form.submit}
      </button>

      <p className="hint" style={{ marginTop: "var(--s-4)" }}>
        {form.orCall}:{" "}
        <a href={site.contact.phoneHref} className="link-inline">
          {site.contact.phone}
        </a>
        {" · "}
        <a
          href={site.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="link-inline"
        >
          WhatsApp
        </a>
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required && <span className="req">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={160}
        className="input"
      />
    </div>
  );
}
