import type { Localized } from "./localized";

export type ChurchEvent = {
  slug: string;
  title: Localized<string>;
  date: string; // ISO — used for sorting and <time>
  timeLabel: string;
  location: string;
  summary: Localized<string>;
};

export const events: ChurchEvent[] = [
  {
    slug: "ablaze-worship-experience-october",
    title: {
      en: "Ablaze Worship Experience — October Edition",
      sw: "Tukio la Ibada la Ablaze — Toleo la Oktoba",
    },
    date: "2022-10-23",
    timeLabel: "2:00 PM – 7:30 PM",
    location: "The Good News Mission Church, Saika",
    summary: {
      en: "An extended evening of open worship with the Ablaze team. Come expectant — no programme, just the presence of God.",
      sw: "Jioni ndefu ya ibada ya wazi pamoja na timu ya Ablaze. Njoo ukitarajia — hakuna ratiba, ni uwepo wa Mungu tu.",
    },
  },
  {
    slug: "partners-dinner",
    title: { en: "Partners Dinner Event", sw: "Chakula cha Jioni cha Washirika" },
    date: "2021-07-17",
    timeLabel: "5:30 PM – 8:00 PM",
    location: "The Good News Mission Church",
    summary: {
      en: "An evening with the partners who make the mission work possible, sharing the year's testimonies and the road ahead.",
      sw: "Jioni pamoja na washirika wanaowezesha kazi ya misheni, tukishiriki ushuhuda wa mwaka na njia iliyo mbele.",
    },
  },
  {
    slug: "ablaze-open-worship-experience",
    title: {
      en: "Ablaze Open Worship Experience",
      sw: "Tukio la Ibada ya Wazi la Ablaze",
    },
    date: "2019-06-15",
    timeLabel: "4:00 PM – 6:00 PM",
    location: "The Good News Mission, Saika",
    summary: {
      en: "Open worship for the whole family — singers, instrumentalists and anyone who simply wants to worship.",
      sw: "Ibada ya wazi kwa familia nzima — waimbaji, wapiga ala na yeyote anayetaka tu kuabudu.",
    },
  },
  {
    slug: "fundraising-dinner",
    title: { en: "Fundraising Dinner", sw: "Chakula cha Jioni cha Harambee" },
    date: "2019-03-02",
    timeLabel: "6:00 PM",
    location: "The Good News Mission Church",
    summary: {
      en: "A fundraising evening towards the church building and outreach programmes.",
      sw: "Jioni ya harambee kwa ajili ya jengo la kanisa na programu za uinjilisti.",
    },
  },
  {
    slug: "church-commissioning",
    title: { en: "Church Commissioning", sw: "Uzinduzi wa Kanisa" },
    date: "2018-12-09",
    timeLabel: "10:00 AM",
    location: "The Good News Mission, Saika",
    summary: {
      en: "The commissioning of The Good News Mission church building at Saika.",
      sw: "Uzinduzi wa jengo la kanisa la The Good News Mission huko Saika.",
    },
  },
];
