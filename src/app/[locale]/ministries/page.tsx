import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { MinistryCard } from "@/components/cards";
import { ministries } from "@/content/ministries";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.ministries };
}

export default async function MinistriesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.home.ministriesTitle}
        subtitle={
          locale === "sw"
            ? "Kuna nafasi kwako ya kuhudumu, kukua na kuwa sehemu. Kila idara ipo ili kuwasaidia watu kukutana na Kristo na kuwa vile Mungu alivyowaumba."
            : "There is a place for you to serve, grow and belong. Every department exists to help people meet Christ and become who God made them to be."
        }
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <MinistryCard key={m.slug} ministry={m} locale={locale} />
          ))}
        </div>
      </div>
    </>
  );
}
