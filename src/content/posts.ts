import type { Localized } from "./localized";

export type Post = {
  slug: string;
  title: Localized<string>;
  author: string;
  date: string;
  excerpt: Localized<string>;
  body: Localized<string[]>;
};

export const posts: Post[] = [
  {
    slug: "messed-up-yet-qualified-by-grace",
    title: {
      en: "Messed Up, Yet Qualified by Grace",
      sw: "Nimeharibika, Lakini Nimestahilishwa kwa Neema",
    },
    author: "The Good News Mission",
    date: "2022-09-18",
    excerpt: {
      en: "Messed up and broken, and yet God qualified me by His grace. Oh the grace! Grace has continued to qualify…",
      sw: "Nimeharibika na kuvunjika, lakini Mungu amenistahilisha kwa neema yake. Ee neema! Neema imeendelea kustahilisha…",
    },
    body: {
      en: [
        "Messed up and broken, and yet God qualified me by His grace. Oh the grace!",
        "Grace has continued to qualify those that the world had long disqualified. It is not the strong, the polished or the impressive that God calls — it is those who know they have nothing to offer but a willing heart.",
        "If you have been waiting until you are good enough to come to God, you will wait forever. Come as you are. Grace will do the qualifying.",
      ],
      sw: [
        "Nimeharibika na kuvunjika, lakini Mungu amenistahilisha kwa neema yake. Ee neema!",
        "Neema imeendelea kuwastahilisha wale ambao ulimwengu ulikuwa umewakataa tangu zamani. Si wenye nguvu, waliong'arishwa au wanaovutia ndio Mungu huwaita — ni wale wanaojua hawana chochote cha kutoa ila moyo ulio tayari.",
        "Kama umekuwa ukisubiri hadi uwe mwema wa kutosha kumjia Mungu, utasubiri milele. Njoo ulivyo. Neema ndiyo itakayostahilisha.",
      ],
    },
  },
  {
    slug: "love-so-great-love-so-deep-love-so-pure",
    title: {
      en: "Love So Great, Love So Deep, Love So Pure!",
      sw: "Upendo Mkuu, Upendo wa Kina, Upendo Safi!",
    },
    author: "The Good News Mission",
    date: "2022-06-12",
    excerpt: {
      en: "For here is the way God loved the world — He gave His only, unique Son as a gift.",
      sw: "Kwa maana hivi ndivyo Mungu aliupenda ulimwengu — alimtoa Mwanawe pekee kama zawadi.",
    },
    body: {
      en: [
        "For here is the way God loved the world: He gave His only, unique Son as a gift. So now everyone who believes in Him will never perish, but experience everlasting life.",
        "This is a love that did not wait for us to deserve it, and does not withdraw when we fail. It is great enough to cover every sin, deep enough to reach every person, and pure enough to change whoever receives it.",
      ],
      sw: [
        "Kwa maana hivi ndivyo Mungu aliupenda ulimwengu: alimtoa Mwanawe pekee kama zawadi. Hivyo sasa kila amwaminiye hataangamia, bali atapata uzima wa milele.",
        "Huu ni upendo ambao haukusubiri tuustahili, na haujiondoi tunaposhindwa. Ni mkuu wa kutosha kufunika kila dhambi, wa kina wa kutosha kumfikia kila mtu, na safi wa kutosha kumbadilisha yeyote anayeupokea.",
      ],
    },
  },
  {
    slug: "start-your-new-life-with-christ",
    title: {
      en: "Start Your New Life With Christ",
      sw: "Anza Maisha Yako Mapya na Kristo",
    },
    author: "The Good News Mission",
    date: "2022-04-10",
    excerpt: {
      en: "Become new now! What it means to surrender your life to Jesus, and the first steps that follow.",
      sw: "Uwe mpya sasa! Maana ya kujisalimisha maisha yako kwa Yesu, na hatua za kwanza zinazofuata.",
    },
    body: {
      en: [
        "The only means of being cleansed from sin is through repentance and faith in the precious blood of Christ. Regeneration by the Holy Spirit is absolutely essential for personal salvation.",
        "If you are ready to begin, pray simply and honestly: admit your need, believe that Jesus died and rose for you, and ask Him to take charge of your life.",
        "Then tell somebody. Find a church family. Get into the word. A new life is meant to be lived out among people who will walk with you.",
      ],
      sw: [
        "Njia pekee ya kusafishwa dhambi ni kupitia toba na imani katika damu ya thamani ya Kristo. Kuzaliwa upya kwa Roho Mtakatifu ni muhimu kabisa kwa wokovu wa binafsi.",
        "Kama uko tayari kuanza, omba kwa unyofu na urahisi: kiri uhitaji wako, amini kwamba Yesu alikufa na kufufuka kwa ajili yako, na umwombe achukue uongozi wa maisha yako.",
        "Kisha mwambie mtu. Tafuta familia ya kanisa. Ingia katika neno. Maisha mapya yanakusudiwa kuishiwa miongoni mwa watu watakaotembea nawe.",
      ],
    },
  },
  {
    slug: "how-do-you-respond-to-the-word-of-god",
    title: {
      en: "How Do You Respond to the Word of God?",
      sw: "Unaitikiaje Neno la Mungu?",
    },
    author: "The Good News Mission",
    date: "2022-02-20",
    excerpt: {
      en: "The same seed falls on four kinds of ground. The difference is never the seed — it is the soil.",
      sw: "Mbegu ile ile huanguka kwenye aina nne za udongo. Tofauti kamwe si mbegu — ni udongo.",
    },
    body: {
      en: [
        "In the parable of the sower, the same seed falls on four kinds of ground. The difference in the harvest is never the seed. It is the soil.",
        "Some hear and never understand. Some receive with joy but have no root. Some let the cares of this life choke the word. And some hear, understand and bear fruit — thirty, sixty, a hundredfold.",
        "The question is not whether the word is being preached. The question is what kind of ground you are.",
      ],
      sw: [
        "Katika mfano wa mpanzi, mbegu ile ile huanguka kwenye aina nne za udongo. Tofauti ya mavuno kamwe si mbegu. Ni udongo.",
        "Wengine husikia lakini hawaelewi kamwe. Wengine hupokea kwa furaha lakini hawana mizizi. Wengine huruhusu shughuli za maisha haya kulisonga neno. Na wengine husikia, huelewa na huzaa matunda — thelathini, sitini, mia moja.",
        "Swali si kama neno linahubiriwa. Swali ni wewe ni udongo wa aina gani.",
      ],
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
