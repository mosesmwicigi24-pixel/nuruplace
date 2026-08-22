import type { Localized } from "./localized";

/**
 * Church leadership.
 *
 * The two portraits came from the old CodeIgniter site, which the church had
 * been running since 2018; the names were confirmed by the pastor rather than
 * inferred from filenames. Putting a guessed name under a face on a church
 * website is worse than an empty slot, so the remaining entries stay marked
 * `placeholder` until someone says who they are.
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
    name: "Pastor Moses Mwicigi",
    role: { en: "Senior Pastor", sw: "Mchungaji Mkuu" },
    bio: {
      en: "Leads The Good News Mission and its missionary sending work.",
      sw: "Anaongoza The Good News Mission na kazi yake ya kutuma wamisionari.",
    },
    photo: "/leadership/moses-mwicigi.webp",
  },
  {
    name: "Jackline Mwicigi",
    role: { en: "First Lady", sw: "Mama Kanisa" },
    bio: {
      en: "Serves alongside the Senior Pastor with particular care for the women of the fellowship.",
      sw: "Anahudumu pamoja na Mchungaji Mkuu akiwajali hasa wanawake wa ushirika.",
    },
    photo: "/leadership/jackline-mwicigi.webp",
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
