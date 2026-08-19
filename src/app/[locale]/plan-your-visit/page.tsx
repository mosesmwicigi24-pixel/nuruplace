import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui";
import { ConnectionCard } from "@/components/connection-card";
import { visitIntro, visitQuestions, visitFacts } from "@/content/visit";
import { site } from "@/content/site";
import { sundayServices } from "@/content/services";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: getDictionary(locale).nav.planVisit,
    description: t(visitIntro, locale),
  };
}

export default async function PlanYourVisitPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero title={dict.nav.planVisit} subtitle={t(visitIntro, locale)} />

      {/* The four facts someone needs before deciding to come at all. */}
      <section className="border-b border-slate-200 bg-brand-50">
        <dl className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {visitFacts.map((fact) => (
            <div key={t(fact.label, "en")}>
              <dt className="text-xs font-bold uppercase tracking-wider text-brand-700">
                {t(fact.label, locale)}
              </dt>
              <dd className="mt-1 text-lg font-bold text-ink-900">
                {t(fact.value, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="space-y-10">
            {visitQuestions.map((q, i) => (
              <section key={i}>
                <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
                  {t(q.question, locale)}
                </h2>
                {t(q.answer, locale).map((para, j) => (
                  <p key={j} className="mt-3 leading-relaxed text-ink-700">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <section className="mt-14 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-ink-900">
              {locale === "sw" ? "Ratiba ya Jumapili" : "Sunday at a glance"}
            </h2>
            <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {sundayServices.map((s) => (
                <li key={t(s.name, "en")} className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-ink-900">
                    {t(s.name, locale)}
                  </span>
                  <span className="text-right text-sm text-ink-700">
                    {t(s.time, locale)}
                    {s.note && (
                      <span className="block text-brand-700">{t(s.note, locale)}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex gap-2 text-ink-700">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                {site.contact.address}, {site.contact.city}
              </p>
              <p className="flex gap-2 text-ink-700">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                {locale === "sw"
                  ? "Fika dakika kumi mapema ukipenda kupata kiti bila haraka."
                  : "Arrive ten minutes early if you would like to find a seat unhurried."}
              </p>
              <p className="flex flex-wrap gap-x-3 gap-y-1 text-ink-700">
                <a
                  href={site.contact.phoneHref}
                  className="flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Phone className="size-4" aria-hidden />
                  {site.contact.phone}
                </a>
                <a
                  href={site.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp
                </a>
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <ConnectionCard locale={locale} kind="connection-card" />
        </aside>
      </div>
    </>
  );
}
