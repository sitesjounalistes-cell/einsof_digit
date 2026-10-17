"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BellRing,
  Eye,
  FlaskConical,
  Info,
  Lightbulb,
  Loader2,
  Mail,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Timer,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HeatmapPage, StatsData, StatsInsight } from "@/app/api/admin/stats/route";

/* ── Statistiques & Cockpit — Espace équipe (spec §28).
 * Panneau prêt à câbler : <StatsPanel onUnauthorized={() => …} />
 * Agrégations anonymes servies par /api/admin/stats ( consentement §28 ). ── */

const GOLD = "#d4af37";
const GOLD_DIM = "rgba(212,175,55,0.32)";
const GRID_STROKE = "rgba(212,175,55,0.14)";
const AXIS_TICK = { fill: "#b0aba1", fontSize: 11 } as const;
const TOOLTIP_STYLE = {
  backgroundColor: "rgba(20,20,23,0.95)",
  border: "1px solid rgba(212,175,55,0.35)",
  borderRadius: 8,
  color: "#faf8f3",
  fontSize: 12,
} as const;

const WEEKDAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // lun → dim

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  tablet: "Tablette",
  desktop: "Ordinateur",
};

const PERIODS = [
  { value: "7", label: "7 derniers jours" },
  { value: "30", label: "30 derniers jours" },
  { value: "90", label: "90 derniers jours" },
] as const;

function fr(n: number): string {
  return n.toLocaleString("fr-FR");
}
function frRate(n: number): string {
  return String(n).replace(".", ",");
}

/* ── Carte KPI ──────────────────────────────────────────────────── */

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden />
        <p className="label-caps">{label}</p>
      </div>
      <p className="mt-2 font-serif text-2xl leading-tight text-goldtext">{value}</p>
      {sub ? <p className="mt-1 text-xs text-mute">{sub}</p> : null}
    </div>
  );
}

/* ── Intensité or de la heatmap ─────────────────────────────────── */

function heatColor(count: number, max: number): string {
  if (count <= 0 || max <= 0) return "transparent";
  const t = Math.min(1, count / max);
  return `rgba(212,175,55,${(0.12 + t * 0.76).toFixed(2)})`;
}

function HeatmapGrid({ page }: { page: HeatmapPage }) {
  const max = Math.max(...page.bins.flat(), 0);
  return (
    <div>
      <p className="truncate text-sm font-medium" title={page.path}>
        {page.path}
      </p>
      <div className="mt-2 grid max-w-[280px] grid-cols-5 gap-1" role="img" aria-label={`Zones de clics — ${page.path}`}>
        {page.bins.map((row, y) =>
          row.map((count, x) => (
            <div
              key={`${x}-${y}`}
              title={`zone ${x},${y} — ${count} clic(s)`}
              aria-hidden
              className={`aspect-square rounded-[4px] border ${count > 0 ? "border-gold/30" : "border-line"}`}
              style={{ backgroundColor: heatColor(count, max) }}
            />
          ))
        )}
      </div>
      <p className="mt-1 text-xs text-mute">
        {max > 0
          ? `Cellule la plus cliquée : ${max} clic(s) · chaque case ≈ 20 % de l'écran`
          : "Aucun clic enregistré sur cette page."}
      </p>
    </div>
  );
}

/* ── Carte insight ──────────────────────────────────────────────── */

function InsightCard({ insight }: { insight: StatsInsight }) {
  const Icon = insight.level === "tip" ? Lightbulb : insight.level === "warn" ? AlertTriangle : Info;
  const color = insight.level === "tip" ? "text-gold" : insight.level === "warn" ? "text-destructive" : "text-mute";
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-4">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} strokeWidth={1.5} aria-hidden />
      <div className="min-w-0">
        <p className="font-medium leading-snug">{insight.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-mute">{insight.detail}</p>
      </div>
    </div>
  );
}

/* ── Panneau ────────────────────────────────────────────────────── */

export function StatsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/stats?days=${days}`, { cache: "no-store" });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as { ok: boolean; data?: StatsData };
      if (json.ok && json.data) {
        setData(json.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [days, onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  const k = data?.kpis;
  const series = data?.series;

  /* Heure de pic (mise en évidence dans le graphe horaire) */
  const peakHour =
    series && series.viewsByHour.length === 24
      ? series.viewsByHour.reduce((best, h) => (h.count > best.count ? h : best), series.viewsByHour[0])
          .hour
      : -1;
  const weekdayData = series
    ? WEEKDAY_ORDER.map((day) => ({ label: WEEKDAY_LABELS[day], count: series.viewsByWeekday[day]?.count ?? 0 }))
    : [];
  const peakWeekdayIdx = weekdayData.reduce((best, w, i) => (w.count > weekdayData[best].count ? i : best), 0);

  return (
    <section aria-labelledby="admin-stats-t">
      {/* En-tête : titre + période */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 id="admin-stats-t" className="font-serif text-xl">
            Statistiques &amp; Cockpit
          </h2>
          <BarChart3 className="h-5 w-5 text-gold" strokeWidth={1.25} aria-hidden />
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v) as 7 | 30 | 90)}>
            <SelectTrigger className="h-10 w-[190px] border-line bg-surface text-sm" aria-label="Période d'analyse">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <GoldButton
            variant="outline"
            className="min-h-10! px-3! text-xs!"
            onClick={() => void load()}
            ariaLabel="Actualiser les statistiques"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} strokeWidth={1.5} aria-hidden />
            Actualiser
          </GoldButton>
        </div>
      </div>
      <p className="mt-1 text-sm text-mute">
        Audience, contenu et notifications — mesures anonymes collectées avec le consentement des
        visiteurs (fenêtre : {days} jours pour les événements).
      </p>

      {/* Chargement */}
      {loading && !data ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      ) : error ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-surface p-5">
          <p className="text-sm text-destructive">
            Impossible de charger les statistiques — vérifiez la connexion puis réessayez.
          </p>
          <GoldButton onClick={() => void load()} className="min-h-10! px-4! text-xs!">
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Réessayer
          </GoldButton>
        </div>
      ) : k && series ? (
        <div className="mt-4 flex flex-col gap-4">
          {/* ── KPI ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard icon={Eye} label="Pages vues" value={fr(k.pageviews)} sub={`dont ${fr(k.articleReads)} article(s) lu(s)`} />
            <KpiCard icon={Users} label="Visiteurs uniques" value={fr(k.uniqueVisitors)} sub={`${fr(k.sessions)} session(s)`} />
            <KpiCard icon={Timer} label="Durée moyenne" value={`${frRate(k.avgSessionMin)} min`} sub="par session (estimation)" />
            <KpiCard icon={Smartphone} label="Installations app" value={fr(k.pwaInstalls)} sub={`+ ${fr(k.pushSubscribers)} abonné(s) push`} />
            <KpiCard icon={BellRing} label="Notifications envoyées" value={fr(k.notifSent)} sub={`${fr(k.notifDelivered)} délivrée(s) · ${fr(k.notifFailed)} échec(s)`} />
            <KpiCard icon={MousePointerClick} label="Notifications ouvertes" value={fr(k.notifOpened)} sub={`${frRate(k.notifOpenRate)} % de taux d'ouverture`} />
            <KpiCard icon={Mail} label="Messages reçus" value={fr(k.contactMessages)} sub={`${fr(k.leads)} lead(s) au total`} />
            <KpiCard icon={FlaskConical} label="Essais demandés" value={fr(k.trials)} sub={`${fr(k.podcastPlays)} écoute(s) podcast`} />
          </div>

          {/* ── Pages vues / jour ───────────────────────────── */}
          <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
            <p className="label-caps">Pages vues par jour</p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.pageviewsPerDay} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stats-pv-gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={{ stroke: GRID_STROKE }}
                    tickFormatter={(v: string) => v.slice(8, 10) + "/" + v.slice(5, 7)}
                    minTickGap={20}
                  />
                  <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value) => [`${fr(Number(value))} page(s) vue(s)`, ""]}
                    labelFormatter={(label) => `Jour : ${label}`}
                  />
                  <Area type="monotone" dataKey="count" stroke={GOLD} strokeWidth={2} fill="url(#stats-pv-gold)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Par heure + par jour de semaine ─────────────── */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
              <p className="label-caps">Pages vues par heure</p>
              <p className="mt-1 text-xs text-mute">
                {peakHour >= 0 ? `Pic d'activité vers ${peakHour} h (mis en évidence).` : "Aucune donnée sur la période."}
              </p>
              <div className="mt-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series.viewsByHour} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={{ stroke: GRID_STROKE }}
                      tickFormatter={(h: number) => `${h}h`}
                      interval={1}
                    />
                    <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: "rgba(212,175,55,0.08)" }}
                      formatter={(value) => [`${fr(Number(value))} page(s) vue(s)`, ""]}
                      labelFormatter={(label) => `${label} h`}
                    />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {series.viewsByHour.map((h) => (
                        <Cell key={h.hour} fill={h.hour === peakHour ? GOLD : GOLD_DIM} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
              <p className="label-caps">Pages vues par jour de semaine</p>
              <p className="mt-1 text-xs text-mute">
                {peakWeekdayIdx >= 0 && weekdayData[peakWeekdayIdx]?.count > 0
                  ? `Jour le plus fréquenté : ${weekdayData[peakWeekdayIdx].label}.`
                  : "Aucune donnée sur la période."}
              </p>
              <div className="mt-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekdayData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: GRID_STROKE }} />
                    <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: "rgba(212,175,55,0.08)" }}
                      formatter={(value) => [`${fr(Number(value))} page(s) vue(s)`, ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {weekdayData.map((w, i) => (
                        <Cell key={w.label} fill={i === peakWeekdayIdx && w.count > 0 ? GOLD : GOLD_DIM} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Zones cliquées + Top pages ──────────────────── */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
              <p className="label-caps">Zones les plus cliquées</p>
              <p className="mt-1 text-xs text-mute">
                Carte de chaleur des clics sur les pages les plus vues (grille 5 × 5, de haut en bas).
              </p>
              {series.heatmap.length === 0 ? (
                <p className="mt-4 text-sm text-mute">Aucune page visitée sur la période.</p>
              ) : (
                <div className="mt-4 flex max-h-96 flex-col gap-5 overflow-y-auto pr-1">
                  {series.heatmap.map((page) => (
                    <HeatmapGrid key={page.path} page={page} />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
              <p className="label-caps">Pages les plus vues</p>
              <p className="mt-1 text-xs text-mute">Vues et clics d&apos;appel à l&apos;action par page.</p>
              {series.topPages.length === 0 ? (
                <p className="mt-4 text-sm text-mute">Aucune page visitée sur la période.</p>
              ) : (
                <div className="mt-4 flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
                  {series.topPages.map((p) => {
                    const maxViews = series.topPages[0].views || 1;
                    return (
                      <div key={p.path}>
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate" title={p.path}>
                            {p.path}
                          </span>
                          <span className="shrink-0 text-xs text-mute">
                            {fr(p.views)} vues · {fr(p.clicks)} clic(s)
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2/60">
                          <div
                            className="gold-fill h-full rounded-full"
                            style={{ width: `${Math.max(3, Math.round((p.views / maxViews) * 100))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Devices + langues ───────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
              <p className="label-caps">Appareils</p>
              {series.devices.length === 0 ? (
                <p className="mt-3 text-sm text-mute">Aucune donnée sur la période.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {series.devices.map((d) => {
                    const total = series.devices.reduce((a, b) => a + b.count, 0) || 1;
                    const pct = Math.round((d.count / total) * 100);
                    return (
                      <span
                        key={d.name}
                        className="rounded-full border border-gold/40 px-3 py-1 text-xs text-goldtext"
                      >
                        {DEVICE_LABELS[d.name] ?? d.name} · {pct} %
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
              <p className="label-caps">Langues du navigateur</p>
              {series.locales.length === 0 ? (
                <p className="mt-3 text-sm text-mute">Aucune donnée sur la période.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {series.locales.map((l) => {
                    const total = series.locales.reduce((a, b) => a + b.count, 0) || 1;
                    const pct = Math.round((l.count / total) * 100);
                    return (
                      <span
                        key={l.name}
                        className="rounded-full border border-line px-3 py-1 text-xs uppercase text-mute"
                      >
                        {l.name} · {pct} %
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Analyses & recommandations ──────────────────── */}
          <div className="rounded-xl border border-line bg-surface p-4 md:p-5">
            <p className="label-caps">Analyses &amp; recommandations</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {data.insights.map((ins) => (
                <InsightCard key={ins.id} insight={ins} />
              ))}
              {data.insights.length === 0 && (
                <p className="text-sm text-mute">Rien à signaler — continuez ainsi.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 text-sm text-mute">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Chargement des statistiques…
        </div>
      )}
    </section>
  );
}

export default StatsPanel;
