import type { Localized } from "./localized";

export type Sermon = {
  slug: string;
  title: Localized<string>;
  speaker: Localized<string>;
  date: string;
  scripture?: string;
  summary: Localized<string>;
  audioUrl?: string;
  videoUrl?: string;
};

const pastor: Localized<string> = {
  en: "Pastor, The Good News Mission",
  sw: "Mchungaji, The Good News Mission",
};

export const sermons: Sermon[] = [
  {
    slug: "messed-up-yet-qualified-by-grace",
    title: {
      en: "Messed Up, Yet Qualified by Grace",
      sw: "Nimeharibika, Lakini Nimestahilishwa kwa Neema",
    },
    speaker: pastor,
    date: "2022-09-18",
    scripture: "Ephesians 2:8–9",
    summary: {
      en: "Messed up and broken, and yet God qualified me by His grace. Grace has continued to qualify those the world has written off.",
      sw: "Nimeharibika na kuvunjika, lakini Mungu amenistahilisha kwa neema yake. Neema imeendelea kuwastahilisha wale ambao ulimwengu umewaacha.",
    },
  },
  {
    slug: "love-so-great-love-so-deep",
    title: {
      en: "Love So Great, Love So Deep, Love So Pure!",
      sw: "Upendo Mkuu, Upendo wa Kina, Upendo Safi!",
    },
    speaker: pastor,
    date: "2022-06-12",
    scripture: "John 3:16",
    summary: {
      en: "For here is the way God loved the world — He gave His only, unique Son as a gift.",
      sw: "Kwa maana hivi ndivyo Mungu aliupenda ulimwengu — alimtoa Mwanawe pekee kama zawadi.",
    },
  },
  {
    slug: "start-your-new-life-with-christ",
    title: {
      en: "Start Your New Life With Christ",
      sw: "Anza Maisha Yako Mapya na Kristo",
    },
    speaker: pastor,
    date: "2022-04-10",
    scripture: "2 Corinthians 5:17",
    summary: {
      en: "What it means to become new, and the first steps of a life surrendered to Jesus.",
      sw: "Maana ya kuwa mpya, na hatua za kwanza za maisha yaliyojisalimisha kwa Yesu.",
    },
  },
  {
    slug: "how-do-you-respond-to-the-word-of-god",
    title: {
      en: "How Do You Respond to the Word of God?",
      sw: "Unaitikiaje Neno la Mungu?",
    },
    speaker: pastor,
    date: "2022-02-20",
    scripture: "Matthew 13:1–23",
    summary: {
      en: "The parable of the sower, and the four kinds of ground the word of God falls on.",
      sw: "Mfano wa mpanzi, na aina nne za udongo ambao neno la Mungu huanguka juu yake.",
    },
  },
];
