import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { EventCard } from "@/components/cards";
import { events } from "@/content/events";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";
import { byDateDesc } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.events };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const today = new Date().toISOString().slice(0, 10);
  const sorted = byDateDesc(events);
  const upcoming = sorted.filter((e) => e.date >= today).reverse();
  const past = sorted.filter((e) => e.date < today);

  return (
    <>
      <PageHero
        title={dict.home.eventsTitle}
        subtitle={
          locale === "sw"
            ? "Matukio ya ibada, uinjilisti na makusanyiko. Kila mtu anakaribishwa."
            : "Worship experiences, outreaches and gatherings. Everyone is welcome."
        }
      />
      <div className="shell section-y">
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
              {dict.common.upcoming}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 2xl:grid-cols-4">
              {upcoming.map((e) => (
                <EventCard key={e.slug} event={e} locale={locale} />
              ))}
            </div>
          </section>
        )}
        {past.length > 0 && (
          <section className={upcoming.length > 0 ? "mt-16" : undefined}>
            <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
              {dict.common.past}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 2xl:grid-cols-4">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
