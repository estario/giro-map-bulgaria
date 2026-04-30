import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Stage } from "@/data/stages";
import { burgasUmapLayers } from "@/data/burgasUmap";
import { cityPrograms, tagColor, type CulturalEvent } from "@/data/events";
import { GIRO_STAGES, type GiroPoint } from "@/data/giroStages";
import { Button } from "@/components/ui/button";
import { LocateFixed, Loader2, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

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

// Distinct flag-style marker for stage START — clearly readable on the map
// so two stages whose start/finish are close (e.g. Stage 1 finish in Burgas
// and Stage 2 start in Burgas) cannot be confused.
function startFlagIcon(color: string, stageId: number, city: string, offsetX = 0) {
  const label = `СТАРТ Е${stageId}`;
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

function finishFlagIcon(color: string, stageId: number, city: string, offsetX = 0) {
  const label = `ФИНАЛ Е${stageId}`;
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
  finishStageId: number,
  startStageId: number,
  city: string,
) {
  return L.divIcon({
    className: "giro-combined-marker",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:flex-start;font-family:system-ui,sans-serif;pointer-events:auto;">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="background:#fff;color:${finishColor};padding:3px 8px;border:2px solid ${finishColor};border-bottom-width:1px;border-radius:6px 6px 2px 2px;font-size:11px;font-weight:800;letter-spacing:0.03em;box-shadow:0 4px 12px rgba(0,0,0,0.3);white-space:nowrap;line-height:1.1;">
          🏆 ФИНАЛ Е${finishStageId}
        </div>
        <div style="background:${startColor};color:#fff;padding:3px 8px;border:2px solid ${startColor};border-top-width:1px;border-radius:2px 2px 6px 6px;font-size:11px;font-weight:800;letter-spacing:0.03em;box-shadow:0 4px 12px rgba(0,0,0,0.4);white-space:nowrap;line-height:1.1;">
          🏁 СТАРТ Е${startStageId}<span style="opacity:0.9;font-weight:600;margin-left:4px;">· ${city}</span>
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

const WEEKDAYS_BG = ["нед", "пон", "вто", "сря", "чет", "пет", "съб"];
const MONTHS_BG = ["януари","февруари","март","април","май","юни","юли","август","септември","октомври","ноември","декември"];
function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_BG[d.getMonth()]} (${WEEKDAYS_BG[d.getDay()]})`;
}

function eventPopup(ev: CulturalEvent, cityName: string, color: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:280px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${color};font-weight:800;">${cityName}${ev.tag ? ` · ${ev.tag}` : ""}</div>
    <div style="font-size:14px;font-weight:700;margin:4px 0 6px;color:#1f1326;line-height:1.25;">${ev.title}</div>
    <div style="font-size:12px;color:#374151;display:flex;flex-direction:column;gap:3px;">
      <div>📅 <strong>${fmtDate(ev.date)}</strong>${ev.time ? ` · ${ev.time}` : ""}</div>
      ${ev.location ? `<div>📍 ${ev.location}</div>` : ""}
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

function featurePopup(properties: Record<string, unknown>) {
  const name = String(properties.name ?? "Детайл от картата");
  const body = String(properties.description ?? properties.Съдържание ?? "");
  return `<div style="font-family:system-ui,sans-serif;max-width:260px;"><strong>${name}</strong>${body ? `<div style="margin-top:6px;font-size:12px;color:#4b5563;">${body}</div>` : ""}</div>`;
}

function addBurgasReferenceLayers(map: L.Map, layers: L.LayerGroup, activeStageId: number, closureLabel: string) {
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
      layer.bindPopup(featurePopup((feature.properties ?? {}) as Record<string, unknown>));
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
      layer.bindPopup(featurePopup((feature.properties ?? {}) as Record<string, unknown>));
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
  const [locating, setLocating] = useState(false);
  const [routingCount, setRoutingCount] = useState(0);
  const [showEvents, setShowEvents] = useState(true);
  const [showOfficial, setShowOfficial] = useState(true);
  const { t } = useT();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [42.7339, 25.4858],
      zoom: 7,
      scrollWheelZoom: true,
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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;
    layers.clearLayers();

    const visibleStages = stages.filter((s) => activeStageId === 0 || s.id === activeStageId);
    const allLatLngs: L.LatLngExpression[] = [];
    let cancelled = false;

    if (activeStageId === 0 || activeStageId === 1 || activeStageId === 2) {
    addBurgasReferenceLayers(map, layers, activeStageId, t.closuresPin);
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

        // Official KML waypoints (KM markers, exits, POIs) — as a separate, toggleable layer
        if (showOfficial) {
          for (const pt of official.points.filter(shouldRenderOfficialPoint)) {
            const m = L.marker([pt.lat, pt.lng], {
              icon: officialPointIcon(pt.type),
              zIndexOffset: pt.type === "start" || pt.type === "redbull" || pt.type === "halfway" ? 600 : 200,
            }).addTo(layers);
            m.bindPopup(
              `<div style="font-family:system-ui,sans-serif;min-width:160px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${stage.color};font-weight:800;">${stage.name} · ${pt.type}</div>
                <div style="font-size:14px;font-weight:700;margin-top:4px;color:#1f1326;">${pt.name}</div>
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
          ? combinedFinishStartIcon(stage.color, nextStage!.color, stage.id, nextStage!.id, stage.to)
          : isStart
            ? startFlagIcon(stage.color, stage.id, stage.from)
            : isFinish
              ? finishFlagIcon(stage.color, stage.id, stage.to)
              : makeIcon(stage.color, `${stage.id}`);
        const marker = L.marker(wp.coords as L.LatLngExpression, {
          icon,
          zIndexOffset: isSharedFinish ? 1100 : isStart ? 1000 : isFinish ? 900 : 0,
        }).addTo(layers);

        const popupHtml = isSharedFinish
          ? `
          <div style="font-family:system-ui,sans-serif;min-width:220px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${stage.color};font-weight:700;">🏆 Финал Етап ${stage.id} · ${stage.to}</div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${nextStage!.color};font-weight:700;margin-top:2px;">🏁 Старт Етап ${nextStage!.id} · ${nextStage!.from}</div>
            <div style="font-size:13px;color:#374151;margin-top:8px;line-height:1.35;">Една и съща точка — финалът на етап ${stage.id} и стартът на етап ${nextStage!.id} са на едно и също място.</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;font-size:12px;">
              <div style="color:${stage.color};"><strong>Финал Е${stage.id}:</strong><br/>${wp.raceTime}</div>
              <div style="color:${nextStage!.color};"><strong>Старт Е${nextStage!.id}:</strong><br/>${nextStage!.waypoints[0].raceTime}</div>
            </div>
          </div>`
          : `
          <div style="font-family:system-ui,sans-serif;min-width:200px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${stage.color};font-weight:700;">${stage.name} · ${stage.from} → ${stage.to}</div>
            <div style="font-size:15px;font-weight:700;margin:4px 0;color:#1f1326;">${wp.name}</div>
            ${wp.road ? `<div style="font-size:12px;color:#6b7280;">Път ${wp.road}</div>` : ""}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;font-size:12px;">
              <div><strong>Общо км:</strong><br/>${wp.totalKm}</div>
              <div><strong>До финал:</strong><br/>${wp.toFinishKm} км</div>
              <div style="color:${stage.color};"><strong>Преминаване:</strong><br/>${wp.raceTime}</div>
              <div style="color:#dc2626;"><strong>Затваряне:</strong><br/>${wp.closeTime}</div>
            </div>
          </div>`;
        marker.bindPopup(popupHtml);
      });
    });

    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      cancelled = true;
    };
  }, [stages, activeStageId, showOfficial]);

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
          cityName: city.name,
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
        marker.bindPopup(eventPopup(primary.ev, primary.cityName, primary.color));
      } else {
        const sorted = [...items].sort((a, b) =>
          (a.ev.date + (a.ev.time ?? "")).localeCompare(b.ev.date + (b.ev.time ?? "")),
        );
        const html = `<div style="font-family:system-ui,sans-serif;max-width:300px;max-height:300px;overflow-y:auto;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${primary.color};font-weight:800;margin-bottom:6px;">${primary.cityName} · ${items.length} събития</div>
          ${sorted.map(({ ev, color }) => `
            <div style="border-top:1px solid #e5e7eb;padding:6px 0;">
              <div style="font-size:11px;color:${color};font-weight:700;">${fmtDate(ev.date)}${ev.time ? ` · ${ev.time}` : ""}${ev.tag ? ` · ${ev.tag}` : ""}</div>
              <div style="font-size:13px;font-weight:600;color:#1f1326;line-height:1.25;margin-top:2px;">${ev.title}</div>
              ${ev.location ? `<div style="font-size:11px;color:#6b7280;margin-top:2px;">📍 ${ev.location}</div>` : ""}
            </div>
          `).join("")}
        </div>`;
        marker.bindPopup(html);
      }
    }
  }, [showEvents]);

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
          {(Object.keys(tagEmoji) as Array<keyof typeof tagEmoji>).map((t) => (
            <span key={t} className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: tagColor[t] }}
              />
              {t}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes giroPulse{0%{transform:scale(0.6);opacity:0.8}100%{transform:scale(2.2);opacity:0}}`}</style>
    </div>
  );
}
