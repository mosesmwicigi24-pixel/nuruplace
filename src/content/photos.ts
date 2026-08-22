import type { Localized } from "./localized";

/**
 * Photo slots the site is built to hold.
 *
 * No images are bundled and none are invented: a church's photographs are of
 * real people who consented to be photographed, and a stock or generated face
 * on an About page is a small lie a visitor can usually feel. Each slot below
 * renders its colour-and-type treatment until a real file exists.
 *
 * To fill one: drop the file into /public/photos, set `src`, and write alt
 * text that describes what is happening rather than "church photo".
 *
 * See public/photos/README.md for the shot list and sizing guidance.
 */
export type Photo = {
  /** Path under /public, e.g. "/photos/hero-sunday.jpg". Unset = no photo yet. */
  src?: string;
  /** Describe the scene, in both languages. Required whenever src is set. */
  alt: Localized<string>;
  /** Intrinsic size, needed so the browser reserves space and nothing jumps. */
  width?: number;
  height?: number;
};

export const photos: Record<string, Photo> = {
  /** Wide shot behind the home page hero. People, mid-worship, not an empty room. */
  hero: {
    src: "/photos/hero-worship.webp",
    width: 1740,
    height: 1160,
    alt: {
      en: "The congregation of The Good News Mission standing in worship with hands raised, a worship leader singing at the front",
      sw: "Kusanyiko la The Good News Mission wamesimama katika ibada mikono juu, kiongozi wa ibada akiimba mbele",
    },
  },
  /** The building or gate, so a first-time visitor recognises it on arrival. */
  building: {
    alt: {
      en: "The entrance to The Good News Mission church in Saika",
      sw: "Lango la kanisa la The Good News Mission huko Saika",
    },
  },
  /**
   * Behind hero slide 2 (the John 8:12 scripture). Deliberately NOT people:
   * a face under a verse reads as an illustration of it, and the verse is
   * about Christ, not about whoever happened to be photographed. Light through
   * a window, the building at dawn, hands open — something that carries the
   * word without putting a person in it.
   */
  heroScripture: {
    src: "/photos/hero-scripture.webp",
    width: 1920,
    height: 799,
    alt: {
      en: "An open Bible with Mark 10 marked in yellow highlighter, where blind Bartimaeus calls out to Jesus and is told his faith has healed him",
      sw: "Biblia iliyofunguliwa ikionyesha Marko 10 imepigiwa mstari wa manjano, ambapo Bartimayo kipofu anamwita Yesu na kuambiwa imani yake imemponya",
    },
  },
  /** Behind hero slide 3 (the welcome). People arriving or greeting — warm, real. */
  heroWelcome: {
    src: "/photos/hero-teaching.webp",
    width: 2000,
    height: 991,
    alt: {
      en: "Teaching at a campus fellowship: a speaker beside a lectern in a lecture hall, students listening from the tiered benches",
      sw: "Mafundisho katika ushirika wa chuo: mzungumzaji kando ya jukwaa katika ukumbi wa mihadhara, wanafunzi wakisikiliza kutoka viti vya juu",
    },
  },
  /** Welcome team or people talking after a service — used on Plan Your Visit. */
  welcome: {
    alt: {
      en: "Members greeting a visitor after the Sunday service",
      sw: "Waumini wakimsalimia mgeni baada ya ibada ya Jumapili",
    },
  },
};

export function hasPhoto(photo: Photo | undefined): photo is Photo & { src: string } {
  return Boolean(photo?.src);
}
