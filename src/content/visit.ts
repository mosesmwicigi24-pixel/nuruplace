import type { Localized } from "./localized";

/**
 * Plan Your Visit. This page exists to answer the question a stranger is
 * actually asking — "is this church for someone like me, and what happens if
 * I walk in?" — not to restate the mission statement.
 *
 * Several answers below are reasonable assumptions that the church should
 * confirm and correct: parking, the crèche age range, and how long the main
 * service really runs. Wrong specifics here are worse than none.
 */

export const visitIntro: Localized<string> = {
  en: "Coming for the first time? Here is exactly what happens, so nothing about Sunday is a surprise.",
  sw: "Unakuja kwa mara ya kwanza? Hapa kuna kinachotokea hasa, ili hakuna jambo la Jumapili litakalokushtua.",
};

export type VisitQuestion = {
  question: Localized<string>;
  answer: Localized<string[]>;
  /** Set while the church has not yet confirmed this answer. */
  unconfirmed?: boolean;
};

export const visitQuestions: VisitQuestion[] = [
  {
    question: { en: "When should I arrive?", sw: "Nifike saa ngapi?" },
    answer: {
      en: [
        "The main service starts at 10:30 AM and runs to about 1:00 PM. Arriving ten minutes early gives you time to find a seat and be greeted without rushing.",
        "If you would like something smaller and quieter first, the discipleship service runs from 8:00 to 9:30 AM.",
      ],
      sw: [
        "Ibada kuu huanza saa 4:30 asubuhi na hukamilika karibu saa 7:00 mchana. Kufika dakika kumi mapema kunakupa muda wa kupata kiti na kusalimiwa bila haraka.",
        "Ukipenda kitu kidogo na tulivu kwanza, ibada ya uanafunzi hufanyika kuanzia saa 2:00 hadi saa 3:30 asubuhi.",
      ],
    },
  },
  {
    question: { en: "What should I wear?", sw: "Nivae nini?" },
    answer: {
      en: [
        "Whatever you are comfortable in. You will see suits and you will see jeans, and nobody is counting. Come as you are — that is not a slogan here, it is the actual dress code.",
      ],
      sw: [
        "Chochote unachojisikia vizuri nacho. Utaona suti na utaona jinzi, na hakuna anayehesabu. Njoo ulivyo — hii si kauli mbiu tu hapa, ni kanuni halisi ya mavazi.",
      ],
    },
  },
  {
    question: {
      en: "What actually happens in the service?",
      sw: "Ni nini hasa hutokea katika ibada?",
    },
    answer: {
      en: [
        "Singing, prayer, an offering, and teaching from the Bible. Roughly the first half is worship and the second half is the message.",
        "You are never asked to stand up, introduce yourself in front of everyone, or give anything. Visitors are welcomed warmly, not put on the spot.",
      ],
      sw: [
        "Kuimba, maombi, sadaka, na mafundisho kutoka Biblia. Takriban nusu ya kwanza ni ibada na nusu ya pili ni ujumbe.",
        "Huwezi kuombwa usimame, ujitambulishe mbele ya kila mtu, au utoe chochote. Wageni hukaribishwa kwa uchangamfu, hawawekwi kwenye wakati mgumu.",
      ],
    },
  },
  {
    question: {
      en: "Where do I go, and how do I find it?",
      sw: "Niende wapi, na nitapataje?",
    },
    answer: {
      en: [
        "We meet on Kangundo Road, Saika Estate, near Kayole Junction, Nairobi.",
        "If you are coming by matatu, alight at Kayole Junction and it is a short walk from there. If you are unsure, call or WhatsApp us before you set off and someone will guide you in.",
      ],
      sw: [
        "Tunakutana Barabara ya Kangundo, Mtaa wa Saika, karibu na Kayole Junction, Nairobi.",
        "Ukija kwa matatu, shuka Kayole Junction na ni matembezi mafupi kutoka hapo. Ukiwa na shaka, tupigie simu au WhatsApp kabla ya kuondoka na mtu atakuelekeza.",
      ],
    },
  },
  {
    question: {
      en: "Can I bring my children?",
      sw: "Naweza kuja na watoto wangu?",
    },
    answer: {
      en: [
        "Yes, and please do. Children's Ministry runs alongside the main service, with Sunday School for younger children and a teens group.",
        "Children are welcome to stay with you in the service if they would rather, and nobody minds the noise.",
      ],
      sw: [
        "Ndiyo, na tafadhali fanya hivyo. Huduma ya Watoto hufanyika sambamba na ibada kuu, ikiwa na Shule ya Jumapili kwa watoto wadogo na kikundi cha vijana.",
        "Watoto wanakaribishwa kubaki nawe ndani ya ibada wakipenda, na hakuna anayejali kelele.",
      ],
    },
  },
  {
    question: {
      en: "Am I expected to give money?",
      sw: "Je, ninatarajiwa kutoa pesa?",
    },
    answer: {
      en: [
        "No. There is an offering during the service, and visitors are not expected to take part in it. Giving at TGNM is something people choose after they have decided this is their church home — not a ticket at the door.",
      ],
      sw: [
        "Hapana. Kuna sadaka wakati wa ibada, na wageni hawatarajiwi kushiriki. Utoaji katika TGNM ni jambo ambalo watu huchagua baada ya kuamua hii ni nyumba yao ya kanisa — si tiketi ya mlangoni.",
      ],
    },
  },
  {
    question: {
      en: "What if I am not a Christian?",
      sw: "Itakuwaje kama mimi si Mkristo?",
    },
    answer: {
      en: [
        "You are genuinely welcome. Plenty of people here came for years before they believed anything, and some are still deciding.",
        "You can sit at the back, listen, and leave without anyone following you out. Ask questions if you want them answered; nobody will corner you.",
      ],
      sw: [
        "Umekaribishwa kwa dhati. Watu wengi hapa walikuja kwa miaka kabla ya kuamini chochote, na wengine bado wanaamua.",
        "Unaweza kukaa nyuma, kusikiliza, na kuondoka bila mtu kukufuata. Uliza maswali ukitaka majibu; hakuna atakayekubana.",
      ],
    },
  },
];

/** Practical facts shown as a summary strip. */
export const visitFacts: { label: Localized<string>; value: Localized<string> }[] =
  [
    {
      label: { en: "Main service", sw: "Ibada kuu" },
      value: { en: "Sundays, 10:30 AM", sw: "Jumapili, saa 4:30 asubuhi" },
    },
    {
      label: { en: "How long", sw: "Muda" },
      value: { en: "About 2½ hours", sw: "Takriban saa 2 na nusu" },
    },
    {
      label: { en: "Children", sw: "Watoto" },
      value: { en: "Welcome, all ages", sw: "Wanakaribishwa, umri wote" },
    },
    {
      label: { en: "Dress", sw: "Mavazi" },
      value: { en: "Come as you are", sw: "Njoo ulivyo" },
    },
  ];
