/**
 * The screens this church's visitors actually use.
 *
 * 320px is still the floor: low-end Androids and older iPhones remain common
 * in Nairobi, and they are exactly the devices belonging to the people the
 * church most wants to reach. If the site breaks anywhere, it breaks there.
 */
export const viewports = [
  { name: "small-android-320", width: 320, height: 568 },
  { name: "android-360", width: 360, height: 640 },
  { name: "iphone-390", width: 390, height: 844 },
  { name: "pixel-412", width: 412, height: 915 },
  { name: "tablet-portrait-768", width: 768, height: 1024 },
  { name: "tablet-landscape-1024", width: 1024, height: 768 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "wide-1920", width: 1920, height: 1080 },
  { name: "ultrawide-2560", width: 2560, height: 1440 },
] as const;

/** One page per template, in both languages — Swahili runs longer than English
 *  and is the more likely place for text to overflow. */
export const pages = [
  { path: "/en", name: "home-en" },
  { path: "/sw", name: "home-sw" },
  { path: "/en/plan-your-visit", name: "visit-en" },
  { path: "/sw/plan-your-visit", name: "visit-sw" },
  { path: "/sw/ministries", name: "ministries-sw" },
  { path: "/sw/ministries/the-andrew-project", name: "ministry-detail-sw" },
  { path: "/sw/events", name: "events-sw" },
  { path: "/sw/our-faith", name: "faith-sw" },
  { path: "/sw/our-leadership", name: "leadership-sw" },
  { path: "/en/contact-us", name: "contact-en" },
  { path: "/sw/blog/messed-up-yet-qualified-by-grace", name: "post-sw" },
  // Pages that were placeholders until they gained real content. The grids,
  // lists and video facades they render are exactly where new layout bugs come
  // from, so they are checked at every width like everything else.
  { path: "/sw/announcements", name: "announcements-sw" },
  { path: "/en/announcements/andrew-project-month", name: "notice-en" },
  { path: "/sw/gallery", name: "gallery-sw" },
  { path: "/en/videos", name: "videos-en" },
  { path: "/sw/resources", name: "resources-sw" },
  { path: "/en/shop", name: "shop-en" },
  // Giving, in both languages, because this page is mostly form — the one
  // template where a label wrapping badly or a tap target shrinking has a cost
  // measured in gifts nobody managed to complete. Without PATHWAY_API_URL set,
  // what renders is the honest "not switched on" panel, which is itself worth
  // checking: it is what visitors see until the church configures the secret.
  { path: "/en/give", name: "give-en" },
  { path: "/sw/give", name: "give-sw" },
] as const;
