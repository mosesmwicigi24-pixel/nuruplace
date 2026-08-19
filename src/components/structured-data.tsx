import { site } from "@/content/site";
import { sundayServices, weeklyServices } from "@/content/services";

/**
 * schema.org/Church JSON-LD. This is what search engines read to answer
 * "church near Kayole Junction" and to show service times directly in results,
 * so it carries the address, geo point, contact details and the weekly schedule.
 */
export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
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
        name: s.name,
        description: s.note ? `${s.time} · ${s.note}` : s.time,
      })),
      ...weeklyServices.map((s) => ({
        "@type": "OpeningHoursSpecification",
        name: s.name,
        description: s.note ? `${s.time} · ${s.note}` : s.time,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // The object is built here from our own content files — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
