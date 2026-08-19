import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, StaticPageBody } from "@/components/ui";
import { aboutPage } from "@/content/pages";
import { t } from "@/content/localized";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t(aboutPage.title, locale) };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <PageHero
        title={t(aboutPage.title, locale)}
        subtitle={aboutPage.intro ? t(aboutPage.intro, locale) : undefined}
      />
      <StaticPageBody page={aboutPage} locale={locale} />
    </>
  );
}
