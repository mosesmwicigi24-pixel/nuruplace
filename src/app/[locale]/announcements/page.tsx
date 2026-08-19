import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState, PageHero } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.announcements };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.announcements}
        subtitle={locale === "sw" ? "Matangazo kwa familia ya kanisa — mabadiliko ya ibada, mikutano na habari." : "Notices for the church family — service changes, meetings and news."}
      />
      <EmptyState
        title={dict.common.comingSoon}
        message={locale === "sw" ? "Matangazo yataonekana hapa mara yatakapoongezwa." : "Announcements will appear here once they are added."}
      />
    </>
  );
}
