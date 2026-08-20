import type { Locale } from "./config";

/**
 * UI chrome — buttons, labels, headings that are not page content.
 * Page content itself lives in src/content/*, keyed by the same locales.
 *
 * NOTE: the Swahili here was written for the rebuild and has NOT yet been
 * reviewed by a first-language Kiswahili speaker. Have someone in the church
 * read it before this goes live.
 */
export type Dictionary = {
  nav: Record<string, string>;
  common: {
    readMore: string;
    continueReading: string;
    seeAll: string;
    allMinistries: string;
    allArticles: string;
    backHome: string;
    give: string;
    giveNow: string;
    ourCauses: string;
    planVisit: string;
    listenSermon: string;
    learnMore: string;
    /** Carousel controls. `carouselSlide` uses {n} and {total} placeholders. */
    carouselLabel: string;
    carouselSlide: string;
    carouselPrev: string;
    carouselNext: string;
    carouselPause: string;
    carouselPlay: string;
    carouselGoTo: string;
    getInTouch: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    upcoming: string;
    past: string;
    date: string;
    location: string;
    speaker: string;
    by: string;
    quickLinks: string;
    ourMinistries: string;
    contactUs: string;
    address: string;
    phone: string;
    email: string;
    sunday: string;
    duringWeek: string;
    comingSoon: string;
    notFound: string;
    notFoundBody: string;
    close: string;
    previous: string;
    next: string;
    play: string;
    videoBlocked: string;
    watchThere: string;
    current: string;
    earlier: string;
    posted: string;
    readNotice: string;
    allNotices: string;
    noPhotosYet: string;
    noVideosYet: string;
    download: string;
    notReadyYet: string;
  };
  form: {
    heading: string;
    lede: string;
    name: string;
    phone: string;
    email: string;
    contactHint: string;
    message: string;
    messagePlaceholder: string;
    planningVisit: string;
    wantsPrayer: string;
    submit: string;
    submitting: string;
    sent: string;
    sentBody: string;
    errRequired: string;
    errContactRequired: string;
    errTooLong: string;
    errNotConfigured: string;
    errFailed: string;
    orCall: string;
  };
  home: {
    heroTitle: string;
    heroBody: string;
    welcomeEyebrow: string;
    welcomeTitle: string;
    welcomeBody: string;
    andrewEyebrow: string;
    andrewTitle: string;
    andrewBody1: string;
    andrewBody2: string;
    andrewCta: string;
    soulsTitle: string;
    soulsBody: string;
    ministriesEyebrow: string;
    ministriesTitle: string;
    eventsEyebrow: string;
    eventsTitle: string;
    sermonEyebrow: string;
    sermonTitle: string;
    blogEyebrow: string;
    blogTitle: string;
    givingTitle: string;
    givingBody: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesOutro: string;
  };
};

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About Us",
    aboutChurch: "About The Good News Mission",
    faith: "Our Faith",
    statutes: "Our Statutes",
    strategicPlan: "Our Strategic Plan",
    pastorMessage: "Message From Our Pastor",
    firstLadyMessage: "Message From Our First Lady",
    leadership: "Our Leadership",
    ministries: "Ministries",
    sermons: "Sermons",
    events: "Events",
    blog: "Blog",
    media: "Media",
    announcements: "Announcements",
    gallery: "Gallery",
    videos: "Videos",
    resources: "Resources",
    contact: "Contact Us",
    planVisit: "Plan Your Visit",
  },
  common: {
    readMore: "Read more",
    continueReading: "Continue reading",
    seeAll: "See all events",
    allMinistries: "All ministries",
    allArticles: "All articles",
    backHome: "Back to the home page",
    give: "Give",
    giveNow: "Give Now",
    ourCauses: "See Our Causes",
    planVisit: "Plan Your Visit",
    listenSermon: "Listen to a Sermon",
    carouselLabel: "Welcome",
    carouselSlide: "Slide {n} of {total}",
    carouselPrev: "Previous slide",
    carouselNext: "Next slide",
    carouselPause: "Pause the slideshow",
    carouselPlay: "Play the slideshow",
    carouselGoTo: "Choose a slide",
    learnMore: "Learn More About Us",
    getInTouch: "Get in touch",
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    upcoming: "Upcoming",
    past: "Past events",
    date: "Date",
    location: "Location",
    speaker: "Speaker",
    by: "By",
    quickLinks: "Quick Links",
    ourMinistries: "Our Ministries",
    contactUs: "Contact Us",
    address: "Address",
    phone: "Phone",
    email: "Email",
    sunday: "Sunday",
    duringWeek: "During the week",
    comingSoon: "Coming soon",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    play: "Play",
    videoBlocked: "If the video will not load on your network,",
    watchThere: "watch it on the provider's site",
    current: "Current",
    earlier: "Earlier notices",
    posted: "Posted",
    readNotice: "Read the full notice",
    allNotices: "All announcements",
    noPhotosYet:
      "No photographs have been published in this album yet. They will appear here once the media team adds them.",
    noVideosYet:
      "No recordings have been published yet. Once the media team adds them, they will appear here — and nothing will load until you press play.",
    download: "Download",
    notReadyYet: "Not published yet",
    notFound: "We couldn't find that page",
    notFoundBody:
      "The page you are looking for may have moved or no longer exists.",
  },
  form: {
    heading: "Say hello",
    lede: "Tell us you are coming, ask a question, or ask for prayer. A real person reads every message.",
    name: "Your name",
    phone: "Phone or WhatsApp",
    email: "Email",
    contactHint: "Give us a phone number or an email — whichever you prefer we use.",
    message: "Your message",
    messagePlaceholder: "Anything you would like us to know…",
    planningVisit: "I am planning to visit",
    wantsPrayer: "I would like someone to pray with me",
    submit: "Send",
    submitting: "Sending…",
    sent: "Thank you — we have your message.",
    sentBody: "Someone from the church will get back to you. If it is urgent, please call or WhatsApp us.",
    errRequired: "Please give us your name and a message.",
    errContactRequired: "Please leave a phone number or an email so we can reply.",
    errTooLong: "That is longer than we can accept. Please shorten it a little.",
    errNotConfigured: "We cannot send this from the website just yet. Please call or WhatsApp us instead — we do not want to lose your message.",
    errFailed: "Something went wrong sending that. Please try again, or call or WhatsApp us.",
    orCall: "Or reach us directly",
  },
  home: {
    heroTitle: "You're Welcome Here",
    heroBody:
      "A dynamic, multicultural, missionary sending church in Nairobi. Join us every Sunday to celebrate Jesus and our faith in Him.",
    welcomeEyebrow: "Become new now!",
    welcomeTitle: "You're Welcome Here; Where Everyone is Someone!",
    welcomeBody:
      "The Good News Mission is more than a church! It's a family of believers who have come together to share the love of God. Our immediate task is to help you become the person God made you to be. No matter where you are in your journey of faith, you're invited to discover your purpose and live it out at TGNM.",
    andrewEyebrow: "The Andrew Month",
    andrewTitle: "Welcome to The Andrew Project",
    andrewBody1:
      "This coming month is our month of inviting family, friends, neighbours and strangers into the love of Christ. We have named this the Andrew Project Month!",
    andrewBody2:
      "Andrew invited Simon Peter, his brother, to Christ. Why not invite everyone close to us — our family, our friends and our colleagues — just like Andrew, to meet Christ?",
    andrewCta: "Join The Andrew Project",
    soulsTitle: "Our primary role as Christians is to win souls for Jesus!",
    soulsBody:
      "God is love, and this love which sent Jesus to the cross to save sinful man is within us. His spirit of self-denial and sacrifice possesses our lives, so that we are united with Him in this great crusade for the salvation of men and women.",
    ministriesEyebrow: "Get Involved",
    ministriesTitle: "Our Ministries",
    eventsEyebrow: "What's On",
    eventsTitle: "Our Events",
    sermonEyebrow: "Be Encouraged",
    sermonTitle: "Our Latest Sermon",
    blogEyebrow: "Read",
    blogTitle: "Latest From Our Blog",
    givingTitle: "Send Your Gift Now!",
    givingBody:
      "Your giving sends missionaries, feeds the hungry and carries the gospel to places we could never reach alone. Thank you for standing with us.",
    servicesEyebrow: "Join Us",
    servicesTitle: "Our Order of Services",
    servicesOutro:
      "We invite you to explore our website, and we are confident you will be blessed a great deal.",
  },
};

const sw: Dictionary = {
  nav: {
    home: "Nyumbani",
    about: "Kutuhusu",
    aboutChurch: "Kuhusu The Good News Mission",
    faith: "Imani Yetu",
    statutes: "Katiba Yetu",
    strategicPlan: "Mpango Wetu wa Kimkakati",
    pastorMessage: "Ujumbe Kutoka kwa Mchungaji",
    firstLadyMessage: "Ujumbe Kutoka kwa Mama Kanisa",
    leadership: "Uongozi Wetu",
    ministries: "Huduma",
    sermons: "Mahubiri",
    events: "Matukio",
    blog: "Blogu",
    media: "Vyombo vya Habari",
    announcements: "Matangazo",
    gallery: "Picha",
    videos: "Video",
    resources: "Rasilimali",
    contact: "Wasiliana Nasi",
    planVisit: "Panga Ujio Wako",
  },
  common: {
    readMore: "Soma zaidi",
    continueReading: "Endelea kusoma",
    seeAll: "Tazama matukio yote",
    allMinistries: "Huduma zote",
    allArticles: "Makala yote",
    backHome: "Rudi ukurasa wa nyumbani",
    give: "Toa",
    giveNow: "Toa Sasa",
    ourCauses: "Tazama Miradi Yetu",
    planVisit: "Panga Ujio Wako",
    listenSermon: "Sikiliza Hubiri",
    carouselLabel: "Karibu",
    carouselSlide: "Slaidi {n} kati ya {total}",
    carouselPrev: "Slaidi iliyotangulia",
    carouselNext: "Slaidi ifuatayo",
    carouselPause: "Simamisha slaidi",
    carouselPlay: "Endesha slaidi",
    carouselGoTo: "Chagua slaidi",
    learnMore: "Jifunze Zaidi Kutuhusu",
    getInTouch: "Wasiliana nasi",
    skipToContent: "Rukia yaliyomo",
    openMenu: "Fungua menyu",
    closeMenu: "Funga menyu",
    language: "Lugha",
    upcoming: "Yanayokuja",
    past: "Matukio yaliyopita",
    date: "Tarehe",
    location: "Mahali",
    speaker: "Mhubiri",
    by: "Na",
    quickLinks: "Viungo vya Haraka",
    ourMinistries: "Huduma Zetu",
    contactUs: "Wasiliana Nasi",
    address: "Anwani",
    phone: "Simu",
    email: "Barua pepe",
    sunday: "Jumapili",
    duringWeek: "Katikati ya wiki",
    comingSoon: "Inakuja hivi karibuni",
    close: "Funga",
    previous: "Picha iliyotangulia",
    next: "Picha inayofuata",
    play: "Cheza",
    videoBlocked: "Kama video haitapakia kwenye mtandao wako,",
    watchThere: "itazame kwenye tovuti ya mtoa huduma",
    current: "Ya sasa",
    earlier: "Matangazo ya awali",
    posted: "Ilichapishwa",
    readNotice: "Soma tangazo kamili",
    allNotices: "Matangazo yote",
    noPhotosYet:
      "Hakuna picha zilizochapishwa katika albamu hii bado. Zitaonekana hapa timu ya vyombo vya habari itakapoziongeza.",
    noVideosYet:
      "Hakuna rekodi zilizochapishwa bado. Timu ya vyombo vya habari itakapoziongeza, zitaonekana hapa — na hakuna kitakachopakia hadi ubonyeze cheza.",
    download: "Pakua",
    notReadyYet: "Haijachapishwa bado",
    notFound: "Hatukuweza kupata ukurasa huo",
    notFoundBody:
      "Ukurasa unaoutafuta huenda umehamishwa au haupo tena.",
  },
  form: {
    heading: "Tusalimie",
    lede: "Tuambie unakuja, uliza swali, au omba maombi. Mtu halisi husoma kila ujumbe.",
    name: "Jina lako",
    phone: "Simu au WhatsApp",
    email: "Barua pepe",
    contactHint: "Tupe nambari ya simu au barua pepe — ile unayopendelea tutumie.",
    message: "Ujumbe wako",
    messagePlaceholder: "Chochote ungependa tujue…",
    planningVisit: "Ninapanga kuja kutembelea",
    wantsPrayer: "Ningependa mtu aombe nami",
    submit: "Tuma",
    submitting: "Inatuma…",
    sent: "Asante — tumepokea ujumbe wako.",
    sentBody: "Mtu kutoka kanisani atakujibu. Kama ni jambo la haraka, tafadhali tupigie simu au WhatsApp.",
    errRequired: "Tafadhali tupe jina lako na ujumbe.",
    errContactRequired: "Tafadhali acha nambari ya simu au barua pepe ili tuweze kukujibu.",
    errTooLong: "Huo ni mrefu kuliko tunavyoweza kupokea. Tafadhali ufupishe kidogo.",
    errNotConfigured: "Hatuwezi kutuma hii kutoka tovuti kwa sasa. Tafadhali tupigie simu au WhatsApp badala yake — hatutaki kupoteza ujumbe wako.",
    errFailed: "Kuna hitilafu wakati wa kutuma. Tafadhali jaribu tena, au tupigie simu au WhatsApp.",
    orCall: "Au wasiliana nasi moja kwa moja",
  },
  home: {
    heroTitle: "Umekaribishwa Hapa",
    heroBody:
      "Kanisa lenye uhai, la tamaduni mbalimbali, linalotuma wamisionari, hapa Nairobi. Ungana nasi kila Jumapili kumsherehekea Yesu na imani yetu kwake.",
    welcomeEyebrow: "Uwe mpya sasa!",
    welcomeTitle: "Umekaribishwa Hapa; Mahali Kila Mtu ni Mtu!",
    welcomeBody:
      "The Good News Mission ni zaidi ya kanisa! Ni familia ya waumini waliokusanyika pamoja kushiriki upendo wa Mungu. Kazi yetu ya kwanza ni kukusaidia uwe mtu ambaye Mungu alikuumba uwe. Popote ulipo katika safari yako ya imani, umealikwa kugundua kusudi lako na kuliishi hapa TGNM.",
    andrewEyebrow: "Mwezi wa Andrea",
    andrewTitle: "Karibu katika Mradi wa Andrea",
    andrewBody1:
      "Mwezi ujao ni mwezi wetu wa kuwaalika familia, marafiki, majirani na wageni katika upendo wa Kristo. Tumeuita Mwezi wa Mradi wa Andrea!",
    andrewBody2:
      "Andrea alimwalika Simoni Petro, ndugu yake, kwa Kristo. Kwa nini tusiwaalike wote walio karibu nasi — familia zetu, marafiki zetu na wenzetu kazini — kama Andrea, ili wakutane na Kristo?",
    andrewCta: "Jiunge na Mradi wa Andrea",
    soulsTitle: "Jukumu letu kuu kama Wakristo ni kuokoa roho kwa ajili ya Yesu!",
    soulsBody:
      "Mungu ni upendo, na upendo huu uliomtuma Yesu msalabani kuokoa mwanadamu mwenye dhambi umo ndani yetu. Roho yake ya kujikana na kujitoa sadaka inamiliki maisha yetu, ili tuwe pamoja naye katika vita hivi vikuu vya wokovu wa wanaume na wanawake.",
    ministriesEyebrow: "Shiriki",
    ministriesTitle: "Huduma Zetu",
    eventsEyebrow: "Yanayoendelea",
    eventsTitle: "Matukio Yetu",
    sermonEyebrow: "Utiwe Moyo",
    sermonTitle: "Hubiri Letu la Hivi Punde",
    blogEyebrow: "Soma",
    blogTitle: "Mapya Kutoka Blogu Yetu",
    givingTitle: "Tuma Zawadi Yako Sasa!",
    givingBody:
      "Utoaji wako unatuma wamisionari, unalisha wenye njaa na unapeleka injili mahali ambapo tusingeweza kufika peke yetu. Asante kwa kusimama nasi.",
    servicesEyebrow: "Ungana Nasi",
    servicesTitle: "Ratiba ya Ibada Zetu",
    servicesOutro:
      "Tunakukaribisha kuchunguza tovuti yetu, na tuna hakika utabarikiwa sana.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, sw };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
