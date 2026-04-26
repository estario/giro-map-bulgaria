import { useMemo } from "react";
import { stages } from "@/data/stages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, AlertTriangle, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  userLocation: { lat: number; lng: number } | null;
};

// Haversine distance in km
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function NearMePanel({ userLocation }: Props) {
  const nearby = useMemo(() => {
    if (!userLocation) return [];
    const items = stages.flatMap((stage) =>
      stage.waypoints.map((wp) => ({
        stage,
        wp,
        dist: distanceKm(userLocation, { lat: wp.coords[0], lng: wp.coords[1] }),
      })),
    );
    return items.sort((a, b) => a.dist - b.dist).slice(0, 6);
  }, [userLocation]);

  if (!userLocation) {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardContent className="py-10 text-center">
          <Navigation className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-semibold">Виж кои затваряния са близо до теб</p>
          <p className="text-sm text-muted-foreground mt-1">
            Натисни <strong>„Намери ме“</strong> в горния десен ъгъл на картата, за да
            покажем най-близките точки от маршрута и часовете на затваряне.
          </p>
        </CardContent>
      </Card>
    );
  }

  const closest = nearby[0];
  const onRoute = closest && closest.dist < 2; // within 2 km

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Около теб
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Твоята позиция: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </p>
      </CardHeader>
      <CardContent>
        {onRoute && (
          <div className="mb-4 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-destructive">Ти си близо до маршрута!</p>
                <p className="text-sm mt-1">
                  Най-близка точка: <strong>{closest.wp.name}</strong> ({closest.dist.toFixed(1)} км).
                  Затваря се в <strong className="text-destructive">{closest.wp.closeTime}</strong>,
                  колоната преминава в{" "}
                  <strong style={{ color: closest.stage.color }}>{closest.wp.raceTime}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {nearby.map(({ stage, wp, dist }, i) => (
            <div
              key={`${stage.id}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 font-bold"
                    style={{ borderColor: stage.color, color: stage.color }}
                  >
                    {stage.name}
                  </Badge>
                  <span className="font-semibold truncate">{wp.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {dist < 1 ? `${(dist * 1000).toFixed(0)} м` : `${dist.toFixed(1)} км`}
                  </span>
                  <span className="inline-flex items-center gap-1" style={{ color: stage.color }}>
                    <Clock className="h-3 w-3" />
                    {wp.raceTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    {wp.closeTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Разстоянията са по права линия. Часовете са според официалния график на етапа.
        </p>
      </CardContent>
    </Card>
  );
}
