import type { Localized } from "./localized";

/** Weekly service schedule shown on the home, visit and contact pages. */
export type ServiceSlot = {
  name: Localized<string>;
  time: Localized<string>;
  note?: Localized<string>;
};

export const sundayServices: ServiceSlot[] = [
  {
    name: { en: "Discipleship Service", sw: "Ibada ya Uanafunzi" },
    time: { en: "8:00 – 9:30 AM", sw: "8:00 – 9:30 asubuhi" },
  },
  {
    name: { en: "Main Service", sw: "Ibada Kuu" },
    time: { en: "10:30 AM – 1:00 PM", sw: "10:30 asubuhi – 1:00 mchana" },
  },
  {
    name: { en: "Worship Experience", sw: "Tukio la Ibada" },
    time: { en: "3:00 – 6:00 PM", sw: "3:00 – 6:00 jioni" },
    note: {
      en: "Second Sunday of the month",
      sw: "Jumapili ya pili ya mwezi",
    },
  },
];

export const weeklyServices: ServiceSlot[] = [
  {
    name: {
      en: "Worship Experience Rehearsal",
      sw: "Mazoezi ya Tukio la Ibada",
    },
    time: { en: "10:00 PM – 5:00 AM", sw: "10:00 usiku – 5:00 alfajiri" },
    note: { en: "Wednesday night", sw: "Usiku wa Jumatano" },
  },
  {
    name: { en: "Prayer Day", sw: "Siku ya Maombi" },
    time: { en: "Every Friday", sw: "Kila Ijumaa" },
  },
];
