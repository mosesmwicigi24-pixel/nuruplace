import type { Localized } from "./localized";

/**
 * Ministries / departments. Each entry becomes a card on /ministries and a
 * detail page at /{locale}/ministries/[slug]. Slugs stay language-neutral so a
 * link shared in one language still resolves in the other.
 */
export type Ministry = {
  slug: string;
  name: Localized<string>;
  summary: Localized<string>;
  body: Localized<string[]>;
  leader?: string;
  /**
   * Photograph for the ministry card. Optional and often absent: a ministry
   * without a picture shows its card without one, which is honest, rather
   * than borrowing a stock image of strangers doing something similar.
   */
  cover?: {
    src: string;
    width: number;
    height: number;
    alt: Localized<string>;
  };
};

export const ministries: Ministry[] = [
  {
    slug: "ablaze-worship",
    cover: {
      src: "/ministries/ablaze-worship.webp",
      width: 1440,
      height: 957,
      alt: {
        en: "A guitarist leading worship practice, other players seated around her with guitars",
        sw: "Mpiga gita akiongoza mazoezi ya ibada, wapiga vyombo wengine wameketi kando yake na magita",
      },
    },
    name: { en: "Ablaze Worship", sw: "Ibada ya Ablaze" },
    summary: {
      en: "Our worship ministry — leading the congregation into the presence of God and raising up worship leaders.",
      sw: "Huduma yetu ya ibada — kuliongoza kusanyiko katika uwepo wa Mungu na kuwainua viongozi wa ibada.",
    },
    body: {
      en: [
        "Are you a worship leader in your church? Do you love music and long to see the presence of God fill a room? Ablaze Worship exists to raise, train and release worshippers who lead from a place of intimacy with God rather than performance.",
        "The ministry runs the Ablaze Worship Experience, an extended evening of open worship held on the second Sunday of the month, along with weekly rehearsals and mentorship for singers and instrumentalists.",
      ],
      sw: [
        "Je, wewe ni kiongozi wa ibada kanisani kwako? Je, unapenda muziki na unatamani kuona uwepo wa Mungu ukijaza chumba? Ablaze Worship ipo ili kuwainua, kuwafunza na kuwatuma waabuduo wanaoongoza kutoka mahali pa ukaribu na Mungu, si kwa maonyesho.",
        "Huduma hii huendesha Tukio la Ibada la Ablaze, jioni ndefu ya ibada ya wazi inayofanyika Jumapili ya pili ya mwezi, pamoja na mazoezi ya kila wiki na ushauri kwa waimbaji na wapiga ala.",
      ],
    },
  },
  {
    slug: "media-department",
    name: { en: "Media Department", sw: "Idara ya Vyombo vya Habari" },
    summary: {
      en: "Sound, live streaming, photography and video — carrying the message beyond the four walls of the building.",
      sw: "Sauti, utangazaji wa moja kwa moja, upigaji picha na video — kupeleka ujumbe nje ya kuta nne za jengo.",
    },
    body: {
      en: [
        "How should the church use technology to be more effective? There are churches that have embraced technology and, in doing so, have multiplied their reach many times over.",
        "The Media Department handles sound, live streaming, photography, video production and the church's online presence, so that every service can reach people who are not in the room.",
      ],
      sw: [
        "Kanisa linapaswa kutumiaje teknolojia ili liwe na matokeo zaidi? Kuna makanisa yaliyokumbatia teknolojia na, kwa kufanya hivyo, yameongeza ufikiaji wao mara nyingi.",
        "Idara ya Vyombo vya Habari inashughulikia sauti, utangazaji wa moja kwa moja, upigaji picha, utengenezaji wa video na uwepo wa kanisa mtandaoni, ili kila ibada iweze kuwafikia watu wasiokuwa ndani ya chumba.",
      ],
    },
  },
  {
    slug: "children-ministry",
    name: { en: "Children Ministry", sw: "Huduma ya Watoto" },
    summary: {
      en: "Teaching children and teenagers the word of God in a way they can understand, remember and live out.",
      sw: "Kuwafundisha watoto na vijana neno la Mungu kwa njia wanayoweza kuelewa, kukumbuka na kuiishi.",
    },
    body: {
      en: [
        "What we aim to achieve with the Children's Ministry is to establish TAS — Teens, Adventurers and the Sunday School — so that every age group is taught the word of God at the level they can receive it.",
        "We nurture children in scripture, prayer and service, and give them room to discover and use their gifts from an early age.",
      ],
      sw: [
        "Lengo letu katika Huduma ya Watoto ni kuanzisha TAS — Vijana, Wagunduzi na Shule ya Jumapili — ili kila kundi la umri lifundishwe neno la Mungu kwa kiwango linaloweza kulipokea.",
        "Tunawalea watoto katika maandiko, maombi na huduma, na kuwapa nafasi ya kugundua na kutumia vipawa vyao tangu wakiwa wadogo.",
      ],
    },
  },
  {
    slug: "the-andrew-project",
    name: { en: "The Andrew Project", sw: "Mradi wa Andrea" },
    summary: {
      en: "A soul-winning project for every believer, modelled on Andrew, who brought his brother Simon Peter to Christ.",
      sw: "Mradi wa kuokoa roho kwa kila muumini, ukiigwa kutoka kwa Andrea, aliyemleta ndugu yake Simoni Petro kwa Kristo.",
    },
    body: {
      en: [
        "The Andrew Project is a project for all Christians. The title of this project comes from the example of Andrew, who invited Simon Peter, his brother, to Christ.",
        "Why not invite everyone close to us — our family, our friends and our colleagues — just like Andrew did, to meet Christ?",
        "Each year we set aside the Andrew Month: a month of inviting family, friends, neighbours and strangers into the love of Christ.",
      ],
      sw: [
        "Mradi wa Andrea ni mradi kwa Wakristo wote. Jina la mradi huu linatokana na mfano wa Andrea, aliyemwalika Simoni Petro, ndugu yake, kwa Kristo.",
        "Kwa nini tusiwaalike wote walio karibu nasi — familia zetu, marafiki zetu na wenzetu kazini — kama Andrea alivyofanya, ili wakutane na Kristo?",
        "Kila mwaka tunatenga Mwezi wa Andrea: mwezi wa kuwaalika familia, marafiki, majirani na wageni katika upendo wa Kristo.",
      ],
    },
  },
  {
    slug: "united-guardians-of-faith",
    name: {
      en: "United Guardians of Faith (UGF)",
      sw: "Walinzi wa Imani Walioungana (UGF)",
    },
    summary: {
      en: "A department committed to guarding and growing the faith of the fellowship through prayer and discipleship.",
      sw: "Idara iliyojitoa kulinda na kukuza imani ya ushirika kupitia maombi na uanafunzi.",
    },
    body: {
      en: [
        "United Guardians of Faith (UGF) is a department of The Good News Mission committed to standing in the gap for the church in prayer, and to guarding sound doctrine within the fellowship.",
        "The department disciples believers into maturity, so that they are able to give an answer for the hope that is in them.",
      ],
      sw: [
        "Walinzi wa Imani Walioungana (UGF) ni idara ya The Good News Mission iliyojitoa kusimama katika nafasi kwa ajili ya kanisa kwa maombi, na kulinda mafundisho sahihi ndani ya ushirika.",
        "Idara hii inawafanya waumini kuwa wanafunzi hadi ukomavu, ili waweze kutoa jibu kwa ajili ya tumaini lililo ndani yao.",
      ],
    },
  },
  {
    slug: "tabitha-ministry",
    name: { en: "Tabitha Ministry", sw: "Huduma ya Tabitha" },
    summary: {
      en: "Practical compassion for widows, orphans and the vulnerable in our community.",
      sw: "Huruma ya vitendo kwa wajane, yatima na walio hatarini katika jamii yetu.",
    },
    body: {
      en: [
        "Tabitha Ministry is a department of The Good News Mission that aims to help the widowed, the orphaned and the vulnerable in the communities around us.",
        "Named after Tabitha of Joppa, who was 'full of good works and acts of charity', the ministry provides food, clothing, counselling and practical support to those in need.",
      ],
      sw: [
        "Huduma ya Tabitha ni idara ya The Good News Mission inayolenga kuwasaidia wajane, yatima na walio hatarini katika jamii zinazotuzunguka.",
        "Ikiitwa kwa jina la Tabitha wa Yafa, aliyekuwa 'amejaa matendo mema na sadaka', huduma hii hutoa chakula, mavazi, ushauri nasaha na msaada wa vitendo kwa wenye uhitaji.",
      ],
    },
  },
  {
    slug: "cyber-missions",
    name: { en: "Cyber Missions", sw: "Misheni ya Mtandaoni" },
    summary: {
      en: "Online outreach — using the internet and social media to reach nations that are otherwise closed to the gospel.",
      sw: "Uinjilisti mtandaoni — kutumia intaneti na mitandao ya kijamii kuyafikia mataifa ambayo vinginevyo yamefungwa kwa injili.",
    },
    body: {
      en: [
        "At The Good News Mission we have a department for Cyber Missions and Online Outreach Ministry. We harness the power of social media and use it to reach more people, including in countries that are suppressing Christianity.",
        "We use our website to disseminate information to people across the world on soul winning and biblical teaching, giving particular emphasis to nations where a physical missionary presence is difficult.",
      ],
      sw: [
        "Katika The Good News Mission tuna idara ya Misheni ya Mtandaoni na Huduma ya Uinjilisti Mtandaoni. Tunatumia nguvu ya mitandao ya kijamii kuwafikia watu wengi zaidi, ikiwa ni pamoja na katika nchi zinazokandamiza Ukristo.",
        "Tunatumia tovuti yetu kusambaza taarifa kwa watu duniani kote kuhusu uokoaji wa roho na mafundisho ya kibiblia, tukiweka mkazo wa pekee kwa mataifa ambayo uwepo wa kimwili wa wamisionari ni mgumu.",
      ],
    },
  },
];

export function getMinistry(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}
