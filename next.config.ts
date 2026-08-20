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

  // Set here rather than in vercel.json so they travel with the app if it
  // ever moves off Vercel. No Content-Security-Policy yet: a strict one needs
  // nonces wired through, and a loose one is theatre.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // The site never needs these. Denying them is one less thing a
            // visitor has to trust us about, on a site that asks for a name
            // and a phone number.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
