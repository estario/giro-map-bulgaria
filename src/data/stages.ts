export type StageWaypoint = {
  name: string;
  road?: string;
  totalKm: number;
  toFinishKm: number;
  raceTime: string;
  closeTime: string;
  coords: [number, number]; // [lat, lng]
};

export type StreetClosure = {
  city: string;
  groups: {
    period: string;
    streets: string[];
  }[];
  note?: string;
};

export type Stage = {
  id: number;
  date: string;
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  color: string;
  waypoints: StageWaypoint[];
  closures: StreetClosure[];
};

// Координати на градовете/населените места по маршрута (приблизителни, OSM)
export const stages: Stage[] = [
  {
    id: 1,
    date: "08.05.2026",
    name: "Етап 1",
    from: "Несебър",
    to: "Бургас",
    distanceKm: 147,
    color: "#ec4899",
    waypoints: [
      { name: "НЕСЕБЪР старт", totalKm: 0, toFinishKm: 147, raceTime: "13:50", closeTime: "12:20", coords: [42.658712, 27.730648] },
      { name: "Несебър км0", totalKm: 0, toFinishKm: 147, raceTime: "14:00", closeTime: "12:30", coords: [42.669740, 27.706800] },
      { name: "Равда", road: "I-9", totalKm: 7.8, toFinishKm: 139.2, raceTime: "14:09", closeTime: "12:39", coords: [42.652920, 27.670340] },
      { name: "Ахелой", road: "I-9", totalKm: 11.5, toFinishKm: 135.5, raceTime: "14:14", closeTime: "12:44", coords: [42.645880, 27.636670] },
      { name: "Поморие", road: "I-9", totalKm: 19.2, toFinishKm: 127.8, raceTime: "14:23", closeTime: "12:53", coords: [42.588820, 27.598550] },
      { name: "Поморие запад", road: "I-9", totalKm: 23.3, toFinishKm: 123.7, raceTime: "14:28", closeTime: "12:58", coords: [42.561000, 27.569990] },
      { name: "Летище Бургас (Сарафово)", road: "I-9", totalKm: 27.7, toFinishKm: 119.3, raceTime: "14:34", closeTime: "13:04", coords: [42.564262, 27.519259] },
      { name: "Бургас център", road: "I-9", totalKm: 32.3, toFinishKm: 114.7, raceTime: "14:40", closeTime: "13:10", coords: [42.548680, 27.471550] },
      { name: "Бургас (1-во преминаване)", totalKm: 38.8, toFinishKm: 108.2, raceTime: "14:48", closeTime: "13:18", coords: [42.500153, 27.480307] },
      { name: "Отклонение Малко Търново", road: "II-99", totalKm: 50.2, toFinishKm: 96.8, raceTime: "15:03", closeTime: "13:33", coords: [42.441621, 27.475130] },
      { name: "Росен", road: "II-99", totalKm: 56.8, toFinishKm: 90.2, raceTime: "15:11", closeTime: "13:41", coords: [42.428034, 27.546016] },
      { name: "Черноморец", road: "II-99", totalKm: 65.3, toFinishKm: 81.7, raceTime: "15:22", closeTime: "13:52", coords: [42.439927, 27.634855] },
      { name: "Вход трасе (обиколка)", road: "II-99", totalKm: 70.9, toFinishKm: 76.1, raceTime: "15:29", closeTime: "13:59", coords: [42.405641, 27.672304] },
      { name: "Св. Тома", totalKm: 78.9, toFinishKm: 68.1, raceTime: "15:40", closeTime: "14:10", coords: [42.345620, 27.714820] },
      { name: "Нос Агалина", totalKm: 84.3, toFinishKm: 62.7, raceTime: "15:47", closeTime: "14:17", coords: [42.379211, 27.719280] },
      { name: "Созопол", totalKm: 90.0, toFinishKm: 57.0, raceTime: "15:54", closeTime: "14:24", coords: [42.417896, 27.695694] },
      { name: "Св. Тома (2-ра обиколка)", totalKm: 101.0, toFinishKm: 46.0, raceTime: "16:08", closeTime: "14:38", coords: [42.345620, 27.714820] },
      { name: "Нос Агалина (2-ра обиколка)", totalKm: 106.4, toFinishKm: 40.6, raceTime: "16:15", closeTime: "14:45", coords: [42.379161, 27.719384] },
      { name: "Созопол (втора обиколка)", totalKm: 112.0, toFinishKm: 35.0, raceTime: "16:21", closeTime: "14:51", coords: [42.417892, 27.695698] },
      { name: "Изход трасе", road: "II-99", totalKm: 115.0, toFinishKm: 32.0, raceTime: "16:25", closeTime: "14:55", coords: [42.405900, 27.671080] },
      { name: "Черноморец (връщане)", road: "II-99", totalKm: 120.5, toFinishKm: 26.5, raceTime: "16:32", closeTime: "15:02", coords: [42.440085, 27.634824] },
      { name: "Росен (връщане)", road: "II-99", totalKm: 129.0, toFinishKm: 18.0, raceTime: "16:42", closeTime: "15:12", coords: [42.428229, 27.545028] },
      { name: "Бургас вход", totalKm: 143.4, toFinishKm: 3.6, raceTime: "16:59", closeTime: "15:29", coords: [42.493080, 27.450040] },
      { name: "БУРГАС финал", totalKm: 147, toFinishKm: 0, raceTime: "17:04", closeTime: "15:34", coords: [42.500750, 27.477944] },
    ],
    closures: [
      {
        city: "Несебър",
        groups: [
          {
            period: "06:00 – 19:00 ч. на 08.05.2026",
            streets: [
              "Ул. Жана Чимбулева (Крайбрежна – Месембрия)",
              "Ул. Месембрия (Жана Чимбулева – Ахелой)",
              "Ул. Ахелой (Месембрия – Митрополитска)",
              "Ул. Митрополитска (Ахелой – Нептун)",
              "Ул. Нептун (Митрополитска – Крайбрежна)",
              "Ул. Крайбрежна (Нептун – Жана Чимбулева)",
              "Ул. Анджело Ронкали (Рибарска – Месембрия)",
              "Ул. Хан Крум (Месембрия – ул. 1-ва)",
              "Ул. 1-ва (Хан Крум – улица към път I-9)",
              "Улица към път I-9 (ул. 1-ва – път I-9)",
            ],
          },
        ],
        note: "Всички пресичащи улици се затварят в зоната на кръстовищата.",
      },
      {
        city: "Бургас",
        groups: [
          {
            period: "08:00 ч. 06.05 – 19:00 ч. 08.05.2026",
            streets: ["Ул. Адам Мицкевич"],
          },
          {
            period: "18:00 ч. 06.05 – 19:00 ч. 08.05.2026",
            streets: ["Част от паркинг „Гурко“"],
          },
          {
            period: "10:00 ч. 07.05 – 19:00 ч. 08.05.2026",
            streets: ["Бул. Демокрация (ул. Кирил и Методий – бул. Сан Стефано)"],
          },
          {
            period: "07:00 – 19:00 ч. на 08.05.2026",
            streets: [
              "Бул. Демокрация (Сан Стефано – Дунав)",
            ],
          },
          {
            period: "12:00 ч. 08.05 (забрана за паркиране) – 17:00 ч. (пълно затваряне) – 19:00 ч. 08.05.2026",
            streets: ["Ул. Димитър Бракалов"],
          },
          {
            period: "14:40 – 19:00 ч. на 08.05.2026 (преминаване на колоната; 2-ро влизане 16:50)",
            streets: [
              "Бул. Димитър Димов",
              "Бул. 24-ти черноморски пехотен полк",
              "Бул. Демокрация",
              "Ул. Булаир",
              "Бул. Иван Вазов",
              "Ул. Индустриална",
              "Ул. Спортна",
              "Бул. Тодор Александров",
            ],
          },
        ],
        note: "Финиш на бул. „Демокрация“ при кръстовището с ул. „Адам Мицкевич“ в 17:00 ч.",
      },
    ],
  },
  {
    id: 2,
    date: "09.05.2026",
    name: "Етап 2",
    from: "Бургас",
    to: "Велико Търново",
    distanceKm: 221,
    color: "#db2777",
    waypoints: [
      { name: "БУРГАС старт", totalKm: 0, toFinishKm: 221, raceTime: "11:55", closeTime: "10:25", coords: [42.496587, 27.471181] },
      { name: "Бургас км0", totalKm: 0, toFinishKm: 221, raceTime: "12:05", closeTime: "10:35", coords: [42.554560, 27.428530] },
      { name: "Ветрен (вход I-6)", road: "I-6", totalKm: 4.3, toFinishKm: 216.7, raceTime: "12:10", closeTime: "10:40", coords: [42.590680, 27.396900] },
      { name: "Дъбник", road: "I-6", totalKm: 9.0, toFinishKm: 212.0, raceTime: "12:16", closeTime: "10:46", coords: [42.624110, 27.359800] },
      { name: "Лясково", road: "I-6", totalKm: 14.4, toFinishKm: 206.6, raceTime: "12:23", closeTime: "10:53", coords: [42.656266, 27.317404] },
      { name: "Айтос", road: "I-6", totalKm: 21.9, toFinishKm: 199.1, raceTime: "12:32", closeTime: "11:02", coords: [42.698760, 27.249448] },
      { name: "Лозарево", road: "I-6", totalKm: 32.0, toFinishKm: 189.0, raceTime: "12:45", closeTime: "11:15", coords: [42.682500, 27.123900] },
      { name: "Черноград", road: "I-6", totalKm: 39.5, toFinishKm: 181.5, raceTime: "12:55", closeTime: "11:25", coords: [42.668700, 27.038700] },
      { name: "Карнобат", road: "I-6", totalKm: 45.6, toFinishKm: 175.4, raceTime: "13:03", closeTime: "11:33", coords: [42.650752, 26.976458] },
      { name: "Венец", road: "I-6", totalKm: 53.0, toFinishKm: 168.0, raceTime: "13:13", closeTime: "11:43", coords: [42.648900, 26.886200] },
      { name: "Деветак", road: "I-6", totalKm: 60.5, toFinishKm: 160.5, raceTime: "13:22", closeTime: "11:52", coords: [42.645100, 26.798500] },
      { name: "Лозенец", road: "I-6", totalKm: 67.9, toFinishKm: 153.1, raceTime: "13:31", closeTime: "12:01", coords: [42.640812, 26.708624] },
      { name: "Горно Александрово", road: "I-6", totalKm: 74.0, toFinishKm: 147.0, raceTime: "13:39", closeTime: "12:09", coords: [42.649421, 26.635524] },
      { name: "Трапоклово", road: "I-6", totalKm: 77.2, toFinishKm: 143.8, raceTime: "13:43", closeTime: "12:13", coords: [42.644393, 26.598225] },
      { name: "Калояново", road: "I-6", totalKm: 89.0, toFinishKm: 132.0, raceTime: "13:58", closeTime: "12:28", coords: [42.657428, 26.459365] },
      { name: "Вход Сливен", road: "III-6007", totalKm: 91.8, toFinishKm: 129.2, raceTime: "14:01", closeTime: "12:31", coords: [42.660740, 26.425410] },
      { name: "Сливен", road: "II-53", totalKm: 100.4, toFinishKm: 120.6, raceTime: "14:13", closeTime: "12:43", coords: [42.677990, 26.326460] },
      { name: "Асенов мост", road: "II-53", totalKm: 108.6, toFinishKm: 112.4, raceTime: "14:24", closeTime: "12:54", coords: [42.711189, 26.260633] },
      { name: "Проход Бяла", road: "II-53", totalKm: 116.3, toFinishKm: 104.7, raceTime: "14:42", closeTime: "13:12", coords: [42.712264, 26.205421] },
      { name: "Бяла", road: "II-53", totalKm: 120.8, toFinishKm: 100.2, raceTime: "14:48", closeTime: "13:18", coords: [42.729660, 26.188470] },
      { name: "Проход Вратник", road: "II-53", totalKm: 134.1, toFinishKm: 86.9, raceTime: "15:07", closeTime: "13:37", coords: [42.820857, 26.164631] },
      { name: "Камен", road: "II-53", totalKm: 142.0, toFinishKm: 79.0, raceTime: "15:18", closeTime: "13:48", coords: [42.875400, 26.158900] },
      { name: "Майско", road: "II-53", totalKm: 150.6, toFinishKm: 70.4, raceTime: "15:28", closeTime: "13:58", coords: [42.927947, 26.157473] },
      { name: "Константин", road: "II-53", totalKm: 158.6, toFinishKm: 62.4, raceTime: "15:38", closeTime: "14:08", coords: [42.947771, 26.070791] },
      { name: "Марян", road: "II-53", totalKm: 168.2, toFinishKm: 52.8, raceTime: "15:50", closeTime: "14:20", coords: [42.931084, 25.966881] },
      { name: "Милковци", road: "II-53", totalKm: 174.7, toFinishKm: 46.3, raceTime: "15:58", closeTime: "14:28", coords: [42.929100, 25.898710] },
      { name: "Беброво", road: "II-53", totalKm: 183.0, toFinishKm: 38.0, raceTime: "16:08", closeTime: "14:38", coords: [42.973100, 25.866400] },
      { name: "Миндя", road: "II-53", totalKm: 191.9, toFinishKm: 29.1, raceTime: "16:19", closeTime: "14:49", coords: [43.024364, 25.839650] },
      { name: "Мерданя", road: "II-53", totalKm: 198.3, toFinishKm: 22.7, raceTime: "16:27", closeTime: "14:57", coords: [43.057396, 25.783657] },
      { name: "Лясковец", road: "II-53", totalKm: 206.8, toFinishKm: 14.2, raceTime: "16:38", closeTime: "15:08", coords: [43.108140, 25.719760] },
      { name: "Манастир Лясковец", totalKm: 210.6, toFinishKm: 10.4, raceTime: "16:46", closeTime: "15:16", coords: [43.090262, 25.700874] },
      { name: "Шереметя", road: "I-4", totalKm: 212.5, toFinishKm: 8.5, raceTime: "16:49", closeTime: "15:19", coords: [43.077400, 25.692010] },
      { name: "Св. Гора", totalKm: 215.6, toFinishKm: 5.4, raceTime: "16:52", closeTime: "15:22", coords: [43.070790, 25.656680] },
      { name: "Царевец", road: "III-514", totalKm: 218.9, toFinishKm: 2.1, raceTime: "16:56", closeTime: "15:26", coords: [43.085060, 25.650010] },
      { name: "ВЕЛИКО ТЪРНОВО финал", totalKm: 221, toFinishKm: 0, raceTime: "16:59", closeTime: "15:29", coords: [43.081250, 25.631040] },
    ],
    closures: [
      {
        city: "Бургас (старт етап 2)",
        groups: [
          {
            period: "05:00 ч. на 09.05.2026 (забрана за паркиране) – 13:00 ч. на 09.05.2026",
            streets: [
              "Ул. Сливница",
              "Ул. Мара Гидик",
              "Ул. Левски",
              "Ул. Пробуда",
              "Ул. Македония",
              "Ул. Самуил",
              "Бул. Сан Стефано",
            ],
          },
          {
            period: "11:55 – 13:00 ч. на 09.05.2026 (преминаване на колоната)",
            streets: [
              "Старт от пл. „Тройката“",
              "Ул. Александровска",
              "Бул. Иван Вазов",
              "Ул. Цар Петър",
              "Ул. Христо Ботев",
              "Ул. Одрин",
              "Бул. Струга",
              "Бул. Стефан Стамболов",
              "Кв. Ветрен (изход от общината към Айтос/Сливен — 12:10)",
            ],
          },
        ],
      },
      {
        city: "Велико Търново",
        groups: [
          {
            period: "06:00 – 19:00 ч. на 09.05.2026",
            streets: [
              "Пълно затваряне на движението в зоната на финала",
            ],
          },
          {
            period: "13:46 – 19:00 ч. на 09.05.2026",
            streets: [
              "Път при манастир Лясковец (от 13:46)",
              "Път I-4 при Шереметя (от 13:49)",
              "Път при Св. Гора (от 13:52)",
              "Път III-514 при Царевец (от 13:56)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    date: "10.05.2026",
    name: "Етап 3",
    from: "Пловдив",
    to: "София",
    distanceKm: 175,
    color: "#be185d",
    waypoints: [
      { name: "ПЛОВДИВ старт", road: "I-8", totalKm: 0, toFinishKm: 175, raceTime: "13:05", closeTime: "11:35", coords: [42.1421, 24.7499] },
      { name: "Пловдив км0", road: "I-8", totalKm: 0, toFinishKm: 175, raceTime: "13:15", closeTime: "11:45", coords: [42.155330, 24.709980] },
      { name: "Стамболийски", road: "I-8", totalKm: 12.8, toFinishKm: 162.2, raceTime: "13:31", closeTime: "12:01", coords: [42.159210, 24.552480] },
      { name: "Мало Конаре", road: "I-8", totalKm: 23.8, toFinishKm: 151.2, raceTime: "13:44", closeTime: "12:14", coords: [42.184580, 24.425680] },
      { name: "Пазарджик", road: "I-8", totalKm: 31.3, toFinishKm: 143.7, raceTime: "13:53", closeTime: "12:23", coords: [42.190370, 24.336880] },
      { name: "Звъничево", road: "I-8", totalKm: 38.8, toFinishKm: 136.2, raceTime: "14:03", closeTime: "12:33", coords: [42.190414, 24.251009] },
      { name: "Септември", road: "I-8", totalKm: 48.6, toFinishKm: 126.4, raceTime: "14:16", closeTime: "12:46", coords: [42.191330, 24.133360] },
      { name: "Белово", road: "I-8", totalKm: 58.6, toFinishKm: 116.4, raceTime: "14:29", closeTime: "12:59", coords: [42.214777, 24.018706] },
      { name: "Момина клисура", road: "I-8", totalKm: 62.6, toFinishKm: 112.4, raceTime: "14:34", closeTime: "13:04", coords: [42.228650, 23.974041] },
      { name: "Костенец", road: "II-82", totalKm: 77.5, toFinishKm: 97.5, raceTime: "14:53", closeTime: "13:23", coords: [42.310960, 23.859430] },
      { name: "Долна баня", road: "II-82", totalKm: 85.8, toFinishKm: 89.2, raceTime: "15:04", closeTime: "13:34", coords: [42.311198, 23.763126] },
      { name: "Боровец проход", road: "II-82", totalKm: 103.2, toFinishKm: 71.8, raceTime: "15:37", closeTime: "14:07", coords: [42.277109, 23.625696] },
      { name: "Боровец", road: "II-82", totalKm: 105.4, toFinishKm: 69.6, raceTime: "15:40", closeTime: "14:10", coords: [42.265580, 23.609560] },
      { name: "Самоков", road: "II-82", totalKm: 115.4, toFinishKm: 59.6, raceTime: "15:52", closeTime: "14:22", coords: [42.337000, 23.555430] },
      { name: "Яз. Искър", road: "II-82", totalKm: 130.8, toFinishKm: 44.2, raceTime: "16:11", closeTime: "14:41", coords: [42.457686, 23.557984] },
      { name: "Долни Пасарел", road: "II-82", totalKm: 145.1, toFinishKm: 29.9, raceTime: "16:27", closeTime: "14:57", coords: [42.537578, 23.499288] },
      { name: "Панчарево", road: "II-82", totalKm: 161.0, toFinishKm: 14.0, raceTime: "16:46", closeTime: "15:16", coords: [42.596479, 23.410093] },
      { name: "Цариградско шосе", totalKm: 167.0, toFinishKm: 8.0, raceTime: "16:53", closeTime: "15:23", coords: [42.643040, 23.400840] },
      { name: "СОФИЯ финал", totalKm: 175, toFinishKm: 0, raceTime: "17:03", closeTime: "15:33", coords: [42.693910, 23.332500] },
    ],
    closures: [
      {
        city: "Пловдив",
        groups: [
          {
            period: "05:00 – 14:30 ч. на 10.05.2026",
            streets: [
              "Ул. Иван Вазов (пл. Централен – бул. Руски)",
              "Ул. Авксентий Велешки (Христо Ботев – Булаир)",
              "Ул. Булаир (Авксентий Велешки – Цар Асен)",
              "Ул. Цар Асен (Булаир – Цанко Дюстабанов)",
              "Ул. Цанко Дюстабанов (Цар Асен – бул. Цар Борис III Обединител)",
              "Бул. Цар Борис III Обединител (Христо Ботев – България)",
              "Бул. България (Цар Борис III Обединител – Пловдивски околовръстен път)",
            ],
          },
        ],
      },
      {
        city: "София",
        groups: [
          {
            period: "03:00 ч. 07.05 – 06:00 ч. 11.05.2026",
            streets: ["Забранява се влизането и паркирането на пл. „Николай Гяуров“"],
          },
          {
            period: "15:00 ч. на 09.05.2026 (забрана за паркиране)",
            streets: [
              "При паметника „Цар Освободител“",
              "Ул. 15-ти ноември (бул. Цар Освободител – ул. Оборище)",
            ],
          },
          {
            period: "19:00 ч. 09.05 – 06:00 ч. 11.05.2026 (забрана за влизане на МПС)",
            streets: [
              "Бул. Цар Освободител (Васил Левски – Г. С. Раковски)",
              "Пл. Народно събрание",
              "Ул. 15-ти ноември",
              "Дъгата зад пл. Александър Невски",
              "Ул. 19-ти февруари",
            ],
          },
          {
            period: "00:00 – 04:30 ч. на 10.05.2026 (технически дейности по трасето)",
            streets: ["Цялото трасе на финала в София"],
          },
          {
            period: "От 04:00 ч. на 10.05.2026 (забрана за престой и паркиране)",
            streets: [
              "Ул. Оборище (пл. Александър Невски – бул. Васил Левски)",
              "Ул. 11-ти август (Московска – пл. Александър Невски)",
              "Ул. Дунав (Московска – пл. Александър Невски)",
              "Ул. Московска (пл. Гина Кунчева – Г. С. Раковски)",
            ],
          },
          {
            period: "06:00 – 23:00 ч. на 10.05.2026 (затворено за движение)",
            streets: [
              "Ул. Оборище (пл. Александър Невски – бул. Васил Левски)",
              "Пл. Александър Невски (северно от ул. Оборище)",
              "Ул. Дунав (Московска – пл. Александър Невски)",
              "Ул. 11-ти август (Московска – пл. Александър Невски)",
              "Ул. Московска (пл. Гина Кунчева – Г. С. Раковски)",
            ],
          },
          {
            period: "06:00 – 22:00 ч. на 10.05.2026",
            streets: [
              "Ул. Ген. Гурко (бул. Васил Левски – бул. Евлоги и Христо Георгиеви)",
            ],
          },
          {
            period: "12:00 – 22:00 ч. на 10.05.2026",
            streets: [
              "Бул. Васил Левски (Цар Освободител – Ген. Гурко)",
              "Бул. Евлоги и Христо Георгиеви (Ген. Гурко – Цар Освободител, в двете посоки)",
              "Бул. Цар Освободител (Васил Левски – Евлоги и Христо Георгиеви)",
              "Бул. Цариградско шосе (Евлоги и Христо Георгиеви – ул. Димитър Пешев)",
              "Ул. Самоковско шосе / път II-82 (разклон с. Горни окол km 49+250 – бул. Копенхаген)",
            ],
          },
          {
            period: "21:00 ч. 10.05 – 06:00 ч. 11.05.2026",
            streets: ["Ул. Ген. Гурко — само за градски транспорт"],
          },
        ],
      },
    ],
  },
];