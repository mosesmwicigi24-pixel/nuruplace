import type { MetadataRoute } from "next";
import { site, description } from "@/content/site";
import { defaultLocale } from "@/i18n/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — A Missionary Sending Church`,
    short_name: site.shortName,
    description: description[defaultLocale],
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#060eff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
