import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Montserrat, Merienda } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";
import { site, description } from "@/content/site";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, locales, localeTags, type Locale } from "@/i18n/config";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const merienda = Merienda({
  subsets: ["latin"],
  variable: "--font-merienda",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const title = `${site.name} — A Missionary Sending Church`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s | ${site.name}` },
    description: description[locale],
    alternates: {
      canonical: "./",
      // hreflang tells search engines these are the same page in two
      // languages, so neither cannibalises the other's ranking.
      languages: Object.fromEntries(
        locales.map((l) => [localeTags[l], `/${l}`]),
      ),
    },
    openGraph: {
      title,
      description: description[locale],
      url: `${site.url}/${locale}`,
      siteName: site.name,
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#060eff",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);

  return (
    <html
      lang={localeTags[locale as Locale]}
      className={`${montserrat.variable} ${merienda.variable}`}
    >
      <body className="font-sans flex min-h-screen flex-col">
        <StructuredData locale={locale as Locale} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.common.skipToContent}
        </a>
        <SiteHeader locale={locale as Locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale as Locale} />
      </body>
    </html>
  );
}
