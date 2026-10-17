/**
 * Cockpit statistiques — agrégations anonymes (spécification §28).
 * GET /api/admin/stats?days=7|30|90 (défaut 30)
 *
 * Renvoie { ok, data: { days, kpis, series, insights } } :
 * - kpis    : compteurs clés (fenêtre glissante pour les événements,
 *             totaux sans fenêtre pour les enregistrements métier) ;
 * - series  : séries temporelles, top pages, heatmap de clics, devices, langues ;
 * - insights: recommandations en français, déduites UNIQUEMENT des données.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/* ── Contrat partagé avec le panel (import type — aucun code serveur
      n'est embarqué côté client) ─────────────────────────────────── */

export interface StatsKpis {
  pageviews: number;
  uniqueVisitors: number;
  sessions: number;
  avgSessionMin: number;
  pwaInstalls: number;
  pushSubscribers: number;
  notifSent: number;
  notifDelivered: number;
  notifFailed: number;
  notifOpened: number;
  notifOpenRate: number;
  contactMessages: number;
  leads: number;
  trials: number;
  podcastPlays: number;
  articleReads: number;
}

export interface DayPoint {
  day: string; // "YYYY-MM-DD"
  count: number;
}
export interface HourPoint {
  hour: number; // 0..23
  count: number;
}
export interface WeekdayPoint {
  day: number; // 0..6 (0 = dimanche, Date#getDay)
  count: number;
}
export interface TopPagePoint {
  path: string;
  views: number;
  clicks: number;
}
/** 5×5 — bins[y][x] : ligne y (haut→bas), colonne x (gauche→droite) */
export interface HeatmapPage {
  path: string;
  bins: number[][];
}
export interface NamedCount {
  name: string;
  count: number;
}
export interface StatsInsight {
  id: string;
  level: "tip" | "warn" | "info";
  title: string;
  detail: string;
}
export interface StatsSeries {
  pageviewsPerDay: DayPoint[];
  viewsByHour: HourPoint[];
  viewsByWeekday: WeekdayPoint[];
  topPages: TopPagePoint[];
  heatmap: HeatmapPage[];
  devices: NamedCount[];
  locales: NamedCount[];
}
export interface StatsData {
  days: number;
  kpis: StatsKpis;
  series: StatsSeries;
  insights: StatsInsight[];
}

/* ── Utilitaires ──────────────────────────────────────────────────── */

const ALLOWED_DAYS = [7, 30, 90];

function parseDays(raw: string | null): number {
  const n = Number(raw);
  return ALLOWED_DAYS.includes(n) ? n : 30;
}

/** JSON.parse défensif des props d'un événement (jamais de throw). */
function safeProps(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

/** Clé de jour locale (cohérente avec getHours()/getDay() des séries). */
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clampBin(v: number): number {
  return Math.min(4, Math.max(0, Math.floor(v / 20)));
}

/* ── GET ──────────────────────────────────────────────────────────── */

export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = parseDays(url.searchParams.get("days"));
  const windowStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const [
      pageViewRows,
      ctaByPath,
      beatRows,
      installCount,
      podcastCount,
      articleReadCount,
      heatRows,
      notifAgg,
      pushSubscribers,
      contactMessages,
      leads,
      trials,
    ] = await Promise.all([
      db.analyticsEvent.findMany({
        where: { name: "page_view", createdAt: { gte: windowStart } },
        select: { props: true, path: true, locale: true, visitorId: true, createdAt: true },
      }),
      db.analyticsEvent.groupBy({
        by: ["path"],
        where: { name: "cta_click", createdAt: { gte: windowStart } },
        _count: { _all: true },
      }),
      db.analyticsEvent.findMany({
        where: { name: "session_beat", createdAt: { gte: windowStart } },
        select: { props: true },
      }),
      db.analyticsEvent.count({ where: { name: "pwa_installed", createdAt: { gte: windowStart } } }),
      db.analyticsEvent.count({ where: { name: "podcast_play", createdAt: { gte: windowStart } } }),
      db.analyticsEvent.count({ where: { name: "article_read", createdAt: { gte: windowStart } } }),
      db.analyticsEvent.findMany({
        where: { name: "click_heat", createdAt: { gte: windowStart } },
        select: { props: true, path: true },
      }),
      db.notificationLog.aggregate({
        where: { createdAt: { gte: windowStart } },
        _sum: { sentTo: true, delivered: true, failed: true, opened: true },
      }),
      db.pushSubscription.count(),
      db.contactMessage.count(),
      db.lead.count(),
      db.trialRequest.count(),
    ]);

    /* ── Pages vues : séries + répartitions ─────────────────────── */
    const perDay = new Map<string, number>();
    const byHour = new Array<number>(24).fill(0);
    const byWeekday = new Array<number>(7).fill(0);
    const devices = new Map<string, number>();
    const locales = new Map<string, number>();
    const viewsByPath = new Map<string, number>();
    const visitors = new Set<string>();

    for (const row of pageViewRows) {
      const d = row.createdAt;
      const key = dayKey(d);
      perDay.set(key, (perDay.get(key) ?? 0) + 1);
      byHour[d.getHours()] += 1;
      byWeekday[d.getDay()] += 1;
      const p = row.path || "/";
      viewsByPath.set(p, (viewsByPath.get(p) ?? 0) + 1);
      const device = safeProps(row.props).device;
      if (typeof device === "string" && device) {
        devices.set(device, (devices.get(device) ?? 0) + 1);
      }
      if (row.locale) {
        locales.set(row.locale, (locales.get(row.locale) ?? 0) + 1);
      }
      if (row.visitorId) visitors.add(row.visitorId);
    }

    /* Tous les jours de la fenêtre présents dans la série (0 si vide) */
    const pageviewsPerDay: DayPoint[] = [];
    {
      const cursor = new Date(windowStart);
      cursor.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      while (cursor <= today) {
        const key = dayKey(cursor);
        pageviewsPerDay.push({ day: key, count: perDay.get(key) ?? 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    /* ── Sessions (session_beat → props.sessionId) ──────────────── */
    const sessionIds = new Set<string>();
    for (const row of beatRows) {
      const sid = safeProps(row.props).sessionId;
      if (typeof sid === "string" && sid) sessionIds.add(sid);
    }
    const sessions = sessionIds.size;
    const beatCount = beatRows.length;
    const avgSessionMin =
      sessions > 0 ? Math.round(((beatCount * 0.75) / sessions) * 10) / 10 : 0;

    /* ── Top pages (vues + clics cta_click) ─────────────────────── */
    const clicksByPath = new Map<string, number>();
    for (const g of ctaByPath) {
      if (g.path) clicksByPath.set(g.path, g._count._all);
    }
    const topPages: TopPagePoint[] = Array.from(viewsByPath.entries())
      .map(([path, views]) => ({ path, views, clicks: clicksByPath.get(path) ?? 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    /* ── Heatmap 5×5 : click_heat des 5 pages les plus vues ─────── */
    const top5Paths = topPages.slice(0, 5).map((p) => p.path);
    const heatMaps = new Map<string, number[][]>();
    for (const p of top5Paths) {
      heatMaps.set(p, Array.from({ length: 5 }, () => new Array<number>(5).fill(0)));
    }
    for (const row of heatRows) {
      const bins = heatMaps.get(row.path || "/");
      if (!bins) continue;
      const props = safeProps(row.props);
      const x = typeof props.x === "number" ? props.x : Number(props.x);
      const y = typeof props.y === "number" ? props.y : Number(props.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      bins[clampBin(y)][clampBin(x)] += 1;
    }
    const heatmap: HeatmapPage[] = top5Paths
      .map((path) => {
        const bins = heatMaps.get(path) ?? [];
        return { path, bins, total: bins.flat().reduce((a, b) => a + b, 0) };
      })
      .sort((a, b) => b.total - a.total)
      .map(({ path, bins }) => ({ path, bins }));

    /* ── Notifications (journal, fenêtre) ───────────────────────── */
    const notifSent = notifAgg._sum.sentTo ?? 0;
    const notifDelivered = notifAgg._sum.delivered ?? 0;
    const notifFailed = notifAgg._sum.failed ?? 0;
    const notifOpened = notifAgg._sum.opened ?? 0;
    const notifOpenRate =
      notifDelivered > 0 ? Math.round((notifOpened / notifDelivered) * 1000) / 10 : 0;

    /* ── Insights — déduits uniquement des données ci-dessus ────── */
    const pageviews = pageViewRows.length;
    const uniqueVisitors = visitors.size;
    const pwaInstalls = installCount;
    const insights: StatsInsight[] = [];

    if (pageviews === 0) {
      insights.push({
        id: "no-data",
        level: "info",
        title: "Statistiques en attente d'activation",
        detail:
          "Les statistiques s'activeront dès que les visiteurs accepteront les statistiques anonymes.",
      });
    } else {
      const maxHour = Math.max(...byHour);
      if (maxHour > 0) {
        const peak = byHour.indexOf(maxHour);
        insights.push({
          id: "peak-hour",
          level: "tip",
          title: `Pic d'activité vers ${peak} h`,
          detail: `Publiez vos articles et envoyez vos notifications vers ${peak} h — votre audience y est la plus active.`,
        });
      }
      if (notifDelivered > 0 && notifOpenRate < 30) {
        insights.push({
          id: "notif-open-rate",
          level: "warn",
          title: "Taux d'ouverture des notifications faible",
          detail: `Seulement ${String(notifOpenRate).replace(".", ",")} % d'ouvertures. Variez les titres et les horaires d'envoi pour capter l'attention.`,
        });
      }
      if (uniqueVisitors > 0 && pwaInstalls / uniqueVisitors < 0.03) {
        insights.push({
          id: "pwa-installs",
          level: "tip",
          title: "Peu d'installations de l'application",
          detail: `${pwaInstalls} installation(s) pour ${uniqueVisitors} visiteurs uniques. Mettez en avant l'installation de l'application (bandeau d'invitation).`,
        });
      }
      const top = topPages[0];
      if (top && top.views >= 10 && top.clicks < top.views * 0.15) {
        insights.push({
          id: "weak-cta",
          level: "warn",
          title: "Appel à l'action à renforcer",
          detail: `« ${top.path} » cumule ${top.views} vues mais seulement ${top.clicks} clic(s) d'appel à l'action. Renforcez l'appel à l'action sur cette page.`,
        });
      }
      const deviceTotal = Array.from(devices.values()).reduce((a, b) => a + b, 0);
      const mobileCount = devices.get("mobile") ?? 0;
      if (deviceTotal > 0 && mobileCount / deviceTotal > 0.7) {
        const pct = Math.round((mobileCount / deviceTotal) * 100);
        insights.push({
          id: "mobile-first",
          level: "info",
          title: "Audience majoritairement mobile",
          detail: `${pct} % de vos visiteurs sont sur mobile — vérifiez la vitesse et l'ergonomie mobile du site.`,
        });
      }
    }

    const data: StatsData = {
      days,
      kpis: {
        pageviews,
        uniqueVisitors,
        sessions,
        avgSessionMin,
        pwaInstalls,
        pushSubscribers,
        notifSent,
        notifDelivered,
        notifFailed,
        notifOpened,
        notifOpenRate,
        contactMessages,
        leads,
        trials,
        podcastPlays: podcastCount,
        articleReads: articleReadCount,
      },
      series: {
        pageviewsPerDay,
        viewsByHour: byHour.map((count, hour) => ({ hour, count })),
        viewsByWeekday: byWeekday.map((count, day) => ({ day, count })),
        topPages,
        heatmap,
        devices: Array.from(devices.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        locales: Array.from(locales.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
      },
      insights,
    };

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("[admin/stats]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
