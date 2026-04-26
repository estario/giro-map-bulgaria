import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Stage } from "@/data/stages";
import { Button } from "@/components/ui/button";
import { LocateFixed, Loader2 } from "lucide-react";

type Props = {
  stages: Stage[];
  activeStageId: number;
  onUserLocation?: (loc: { lat: number; lng: number } | null) => void;
};

function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: "giro-marker",
    html: `<div style="background:${color};color:#fff;border:2px solid #fff;border-radius:9999px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 4px 12px rgba(236,72,153,0.5);font-family:system-ui,sans-serif;">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
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

// Cache OSRM responses in-memory per stage
const routeCache = new Map<number, [number, number][]>();

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
  const [locating, setLocating] = useState(false);

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

    visibleStages.forEach((stage) => {
      const waypointLatLngs = stage.waypoints.map((w) => w.coords as [number, number]);
      allLatLngs.push(...waypointLatLngs);

      // Draw markers + a temporary straight line first (fast paint)
      const tempLine = L.polyline(waypointLatLngs, {
        color: stage.color,
        weight: 3,
        opacity: 0.4,
        dashArray: "6 6",
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

      // Then fetch real road geometry from OSRM (cached)
      const drawReal = (geom: [number, number][]) => {
        if (cancelled || geom.length === 0) return;
        layers.removeLayer(tempLine);
        L.polyline(geom, {
          color: stage.color,
          weight: 10,
          opacity: 0.18,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layers);
        L.polyline(geom, {
          color: stage.color,
          weight: 4,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layers);
      };

      const cached = routeCache.get(stage.id);
      if (cached) {
        drawReal(cached);
      } else {
        fetchOsrmRoute(waypointLatLngs).then((geom) => {
          if (geom.length > 0) routeCache.set(stage.id, geom);
          drawReal(geom);
        });
      }
    });

    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      cancelled = true;
    };
  }, [stages, activeStageId]);

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
            `<div style="font-family:system-ui,sans-serif;"><strong>Твоята позиция</strong><br/><span style="color:#6b7280;font-size:12px;">${lat.toFixed(4)}, ${lng.toFixed(4)}</span></div>`,
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
        alert("Не успяхме да намерим позицията ти. Разреши достъп до локация в браузъра.");
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
      <Button
        onClick={handleLocate}
        size="sm"
        className="absolute top-4 right-4 z-[400] shadow-lg"
        disabled={locating}
      >
        {locating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LocateFixed className="h-4 w-4" />
        )}
        <span className="ml-2">Намери ме</span>
      </Button>
      <style>{`@keyframes giroPulse{0%{transform:scale(0.6);opacity:0.8}100%{transform:scale(2.2);opacity:0}}`}</style>
    </div>
  );
}
