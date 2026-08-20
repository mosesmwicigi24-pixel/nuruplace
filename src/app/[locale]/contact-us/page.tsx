import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui";
import { ConnectionCard } from "@/components/connection-card";
import { site } from "@/content/site";
import { sundayServices, weeklyServices } from "@/content/services";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.contact };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.contact}
        subtitle={
          locale === "sw"
            ? "Tungependa kusikia kutoka kwako. Njoo utembelee, tupigie simu, au tutumie ujumbe."
            : "We would love to hear from you. Come and visit, call, or send us a message."
        }
      />
      <div className="shell grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
            {locale === "sw" ? "Tupate wapi" : "Find us"}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-700">
            {locale === "sw"
              ? "The Good News Mission ni kanisa linalotuma wamisionari. Tunatamani kuonyesha upendo wa Kristo kwa watu wote kwa kushiriki Habari Njema ya Bwana wetu Yesu Kristo na kila mtu duniani kote. Wito wetu ni ule usemao “Enendeni”, badala ya kuwaomba watu waje na kubaki milele ndani ya kuta nne za jengo."
              : "The Good News Mission is a missionary sending church. We desire to show the love of Christ to all people through sharing the Good News of our Lord Jesus Christ with every soul across the world. Our calling is one that says “Go ye out”, rather than asking people to come and forever remain within the four walls of a building."}
          </p>

          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-bold text-ink-900">{dict.common.address}</p>
                <p className="text-ink-700">{site.contact.address}</p>
                <p className="text-ink-700">{site.contact.city}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-bold text-ink-900">{dict.common.phone}</p>
                <a href={site.contact.phoneHref} className="inline-flex min-h-6 items-center text-brand-600 hover:text-brand-700">
                  {site.contact.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MessageCircle className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-bold text-ink-900">WhatsApp</p>
                <a
                  href={site.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center text-brand-600 hover:text-brand-700"
                >
                  {site.contact.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-bold text-ink-900">{dict.common.email}</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex min-h-6 items-center break-all text-brand-600 hover:text-brand-700"
                >
                  {site.contact.email}
                </a>
              </div>
            </li>
          </ul>

          <h2 className="mt-12 text-xl font-extrabold tracking-tight text-ink-900">
            {locale === "sw" ? "Nyakati za ibada" : "Service times"}
          </h2>
          <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {[...sundayServices, ...weeklyServices].map((s) => (
              <li key={t(s.name, "en")} className="flex justify-between gap-4 py-4">
                <span className="font-bold text-ink-900">{t(s.name, locale)}</span>
                <span className="text-right text-sm text-ink-700">
                  {t(s.time, locale)}
                  {s.note && (
                    <span className="block text-brand-700">{t(s.note, locale)}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ConnectionCard locale={locale} kind="message" />
        </div>
      </div>
    </>
  );
}
