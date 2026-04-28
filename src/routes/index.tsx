import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { stages } from "@/data/stages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Clock, Route as RouteIcon, AlertTriangle, Calendar } from "lucide-react";
import { LanguageSwitcher, useT } from "@/i18n/LanguageProvider";

const RouteMap = lazy(() => import("@/components/giro/RouteMap"));
const NearMePanel = lazy(() => import("@/components/giro/NearMePanel"));
const CulturalProgram = lazy(() => import("@/components/giro/CulturalProgram"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Giro d'Italia 2026 България — маршрут и затворени улици" },
      {
        name: "description",
        content:
          "Интерактивна карта на Giro d'Italia 2026 в България. Етапи Несебър–Бургас, Бургас–Велико Търново, Пловдив–София с часове и затворени улици.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeStage, setActiveStage] = useState<string>("0");
  const activeId = parseInt(activeStage, 10);
  const totalKm = stages.reduce((s, st) => s + st.distanceKm, 0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { t } = useT();

  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Tricolore stripe */}
      <div className="h-1.5 w-full" style={{ background: "var(--gradient-tricolore)" }} />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: "var(--gradient-rosa)" }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24 text-primary-foreground">
          <div className="absolute top-4 right-6 z-10">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-90">
            <span>{t.grandePartenza}</span>
            <span>·</span>
            <span>{t.bulgaria2026}</span>
          </div>
          <h1 className="mt-4 text-balance text-5xl md:text-7xl font-black leading-[0.95]">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg md:text-xl opacity-95">
            {t.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Stat icon={<RouteIcon className="h-4 w-4" />} label={t.totalKm(totalKm)} />
            <Stat icon={<Calendar className="h-4 w-4" />} label={t.dates} />
            <Stat icon={<MapPin className="h-4 w-4" />} label={t.stagesCities} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14 space-y-10">
        {/* Stage selector + map */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-balance">{t.mapHeading}</h2>
              <p className="text-muted-foreground mt-1">
                {t.mapSubtitle}
              </p>
            </div>
          </div>

          <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
              <TabsTrigger value="0" className="py-2.5">{t.allStages}</TabsTrigger>
              {stages.map((s) => (
                <TabsTrigger key={s.id} value={String(s.id)} className="py-2.5">
                  {t.stageN(s.id)}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="h-[600px] w-full rounded-2xl bg-muted animate-pulse" />
                }
              >
                <RouteMap
                  stages={stages}
                  activeStageId={activeId}
                  onUserLocation={setUserLocation}
                />
              </Suspense>
            </div>

            <div className="mt-6">
              <Suspense fallback={<div className="h-40 rounded-2xl bg-muted animate-pulse" />}>
                <NearMePanel userLocation={userLocation} />
              </Suspense>
            </div>

            {stages.map((s) => (
              <TabsContent key={s.id} value={String(s.id)} className="mt-6">
                <StageDetail stageId={s.id} />
              </TabsContent>
            ))}
            <TabsContent value="0" className="mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {stages.map((s) => (
                  <StageSummaryCard key={s.id} stageId={s.id} onSelect={() => setActiveStage(String(s.id))} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Cultural & sport program */}
        <Suspense fallback={<div className="h-64 rounded-2xl bg-muted animate-pulse" />}>
          <CulturalProgram />
        </Suspense>

        {/* Footer note */}
        <footer className="border-t border-border pt-6 pb-10 text-sm text-muted-foreground">
          <p>
            {t.footerText}{" "}
            <a
              href="https://umap.openstreetmap.fr/bg/map/giro-ditalia-2026-grande-partenza-burgas_1380795"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              {t.burgasUmap}
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium ring-1 ring-white/30">
      {icon}
      {label}
    </div>
  );
}

function StageSummaryCard({ stageId, onSelect }: { stageId: number; onSelect: () => void }) {
  const stage = stages.find((s) => s.id === stageId)!;
  const { t } = useT();
  return (
    <button
      onClick={onSelect}
      className="text-left group rounded-2xl border border-border bg-card p-6 transition-[box-shadow,transform] hover:shadow-[var(--shadow-rosa)] hover:-translate-y-0.5"
    >
      <div
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        style={{ color: stage.color }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: stage.color }} />
        {t.stageN(stage.id)} · {stage.date}
      </div>
      <h3 className="mt-2 text-xl font-bold">
        {stage.from} → {stage.to}
      </h3>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground tabular-nums">
        <span className="inline-flex items-center gap-1">
          <RouteIcon className="h-4 w-4" /> {stage.distanceKm} {t.kmShort}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-4 w-4" /> {stage.waypoints[0].raceTime} – {stage.waypoints.at(-1)!.raceTime}
        </span>
      </div>
    </button>
  );
}

function StageDetail({ stageId }: { stageId: number }) {
  const stage = stages.find((s) => s.id === stageId)!;
  const { t } = useT();
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Schedule */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {stage.from} → {stage.to}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {stage.date} · {stage.distanceKm} {t.kmShort} · {t.stageN(stage.id)}
              </p>
            </div>
            <Badge style={{ background: stage.color, color: "white" }}>Maglia rosa</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" style={{ color: stage.color }} />
            {t.schedule}
          </h4>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm tabular-nums">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="text-left p-2 font-semibold">{t.place}</th>
                  <th className="text-right p-2 font-semibold">{t.km}</th>
                  <th className="text-right p-2 font-semibold" style={{ color: stage.color }}>
                    {t.passing}
                  </th>
                  <th className="text-right p-2 font-semibold text-destructive">{t.closure}</th>
                </tr>
              </thead>
              <tbody>
                {stage.waypoints.map((w, i) => (
                  <tr key={i} className="border-t border-border hover:bg-accent/30">
                    <td className="p-2 font-medium">{w.name}</td>
                    <td className="p-2 text-right text-muted-foreground">{w.totalKm}</td>
                    <td className="p-2 text-right font-semibold" style={{ color: stage.color }}>
                      {w.raceTime}
                    </td>
                    <td className="p-2 text-right text-destructive">{w.closeTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Closures */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t.closedStreets}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.closedStreetsSub}
          </p>
        </CardHeader>
        <CardContent>
          {stage.closures.map((c) => (
            <div key={c.city} className="mb-4 last:mb-0">
              <h4 className="font-bold text-lg mb-2">{c.city}</h4>
              <Accordion type="multiple" className="w-full">
                {c.groups.map((g, gi) => (
                  <AccordionItem key={gi} value={`${c.city}-${gi}`}>
                    <AccordionTrigger className="text-left">
                      <span className="text-sm font-semibold">{g.period}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1.5 text-sm">
                        {g.streets.map((s, si) => (
                          <li key={si} className="flex gap-2">
                            <span className="text-primary mt-1">▸</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {c.note && (
                <p className="text-xs text-muted-foreground mt-2 italic">{c.note}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
