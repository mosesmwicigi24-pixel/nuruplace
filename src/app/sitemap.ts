import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { ministries } from "@/content/ministries";
import { posts } from "@/content/posts";
import { locales, localeTags } from "@/i18n/config";

const paths = [
  "",
  "/plan-your-visit",
  "/about-us",
  "/our-faith",
  "/our-statutes",
  "/our-strategic-plan",
  "/message-from-our-pastor",
  "/message-from-our-first-lady",
  "/our-leadership",
  "/ministries",
  "/sermons",
  "/events",
  "/blog",
  "/announcements",
  "/gallery",
  "/videos",
  "/resources",
  "/shop",
  "/contact-us",
  ...ministries.map((m) => `/ministries/${m.slug}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.url}/${locale}${path}`,
      // Tell crawlers each page has a sibling in the other language.
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [localeTags[l], `${site.url}/${l}${path}`]),
        ),
      },
    })),
  );
}
