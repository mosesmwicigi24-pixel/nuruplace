import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, StaticPageBody } from "@/components/ui";
import { firstLadyMessagePage } from "@/content/pages";
import { t } from "@/content/localized";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t(firstLadyMessagePage.title, locale) };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <PageHero
        title={t(firstLadyMessagePage.title, locale)}
        subtitle={firstLadyMessagePage.intro ? t(firstLadyMessagePage.intro, locale) : undefined}
      />
      <StaticPageBody page={firstLadyMessagePage} locale={locale} />
    </>
  );
}
