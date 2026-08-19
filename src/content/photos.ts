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
    alt: {
      en: "The congregation at The Good News Mission during a Sunday service",
      sw: "Kusanyiko la The Good News Mission wakati wa ibada ya Jumapili",
    },
  },
  /** The building or gate, so a first-time visitor recognises it on arrival. */
  building: {
    alt: {
      en: "The entrance to The Good News Mission church in Saika",
      sw: "Lango la kanisa la The Good News Mission huko Saika",
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
