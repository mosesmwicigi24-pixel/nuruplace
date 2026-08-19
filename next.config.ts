import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats first — on a metered connection this is the single
    // biggest saving available on photographs.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Images still served by the current nuruplace.org CMS. Remove once
      // every asset has been migrated into /public.
      { protocol: "https", hostname: "nuruplace.org" },
    ],
  },
};

export default nextConfig;
