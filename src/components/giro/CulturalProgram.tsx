import { useMemo, useState } from "react";
import { cityPrograms, tagColor, type CityKey, type CulturalEvent } from "@/data/events";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

function formatDate(iso: string, weekdays: string[], months: string[]) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} · ${weekdays[d.getDay()]}`;
}

function timeKey(t?: string) {
  if (!t) return "99:99";
  const m = t.match(/(\d{1,2}):(\d{2})/);
  if (!m) return "99:99";
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

function groupByDate(events: CulturalEvent[]) {
  const map = new Map<string, CulturalEvent[]>();
  for (const e of events) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date)!.push(e);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => timeKey(a.time).localeCompare(timeKey(b.time)));
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function CulturalProgram() {
  const [city, setCity] = useState<CityKey>("nesebar");
  const { t } = useT();
  const program = cityPrograms.find((c) => c.key === city)!;
  const grouped = useMemo(() => groupByDate(program.events), [program]);

  const totalEvents = cityPrograms.reduce((s, c) => s + c.events.length, 0);

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold" style={{ color: "var(--rosa-deep)" }}>
            <Sparkles className="h-3.5 w-3.5" />
            {t.cultProgramKicker}
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance">
            {t.cultProgramTitle}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t.cultProgramSubtitle(totalEvents)}
          </p>
        </div>
      </div>

      <Tabs value={city} onValueChange={(v) => setCity(v as CityKey)}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
          {cityPrograms.map((c) => (
            <TabsTrigger key={c.key} value={c.key} className="py-2.5">
              {c.name}
              <span className="ml-2 text-xs opacity-60 tabular-nums">{c.events.length}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {cityPrograms.map((c) => (
          <TabsContent key={c.key} value={c.key} className="mt-6">
            <div className="space-y-6">
              {groupByDate(c.events).map(([date, items]) => (
                <DayBlock key={date} date={date} events={items} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function DayBlock({ date, events }: { date: string; events: CulturalEvent[] }) {
  const { t } = useT();
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-primary-foreground"
          style={{ background: "var(--gradient-rosa)" }}
        >
          <Calendar className="h-4 w-4" />
          {formatDate(date, t.weekdays, t.months)}
        </div>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground tabular-nums">{events.length} {t.eventsLabel}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {events.map((e, i) => (
          <EventCard key={i} event={e} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: CulturalEvent }) {
  const color = event.tag ? tagColor[event.tag] : "var(--rosa-deep)";
  return (
    <Card className="rounded-2xl border border-border/70 transition-[box-shadow,transform] hover:shadow-[var(--shadow-rosa)] hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="mt-1 h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 20%, transparent)` }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
              {event.time && (
                <span className="inline-flex items-center gap-1 font-semibold" style={{ color }}>
                  <Clock className="h-3.5 w-3.5" />
                  {event.time}
                </span>
              )}
              {event.tag && (
                <Badge variant="secondary" className="capitalize text-[10px] px-2 py-0">
                  {event.tag}
                </Badge>
              )}
            </div>
            <h4 className="mt-1.5 font-semibold leading-snug text-pretty">{event.title}</h4>
            {event.location && (
              <p className="mt-1.5 text-sm text-muted-foreground inline-flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{event.location}</span>
              </p>
            )}
            {event.description && (
              <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}