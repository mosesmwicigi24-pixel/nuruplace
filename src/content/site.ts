import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { localePath } from "@/i18n/config";

/**
 * Global site settings. Contact details and links are language-neutral;
 * navigation labels come from the dictionary so the menu translates with
 * everything else.
 */
export const site = {
  name: "The Good News Mission",
  shortName: "TGNM",
  url: "https://nuruplace.org",
  contact: {
    email: "pastor@thegoodnewsmission.org",
    phone: "+254 700706875",
    phoneHref: "tel:+254700706875",
    whatsappHref: "https://wa.me/254700706875",
    address: "Kangundo Road, Saika Estate, Near Kayole Junction",
    city: "Nairobi, Kenya",
  },
  giving: {
    // The mission's own funding site. Since /give exists this is a FALLBACK,
    // shown when M-Pesa giving is not switched on — not the main path.
    url: "https://funding.thegoodnewsmission.org",
    label: "Give at funding.thegoodnewsmission.org",
    causesUrl: "https://funding.thegoodnewsmission.org/causes",
  },
  socials: [
    { name: "Facebook", href: "https://facebook.com/thegoodnewsmissions/" },
    { name: "Twitter", href: "https://twitter.com/tgnfi" },
    { name: "Instagram", href: "https://instagram.com/thegoodnewsfellowship" },
    { name: "LinkedIn", href: "https://linkedin.com/in/good-news-462b91150/" },
  ],
} as const;

/** Tagline is content, so it translates. */
export const tagline: Record<Locale, string> = {
  en: "Where Everyone is Someone!",
  sw: "Mahali Kila Mtu ni Mtu!",
};

export const description: Record<Locale, string> = {
  en: "The Good News Mission is a dynamic, multicultural, missionary sending church in Nairobi, Kenya. Join us every Sunday to celebrate Jesus and our faith in Him.",
  sw: "The Good News Mission ni kanisa lenye uhai, la tamaduni mbalimbali, linalotuma wamisionari, hapa Nairobi, Kenya. Ungana nasi kila Jumapili kumsherehekea Yesu na imani yetu kwake.",
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export function getMainNav(locale: Locale): NavItem[] {
  const { nav } = getDictionary(locale);
  const p = (path: string) => localePath(locale, path);

  return [
    { label: nav.home, href: p("/") },
    {
      label: nav.about,
      href: p("/about-us"),
      children: [
        { label: nav.aboutChurch, href: p("/about-us") },
        { label: nav.faith, href: p("/our-faith") },
        { label: nav.statutes, href: p("/our-statutes") },
        { label: nav.strategicPlan, href: p("/our-strategic-plan") },
        { label: nav.pastorMessage, href: p("/message-from-our-pastor") },
        { label: nav.firstLadyMessage, href: p("/message-from-our-first-lady") },
        { label: nav.leadership, href: p("/our-leadership") },
      ],
    },
    { label: nav.planVisit, href: p("/plan-your-visit") },
    { label: nav.ministries, href: p("/ministries") },
    { label: nav.sermons, href: p("/sermons") },
    { label: nav.events, href: p("/events") },
    { label: nav.blog, href: p("/blog") },
    {
      label: nav.media,
      href: p("/gallery"),
      children: [
        { label: nav.announcements, href: p("/announcements") },
        { label: nav.gallery, href: p("/gallery") },
        { label: nav.videos, href: p("/videos") },
      ],
    },
    { label: nav.resources, href: p("/resources") },
    { label: nav.contact, href: p("/contact-us") },
  ];
}

export function getFooterLinks(locale: Locale) {
  const { nav } = getDictionary(locale);
  const p = (path: string) => localePath(locale, path);
  return [
    { label: nav.planVisit, href: p("/plan-your-visit") },
    { label: nav.aboutChurch, href: p("/about-us") },
    { label: nav.faith, href: p("/our-faith") },
    { label: nav.leadership, href: p("/our-leadership") },
    { label: nav.sermons, href: p("/sermons") },
    { label: nav.events, href: p("/events") },
    { label: nav.blog, href: p("/blog") },
    { label: nav.contact, href: p("/contact-us") },
  ];
}
