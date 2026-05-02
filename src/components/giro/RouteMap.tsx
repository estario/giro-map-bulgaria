import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Stage } from "@/data/stages";
import { burgasUmapLayers } from "@/data/burgasUmap";
import { cityPrograms, tagColor, localizeEvent, localizeCityName, type CulturalEvent } from "@/data/events";
import { GIRO_STAGES, type GiroPoint } from "@/data/giroStages";
import { viewingSpots, localizeViewingSpot } from "@/data/viewingSpots";
import { Button } from "@/components/ui/button";
import { LocateFixed, Loader2, Sparkles, Eye, MousePointerClick } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { Lang } from "@/i18n/translations";

type Props = {
  stages: Stage[];
  activeStageId: number;
  onUserLocation?: (loc: { lat: number; lng: number } | null) => void;
};

function makeIcon(color: string, label: string, offsetX = 0) {
  return L.divIcon({
    className: "giro-marker",
    html: `<div style="transform:translateX(${offsetX}px);background:${color};color:#fff;border:2px solid #fff;border-radius:9999px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 4px 12px rgba(236,72,153,0.5);font-family:system-ui,sans-serif;">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function kmZeroIcon() {
  return L.divIcon({
    className: "giro-km-zero-marker",
    html: `<div style="display:flex;align-items:center;gap:4px;font-family:system-ui,sans-serif;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
      <div style="width:14px;height:14px;border-radius:9999px;background:#16a34a;border:3px solid #fff;"></div>
      <div style="background:#fff;color:#14532d;border:2px solid #16a34a;border-radius:4px;padding:2px 6px;font-size:11px;font-weight:900;line-height:1;white-space:nowrap;">km 0</div>
    </div>`,
    iconSize: [58, 22],
    iconAnchor: [7, 11],
    popupAnchor: [18, -10],
  });
}

// Distinct flag-style marker for stage START — clearly readable on the map
// so two stages whose start/finish are close (e.g. Stage 1 finish in Burgas
// and Stage 2 start in Burgas) cannot be confused.
function startFlagIcon(color: string, label: string, city: string, offsetX = 0) {
  return L.divIcon({
    className: "giro-start-marker",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:flex-start;font-family:system-ui,sans-serif;pointer-events:auto;transform:translateX(${offsetX}px);">
      <div style="background:${color};color:#fff;padding:4px 8px 4px 9px;border:2px solid #fff;border-radius:6px;font-size:11px;font-weight:800;letter-spacing:0.04em;box-shadow:0 4px 12px rgba(0,0,0,0.45);white-space:nowrap;line-height:1.1;">
        🏁 ${label}<span style="opacity:0.85;font-weight:600;margin-left:4px;">· ${city}</span>
      </div>
      <div style="width:3px;height:18px;background:${color};margin-left:6px;box-shadow:0 2px 4px rgba(0,0,0,0.35);"></div>
      <div style="width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid #fff;margin-left:0px;margin-top:-3px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
    </div>`,
    iconSize: [120, 50],
    iconAnchor: [6, 50],
    popupAnchor: [0, -48],
  });
}

function finishFlagIcon(color: string, label: string, city: string, offsetX = 0) {
  return L.divIcon({
    className: "giro-finish-marker",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:flex-start;font-family:system-ui,sans-serif;pointer-events:auto;transform:translateX(${offsetX}px);">
      <div style="background:#fff;color:${color};padding:4px 8px;border:2px solid ${color};border-radius:6px;font-size:11px;font-weight:800;letter-spacing:0.04em;box-shadow:0 4px 12px rgba(0,0,0,0.35);white-space:nowrap;line-height:1.1;">
        🏆 ${label}<span style="opacity:0.85;font-weight:600;margin-left:4px;color:#1f1326;">· ${city}</span>
      </div>
      <div style="width:3px;height:18px;background:${color};margin-left:6px;"></div>
      <div style="width:12px;height:12px;border-radius:9999px;background:#fff;border:2px solid ${color};margin-left:0px;margin-top:-3px;"></div>
    </div>`,
    iconSize: [120, 50],
    iconAnchor: [6, 50],
    popupAnchor: [0, -48],
  });
}

// Combined marker for the case when one stage's FINISH and the next stage's START
// are at the exact same physical point (e.g. Stage 1 finish & Stage 2 start in Burgas).
// Shown as a single pin with two stacked labels so users don't think there are two
// separate places.
function combinedFinishStartIcon(
  finishColor: string,
  startColor: string,
  finishLabel: string,
  startLabel: string,
  city: string,
) {
  return L.divIcon({
    className: "giro-combined-marker",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:flex-start;font-family:system-ui,sans-serif;pointer-events:auto;">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="background:#fff;color:${finishColor};padding:3px 8px;border:2px solid ${finishColor};border-bottom-width:1px;border-radius:6px 6px 2px 2px;font-size:11px;font-weight:800;letter-spacing:0.03em;box-shadow:0 4px 12px rgba(0,0,0,0.3);white-space:nowrap;line-height:1.1;">
          🏆 ${finishLabel}
        </div>
        <div style="background:${startColor};color:#fff;padding:3px 8px;border:2px solid ${startColor};border-top-width:1px;border-radius:2px 2px 6px 6px;font-size:11px;font-weight:800;letter-spacing:0.03em;box-shadow:0 4px 12px rgba(0,0,0,0.4);white-space:nowrap;line-height:1.1;">
          🏁 ${startLabel}<span style="opacity:0.9;font-weight:600;margin-left:4px;">· ${city}</span>
        </div>
      </div>
      <div style="width:3px;height:18px;background:${startColor};margin-left:6px;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>
      <div style="width:13px;height:13px;border-radius:9999px;background:#fff;border:3px solid ${startColor};margin-left:-1px;margin-top:-3px;box-shadow:0 2px 6px rgba(0,0,0,0.45);"></div>
    </div>`,
    iconSize: [180, 80],
    iconAnchor: [6, 80],
    popupAnchor: [0, -78],
  });
}

function userIcon() {
  return L.divIcon({
    className: "giro-user-marker",
    html: `<div style="position:relative;width:22px;height:22px;">
      <div style="position:absolute;inset:-8px;border-radius:9999px;background:rgba(59,130,246,0.25);animation:giroPulse 2s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;background:#3b82f6;border:3px solid #fff;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function infoIcon(color: string, label: string) {
  return L.divIcon({
    className: "giro-info-marker",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center;font-family:system-ui,sans-serif;pointer-events:auto;">
      <div style="background:${color};color:#fff;border:2px solid #fff;border-radius:9999px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;box-shadow:0 4px 12px rgba(220,38,38,0.55);line-height:1;">🚧</div>
      <div style="margin-top:2px;background:#fff;color:${color};border:1.5px solid ${color};border-radius:4px;padding:1px 5px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;box-shadow:0 2px 4px rgba(0,0,0,0.2);white-space:nowrap;">${label}</div>
    </div>`,
    iconSize: [60, 50],
    iconAnchor: [30, 15],
    popupAnchor: [0, -15],
  });
}

const VIEWING_SPOT_COLOR = "#0d9488"; // teal-600 — distinct from closure red & event purple

function viewingSpotIcon(label: string) {
  return L.divIcon({
    className: "giro-viewing-marker",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center;font-family:system-ui,sans-serif;pointer-events:auto;">
      <div style="background:${VIEWING_SPOT_COLOR};color:#fff;border:2px solid #fff;border-radius:9999px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;box-shadow:0 4px 12px rgba(13,148,136,0.55);line-height:1;">👁</div>
      <div style="margin-top:2px;background:#fff;color:${VIEWING_SPOT_COLOR};border:1.5px solid ${VIEWING_SPOT_COLOR};border-radius:4px;padding:1px 5px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;box-shadow:0 2px 4px rgba(0,0,0,0.2);white-space:nowrap;">${label}</div>
    </div>`,
    iconSize: [60, 50],
    iconAnchor: [30, 15],
    popupAnchor: [0, -15],
  });
}

const tagEmoji: Record<NonNullable<CulturalEvent["tag"]>, string> = {
  "култура": "✦",
  "спорт": "🚴",
  "изложба": "🖼",
  "концерт": "♪",
  "детско": "★",
  "церемония": "▲",
};

function eventIcon(color: string, glyph: string) {
  return L.divIcon({
    className: "giro-event-marker",
    html: `<div style="position:relative;width:28px;height:34px;">
      <svg width="28" height="34" viewBox="0 0 28 34" style="position:absolute;inset:0;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
        <path d="M14 0 C6.27 0 0 6.27 0 14 c0 9 14 20 14 20 s14-11 14-20 C28 6.27 21.73 0 14 0 z" fill="${color}" stroke="#fff" stroke-width="2"/>
      </svg>
      <div style="position:absolute;top:3px;left:0;right:0;height:22px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;font-family:system-ui,sans-serif;line-height:1;">${glyph}</div>
    </div>`,
    iconSize: [28, 34],
    iconAnchor: [14, 34],
    popupAnchor: [0, -30],
  });
}

function fmtDateWith(iso: string, weekdays: string[], months: string[]) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} (${weekdays[d.getDay()]})`;
}

const placeLabels: Record<string, Record<Lang, string>> = {
  "Летище Бургас (Сарафово)": { bg: "Летище Бургас (Сарафово)", en: "Burgas Airport (Sarafovo)", it: "Aeroporto di Burgas (Sarafovo)" },
  "Велико Търново": { bg: "Велико Търново", en: "Veliko Tarnovo", it: "Veliko Tarnovo" },
  "Меден рудник": { bg: "Меден рудник", en: "Meden Rudnik", it: "Meden Rudnik" },
  "Отклонение Малко Търново": { bg: "Отклонение Малко Търново", en: "Malko Tarnovo junction", it: "Bivio Malko Tarnovo" },
  "Вход трасе": { bg: "Вход трасе", en: "Circuit entrance", it: "Ingresso circuito" },
  "Изход трасе": { bg: "Изход трасе", en: "Circuit exit", it: "Uscita circuito" },
  "Св. Тома": { bg: "Св. Тома", en: "St. Thomas", it: "San Tommaso" },
  "Нос Агалина": { bg: "Нос Агалина", en: "Cape Agalina", it: "Capo Agalina" },
  "Ветрен": { bg: "Ветрен", en: "Vetren", it: "Vetren" },
  "Лясково": { bg: "Лясково", en: "Lyaskovo", it: "Lyaskovo" },
  "Лясковец": { bg: "Лясковец", en: "Lyaskovets", it: "Lyaskovets" },
  "Манастир Лясковец": { bg: "Манастир Лясковец", en: "Lyaskovets Monastery", it: "Monastero di Lyaskovets" },
  "Шереметя": { bg: "Шереметя", en: "Sheremetya", it: "Sheremetya" },
  "Св. Гора": { bg: "Св. Гора", en: "Sveta Gora", it: "Sveta Gora" },
  "Царевец": { bg: "Царевец", en: "Tsarevets", it: "Tsarevets" },
  "Пловдив": { bg: "Пловдив", en: "Plovdiv", it: "Plovdiv" },
  "Несебър": { bg: "Несебър", en: "Nessebar", it: "Nessebar" },
  "Бургас": { bg: "Бургас", en: "Burgas", it: "Burgas" },
  "София": { bg: "София", en: "Sofia", it: "Sofia" },
};

// Extended list of toponyms used in stage waypoints / closures so that
// English & Italian popups don't fall back to Cyrillic.
const extraPlaceLabels: Record<string, Record<Lang, string>> = {
  // ====== Stage 1 ======
  "Равда": { bg: "Равда", en: "Ravda", it: "Ravda" },
  "Ахелой": { bg: "Ахелой", en: "Aheloy", it: "Aheloy" },
  "Поморие запад": { bg: "Поморие запад", en: "Pomorie west", it: "Pomorie ovest" },
  "Поморие": { bg: "Поморие", en: "Pomorie", it: "Pomorie" },
  "Сарафово": { bg: "Сарафово", en: "Sarafovo", it: "Sarafovo" },
  "Бургас Сарафово": { bg: "Бургас Сарафово", en: "Burgas Sarafovo", it: "Burgas Sarafovo" },
  "Бургас център": { bg: "Бургас център", en: "Burgas centre", it: "Burgas centro" },
  "Бургас вход": { bg: "Бургас вход", en: "Burgas entry", it: "Burgas ingresso" },
  "Росен": { bg: "Росен", en: "Rosen", it: "Rosen" },
  "Черноморец": { bg: "Черноморец", en: "Chernomorets", it: "Chernomorets" },
  "Созопол": { bg: "Созопол", en: "Sozopol", it: "Sozopol" },
  // ====== Stage 2 ======
  "Дъбник": { bg: "Дъбник", en: "Dabnik", it: "Dabnik" },
  "Айтос": { bg: "Айтос", en: "Aytos", it: "Aytos" },
  "Лозарево": { bg: "Лозарево", en: "Lozarevo", it: "Lozarevo" },
  "Черноград": { bg: "Черноград", en: "Chernograd", it: "Chernograd" },
  "Карнобат": { bg: "Карнобат", en: "Karnobat", it: "Karnobat" },
  "Венец": { bg: "Венец", en: "Venets", it: "Venets" },
  "Деветак": { bg: "Деветак", en: "Devetak", it: "Devetak" },
  "Лозенец": { bg: "Лозенец", en: "Lozenets", it: "Lozenets" },
  "Горно Александрово": { bg: "Горно Александрово", en: "Gorno Aleksandrovo", it: "Gorno Aleksandrovo" },
  "Трапоклово": { bg: "Трапоклово", en: "Trapoklovo", it: "Trapoklovo" },
  "Калояново": { bg: "Калояново", en: "Kaloyanovo", it: "Kaloyanovo" },
  "Сливен": { bg: "Сливен", en: "Sliven", it: "Sliven" },
  "Асенов мост": { bg: "Асенов мост", en: "Asenov Bridge", it: "Ponte Asen" },
  "Проход Бяла": { bg: "Проход Бяла", en: "Byala Pass", it: "Passo Byala" },
  "Бяла": { bg: "Бяла", en: "Byala", it: "Byala" },
  "Проход Вратник": { bg: "Проход Вратник", en: "Vratnik Pass", it: "Passo Vratnik" },
  "Камен": { bg: "Камен", en: "Kamen", it: "Kamen" },
  "Майско": { bg: "Майско", en: "Maysko", it: "Maysko" },
  "Константин": { bg: "Константин", en: "Konstantin", it: "Konstantin" },
  "Марян": { bg: "Марян", en: "Maryan", it: "Maryan" },
  "Милковци": { bg: "Милковци", en: "Milkovtsi", it: "Milkovtsi" },
  "Беброво": { bg: "Беброво", en: "Bebrovo", it: "Bebrovo" },
  "Миндя": { bg: "Миндя", en: "Mindya", it: "Mindya" },
  "Мерданя": { bg: "Мерданя", en: "Merdanya", it: "Merdanya" },
  // ====== Stage 3 ======
  "Стамболийски": { bg: "Стамболийски", en: "Stamboliyski", it: "Stamboliyski" },
  "Кричим разклон": { bg: "Кричим разклон", en: "Krichim junction", it: "Bivio Krichim" },
  "Мало Конаре": { bg: "Мало Конаре", en: "Malo Konare", it: "Malo Konare" },
  "Пазарджик": { bg: "Пазарджик", en: "Pazardzhik", it: "Pazardzhik" },
  "Звъничево": { bg: "Звъничево", en: "Zvanichevo", it: "Zvanichevo" },
  "Септември": { bg: "Септември", en: "Septemvri", it: "Septemvri" },
  "Белово": { bg: "Белово", en: "Belovo", it: "Belovo" },
  "Момина клисура": { bg: "Момина клисура", en: "Momina Klisura", it: "Momina Klisura" },
  "Костенец": { bg: "Костенец", en: "Kostenets", it: "Kostenets" },
  "Долна баня": { bg: "Долна баня", en: "Dolna Banya", it: "Dolna Banya" },
  "Радуил": { bg: "Радуил", en: "Raduil", it: "Raduil" },
  "Боровец проход": { bg: "Боровец проход", en: "Borovets Pass", it: "Passo Borovets" },
  "Боровец": { bg: "Боровец", en: "Borovets", it: "Borovets" },
  "Самоков": { bg: "Самоков", en: "Samokov", it: "Samokov" },
  "Бели Искър разклон": { bg: "Бели Искър разклон", en: "Beli Iskar junction", it: "Bivio Beli Iskar" },
  "Яз. Искър": { bg: "Яз. Искър", en: "Iskar Reservoir", it: "Lago di Iskar" },
  "Долни Пасарел": { bg: "Долни Пасарел", en: "Dolni Pasarel", it: "Dolni Pasarel" },
  "Кокаляне": { bg: "Кокаляне", en: "Kokalyane", it: "Kokalyane" },
  "Панчарево": { bg: "Панчарево", en: "Pancharevo", it: "Pancharevo" },
  "Цариградско шосе": { bg: "Цариградско шосе", en: "Tsarigradsko Shose", it: "Tsarigradsko Shose" },
  // ====== Closures: city headings ======
  "Бургас (старт етап 2)": { bg: "Бургас (старт етап 2)", en: "Burgas (Stage 2 start)", it: "Burgas (partenza Tappa 2)" },
};

const ALL_PLACE_LABELS: Record<string, Record<Lang, string>> = {
  ...placeLabels,
  ...extraPlaceLabels,
};

function markerStartLabel(stageId: number, lang: Lang) {
  if (lang === "en") return `START S${stageId}`;
  if (lang === "it") return `PARTENZA T${stageId}`;
  return `СТАРТ Е${stageId}`;
}

function markerFinishLabel(stageId: number, lang: Lang) {
  if (lang === "en") return `FINISH S${stageId}`;
  if (lang === "it") return `ARRIVO T${stageId}`;
  return `ФИНАЛ Е${stageId}`;
}

export function localizePlaceName(name: string, lang: Lang) {
  if (lang === "bg") return name;
  let text = name;
  for (const [bgName, labels] of Object.entries(ALL_PLACE_LABELS).sort((a, b) => b[0].length - a[0].length)) {
    text = text.replaceAll(bgName, labels[lang]);
    text = text.replaceAll(bgName.toUpperCase(), labels[lang].toUpperCase());
  }
  // Word-level replacements with Unicode word boundaries, so we don't chew
  // up syllables inside other Bulgarian words (e.g. /на/ inside "народно").
  const wb = (w: string) => new RegExp(`(?<![A-Za-zА-Яа-я])${w}(?![A-Za-zА-Яа-я])`, "gi");
  const replacements: Array<[RegExp, string]> = lang === "en"
    ? [
        [wb("втора обиколка"), "second lap"], [wb("2-ра обиколка"), "second lap"],
        [wb("обиколка"), "lap"],
        [wb("отклонение"), "junction"], [wb("разклон"), "junction"],
        [wb("проход"), "pass"], [wb("манастир"), "monastery"],
        [wb("връщане"), "return"], [wb("вход"), "entry"], [wb("изход"), "exit"],
        [wb("център"), "centre"], [wb("запад"), "west"], [wb("изток"), "east"],
        [wb("етап"), "stage"], [wb("старт"), "start"], [wb("финал"), "finish"],
        [wb("км0"), "km 0"], [wb("км"), "km"],
      ]
    : [
        [wb("втора обиколка"), "secondo giro"], [wb("2-ра обиколка"), "secondo giro"],
        [wb("обиколка"), "giro"],
        [wb("отклонение"), "bivio"], [wb("разклон"), "bivio"],
        [wb("проход"), "passo"], [wb("манастир"), "monastero"],
        [wb("връщане"), "ritorno"], [wb("вход"), "ingresso"], [wb("изход"), "uscita"],
        [wb("център"), "centro"], [wb("запад"), "ovest"], [wb("изток"), "est"],
        [wb("етап"), "tappa"], [wb("старт"), "partenza"], [wb("финал"), "arrivo"],
        [wb("км0"), "km 0"], [wb("км"), "km"],
      ];
  for (const [pattern, replacement] of replacements) text = text.replace(pattern, replacement);
  return text;
}

export function localizeClosureText(text: string, lang: Lang) {
  if (lang === "bg") return text;
  let result = localizePlaceName(text, lang);
  // Multi-word phrases first (longest -> shortest), then individual words with
  // Unicode word boundaries. Critically, we DO NOT translate short particles
  // like "на", "от", "при", "в" — they appear inside many Bulgarian words
  // and naive global replace destroys readable text.
  const wb = (w: string) => new RegExp(`(?<![A-Za-zА-Яа-я])${w}(?![A-Za-zА-Яа-я])`, "gi");
  const phrases: Array<[RegExp, string]> = lang === "en"
    ? [
        [/преминаване на колоната(?:; 2-ро влизане[^)]*)?/gi, "peloton passage"],
        [/технически дейности по трасето/gi, "technical work on the route"],
        [/цялото трасе на финала в София/gi, "the full Sofia finish route"],
        [/цялото трасе на финала/gi, "the full finish route"],
        [/забрана за престой и паркиране/gi, "stopping and parking ban"],
        [/забрана за паркиране/gi, "parking ban"],
        [/забрана за влизане на МПС/gi, "vehicle entry ban"],
        [/пълно затваряне на движението/gi, "full traffic closure"],
        [/затворено за движение/gi, "closed to traffic"],
        [/само за градски транспорт/gi, "public transport only"],
        [/всички пресичащи улици се затварят/gi, "all crossing streets are closed"],
        [/в зоната на кръстовищата/gi, "at junction areas"],
        [/в зоната на финала/gi, "in the finish area"],
        [/в зоната на/gi, "in the area of"],
        [/път при/gi, "Road at"],
        [/в двете посоки/gi, "both directions"],
        [/северно от/gi, "north of"],
        [/част от паркинг/gi, "part of car park"],
        [/ч\. на/gi, "on"], [/ч\./gi, ""],
        [/ул\./gi, "St."], [/бул\./gi, "Blvd."], [/пл\./gi, "Sq."], [/кв\./gi, "district"], [/с\./gi, "village"],
      ]
    : [
        [/преминаване на колоната(?:; 2-ро влизане[^)]*)?/gi, "passaggio del gruppo"],
        [/технически дейности по трасето/gi, "lavori tecnici sul percorso"],
        [/цялото трасе на финала в София/gi, "tutto il percorso di arrivo a Sofia"],
        [/цялото трасе на финала/gi, "tutto il percorso di arrivo"],
        [/забрана за престой и паркиране/gi, "divieto di sosta e parcheggio"],
        [/забрана за паркиране/gi, "divieto di parcheggio"],
        [/забрана за влизане на МПС/gi, "divieto di accesso ai veicoli"],
        [/пълно затваряне на движението/gi, "chiusura totale al traffico"],
        [/затворено за движение/gi, "chiusa al traffico"],
        [/само за градски транспорт/gi, "solo trasporto pubblico"],
        [/всички пресичащи улици се затварят/gi, "tutte le vie trasversali chiuse"],
        [/в зоната на кръстовищата/gi, "nell'area degli incroci"],
        [/в зоната на финала/gi, "nell'area di arrivo"],
        [/в зоната на/gi, "nell'area di"],
        [/път при/gi, "Strada presso"],
        [/в двете посоки/gi, "in entrambe le direzioni"],
        [/северно от/gi, "a nord di"],
        [/част от паркинг/gi, "parte del parcheggio"],
        [/ч\. на/gi, "del"], [/ч\./gi, ""],
        [/ул\./gi, "Via"], [/бул\./gi, "Viale"], [/пл\./gi, "Piazza"], [/кв\./gi, "quartiere"], [/с\./gi, "villaggio"],
      ];
  for (const [pattern, replacement] of phrases) result = result.replace(pattern, replacement);
  const words: Array<[RegExp, string]> = lang === "en"
    ? [
        [wb("финиш"), "finish"], [wb("старт"), "start"], [wb("финал"), "finish"],
        [wb("отклонение"), "junction"], [wb("разклон"), "junction"],
      ]
    : [
        [wb("финиш"), "arrivo"], [wb("старт"), "partenza"], [wb("финал"), "arrivo"],
        [wb("отклонение"), "bivio"], [wb("разклон"), "bivio"],
      ];
  for (const [pattern, replacement] of words) result = result.replace(pattern, replacement);
  return result.replace(/\s{2,}/g, " ").trim();
}

type TagLabels = Record<NonNullable<CulturalEvent["tag"]>, string>;

function eventPopup(ev: CulturalEvent, cityName: string, color: string, weekdays: string[], months: string[], tagLabels: TagLabels, lang: Lang) {
  const tagText = ev.tag ? tagLabels[ev.tag] : "";
  const loc = localizeEvent(ev, lang);
  return `<div style="font-family:system-ui,sans-serif;max-width:280px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${color};font-weight:800;">${cityName}${tagText ? ` · ${tagText}` : ""}</div>
    <div style="font-size:14px;font-weight:700;margin:4px 0 6px;color:#1f1326;line-height:1.25;">${loc.title}</div>
    <div style="font-size:12px;color:#374151;display:flex;flex-direction:column;gap:3px;">
      <div>📅 <strong>${fmtDateWith(ev.date, weekdays, months)}</strong>${ev.time ? ` · ${ev.time}` : ""}</div>
      ${loc.location ? `<div>📍 ${loc.location}</div>` : ""}
    </div>
  </div>`;
}

// Map official KML stage data by stage id (1=Burgas, 2=Veliko Tarnovo, 3=Sofia)
const officialStageById = new Map(GIRO_STAGES.map((s) => [s.stage, s]));

const pointTypeStyle: Record<GiroPoint["type"], { color: string; glyph: string; size: number }> = {
  start:    { color: "#16a34a", glyph: "S",  size: 28 },
  km:       { color: "#1f2937", glyph: "•",  size: 14 },
  halfway:  { color: "#f59e0b", glyph: "½",  size: 22 },
  redbull:  { color: "#dc2626", glyph: "RB", size: 22 },
  road:     { color: "#0ea5e9", glyph: "↦",  size: 18 },
  poi:      { color: "#7c3aed", glyph: "★",  size: 20 },
};

function shouldRenderOfficialPoint(point: GiroPoint) {
  const name = point.name.toLowerCase();
  return point.type !== "start" && !name.includes("end of route") && !name.includes("начало на") && !name.includes("край на");
}

function officialPointIcon(type: GiroPoint["type"]) {
  const s = pointTypeStyle[type];
  return L.divIcon({
    className: "giro-official-marker",
    html: `<div style="background:${s.color};color:#fff;border:2px solid #fff;border-radius:9999px;width:${s.size}px;height:${s.size}px;display:flex;align-items:center;justify-content:center;font-size:${Math.max(9, s.size / 2.4)}px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-family:system-ui,sans-serif;line-height:1;">${s.glyph}</div>`,
    iconSize: [s.size, s.size],
    iconAnchor: [s.size / 2, s.size / 2],
  });
}

const STAGE1_NEUTRAL_ROUTE: [number, number][] = [
  [42.660600, 27.736600],
  [42.660395, 27.735897],
  [42.660148, 27.735010],
  [42.659618, 27.734989],
  [42.658976, 27.734546],
  [42.657956, 27.734219],
  [42.657561, 27.733141],
  [42.657066, 27.732512],
  [42.658436, 27.730215],
  [42.658871, 27.729939],
  [42.659264, 27.728742],
  [42.659330, 27.728476],
  [42.659458, 27.725948],
  [42.659100, 27.722900],
  [42.658500, 27.720400],
  [42.659700, 27.716500],
  [42.662700, 27.712300],
  [42.665500, 27.707472],
  [42.669740, 27.706800],
];

function addStage1NeutralRoute(layers: L.LayerGroup, lang: Lang) {
  const label =
    lang === "bg"
      ? "Неутрализиран стартов участък до km 0"
      : lang === "it"
        ? "Tratto neutralizzato fino al km 0"
        : "Neutralized start section to km 0";

  L.polyline(STAGE1_NEUTRAL_ROUTE as L.LatLngExpression[], {
    color: "#ffffff",
    weight: 9,
    opacity: 0.92,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(layers);

  L.polyline(STAGE1_NEUTRAL_ROUTE as L.LatLngExpression[], {
    color: "#16a34a",
    weight: 5,
    opacity: 1,
    lineCap: "round",
    lineJoin: "round",
  })
    .addTo(layers)
    .bindPopup(`<div style="font-family:system-ui,sans-serif;font-size:13px;font-weight:700;color:#14532d;">${label}</div>`);
}

function featurePopup(properties: Record<string, unknown>, lang: Lang) {
  const fallback = lang === "bg" ? "Детайл от картата" : lang === "en" ? "Map detail" : "Dettaglio mappa";
  const name = localizeClosureText(String(properties.name ?? fallback), lang);
  const body = localizeClosureText(String(properties.description ?? properties.Съдържание ?? ""), lang);
  return `<div style="font-family:system-ui,sans-serif;max-width:260px;"><strong>${name}</strong>${body ? `<div style="margin-top:6px;font-size:12px;color:#4b5563;">${body}</div>` : ""}</div>`;
}

function addBurgasReferenceLayers(map: L.Map, layers: L.LayerGroup, activeStageId: number, closureLabel: string, lang: Lang) {
  if (!map.getPane("burgas-detail")) {
    map.createPane("burgas-detail");
    map.getPane("burgas-detail")!.style.zIndex = "450";
  }

  // Filter race-stage features by the currently selected stage so that e.g.
  // when the user views ONLY Stage 1, the Stage 2 starting line (Burgas →
  // Vetren) is not drawn on the map.
  const stageMatches = (rawName: string): boolean => {
    if (activeStageId === 0) return true;
    const n = rawName.toLowerCase();
    const isStage1 = n.includes("етап 1") || n.includes("stage 1");
    const isStage2 = n.includes("етап 2") || n.includes("stage 2");
    const isStage3 = n.includes("етап 3") || n.includes("stage 3");
    // Generic features (no stage marker) are kept for all views.
    if (!isStage1 && !isStage2 && !isStage3) return true;
    if (activeStageId === 1) return isStage1;
    if (activeStageId === 2) return isStage2;
    if (activeStageId === 3) return isStage3;
    return true;
  };

  const rsRaw = burgasUmapLayers.raceStages as unknown as {
    type: string;
    features: Array<{ geometry?: { type?: string }; properties?: { name?: string } }>;
  };
  const filteredRaceStages = {
    ...rsRaw,
    features: rsRaw.features.filter((f) => {
      const geometryType = f?.geometry?.type;
      return stageMatches(String(f?.properties?.name ?? "")) && (geometryType === "LineString" || geometryType === "MultiLineString");
    }),
  };

  L.geoJSON(filteredRaceStages as never, {
    pane: "burgas-detail",
    style: (feature) => {
      const props = (feature?.properties ?? {}) as Record<string, string>;
      return {
        color: props.stroke || "#ec4899",
        weight: Number(props["stroke-width"] || 8),
        opacity: Number(props["stroke-opacity"] || 1),
        lineCap: "round",
        lineJoin: "round",
      };
    },
    pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: makeIcon("#ec4899", "G") }),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(featurePopup((feature.properties ?? {}) as Record<string, unknown>, lang));
    },
  }).addTo(layers);

  L.geoJSON(burgasUmapLayers.trafficOrganization as never, {
    pane: "burgas-detail",
    style: (feature) => {
      const props = (feature?.properties ?? {}) as Record<string, string>;
      return {
        color: props.stroke || "#b91c1c",
        weight: Number(props["stroke-width"] || 3),
        opacity: Number(props["stroke-opacity"] || 0.75),
        fillColor: props.fill || "#dc2626",
        fillOpacity: Number(props["fill-opacity"] || 0.18),
      };
    },
    pointToLayer: (feature, latlng) => {
      const props = (feature?.properties ?? {}) as Record<string, string>;
      return L.marker(latlng, { icon: infoIcon(props.fill || "#b91c1c", closureLabel) });
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(featurePopup((feature.properties ?? {}) as Record<string, unknown>, lang));
    },
  }).addTo(layers);
}

async function fetchOsrmRoute(coords: [number, number][]): Promise<[number, number][]> {
  // OSRM expects lng,lat; chunk if too many waypoints (<=25 typically OK on demo server)
  const chunks: [number, number][][] = [];
  const max = 20;
  for (let i = 0; i < coords.length; i += max - 1) {
    chunks.push(coords.slice(i, i + max));
  }
  const all: [number, number][] = [];
  for (const chunk of chunks) {
    if (chunk.length < 2) continue;
    const coordStr = chunk.map(([lat, lng]) => `${lng},${lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("OSRM error");
      const data = await res.json();
      const geom = data.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
      if (geom) {
        for (const [lng, lat] of geom) all.push([lat, lng]);
      }
    } catch {
      // fallback: straight lines for this chunk
      for (const [lat, lng] of chunk) all.push([lat, lng]);
    }
  }
  return all;
}

export default function RouteMap({ stages, activeStageId, onUserLocation }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const eventsLayerRef = useRef<L.LayerGroup | null>(null);
  const viewingLayerRef = useRef<L.LayerGroup | null>(null);
  const [locating, setLocating] = useState(false);
  const [routingCount, setRoutingCount] = useState(0);
  const [showEvents, setShowEvents] = useState(true);
  const [showOfficial, setShowOfficial] = useState(true);
  const [showViewing, setShowViewing] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const { t, lang } = useT();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [42.7339, 25.4858],
      zoom: 7,
      scrollWheelZoom: false,
      dragging: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · routing &copy; <a href="https://project-osrm.org">OSRM</a>',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    layersRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    eventsLayerRef.current = L.layerGroup().addTo(map);
    viewingLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Toggle scroll-wheel zoom + dragging based on user-activated "interactive" mode.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (interactive) {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [interactive]);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;
    layers.clearLayers();

    const visibleStages = stages.filter((s) => activeStageId === 0 || s.id === activeStageId);
    const allLatLngs: L.LatLngExpression[] = [];
    let cancelled = false;

    if (activeStageId === 0 || activeStageId === 1 || activeStageId === 2) {
    addBurgasReferenceLayers(map, layers, activeStageId, t.closuresPin, lang);
      allLatLngs.push([42.4939, 27.477], [42.6587, 27.7307]);
    }

    visibleStages.forEach((stage) => {
      const waypointLatLngs = stage.waypoints.map((w) => w.coords as [number, number]);
      allLatLngs.push(...waypointLatLngs);

      // Try to draw the OFFICIAL route geometry from the Giro KML data
      const official = officialStageById.get(stage.id);
      if (official && official.route.length > 1) {
        // glow
        L.polyline(official.route as L.LatLngExpression[], {
          color: stage.color,
          weight: 12,
          opacity: 0.22,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layers);
        // main
        L.polyline(official.route as L.LatLngExpression[], {
          color: stage.color,
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layers);
        for (const p of official.route) allLatLngs.push(p as L.LatLngExpression);

        if (stage.id === 1) {
          addStage1NeutralRoute(layers, lang);
          allLatLngs.push(...STAGE1_NEUTRAL_ROUTE);
        }

        // Official KML waypoints (KM markers, exits, POIs) — as a separate, toggleable layer
        if (showOfficial) {
          for (const pt of official.points.filter(shouldRenderOfficialPoint)) {
            const m = L.marker([pt.lat, pt.lng], {
              icon: officialPointIcon(pt.type),
              zIndexOffset: pt.type === "start" || pt.type === "redbull" || pt.type === "halfway" ? 600 : 200,
            }).addTo(layers);
            m.bindPopup(
              `<div style="font-family:system-ui,sans-serif;min-width:160px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${stage.color};font-weight:800;">${t.stageN(stage.id)} · ${t.stageTypeLabels[pt.type]}</div>
                <div style="font-size:14px;font-weight:700;margin-top:4px;color:#1f1326;">${localizePlaceName(pt.name, lang)}</div>
              </div>`,
            );
          }
        }
      } else {
        // Fallback: dashed line between waypoints if no official KML for this stage
        L.polyline(waypointLatLngs, {
          color: stage.color,
          weight: 3,
          opacity: 0.4,
          dashArray: "6 6",
        }).addTo(layers);
      }

      stage.waypoints.forEach((wp, i) => {
        const isStart = i === 0;
        const isFinish = i === stage.waypoints.length - 1;

        // Detect "shared point" case: this stage's finish == next stage's start
        // (or this stage's start == previous stage's finish). When both stages
        // are visible we render a SINGLE combined marker instead of two pins
        // sitting on top of each other.
        const COORD_EPS = 0.0005;
        const sameCoords = (a: [number, number], b: [number, number]) =>
          Math.abs(a[0] - b[0]) < COORD_EPS && Math.abs(a[1] - b[1]) < COORD_EPS;

        const nextStage = stages.find((s) => s.id === stage.id + 1);
        const prevStage = stages.find((s) => s.id === stage.id - 1);
        const nextStageVisible = nextStage && (activeStageId === 0 || activeStageId === nextStage.id);
        const prevStageVisible = prevStage && (activeStageId === 0 || activeStageId === prevStage.id);

        const isSharedFinish =
          isFinish &&
          nextStage &&
          nextStageVisible &&
          nextStage.waypoints.length > 0 &&
          sameCoords(wp.coords as [number, number], nextStage.waypoints[0].coords as [number, number]);

        const isSharedStartSkip =
          isStart &&
          prevStage &&
          prevStageVisible &&
          prevStage.waypoints.length > 0 &&
          sameCoords(
            wp.coords as [number, number],
            prevStage.waypoints[prevStage.waypoints.length - 1].coords as [number, number],
          );

        // Skip the duplicate start marker — the combined marker on the previous
        // stage's finish already represents this point.
        if (isSharedStartSkip) return;

        const icon = isSharedFinish
          ? combinedFinishStartIcon(stage.color, nextStage!.color, markerFinishLabel(stage.id, lang), markerStartLabel(nextStage!.id, lang), localizePlaceName(stage.to, lang))
          : wp.name.toLowerCase().includes("км0")
            ? kmZeroIcon()
          : isStart
            ? startFlagIcon(stage.color, markerStartLabel(stage.id, lang), localizePlaceName(stage.from, lang))
            : isFinish
              ? finishFlagIcon(stage.color, markerFinishLabel(stage.id, lang), localizePlaceName(stage.to, lang))
              : makeIcon(stage.color, `${stage.id}`);
        const marker = L.marker(wp.coords as L.LatLngExpression, {
          icon,
          zIndexOffset: isSharedFinish ? 1100 : isStart ? 1000 : isFinish ? 900 : 0,
        }).addTo(layers);

        const popupHtml = isSharedFinish
          ? `
          <div style="font-family:system-ui,sans-serif;min-width:220px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${stage.color};font-weight:700;">${t.finishStageN(stage.id)} · ${localizePlaceName(stage.to, lang)}</div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${nextStage!.color};font-weight:700;margin-top:2px;">${t.startStageN(nextStage!.id)} · ${localizePlaceName(nextStage!.from, lang)}</div>
            <div style="font-size:13px;color:#374151;margin-top:8px;line-height:1.35;">${t.sharedPointDesc(stage.id, nextStage!.id)}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;font-size:12px;">
              <div style="color:${stage.color};"><strong>${t.finishE(stage.id)}</strong><br/>${wp.raceTime}</div>
              <div style="color:${nextStage!.color};"><strong>${t.startE(nextStage!.id)}</strong><br/>${nextStage!.waypoints[0].raceTime}</div>
            </div>
          </div>`
          : `
          <div style="font-family:system-ui,sans-serif;min-width:200px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${stage.color};font-weight:700;">${t.stageN(stage.id)} · ${localizePlaceName(stage.from, lang)} → ${localizePlaceName(stage.to, lang)}</div>
            <div style="font-size:15px;font-weight:700;margin:4px 0;color:#1f1326;">${localizePlaceName(wp.name, lang)}</div>
            ${wp.road ? `<div style="font-size:12px;color:#6b7280;">${t.road} ${wp.road}</div>` : ""}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;font-size:12px;">
              <div><strong>${t.totalKmLabel}</strong><br/>${wp.totalKm}</div>
              <div><strong>${t.toFinishLabel}</strong><br/>${wp.toFinishKm} ${t.kmShort}</div>
              <div style="color:${stage.color};"><strong>${t.passingLabel}</strong><br/>${wp.raceTime}</div>
              <div style="color:#dc2626;"><strong>${t.closureLabel}</strong><br/>${wp.closeTime}</div>
            </div>
          </div>`;
        marker.bindPopup(popupHtml);
      });

      // ===== Closure information pins per city/group from stage.closures =====
      // Place one 🚧 pin per closure GROUP at the corresponding city center,
      // with small fan-out offsets so multiple groups in the same city are
      // distinguishable on the map.
      const cityCenters: Record<string, [number, number]> = {
        // Old Town Nessebar peninsula — keeps closure pins on land near the actual closed streets
        "несебър": [42.6595, 27.7345],
        // Burgas Stage 1 finish area — Demokratsia Blvd. near the Sea Garden
        "бургас": [42.4990, 27.4740],
        // Burgas Stage 2 start — pl. Troykata / Aleksandrovska
        "бургас (старт етап 2)": [42.4966, 27.4712],
        "велико търново": [43.0812, 25.6310],
        "пловдив": [42.1421, 24.7499],
        "софия": [42.6939, 23.3325],
      };
      stage.closures.forEach((cl, ci) => {
        const key = cl.city.toLowerCase();
        const center = cityCenters[key];
        if (!center) return;
        cl.groups.forEach((group, gi) => {
          // Tighter fan-out (~80–180 m) so multiple pins per city stay close to
          // the actual closure area instead of drifting into the sea / industrial zones.
          const angle = ((ci * 3 + gi) * 55) * (Math.PI / 180);
          const r = 0.0010 + ((ci + gi) % 3) * 0.0006;
          const lat = center[0] + Math.cos(angle) * r;
          const lng = center[1] + Math.sin(angle) * r * 1.35;
          const m = L.marker([lat, lng], {
            icon: infoIcon("#b91c1c", t.closuresPin),
            zIndexOffset: 700,
          }).addTo(layers);
          const streetsHtml = group.streets
            .map((s) => `<li style="margin:2px 0;">${localizeClosureText(s, lang)}</li>`)
            .join("");
          m.bindPopup(`
            <div style="font-family:system-ui,sans-serif;max-width:320px;">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#b91c1c;font-weight:800;">${t.closuresPin} · ${localizePlaceName(cl.city, lang)}</div>
              <div style="font-size:13px;font-weight:700;margin:4px 0 6px;color:#1f1326;line-height:1.3;">${localizeClosureText(group.period, lang)}</div>
              <ul style="font-size:12px;color:#374151;padding-left:16px;margin:0;line-height:1.35;max-height:220px;overflow-y:auto;">${streetsHtml}</ul>
              ${cl.note ? `<div style="font-size:11px;color:#6b7280;margin-top:6px;font-style:italic;">${localizeClosureText(cl.note, lang)}</div>` : ""}
            </div>
          `);
        });
      });
    });

    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      cancelled = true;
    };
  }, [stages, activeStageId, showOfficial, t, lang]);

  // Render cultural / sport event pins
  useEffect(() => {
    const layer = eventsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!showEvents) return;

    // Group events by coordinate so overlapping pins become one marker with N events
    const buckets = new Map<string, { lat: number; lng: number; items: { ev: CulturalEvent; cityName: string; color: string }[] }>();
    for (const city of cityPrograms) {
      for (const ev of city.events) {
        if (!ev.coords) continue;
        const key = `${ev.coords[0].toFixed(4)},${ev.coords[1].toFixed(4)}`;
        if (!buckets.has(key)) buckets.set(key, { lat: ev.coords[0], lng: ev.coords[1], items: [] });
        buckets.get(key)!.items.push({
          ev,
          cityName: localizeCityName(city, lang),
          color: ev.tag ? tagColor[ev.tag] : "#ec4899",
        });
      }
    }

    for (const { lat, lng, items } of buckets.values()) {
      const primary = items[0];
      const glyph = primary.ev.tag ? tagEmoji[primary.ev.tag] : "✦";
      const marker = L.marker([lat, lng], {
        icon: eventIcon(primary.color, items.length > 1 ? String(items.length) : glyph),
        zIndexOffset: 500,
      }).addTo(layer);

      if (items.length === 1) {
        marker.bindPopup(eventPopup(primary.ev, primary.cityName, primary.color, t.weekdays, t.months, t.tagLabels, lang));
      } else {
        const sorted = [...items].sort((a, b) =>
          (a.ev.date + (a.ev.time ?? "")).localeCompare(b.ev.date + (b.ev.time ?? "")),
        );
        const html = `<div style="font-family:system-ui,sans-serif;max-width:300px;max-height:300px;overflow-y:auto;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${primary.color};font-weight:800;margin-bottom:6px;">${primary.cityName} · ${t.eventsAt(items.length)}</div>
          ${sorted.map(({ ev, color }) => {
            const loc = localizeEvent(ev, lang);
            return `
            <div style="border-top:1px solid #e5e7eb;padding:6px 0;">
              <div style="font-size:11px;color:${color};font-weight:700;">${fmtDateWith(ev.date, t.weekdays, t.months)}${ev.time ? ` · ${ev.time}` : ""}${ev.tag ? ` · ${t.tagLabels[ev.tag]}` : ""}</div>
              <div style="font-size:13px;font-weight:600;color:#1f1326;line-height:1.25;margin-top:2px;">${loc.title}</div>
              ${loc.location ? `<div style="font-size:11px;color:#6b7280;margin-top:2px;">📍 ${loc.location}</div>` : ""}
            </div>
            `;
          }).join("")}
        </div>`;
        marker.bindPopup(html);
      }
    }
  }, [showEvents, t, lang]);

  // Render recommended viewing-spot pins
  useEffect(() => {
    const layer = viewingLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!showViewing) return;

    const visible = viewingSpots.filter(
      (s) => activeStageId === 0 || s.stageId === activeStageId,
    );
    for (const spot of visible) {
      const stage = stages.find((s) => s.id === spot.stageId);
      const stageColor = stage?.color ?? VIEWING_SPOT_COLOR;
      const loc = localizeViewingSpot(spot, lang);
      const m = L.marker(spot.coords as L.LatLngExpression, {
        icon: viewingSpotIcon(t.viewingSpotPin),
        zIndexOffset: 800,
      }).addTo(layer);
      m.bindPopup(`
        <div style="font-family:system-ui,sans-serif;max-width:300px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${VIEWING_SPOT_COLOR};font-weight:800;">👁 ${t.viewingSpotKicker}</div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:${stageColor};font-weight:700;margin-top:3px;">${t.stageN(spot.stageId)}</div>
          <div style="font-size:14px;font-weight:700;margin:4px 0 6px;color:#1f1326;line-height:1.3;">${loc.title}</div>
          ${loc.description ? `<div style="font-size:12px;color:#374151;line-height:1.4;">${loc.description}</div>` : ""}
        </div>
      `);
    }
  }, [showViewing, activeStageId, stages, t, lang]);

  const handleLocate = () => {
    if (!navigator.geolocation || !mapRef.current || !userLayerRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const layer = userLayerRef.current!;
        layer.clearLayers();
        L.marker([lat, lng], { icon: userIcon(), zIndexOffset: 1000 })
          .bindPopup(
            `<div style="font-family:system-ui,sans-serif;"><strong>${t.yourPosition}</strong><br/><span style="color:#6b7280;font-size:12px;">${lat.toFixed(4)}, ${lng.toFixed(4)}</span></div>`,
          )
          .addTo(layer);
        L.circle([lat, lng], {
          radius: pos.coords.accuracy || 50,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.08,
          weight: 1,
        }).addTo(layer);
        mapRef.current!.setView([lat, lng], 13, { animate: true });
        onUserLocation?.({ lat, lng });
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error", err);
        setLocating(false);
        alert(t.geoError);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[600px] w-full rounded-2xl overflow-hidden shadow-[var(--shadow-rosa)] border border-border"
        style={{ background: "#f1f5f9" }}
      />
      {routingCount > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] inline-flex items-center gap-2 rounded-full bg-background/95 backdrop-blur px-4 py-2 text-xs font-semibold shadow-lg border border-border">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          {t.routingLabel}
        </div>
      )}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 items-end">
        <Button onClick={handleLocate} size="sm" className="shadow-lg" disabled={locating}>
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
          <span className="ml-2">{t.findMe}</span>
        </Button>
        <Button
          onClick={() => setShowEvents((v) => !v)}
          size="sm"
          variant={showEvents ? "default" : "secondary"}
          className="shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span className="ml-2">{showEvents ? t.hideEvents : t.showEvents}</span>
        </Button>
        <Button
          onClick={() => setShowViewing((v) => !v)}
          size="sm"
          variant={showViewing ? "default" : "secondary"}
          className="shadow-lg"
        >
          <Eye className="h-4 w-4" />
          <span className="ml-2">{showViewing ? t.hideViewingSpots : t.showViewingSpots}</span>
        </Button>
        <Button
          onClick={() => setShowOfficial((v) => !v)}
          size="sm"
          variant={showOfficial ? "default" : "secondary"}
          className="shadow-lg"
        >
          <span className="ml-2">{showOfficial ? t.hideKm : t.showKm}</span>
        </Button>
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[400] rounded-xl bg-background/95 backdrop-blur px-3 py-2 text-[11px] shadow-lg border border-border">
        <div className="font-bold uppercase tracking-wider text-[10px] mb-1 text-muted-foreground">{t.legendEvents}</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {(Object.keys(tagEmoji) as Array<keyof typeof tagEmoji>).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: tagColor[tag] }}
              />
              {t.tagLabels[tag]}
            </span>
          ))}
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: VIEWING_SPOT_COLOR }}
            />
            👁 {t.legendViewingSpot}
          </span>
        </div>
      </div>
      <style>{`@keyframes giroPulse{0%{transform:scale(0.6);opacity:0.8}100%{transform:scale(2.2);opacity:0}}`}</style>
    </div>
  );
}
