import { site, description } from "@/content/site";
import { sundayServices, weeklyServices } from "@/content/services";
import { t } from "@/content/localized";
import type { Locale } from "@/i18n/config";

/**
 * schema.org/Church JSON-LD. This is what search engines read to answer
 * "church near Kayole Junction" and to show service times directly in results,
 * so it carries the address, geo point, contact details and weekly schedule.
 */
export function StructuredData({ locale }: { locale: Locale }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: site.name,
    alternateName: site.shortName,
    description: description[locale],
    url: `${site.url}/${locale}`,
    telephone: site.contact.phone,
    email: site.contact.email,
    inLanguage: ["en-KE", "sw-KE"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    geo: {
      // Saika Estate, off Kangundo Road, near Kayole Junction.
      "@type": "GeoCoordinates",
      latitude: -1.2745,
      longitude: 36.9256,
    },
    sameAs: site.socials.map((s) => s.href),
    openingHoursSpecification: [
      ...sundayServices.map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Sunday",
        name: t(s.name, locale),
        description: s.note
          ? `${t(s.time, locale)} · ${t(s.note, locale)}`
          : t(s.time, locale),
      })),
      ...weeklyServices.map((s) => ({
        "@type": "OpeningHoursSpecification",
        name: t(s.name, locale),
        description: s.note
          ? `${t(s.time, locale)} · ${t(s.note, locale)}`
          : t(s.time, locale),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Built here from our own content files — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
