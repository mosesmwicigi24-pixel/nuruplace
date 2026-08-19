import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState, PageHero } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.gallery };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.gallery}
        subtitle={locale === "sw" ? "Nyakati kutoka ibada zetu, uinjilisti na matukio." : "Moments from our services, outreaches and events."}
      />
      <EmptyState
        title={dict.common.comingSoon}
        message={locale === "sw" ? "Ongeza picha katika /public/gallery na uziorodheshe katika faili la maudhui ili zionekane hapa." : "Add photographs to /public/gallery and list them in a content file to show them here."}
      />
    </>
  );
}
