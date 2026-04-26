import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Stage } from "@/data/stages";

type Props = {
  stages: Stage[];
  activeStageId: number;
};

// Custom rosa marker icon (no external image needed)
function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: "giro-marker",
    html: `<div style="background:${color};color:#fff;border:2px solid #fff;border-radius:9999px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 4px 12px rgba(236,72,153,0.5);font-family:system-ui,sans-serif;">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function RouteMap({ stages, activeStageId }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [42.7339, 25.4858], // center of Bulgaria
      zoom: 7,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    layersRef.current = L.layerGroup().addTo(map);

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

    visibleStages.forEach((stage) => {
      const latlngs = stage.waypoints.map((w) => w.coords as L.LatLngExpression);
      allLatLngs.push(...latlngs);

      // Glow underline
      L.polyline(latlngs, {
        color: stage.color,
        weight: 10,
        opacity: 0.18,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layers);
      // Main line
      L.polyline(latlngs, {
        color: stage.color,
        weight: 4,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layers);

      stage.waypoints.forEach((wp, i) => {
        const isStart = i === 0;
        const isFinish = i === stage.waypoints.length - 1;
        const label = isStart ? "S" : isFinish ? "F" : `${stage.id}`;
        const marker = L.marker(wp.coords as L.LatLngExpression, {
          icon: makeIcon(stage.color, label),
        }).addTo(layers);

        marker.bindPopup(`
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
          </div>
        `);
      });
    });

    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [stages, activeStageId]);

  return (
    <div
      ref={containerRef}
      className="h-[600px] w-full rounded-2xl overflow-hidden shadow-[var(--shadow-rosa)] border border-border"
      style={{ background: "#f1f5f9" }}
    />
  );
}