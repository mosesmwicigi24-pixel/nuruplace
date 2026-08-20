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
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-brand-600" aria-hidden />
        <p className="mt-4 text-lg font-bold text-ink-900">{form.sent}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{form.sentBody}</p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
        {form.heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{form.lede}</p>

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="kind" value={kind} />
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="name" name="name" label={form.name} required autoComplete="name" />
        <Field id="phone" name="phone" label={form.phone} type="tel" autoComplete="tel" />
      </div>
      <div className="mt-4">
        <Field id="email" name="email" label={form.email} type="email" autoComplete="email" />
        <p className="mt-1.5 text-xs text-ink-mute">{form.contactHint}</p>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="block text-sm font-semibold text-ink-900">
          {form.message} <span className="text-accent-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder={form.messagePlaceholder}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <fieldset className="mt-4 space-y-2">
        <Check name="planningVisit" label={form.planningVisit} />
        <Check name="wantsPrayer" label={form.wantsPrayer} />
      </fieldset>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mt-4 flex gap-2 rounded-lg bg-accent-50 p-3 text-sm text-accent-600"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{errorText[state.message]}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? form.submitting : form.submit}
      </button>

      <p className="mt-4 text-xs text-ink-mute">
        {form.orCall}:{" "}
        <a href={site.contact.phoneHref} className="font-semibold text-brand-600">
          {site.contact.phone}
        </a>
        {" · "}
        <a
          href={site.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-600"
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
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label} {required && <span className="text-accent-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={160}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

function Check({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-ink-700">
      <input
        type="checkbox"
        name={name}
        className="mt-0.5 size-6 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
      />
      <span>{label}</span>
    </label>
  );
}
