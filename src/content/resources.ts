import type { Localized } from "./localized";

/**
 * Downloads and reading — study guides, forms, the documents people ask for
 * at the back of the church so somebody does not have to print them again.
 *
 * `file` points at something in /public/resources. An entry with no file
 * renders as "coming soon" rather than a dead link: a 404 on a church website
 * costs more trust than an honest gap.
 */
export type ResourceKind = "study" | "form" | "document" | "audio";

export type Resource = {
  slug: string;
  kind: ResourceKind;
  title: Localized<string>;
  description: Localized<string>;
  /** Path under /public, e.g. "/resources/baptism-class.pdf". */
  file?: string;
  /** Human-readable size, so nobody on a bundle is ambushed by a 40 MB PDF. */
  size?: string;
};

export const resources: Resource[] = [
  {
    slug: "statement-of-faith",
    kind: "document",
    title: { en: "Statement of Faith", sw: "Tamko la Imani" },
    description: {
      en: "What The Good News Mission believes, in full, as a printable document.",
      sw: "Kile ambacho The Good News Mission inaamini, kwa ukamilifu, kama hati inayoweza kuchapishwa.",
    },
  },
  {
    slug: "new-believers-guide",
    kind: "study",
    title: {
      en: "A Guide for New Believers",
      sw: "Mwongozo kwa Waumini Wapya",
    },
    description: {
      en: "First steps after deciding to follow Jesus — reading, prayer, baptism, and finding a cell group.",
      sw: "Hatua za kwanza baada ya kuamua kumfuata Yesu — kusoma, maombi, ubatizo, na kupata kikundi.",
    },
  },
  {
    slug: "baptism-application",
    kind: "form",
    title: { en: "Baptism Application", sw: "Fomu ya Ubatizo" },
    description: {
      en: "Complete this before the next baptism service and hand it to any leader.",
      sw: "Jaza hii kabla ya ibada ijayo ya ubatizo na umkabidhi kiongozi yeyote.",
    },
  },
  {
    slug: "cell-group-leaders-notes",
    kind: "study",
    title: {
      en: "Cell Group Leader's Notes",
      sw: "Maelezo ya Kiongozi wa Kikundi",
    },
    description: {
      en: "Weekly discussion outlines for cell leaders, following the Sunday teaching.",
      sw: "Muhtasari wa majadiliano ya kila wiki kwa viongozi wa vikundi, ukifuata mafundisho ya Jumapili.",
    },
  },
];

export function resourcesReady(): Resource[] {
  return resources.filter((r) => r.file);
}

export function resourcesPending(): Resource[] {
  return resources.filter((r) => !r.file);
}
