import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { SermonCard } from "@/components/cards";
import { sermons } from "@/content/sermons";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";
import { byDateDesc } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.sermons };
}

export default async function SermonsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageHero
        title={getDictionary(locale).nav.sermons}
        subtitle={
          locale === "sw"
            ? "Mafundisho kutoka makusanyiko yetu ya Jumapili. Sikiliza, utiwe moyo, na ushiriki na mtu anayehitaji."
            : "Teaching from our Sunday gatherings. Listen, be encouraged, and share with someone who needs it."
        }
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {byDateDesc(sermons).map((s) => (
            <SermonCard key={s.slug} sermon={s} locale={locale} />
          ))}
        </div>
      </div>
    </>
  );
}
