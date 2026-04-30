export type Lang = "bg" | "en" | "it";

export const LANG_LABELS: Record<Lang, string> = {
  bg: "БГ",
  en: "EN",
  it: "IT",
};

export const LANG_FULL: Record<Lang, string> = {
  bg: "Български",
  en: "English",
  it: "Italiano",
};

type Dict = {
  // Header
  grandePartenza: string;
  bulgaria2026: string;
  heroTitle: string;
  heroSubtitle: string;
  totalKm: (km: number) => string;
  dates: string;
  stagesCities: string;

  // Map section
  mapHeading: string;
  mapSubtitle: string;
  allStages: string;
  stageN: (n: number) => string;

  // Map controls / labels
  findMe: string;
  hideEvents: string;
  showEvents: string;
  hideKm: string;
  showKm: string;
  routingLabel: string;
  legendEvents: string;
  geoError: string;
  yourPosition: string;

  // Popups
  finishStageN: (n: number) => string;
  startStageN: (n: number) => string;
  sharedPointDesc: (a: number, b: number) => string;
  finishE: (n: number) => string;
  startE: (n: number) => string;
  road: string;
  totalKmLabel: string;
  toFinishLabel: string;
  passingLabel: string;
  closureLabel: string;
  eventsCount: (n: number) => string;
  closuresPin: string;
  eventsAt: (n: number) => string;

  // Stage detail
  schedule: string;
  place: string;
  km: string;
  passing: string;
  closure: string;
  closedStreets: string;
  closedStreetsSub: string;

  // Near me
  nearYou: string;
  yourPositionLabel: string;
  nearRouteAlert: string;
  closestPoint: string;
  closesAt: string;
  passesAt: string;
  findMeHint: string;
  findMeHintTitle: string;
  distancesNote: string;

  // Cultural program
  cultProgramKicker: string;
  cultProgramTitle: string;
  cultProgramSubtitle: (n: number) => string;
  eventsLabel: string;

  // Footer
  footerText: string;
  burgasUmap: string;

  // Stage names & cities (kept for translation tooltips, but topo names stay native)
  // Months / weekdays
  weekdays: string[];
  months: string[];

  metres: string;
  kmShort: string;
};

export const T: Record<Lang, Dict> = {
  bg: {
    grandePartenza: "Grande Partenza",
    bulgaria2026: "България 2026",
    heroTitle: "Giro d'Italia 2026",
    heroSubtitle:
      "Първите три етапа на легендарната Обиколка на Италия преминават през България — 8, 9 и 10 май 2026 г. Виж маршрута на картата и часовете, в които улиците ще бъдат затворени за движение.",
    totalKm: (km) => `${km} км общо`,
    dates: "8 – 10 май 2026",
    stagesCities: "3 етапа · 5 града",
    mapHeading: "Маршрут на картата",
    mapSubtitle:
      "Бургас е нанесен с детайлните uMap слоеве от референцията; останалите етапи се чертаят по OSRM.",
    allStages: "Всички етапи",
    stageN: (n) => `Етап ${n}`,
    findMe: "Намери ме",
    hideEvents: "Скрий събития",
    showEvents: "Покажи събития",
    hideKm: "Скрий KM маркери",
    showKm: "Покажи KM маркери",
    routingLabel: "Изчертаване по реалните пътища…",
    legendEvents: "Събития",
    geoError: "Не успяхме да намерим позицията ти. Разреши достъп до локация в браузъра.",
    yourPosition: "Твоята позиция",
    finishStageN: (n) => `🏆 Финал Етап ${n}`,
    startStageN: (n) => `🏁 Старт Етап ${n}`,
    sharedPointDesc: (a, b) =>
      `Една и съща точка — финалът на етап ${a} и стартът на етап ${b} са на едно и също място.`,
    finishE: (n) => `Финал Е${n}:`,
    startE: (n) => `Старт Е${n}:`,
    road: "Път",
    totalKmLabel: "Общо км:",
    toFinishLabel: "До финал:",
    passingLabel: "Преминаване:",
    closureLabel: "Затваряне:",
    eventsCount: (n) => `${n} събития`,
    schedule: "График за преминаване",
    place: "Място",
    km: "км",
    passing: "Преминаване",
    closure: "Затваряне",
    closedStreets: "Затворени улици",
    closedStreetsSub: "Подробен график по град и времеви интервал.",
    nearYou: "Около теб",
    yourPositionLabel: "Твоята позиция:",
    nearRouteAlert: "Ти си близо до маршрута!",
    closestPoint: "Най-близка точка:",
    closesAt: "Затваря се в",
    passesAt: "колоната преминава в",
    findMeHintTitle: "Виж кои затваряния са близо до теб",
    findMeHint:
      "Натисни „Намери ме“ в горния десен ъгъл на картата, за да покажем най-близките точки от маршрута и часовете на затваряне.",
    distancesNote:
      "Разстоянията са по права линия. Часовете са според официалния график на етапа.",
    cultProgramKicker: "Културна и спортна програма",
    cultProgramTitle: "Какво се случва в градовете домакини",
    cultProgramSubtitle: (n) =>
      `${n} събития в 5 града — концерти, изложби, велопаради, церемонии и детски активности.`,
    eventsLabel: "събития",
    footerText:
      "Данните са според официалните графици за затваряне на улици и графиците за преминаване на състезанието. Координатите на маршрута са приблизителни (по населени места). За пълна детайлна карта виж и",
    burgasUmap: "uMap за Бургас",
    weekdays: ["нед", "пон", "вто", "сря", "чет", "пет", "съб"],
    months: [
      "януари","февруари","март","април","май","юни",
      "юли","август","септември","октомври","ноември","декември",
    ],
    metres: "м",
    kmShort: "км",
  },
  en: {
    grandePartenza: "Grande Partenza",
    bulgaria2026: "Bulgaria 2026",
    heroTitle: "Giro d'Italia 2026",
    heroSubtitle:
      "The first three stages of the legendary Tour of Italy pass through Bulgaria — 8, 9 and 10 May 2026. See the route on the map and the times when the streets will be closed to traffic.",
    totalKm: (km) => `${km} km total`,
    dates: "8 – 10 May 2026",
    stagesCities: "3 stages · 5 cities",
    mapHeading: "Route on the map",
    mapSubtitle:
      "Burgas is drawn with the detailed uMap reference layers; the other stages are routed via OSRM.",
    allStages: "All stages",
    stageN: (n) => `Stage ${n}`,
    findMe: "Find me",
    hideEvents: "Hide events",
    showEvents: "Show events",
    hideKm: "Hide KM markers",
    showKm: "Show KM markers",
    routingLabel: "Drawing along real roads…",
    legendEvents: "Events",
    geoError: "We couldn't find your position. Please allow location access in the browser.",
    yourPosition: "Your position",
    finishStageN: (n) => `🏆 Stage ${n} finish`,
    startStageN: (n) => `🏁 Stage ${n} start`,
    sharedPointDesc: (a, b) =>
      `Same point — the finish of stage ${a} and the start of stage ${b} are at the same place.`,
    finishE: (n) => `Finish S${n}:`,
    startE: (n) => `Start S${n}:`,
    road: "Road",
    totalKmLabel: "Total km:",
    toFinishLabel: "To finish:",
    passingLabel: "Passing:",
    closureLabel: "Closure:",
    eventsCount: (n) => `${n} events`,
    schedule: "Passage schedule",
    place: "Place",
    km: "km",
    passing: "Passing",
    closure: "Closure",
    closedStreets: "Closed streets",
    closedStreetsSub: "Detailed schedule by city and time interval.",
    nearYou: "Around you",
    yourPositionLabel: "Your position:",
    nearRouteAlert: "You are close to the route!",
    closestPoint: "Nearest point:",
    closesAt: "Closes at",
    passesAt: "the peloton passes at",
    findMeHintTitle: "See which closures are near you",
    findMeHint:
      "Tap “Find me” in the top right of the map to show the nearest points on the route and their closure times.",
    distancesNote:
      "Distances are straight-line. Times follow the stage's official schedule.",
    cultProgramKicker: "Cultural & sports programme",
    cultProgramTitle: "What's happening in the host cities",
    cultProgramSubtitle: (n) =>
      `${n} events across 5 cities — concerts, exhibitions, bike parades, ceremonies and kids' activities.`,
    eventsLabel: "events",
    footerText:
      "The data follows the official street-closure schedules and race timings. Route coordinates are approximate (by locality). For the full detailed map, see also",
    burgasUmap: "uMap for Burgas",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ],
    metres: "m",
    kmShort: "km",
  },
  it: {
    grandePartenza: "Grande Partenza",
    bulgaria2026: "Bulgaria 2026",
    heroTitle: "Giro d'Italia 2026",
    heroSubtitle:
      "Le prime tre tappe del leggendario Giro d'Italia attraversano la Bulgaria — 8, 9 e 10 maggio 2026. Guarda il percorso sulla mappa e gli orari in cui le strade saranno chiuse al traffico.",
    totalKm: (km) => `${km} km totali`,
    dates: "8 – 10 maggio 2026",
    stagesCities: "3 tappe · 5 città",
    mapHeading: "Percorso sulla mappa",
    mapSubtitle:
      "Burgas è tracciata con i livelli dettagliati di uMap; le altre tappe sono tracciate tramite OSRM.",
    allStages: "Tutte le tappe",
    stageN: (n) => `Tappa ${n}`,
    findMe: "Trovami",
    hideEvents: "Nascondi eventi",
    showEvents: "Mostra eventi",
    hideKm: "Nascondi marcatori KM",
    showKm: "Mostra marcatori KM",
    routingLabel: "Tracciatura sulle strade reali…",
    legendEvents: "Eventi",
    geoError: "Non siamo riusciti a trovare la tua posizione. Consenti l'accesso alla posizione nel browser.",
    yourPosition: "La tua posizione",
    finishStageN: (n) => `🏆 Arrivo Tappa ${n}`,
    startStageN: (n) => `🏁 Partenza Tappa ${n}`,
    sharedPointDesc: (a, b) =>
      `Stesso punto — l'arrivo della tappa ${a} e la partenza della tappa ${b} sono nello stesso luogo.`,
    finishE: (n) => `Arrivo T${n}:`,
    startE: (n) => `Partenza T${n}:`,
    road: "Strada",
    totalKmLabel: "Km totali:",
    toFinishLabel: "All'arrivo:",
    passingLabel: "Passaggio:",
    closureLabel: "Chiusura:",
    eventsCount: (n) => `${n} eventi`,
    schedule: "Orari di passaggio",
    place: "Località",
    km: "km",
    passing: "Passaggio",
    closure: "Chiusura",
    closedStreets: "Strade chiuse",
    closedStreetsSub: "Programma dettagliato per città e fascia oraria.",
    nearYou: "Intorno a te",
    yourPositionLabel: "La tua posizione:",
    nearRouteAlert: "Sei vicino al percorso!",
    closestPoint: "Punto più vicino:",
    closesAt: "Chiude alle",
    passesAt: "il gruppo passa alle",
    findMeHintTitle: "Scopri quali chiusure sono vicino a te",
    findMeHint:
      "Tocca “Trovami” in alto a destra sulla mappa per mostrare i punti più vicini del percorso e gli orari di chiusura.",
    distancesNote:
      "Le distanze sono in linea d'aria. Gli orari seguono il programma ufficiale della tappa.",
    cultProgramKicker: "Programma culturale e sportivo",
    cultProgramTitle: "Cosa succede nelle città ospitanti",
    cultProgramSubtitle: (n) =>
      `${n} eventi in 5 città — concerti, mostre, ciclo-parate, cerimonie e attività per bambini.`,
    eventsLabel: "eventi",
    footerText:
      "I dati seguono i programmi ufficiali di chiusura delle strade e gli orari della corsa. Le coordinate del percorso sono approssimative (per località). Per la mappa completa dettagliata, vedi anche",
    burgasUmap: "uMap per Burgas",
    weekdays: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
    months: [
      "gennaio","febbraio","marzo","aprile","maggio","giugno",
      "luglio","agosto","settembre","ottobre","novembre","dicembre",
    ],
    metres: "m",
    kmShort: "km",
  },
};