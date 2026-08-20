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
      <div className="shell section">
        {upcoming.length > 0 && (
          <section>
            <h2 className="t-sub">{dict.common.upcoming}</h2>
            <div className="grid-cards" style={{ marginTop: "var(--s-6)" }}>
              {upcoming.map((e) => (
                <EventCard key={e.slug} event={e} locale={locale} />
              ))}
            </div>
          </section>
        )}
        {past.length > 0 && (
          <section style={upcoming.length > 0 ? { marginTop: "var(--s-16)" } : undefined}>
            <h2 className="t-sub">{dict.common.past}</h2>
            <div className="grid-cards" style={{ marginTop: "var(--s-6)" }}>
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
