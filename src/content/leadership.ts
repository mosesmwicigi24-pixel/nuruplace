import type { Localized } from "./localized";

/**
 * Church leadership. Names and photographs have not been supplied yet — the
 * live site listed only one role publicly. Replace these entries with the real
 * team and add a `photo` path (e.g. "/leadership/name.jpg") once portraits
 * exist in /public.
 */
export type Leader = {
  name: string;
  role: Localized<string>;
  bio?: Localized<string>;
  photo?: string;
  /** True while this is a stand-in rather than a real person. */
  placeholder?: boolean;
};

export const leadership: Leader[] = [
  {
    name: "—",
    role: { en: "Senior Pastor", sw: "Mchungaji Mkuu" },
    bio: {
      en: "Leads The Good News Mission and its missionary sending work.",
      sw: "Anaongoza The Good News Mission na kazi yake ya kutuma wamisionari.",
    },
    placeholder: true,
  },
  {
    name: "—",
    role: { en: "First Lady", sw: "Mama Kanisa" },
    bio: {
      en: "Serves alongside the Senior Pastor with particular care for the women of the fellowship.",
      sw: "Anahudumu pamoja na Mchungaji Mkuu akiwajali hasa wanawake wa ushirika.",
    },
    placeholder: true,
  },
  {
    name: "—",
    role: {
      en: "Department Leader — United Guardians of Faith (UGF)",
      sw: "Kiongozi wa Idara — Walinzi wa Imani Walioungana (UGF)",
    },
    placeholder: true,
  },
  {
    name: "—",
    role: {
      en: "Department Leader — Ablaze Worship",
      sw: "Kiongozi wa Idara — Ibada ya Ablaze",
    },
    placeholder: true,
  },
  {
    name: "—",
    role: {
      en: "Department Leader — Media",
      sw: "Kiongozi wa Idara — Vyombo vya Habari",
    },
    placeholder: true,
  },
  {
    name: "—",
    role: {
      en: "Department Leader — Children Ministry",
      sw: "Kiongozi wa Idara — Huduma ya Watoto",
    },
    placeholder: true,
  },
];
