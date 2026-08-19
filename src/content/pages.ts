import type { Localized } from "./localized";

/**
 * Long-form static pages: a title, an optional intro, and sections that render
 * as a heading plus paragraphs and an optional bullet list.
 *
 * The Swahili here was written for the rebuild and has NOT been reviewed by a
 * first-language Kiswahili speaker. Have someone in the church read it before
 * launch — especially the doctrinal statements on Our Faith, where precision
 * matters more than fluency.
 */
export type PageSection = {
  heading?: Localized<string>;
  paragraphs?: Localized<string[]>;
  bullets?: Localized<string[]>;
};

export type StaticPage = {
  title: Localized<string>;
  intro?: Localized<string>;
  sections: PageSection[];
};

export const aboutPage: StaticPage = {
  title: {
    en: "About The Good News Mission",
    sw: "Kuhusu The Good News Mission",
  },
  intro: {
    en: "The Good News Mission is a dynamic, multicultural community and a missionary sending church. The church offers relevant teaching and amazing worship as part of every Sunday worship gathering. Get ready to experience church in a whole new way — join us every Sunday, 10:00 AM to 1:00 PM, to celebrate Jesus and our faith in Him.",
    sw: "The Good News Mission ni jumuiya yenye uhai, ya tamaduni mbalimbali, na kanisa linalotuma wamisionari. Kanisa hutoa mafundisho yanayohusika na ibada ya ajabu katika kila kusanyiko la Jumapili. Jiandae kuipata kanisa kwa njia mpya kabisa — ungana nasi kila Jumapili, saa 4:00 asubuhi hadi saa 7:00 mchana, kumsherehekea Yesu na imani yetu kwake.",
  },
  sections: [
    {
      heading: { en: "Who We Are", sw: "Sisi Ni Nani" },
      paragraphs: {
        en: [
          "The church is a fellowship where those who know Christ are bound together in the Spirit; a lecture room where great truths are expounded and teaching on every Christian virtue is given; and a nursery where young Christians are grown into maturity.",
          "The Good News Mission is more than a church. It is a family of believers who have come together to share the love of God. Our immediate task is to help you become the person God made you to be. No matter where you are in your journey of faith, you are invited to discover your purpose and live it out at TGNM.",
        ],
        sw: [
          "Kanisa ni ushirika ambapo wale wanaomjua Kristo wameunganishwa pamoja katika Roho; ni darasa ambapo kweli kuu hufafanuliwa na mafundisho juu ya kila fadhila ya Kikristo hutolewa; na ni kitalu ambapo Wakristo wachanga hukuzwa hadi ukomavu.",
          "The Good News Mission ni zaidi ya kanisa. Ni familia ya waumini waliokusanyika pamoja kushiriki upendo wa Mungu. Kazi yetu ya kwanza ni kukusaidia uwe mtu ambaye Mungu alikuumba uwe. Popote ulipo katika safari yako ya imani, umealikwa kugundua kusudi lako na kuliishi hapa TGNM.",
        ],
      },
    },
    {
      heading: { en: "Our Mission", sw: "Dhamira Yetu" },
      paragraphs: {
        en: [
          "Our mission is to preach the Good News of our Lord Jesus Christ that brings salvation to every soul that hears and believes, across the world. We are determined to bring souls to Christ, then teach them, train them in the area of their gifting, and later commission them to win more souls for Jesus.",
        ],
        sw: [
          "Dhamira yetu ni kuhubiri Habari Njema ya Bwana wetu Yesu Kristo inayoleta wokovu kwa kila roho inayosikia na kuamini, duniani kote. Tumeazimia kuwaleta watu kwa Kristo, kisha kuwafundisha, kuwafunza katika eneo la kipawa chao, na baadaye kuwatuma waokoe roho zaidi kwa ajili ya Yesu.",
        ],
      },
    },
    {
      heading: { en: "Our Vision", sw: "Maono Yetu" },
      paragraphs: {
        en: [
          "Our vision is to go out into the ripened world and win more souls for Jesus. We intend to leverage every available tool — technology, people, corporations and airwaves — to reach people across the world, with particular emphasis on nations where the gospel is least accessible.",
        ],
        sw: [
          "Maono yetu ni kwenda katika ulimwengu ulioiva na kuokoa roho zaidi kwa ajili ya Yesu. Tunakusudia kutumia kila chombo kinachopatikana — teknolojia, watu, mashirika na mawimbi ya redio — kuwafikia watu duniani kote, tukiweka mkazo wa pekee kwa mataifa ambako injili haipatikani kwa urahisi.",
        ],
      },
    },
    {
      heading: { en: "How We Reach Out", sw: "Jinsi Tunavyofikia Watu" },
      paragraphs: {
        en: ["We intend to use every available tool to reach out. They include:"],
        sw: ["Tunakusudia kutumia kila chombo kinachopatikana kufikia watu. Vinajumuisha:"],
      },
      bullets: {
        en: [
          "Harnessing the power of social media and using it to reach more people, including in countries that are suppressing Christianity.",
          "Using our website to disseminate information to people across the world on soul winning and biblical teaching.",
          "Empowering brethren by training them to be effective missionaries in their own societies.",
          "Commissioning missionaries both locally and internationally, and much more as God enables us.",
        ],
        sw: [
          "Kutumia nguvu ya mitandao ya kijamii kuwafikia watu wengi zaidi, ikiwa ni pamoja na katika nchi zinazokandamiza Ukristo.",
          "Kutumia tovuti yetu kusambaza taarifa kwa watu duniani kote kuhusu uokoaji wa roho na mafundisho ya kibiblia.",
          "Kuwawezesha ndugu kwa kuwafunza wawe wamisionari wenye matokeo katika jamii zao wenyewe.",
          "Kutuma wamisionari ndani na nje ya nchi, na mengi zaidi kadiri Mungu atakavyotuwezesha.",
        ],
      },
    },
    {
      heading: { en: "The Great Commission", sw: "Agizo Kuu" },
      paragraphs: {
        en: [
          "“Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.” — Matthew 28:19–20",
        ],
        sw: [
          "“Basi enendeni, mkawafanye mataifa yote kuwa wanafunzi, mkiwabatiza kwa jina la Baba, na Mwana, na Roho Mtakatifu; na kuwafundisha kuyashika yote niliyowaamuru ninyi; na tazama, mimi nipo pamoja nanyi siku zote, hata ukamilifu wa dahari.” — Mathayo 28:19–20",
        ],
      },
    },
  ],
};

export const faithPage: StaticPage = {
  title: { en: "Our Faith", sw: "Imani Yetu" },
  intro: {
    en: "What we believe, and why it shapes everything we do as a missionary sending church.",
    sw: "Tunachoamini, na kwa nini kinaunda kila tunachofanya kama kanisa linalotuma wamisionari.",
  },
  sections: [
    {
      heading: { en: "What We Believe", sw: "Tunachoamini" },
      bullets: {
        en: [
          "The Bible is the inspired, infallible and authoritative written word of God.",
          "There is one God, eternally existing in three persons: God the Father, God the Son and God the Holy Ghost.",
          "In the deity of our Lord Jesus Christ: His virgin birth, His sinless life, His miracles, His vicarious and atoning death, His bodily resurrection, His ascension to the right hand of the Father, and His future return to earth in power and glory.",
          "In the blessed hope and the rapture of the Church at Christ's coming.",
          "The only means of being cleansed from sin is through repentance and faith in the precious blood of Christ.",
          "Regeneration by the Holy Spirit is absolutely essential for personal salvation.",
          "In water baptism by immersion.",
          "The redemptive work of Christ on the cross provides healing of the human body in answer to believing prayer.",
          "The baptism in the Holy Spirit, according to Acts 2:4, is given to believers who ask for it.",
          "In the sanctifying power of the Holy Spirit, by whose indwelling the Christian is enabled to live a holy life.",
          "In the Lord's Supper.",
          "In the millennial or second coming of Jesus: first, to resurrect the righteous dead and receive the living saints to Him in the air; second, to reign on earth a thousand years.",
          "In the bodily resurrection; eternal life for the righteous and eternal punishment for the wicked.",
        ],
        sw: [
          "Biblia ni neno la Mungu lililoandikwa kwa uvuvio, lisilokosea na lenye mamlaka.",
          "Kuna Mungu mmoja, aliyeko milele katika nafsi tatu: Mungu Baba, Mungu Mwana na Mungu Roho Mtakatifu.",
          "Katika Uungu wa Bwana wetu Yesu Kristo: kuzaliwa kwake na bikira, maisha yake yasiyo na dhambi, miujiza yake, kifo chake cha ukombozi na upatanisho, ufufuo wake wa mwili, kupaa kwake mkono wa kuume wa Baba, na kurudi kwake duniani kwa nguvu na utukufu.",
          "Katika tumaini lililobarikiwa na kunyakuliwa kwa Kanisa wakati wa kuja kwa Kristo.",
          "Njia pekee ya kusafishwa dhambi ni kupitia toba na imani katika damu ya thamani ya Kristo.",
          "Kuzaliwa upya kwa Roho Mtakatifu ni muhimu kabisa kwa wokovu wa binafsi.",
          "Katika ubatizo wa maji kwa kuzamishwa.",
          "Kazi ya ukombozi ya Kristo msalabani hutoa uponyaji wa mwili wa binadamu kwa jibu la maombi ya imani.",
          "Ubatizo wa Roho Mtakatifu, kwa mujibu wa Matendo 2:4, hutolewa kwa waumini wanaouomba.",
          "Katika nguvu ya utakaso ya Roho Mtakatifu, ambaye kwa kukaa kwake ndani Mkristo huwezeshwa kuishi maisha matakatifu.",
          "Katika Meza ya Bwana.",
          "Katika ujio wa pili wa Yesu: kwanza, kuwafufua wenye haki waliokufa na kuwapokea watakatifu walio hai kwake angani; pili, kutawala duniani miaka elfu moja.",
          "Katika ufufuo wa mwili; uzima wa milele kwa wenye haki na adhabu ya milele kwa waovu.",
        ],
      },
    },
    {
      heading: {
        en: "Every Believer Is Primarily a Missionary",
        sw: "Kila Muumini Kimsingi Ni Mmisionari",
      },
      paragraphs: {
        en: [
          "Soul winning is not just an ambition for a few choice souls who wish to be accounted wise in the sight of God. It is a statement which sets out the great task in which every believer is involved because of his or her relationship with God.",
          "“The fruit of the righteous is a tree of life, and he that wins souls is wise.” — Proverbs 11:30",
        ],
        sw: [
          "Kuokoa roho si tu shauku ya watu wachache wateule wanaotaka kuhesabiwa wenye hekima machoni pa Mungu. Ni tamko linaloweka wazi kazi kuu ambayo kila muumini anahusika nayo kwa sababu ya uhusiano wake na Mungu.",
          "“Tunda la mwenye haki ni mti wa uzima, naye mwenye hekima huvuta roho za watu.” — Mithali 11:30",
        ],
      },
    },
    {
      heading: { en: "The Apostles' Creed", sw: "Imani ya Mitume" },
      paragraphs: {
        en: [
          "I believe in God, the Father almighty, creator of heaven and earth.",
          "I believe in Jesus Christ, God's only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried; He descended to the dead. On the third day He rose again; He ascended into heaven, He is seated at the right hand of the Father, and He will come to judge the living and the dead.",
          "I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and the life everlasting. Amen.",
        ],
        sw: [
          "Ninamwamini Mungu, Baba Mwenyezi, muumba wa mbingu na nchi.",
          "Ninamwamini Yesu Kristo, Mwana pekee wa Mungu, Bwana wetu, aliyechukuliwa mimba kwa uweza wa Roho Mtakatifu, akazaliwa na Bikira Maria, akateswa chini ya Pontio Pilato, akasulubiwa, akafa, akazikwa; alishuka kwa wafu. Siku ya tatu alifufuka; alipaa mbinguni, ameketi mkono wa kuume wa Baba, naye atakuja kuwahukumu walio hai na waliokufa.",
          "Ninamwamini Roho Mtakatifu, Kanisa takatifu katoliki, ushirika wa watakatifu, ondoleo la dhambi, ufufuo wa mwili, na uzima wa milele. Amina.",
        ],
      },
    },
  ],
};

export const statutesPage: StaticPage = {
  title: { en: "Our Statutes", sw: "Katiba Yetu" },
  intro: {
    en: "The statutes that govern the order, membership and administration of The Good News Mission.",
    sw: "Katiba inayoongoza utaratibu, uanachama na uendeshaji wa The Good News Mission.",
  },
  sections: [
    {
      heading: { en: "Content to be added", sw: "Maudhui yataongezwa" },
      paragraphs: {
        en: [
          "The full text of the church statutes will be published here. Replace this section in src/content/pages.ts with the official document once it has been supplied.",
        ],
        sw: [
          "Maandishi kamili ya katiba ya kanisa yatachapishwa hapa. Badilisha sehemu hii katika src/content/pages.ts na hati rasmi mara itakapotolewa.",
        ],
      },
    },
  ],
};

export const strategicPlanPage: StaticPage = {
  title: { en: "Our Strategic Plan", sw: "Mpango Wetu wa Kimkakati" },
  intro: {
    en: "The desire of The Good News Mission is to reach out to as many people as possible with the Good News of Jesus Christ that saves. We are therefore putting in place processes that will help us realise this great commission of our Lord Jesus Christ.",
    sw: "Shauku ya The Good News Mission ni kuwafikia watu wengi iwezekanavyo kwa Habari Njema ya Yesu Kristo inayookoa. Kwa hiyo tunaweka mifumo itakayotusaidia kutimiza agizo hili kuu la Bwana wetu Yesu Kristo.",
  },
  sections: [
    {
      heading: {
        en: "Aligning Our Programmes to Outreach",
        sw: "Kuoanisha Programu Zetu na Uinjilisti",
      },
      paragraphs: {
        en: [
          "We are aligning our church programmes to emphasise outreach and soul winning. This includes committing 80% of our church finances towards outreach and soul winning.",
        ],
        sw: [
          "Tunaoanisha programu za kanisa letu ili kusisitiza uinjilisti na uokoaji wa roho. Hii inajumuisha kutenga asilimia 80 ya fedha za kanisa letu kwa ajili ya uinjilisti na uokoaji wa roho.",
        ],
      },
    },
    {
      heading: {
        en: "Training and Commissioning Missionaries",
        sw: "Kufunza na Kutuma Wamisionari",
      },
      paragraphs: {
        en: [
          "We are teaching church members on outreach and soul winning by holding seminars and trainings. The long-term outcome desired from this process is to have moulded a team of active missionaries who will be deployed within and outside the country to do the mission work.",
        ],
        sw: [
          "Tunawafundisha waumini wa kanisa kuhusu uinjilisti na uokoaji wa roho kwa kufanya semina na mafunzo. Matokeo ya muda mrefu yanayotarajiwa kutoka kwa mchakato huu ni kuwa tumeunda timu ya wamisionari hai watakaotumwa ndani na nje ya nchi kufanya kazi ya misheni.",
        ],
      },
    },
    {
      heading: { en: "Reaching the Least Reached", sw: "Kuwafikia Waliofikiwa Kidogo" },
      paragraphs: {
        en: [
          "We give particular emphasis to nations where the gospel is least accessible, using technology, partnerships and airwaves to reach people that a physical missionary presence cannot easily reach.",
        ],
        sw: [
          "Tunaweka mkazo wa pekee kwa mataifa ambako injili haipatikani kwa urahisi, tukitumia teknolojia, ushirikiano na mawimbi ya redio kuwafikia watu ambao uwepo wa kimwili wa wamisionari hauwezi kuwafikia kwa urahisi.",
        ],
      },
    },
  ],
};

export const pastorMessagePage: StaticPage = {
  title: { en: "Message From Our Pastor", sw: "Ujumbe Kutoka kwa Mchungaji Wetu" },
  intro: {
    en: "I take this wonderful moment to welcome you to our church.",
    sw: "Nachukua nafasi hii nzuri kukukaribisha kanisani kwetu.",
  },
  sections: [
    {
      paragraphs: {
        en: [
          "Our church is driven by the desire to reach every soul with the good news of our Lord Jesus Christ — the good news that brings salvation to the lost. We are a group of people committed to following Jesus. This means that we encourage prayer in church and throughout life, and that we show love to people outside the church through generosity, invitation and compassion.",
          "We truly love all people that fellowship here, as well as all visitors that come our way. We also take great interest in the development of individual members. We nurture their talents and gifts and then give them room to serve God in their area of gifting.",
          "Not only do we regard those that are of the fellowship of the brethren, but we also reach out to all people that are not born again with love and with joy. We give a hand of friendship to them too by praying with them, giving food to the hungry, offering guidance and counselling to those that need it, and much more.",
          "We cannot explicitly state all things here — but if you can come, you will experience a wonderful place to serve God.",
          "God bless you as you plan to come and fellowship with us.",
        ],
        sw: [
          "Kanisa letu linaendeshwa na shauku ya kumfikia kila mtu kwa habari njema ya Bwana wetu Yesu Kristo — habari njema inayoleta wokovu kwa waliopotea. Sisi ni kundi la watu waliojitoa kumfuata Yesu. Hii ina maana kwamba tunahimiza maombi kanisani na katika maisha yote, na kwamba tunaonyesha upendo kwa watu walio nje ya kanisa kupitia ukarimu, mwaliko na huruma.",
          "Tunawapenda kweli watu wote wanaoabudu hapa, pamoja na wageni wote wanaotujia. Pia tunapenda sana maendeleo ya kila mwanachama. Tunalea vipaji na vipawa vyao kisha tunawapa nafasi ya kumtumikia Mungu katika eneo la kipawa chao.",
          "Si tu kwamba tunawajali walio katika ushirika wa ndugu, bali pia tunawafikia watu wote ambao hawajazaliwa mara ya pili kwa upendo na kwa furaha. Tunawapa mkono wa urafiki pia kwa kuomba nao, kuwapa chakula wenye njaa, kutoa mwongozo na ushauri nasaha kwa wanaohitaji, na mengi zaidi.",
          "Hatuwezi kueleza mambo yote hapa kwa undani — lakini ukiweza kuja, utapata mahali pazuri pa kumtumikia Mungu.",
          "Mungu akubariki unapopanga kuja kuabudu nasi.",
        ],
      },
    },
    {
      heading: { en: "On Evangelism", sw: "Kuhusu Uinjilisti" },
      paragraphs: {
        en: [
          "“Evangelism is grounded in the very nature of God. Not only is Jesus the motivating power within us, but He is also the great example to us. Paul states: Let this mind be in you which was also in Christ Jesus, who being in the form of God, did not consider it robbery to be equal with God, but made Himself of no reputation… but humbled Himself… became obedient to the point of death, even the death of the cross.”",
          "Evangelism is neither debatable nor optional; it is obligatory. The gospel must be proclaimed. All who know Him must make Him known.",
        ],
        sw: [
          "“Uinjilisti umejikita katika asili yenyewe ya Mungu. Si tu kwamba Yesu ni nguvu inayotusukuma ndani yetu, bali pia ni mfano mkuu kwetu. Paulo anasema: Iweni na nia ile ile iliyokuwamo ndani ya Kristo Yesu, ambaye yeye mwanzo alikuwa yuna namna ya Mungu, naye hakuona kwamba kuwa sawa na Mungu ni kitu cha kushikamana nacho, bali alijifanya kuwa hana utukufu… bali alijinyenyekeza… akawa mtii hata mauti, naam, mauti ya msalaba.”",
          "Uinjilisti si jambo la mjadala wala si la hiari; ni la lazima. Injili lazima itangazwe. Wote wanaomjua lazima wamfanye ajulikane.",
        ],
      },
    },
  ],
};

export const firstLadyMessagePage: StaticPage = {
  title: {
    en: "Message From Our First Lady",
    sw: "Ujumbe Kutoka kwa Mama Kanisa",
  },
  intro: {
    en: "A warm welcome to every woman, every family and every visitor.",
    sw: "Karibu sana kwa kila mwanamke, kila familia na kila mgeni.",
  },
  sections: [
    {
      heading: { en: "Content to be added", sw: "Maudhui yataongezwa" },
      paragraphs: {
        en: [
          "The First Lady's message will be published here. Replace this section in src/content/pages.ts with the final text once it has been supplied.",
        ],
        sw: [
          "Ujumbe wa Mama Kanisa utachapishwa hapa. Badilisha sehemu hii katika src/content/pages.ts na maandishi ya mwisho mara yatakapotolewa.",
        ],
      },
    },
  ],
};

export const resourcesPage: StaticPage = {
  title: { en: "Resources", sw: "Rasilimali" },
  intro: {
    en: "Teaching materials, study guides and downloads to help you grow in the word.",
    sw: "Vifaa vya kufundishia, miongozo ya masomo na vipakuliwa vya kukusaidia kukua katika neno.",
  },
  sections: [
    {
      heading: { en: "Coming soon", sw: "Inakuja hivi karibuni" },
      paragraphs: {
        en: [
          "Resources will be listed here as they are published. Add them in src/content/pages.ts, or replace this page with a downloads listing once files are available.",
        ],
        sw: [
          "Rasilimali zitaorodheshwa hapa zitakapochapishwa. Ziongeze katika src/content/pages.ts, au badilisha ukurasa huu na orodha ya vipakuliwa mara faili zitakapopatikana.",
        ],
      },
    },
  ],
};
