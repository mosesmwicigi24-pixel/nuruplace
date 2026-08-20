import type { Localized } from "./localized";

/**
 * Notices for the church family — service changes, meetings, appeals.
 *
 * Announcements are short-lived by nature, so each carries `expires`. The page
 * separates current from past on that date rather than making someone
 * remember to delete them; a notice nobody removed is how a website starts
 * telling people the wrong thing.
 */
export type Announcement = {
  slug: string;
  title: Localized<string>;
  /** ISO date the notice was posted. */
  date: string;
  /** ISO date after which it drops to "past". Omit for no expiry. */
  expires?: string;
  /** Shown on the listing. */
  summary: Localized<string>;
  body: Localized<string[]>;
  /** Marks a notice worth pinning to the top of the list. */
  urgent?: boolean;
};

export const announcements: Announcement[] = [
  {
    slug: "andrew-project-month",
    title: {
      en: "The Andrew Project Month begins",
      sw: "Mwezi wa Mradi wa Andrea waanza",
    },
    date: "2026-08-02",
    urgent: true,
    summary: {
      en: "A whole month of inviting the people closest to us. Pick three names and start praying for them this week.",
      sw: "Mwezi mzima wa kuwaalika walio karibu nasi. Chagua majina matatu na uanze kuwaombea wiki hii.",
    },
    body: {
      en: [
        "Through this month we are giving ourselves to one thing: inviting the people already close to us — family, neighbours, colleagues — into the love of Christ.",
        "You are asked for three names. Write them down, pray for them through the week, and invite them to any Sunday this month. That is the whole ask. Nobody is expected to preach on a matatu.",
        "If someone you invited comes, bring them to the welcome table afterwards so we can meet them properly.",
      ],
      sw: [
        "Mwezi huu tunajitoa kwa jambo moja: kuwaalika watu ambao tayari wako karibu nasi — familia, majirani, wenzetu kazini — katika upendo wa Kristo.",
        "Unaombwa majina matatu. Yaandike, uwaombee wiki nzima, na uwaalike Jumapili yoyote mwezi huu. Hilo ndilo ombi lote. Hakuna anayetarajiwa kuhubiri ndani ya matatu.",
        "Kama uliyemwalika atakuja, mlete mezani pa wageni baadaye ili tumfahamu vizuri.",
      ],
    },
  },
  {
    slug: "worship-experience-second-sunday",
    title: {
      en: "Worship Experience moves to the second Sunday",
      sw: "Tukio la Ibada lahamia Jumapili ya pili",
    },
    date: "2026-07-20",
    summary: {
      en: "From this month the open worship evening runs on the second Sunday, 3:00–6:00 PM, rather than the last.",
      sw: "Kuanzia mwezi huu ibada ya wazi ya jioni itafanyika Jumapili ya pili, saa 9:00 – 12:00 jioni, badala ya ya mwisho.",
    },
    body: {
      en: [
        "The Worship Experience now runs on the second Sunday of each month, from 3:00 to 6:00 PM.",
        "The change is simply so that it no longer lands on the same weekend as the cell gatherings, which was forcing people to choose between them.",
        "Rehearsals remain on Wednesday night. Anyone who sings or plays is welcome — you do not need to be on a team already.",
      ],
      sw: [
        "Tukio la Ibada sasa litafanyika Jumapili ya pili ya kila mwezi, kuanzia saa 9:00 hadi saa 12:00 jioni.",
        "Mabadiliko haya ni ili lisiangukie wikendi moja na mikutano ya vikundi, jambo lililokuwa likiwalazimu watu kuchagua kati yake.",
        "Mazoezi yataendelea kufanyika usiku wa Jumatano. Yeyote anayeimba au kupiga ala anakaribishwa — si lazima uwe tayari kwenye timu.",
      ],
    },
  },
  {
    slug: "tabitha-food-drive",
    title: {
      en: "Tabitha Ministry food drive",
      sw: "Mchango wa chakula wa Huduma ya Tabitha",
    },
    date: "2026-07-05",
    expires: "2026-08-10",
    summary: {
      en: "Dry goods for widows and families in the estate. Bring what you can to the back table any Sunday.",
      sw: "Vyakula vikavu kwa wajane na familia za mtaa. Lete unachoweza mezani pa nyuma Jumapili yoyote.",
    },
    body: {
      en: [
        "Tabitha Ministry is collecting dry goods — maize flour, rice, beans, cooking oil, sugar — for widows and families around the estate.",
        "Bring what you can to the table at the back on any Sunday. Small is fine; several small gifts fill a basket faster than one large one.",
        "If you know a household that should be on the list, speak to any Tabitha team member. You do not need to give their name in public.",
      ],
      sw: [
        "Huduma ya Tabitha inakusanya vyakula vikavu — unga wa mahindi, mchele, maharagwe, mafuta ya kupikia, sukari — kwa wajane na familia za mtaa.",
        "Lete unachoweza mezani pa nyuma Jumapili yoyote. Kidogo kinatosha; michango midogo kadhaa hujaza kikapu haraka kuliko mmoja mkubwa.",
        "Kama unajua familia inayostahili kuwa kwenye orodha, ongea na mwanatimu yeyote wa Tabitha. Si lazima utaje jina lake hadharani.",
      ],
    },
  },
];

export function getAnnouncement(slug: string): Announcement | undefined {
  return announcements.find((a) => a.slug === slug);
}

/** Split into current and past on a given day (ISO date string). */
export function partitionAnnouncements(today: string) {
  const sorted = [...announcements].sort((a, b) => b.date.localeCompare(a.date));
  const current = sorted.filter((a) => !a.expires || a.expires >= today);
  const past = sorted.filter((a) => a.expires && a.expires < today);
  // Urgent notices lead, but only within the current set.
  current.sort((a, b) => Number(Boolean(b.urgent)) - Number(Boolean(a.urgent)));
  return { current, past };
}
