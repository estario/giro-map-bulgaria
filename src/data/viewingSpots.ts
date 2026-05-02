import type { Lang } from "@/i18n/translations";

export type ViewingSpotI18n = {
  title: string;
  description?: string;
};

export type ViewingSpot = {
  id: string;
  stageId: 1 | 2 | 3;
  /** [lat, lng] */
  coords: [number, number];
  /** Bulgarian (default) content */
  title: string;
  description?: string;
  /** Translations */
  i18n?: Partial<Record<Lang, ViewingSpotI18n>>;
};

/**
 * Recommended viewing spots for the Giro d'Italia 2026 stages in Bulgaria.
 * Sourced from the official "Места за гледане" guide.
 */
export const viewingSpots: ViewingSpot[] = [
  // ============ STAGE 1: Несебър → Бургас ============
  {
    id: "s1-nesebar-old-town",
    stageId: 1,
    coords: [42.6606, 27.7345],
    title: "Старият град в Несебър",
    description:
      "Включително входа и покрай двете църкви. Това е неутралната зона — колоездачите ще минават бавно и могат да бъдат видяни в непосредствена близост.",
    i18n: {
      en: {
        title: "Nessebar Old Town",
        description:
          "Including the entrance and around the two churches. This is the neutral zone — riders pass slowly and can be seen up close.",
      },
      it: {
        title: "Centro storico di Nessebar",
        description:
          "Inclusi l'ingresso e la zona delle due chiese. È la zona neutralizzata — i corridori passano lentamente e si possono vedere da vicinissimo.",
      },
    },
  },
  {
    id: "s1-burgas-24th-regiment",
    stageId: 1,
    coords: [42.4944, 27.4683],
    title: "Бургас — ул. „24-ти черноморски полк“",
    description:
      "Непосредствено до Морската градина. Колоната минава тук на път към и от финала.",
    i18n: {
      en: {
        title: "Burgas — 24th Black Sea Regiment St.",
        description:
          "Right next to the Sea Garden. The peloton passes here on the way to and from the finish.",
      },
      it: {
        title: "Burgas — Via 24° Reggimento del Mar Nero",
        description:
          "Proprio accanto al Giardino del Mare. Il gruppo passa qui sia in andata sia verso l'arrivo.",
      },
    },
  },
  {
    id: "s1-burgas-democracy",
    stageId: 1,
    coords: [42.5005, 27.4732],
    title: "Бургас — бул. „Демокрация“",
    description:
      "Колоездачите минават два пъти — в началото на етапа (около 39-ти км) и при финала.",
    i18n: {
      en: {
        title: "Burgas — Demokratsia Blvd.",
        description:
          "The riders pass twice — early in the stage (around km 39) and at the finish.",
      },
      it: {
        title: "Burgas — Viale Demokratsia",
        description:
          "I corridori passano due volte — a inizio tappa (intorno al km 39) e all'arrivo.",
      },
    },
  },
  {
    id: "s1-burgas-ivan-vazov",
    stageId: 1,
    coords: [42.4961, 27.4711],
    title: "Бургас — бул. „Иван Вазов“",
    description: "Колоната преминава отново в началото и в края на етапа.",
    i18n: {
      en: {
        title: "Burgas — Ivan Vazov Blvd.",
        description: "The peloton passes again early and at the end of the stage.",
      },
      it: {
        title: "Burgas — Viale Ivan Vazov",
        description: "Il gruppo passa di nuovo all'inizio e alla fine della tappa.",
      },
    },
  },
  {
    id: "s1-burgas-chernomorets",
    stageId: 1,
    coords: [42.4983, 27.4690],
    title: "Покрай стадион „Черноморец“",
    description: "Преминаване и в началото, и в края на етапа.",
    i18n: {
      en: {
        title: "By the 'Chernomorets' Stadium",
        description: "Passes both at the start and at the end of the stage.",
      },
      it: {
        title: "Vicino allo Stadio 'Chernomorets'",
        description: "Passaggio sia all'inizio sia alla fine della tappa.",
      },
    },
  },
  {
    id: "s1-sozopol-shofyorski",
    stageId: 1,
    coords: [42.4135, 27.6928],
    title: "Созопол — Шофьорски плаж",
    description:
      "Едно от най-добрите места за наблюдаване на групата — колоездачите ще бъдат в непосредствена близост по време на ~22-километровата градска обиколка.",
    i18n: {
      en: {
        title: "Sozopol — Shofyorski Beach",
        description:
          "One of the best spots to watch the peloton — riders pass extremely close during the ~22 km circuit around Sozopol.",
      },
      it: {
        title: "Sozopol — Spiaggia Shofyorski",
        description:
          "Uno dei posti migliori per vedere il gruppo — i corridori passano vicinissimi durante il circuito di ~22 km intorno a Sozopol.",
      },
    },
  },
  {
    id: "s1-dyuni",
    stageId: 1,
    coords: [42.4280, 27.5460],
    title: "Росен",
    description:
      "Колоната минава през Росен по път II-99 — на път към обиколката на Созопол и при връщането към Бургас (двукратно преминаване).",
    i18n: {
      en: {
        title: "Rosen",
        description:
          "The peloton passes through Rosen on road II-99 — heading to the Sozopol loop and again on the way back to Burgas (two passes).",
      },
      it: {
        title: "Rosen",
        description:
          "Il gruppo attraversa Rosen sulla strada II-99 — verso il circuito di Sozopol e di nuovo al ritorno verso Burgas (doppio passaggio).",
      },
    },
  },
  {
    id: "s1-sozopol-republikanska",
    stageId: 1,
    coords: [42.4172, 27.6953],
    title: "Созопол — ул. „Републиканска“ и пристанището",
    description:
      "Преминаване през центъра — покрай стадиона, по „Републиканска“, над пристанището и покрай плаж „Златна рибка“.",
    i18n: {
      en: {
        title: "Sozopol — Republikanska St. & port",
        description:
          "Passing through the centre — by the stadium, along Republikanska St., above the port and past 'Zlatna Ribka' beach.",
      },
      it: {
        title: "Sozopol — Via Republikanska e porto",
        description:
          "Passaggio nel centro — accanto allo stadio, lungo Via Republikanska, sopra il porto e lungo la spiaggia 'Zlatna Ribka'.",
      },
    },
  },

  // ============ STAGE 2: Бургас → Велико Търново ============
  {
    id: "s2-aytos-slavyanska",
    stageId: 2,
    coords: [42.6996, 27.2476],
    title: "Айтос — ул. „Славянска“",
    description: "Колоната минава през Айтос по ул. „Славянска“.",
    i18n: {
      en: {
        title: "Aytos — Slavyanska St.",
        description: "The peloton passes through Aytos along Slavyanska St.",
      },
      it: {
        title: "Aytos — Via Slavyanska",
        description: "Il gruppo attraversa Aytos lungo Via Slavyanska.",
      },
    },
  },
  {
    id: "s2-karnobat-moskva",
    stageId: 2,
    coords: [42.6504, 26.9763],
    title: "Карнобат — ул. „Москва“",
    description: "Преминаване през Карнобат по ул. „Москва“.",
    i18n: {
      en: {
        title: "Karnobat — Moskva St.",
        description: "Passage through Karnobat along Moskva St.",
      },
      it: {
        title: "Karnobat — Via Moskva",
        description: "Passaggio attraverso Karnobat lungo Via Moskva.",
      },
    },
  },
  {
    id: "s2-sliven",
    stageId: 2,
    coords: [42.6824, 26.3225],
    title: "Сливен — централен маршрут",
    description:
      "Колоната минава по „Бургаско шосе“, „Братя Миладинови“, бул. „Цар Симеон“ и ул. „Димитър Пехливанов-Добрович“.",
    i18n: {
      en: {
        title: "Sliven — central route",
        description:
          "The peloton passes along Burgasko Shose, Bratya Miladinovi, Tsar Simeon Blvd. and Dimitar Pehlivanov-Dobrovich St.",
      },
      it: {
        title: "Sliven — percorso centrale",
        description:
          "Il gruppo passa per Burgasko Shose, Bratya Miladinovi, Viale Tsar Simeon e Via Dimitar Pehlivanov-Dobrovich.",
      },
    },
  },
  {
    id: "s2-vratnik",
    stageId: 2,
    coords: [42.8209, 26.1646],
    title: "Проход „Вратник“ / „Железни врата“",
    description: "Категоризираното изкачване по пътя към Велико Търново.",
    i18n: {
      en: {
        title: "Vratnik / 'Iron Gates' Pass",
        description: "The categorised climb on the way to Veliko Tarnovo.",
      },
      it: {
        title: "Passo Vratnik / 'Porte di Ferro'",
        description: "La salita classificata sulla strada verso Veliko Tarnovo.",
      },
    },
  },
  {
    id: "s2-byala",
    stageId: 2,
    coords: [42.7297, 26.1885],
    title: "Бяла",
    description: "Колоната минава през Бяла по главния път.",
    i18n: {
      en: { title: "Byala", description: "The peloton passes through Byala on the main road." },
      it: { title: "Byala", description: "Il gruppo attraversa Byala sulla strada principale." },
    },
  },
  {
    id: "s2-lyaskovets-monastery",
    stageId: 2,
    coords: [43.0903, 25.7009],
    title: "Лясковец — изкачване към манастира",
    description:
      "Колоната минава по бул. „Христо Ботев“, ул. „Манастирска“, покрай стадиона и започва изкачването към Лясковския манастир.",
    i18n: {
      en: {
        title: "Lyaskovets — climb to the monastery",
        description:
          "The peloton passes along Hristo Botev Blvd. and Manastirska St., past the stadium, then starts the climb to Lyaskovets Monastery.",
      },
      it: {
        title: "Lyaskovets — salita al monastero",
        description:
          "Il gruppo passa per Viale Hristo Botev e Via Manastirska, accanto allo stadio, poi inizia la salita al Monastero di Lyaskovets.",
      },
    },
  },
  {
    id: "s2-vt-entry",
    stageId: 2,
    coords: [43.0890, 25.6500],
    title: "Велико Търново — вход през ж.к. „Света гора“",
    description:
      "Влизане през ж.к. „Света гора“, ул. „Теодосий Търновски“, ул. „Димитър Найденов“, ул. „Сливница“, под Балдуиновата кула, ул. „Свети Климент Охридски“, покрай парк „Мини България“.",
    i18n: {
      en: {
        title: "Veliko Tarnovo — entry via Sveta Gora district",
        description:
          "Enters via Sveta Gora district, Teodosiy Tarnovski St., Dimitar Naydenov St., Slivnitsa St., under Baldwin's Tower, Sveti Kliment Ohridski St., past Mini Bulgaria park.",
      },
      it: {
        title: "Veliko Tarnovo — ingresso da Sveta Gora",
        description:
          "Ingresso dal quartiere Sveta Gora, Via Teodosiy Tarnovski, Via Dimitar Naydenov, Via Slivnitsa, sotto la Torre di Baldovino, Via Sveti Kliment Ohridski, accanto al parco Mini Bulgaria.",
      },
    },
  },
  {
    id: "s2-vt-finish",
    stageId: 2,
    coords: [43.0813, 25.6310],
    title: "Велико Търново — финал пред Театъра",
    description:
      "Площад „Цар Асен I“, ул. „Никола Пиколо“, ул. „Стефан Стамболов“ и финал на бул. „Васил Левски“ пред Театъра.",
    i18n: {
      en: {
        title: "Veliko Tarnovo — finish in front of the Theatre",
        description:
          "Tsar Asen I Square, Nikola Pikolo St., Stefan Stambolov St. and finish on Vasil Levski Blvd. in front of the Theatre.",
      },
      it: {
        title: "Veliko Tarnovo — arrivo davanti al Teatro",
        description:
          "Piazza Tsar Asen I, Via Nikola Pikolo, Via Stefan Stambolov e arrivo su Viale Vasil Levski davanti al Teatro.",
      },
    },
  },

  // ============ STAGE 3: Пловдив → София ============
  {
    id: "s3-plovdiv-central",
    stageId: 3,
    coords: [42.1473, 24.7503],
    title: "Пловдив — пл. „Централен“",
    description: "Неутрален старт, преминаване през тунела под Античния театър.",
    i18n: {
      en: {
        title: "Plovdiv — Central Square",
        description: "Neutral start, passing through the tunnel under the Roman Theatre.",
      },
      it: {
        title: "Plovdiv — Piazza Centrale",
        description: "Partenza neutralizzata, passaggio nel tunnel sotto il Teatro Romano.",
      },
    },
  },
  {
    id: "s3-pazardzhik",
    stageId: 3,
    coords: [42.1929, 24.3357],
    title: "Пазарджик — централен маршрут",
    description:
      "ул. „Пловдивска“, ул. „Генерал Гурко“, бул. „България“ и ул. „Христо Касабвелев“.",
    i18n: {
      en: {
        title: "Pazardzhik — central route",
        description: "Plovdivska St., General Gurko St., Bulgaria Blvd. and Hristo Kasabvelev St.",
      },
      it: {
        title: "Pazardzhik — percorso centrale",
        description: "Via Plovdivska, Via General Gurko, Viale Bulgaria e Via Hristo Kasabvelev.",
      },
    },
  },
  {
    id: "s3-dolna-banya",
    stageId: 3,
    coords: [42.3115, 23.7634],
    title: "Долна баня — ул. „Търговска“",
    description: "Колоната минава през центъра на Долна баня.",
    i18n: {
      en: {
        title: "Dolna Banya — Targovska St.",
        description: "The peloton passes through the centre of Dolna Banya.",
      },
      it: {
        title: "Dolna Banya — Via Targovska",
        description: "Il gruppo attraversa il centro di Dolna Banya.",
      },
    },
  },
  {
    id: "s3-borovets",
    stageId: 3,
    coords: [42.2657, 23.6091],
    title: "Боровец",
    description: "Преминаване през курорта Боровец.",
    i18n: {
      en: { title: "Borovets", description: "Passage through the Borovets ski resort." },
      it: { title: "Borovets", description: "Passaggio attraverso la stazione sciistica di Borovets." },
    },
  },
  {
    id: "s3-samokov",
    stageId: 3,
    coords: [42.3370, 23.5556],
    title: "Самоков — централен маршрут",
    description: "ул. „Цар Борис III“, бул. „Искър“ и ул. „Софийско шосе“.",
    i18n: {
      en: {
        title: "Samokov — central route",
        description: "Tsar Boris III St., Iskar Blvd. and Sofiysko Shose St.",
      },
      it: {
        title: "Samokov — percorso centrale",
        description: "Via Tsar Boris III, Viale Iskar e Via Sofiysko Shose.",
      },
    },
  },
  {
    id: "s3-yazovir-iskar",
    stageId: 3,
    coords: [42.4577, 23.5580],
    title: "Язовир „Искър“",
    description: "Колоната минава покрай язовира.",
    i18n: {
      en: { title: "Iskar Reservoir", description: "The peloton passes along the reservoir." },
      it: { title: "Lago di Iskar", description: "Il gruppo passa lungo il lago artificiale." },
    },
  },
  {
    id: "s3-kokalyane",
    stageId: 3,
    coords: [42.5679, 23.4483],
    title: "Кокаляне — „Самоковско шосе“",
    description: "Преминаване по Самоковско шосе.",
    i18n: {
      en: { title: "Kokalyane — Samokovsko Shose", description: "Passage along Samokovsko Shose." },
      it: { title: "Kokalyane — Samokovsko Shose", description: "Passaggio lungo Samokovsko Shose." },
    },
  },
  {
    id: "s3-pancharevo",
    stageId: 3,
    coords: [42.6122, 23.4109],
    title: "Панчарево",
    description: "Преминаване през Панчарево по „Самоковско шосе“ към „Цариградско шосе“.",
    i18n: {
      en: {
        title: "Pancharevo",
        description: "Passage through Pancharevo along Samokovsko Shose toward Tsarigradsko Shose.",
      },
      it: {
        title: "Pancharevo",
        description: "Passaggio attraverso Pancharevo lungo Samokovsko Shose verso Tsarigradsko Shose.",
      },
    },
  },
  {
    id: "s3-tsarigradsko",
    stageId: 3,
    coords: [42.6650, 23.4017],
    title: "София — „Цариградско шосе“",
    description: "Влизане в София по „Цариградско шосе“ към финала.",
    i18n: {
      en: {
        title: "Sofia — Tsarigradsko Shose",
        description: "Entry into Sofia along Tsarigradsko Shose toward the finish.",
      },
      it: {
        title: "Sofia — Tsarigradsko Shose",
        description: "Ingresso a Sofia lungo Tsarigradsko Shose verso l'arrivo.",
      },
    },
  },
];

export function localizeViewingSpot(spot: ViewingSpot, lang: Lang): ViewingSpotI18n {
  if (lang === "bg") return { title: spot.title, description: spot.description };
  const tr = spot.i18n?.[lang];
  if (!tr) return { title: spot.title, description: spot.description };
  return {
    title: tr.title || spot.title,
    description: tr.description ?? spot.description,
  };
}