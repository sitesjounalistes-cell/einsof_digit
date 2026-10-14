"use client";

/**
 * Panneau « Démonstrations » de l'Espace équipe (tâche 6-c).
 * Liste les réservations de démonstration par créneau (places prises/capacité,
 * coordonnées du lead, SaaS) avec changement de statut. Câblage à l'orchestrateur :
 * <DemosPanel onUnauthorized={...} /> — même signature que les autres panneaux.
 * Outil interne : libellés en français codés en dur, style identique à AdminOverlay.
 */

import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SAAS_PRODUCTS } from "@/lib/catalog";

/* ── Typage des données (aucun any) ─────────────────────────── */

interface DemoBookingRow {
  id: string;
  status: string;
  saasSlug: string | null;
  locale: string;
  createdAt: string;
  lead: { firstName: string; lastName: string; phone: string };
}

interface DemoSlotGroup {
  id: string;
  startsAt: string;
  capacity: number;
  taken: number;
  bookings: DemoBookingRow[];
}

interface DemosData {
  upcoming: DemoSlotGroup[];
  past: DemoSlotGroup[];
}

const DEMO_STATUS: Record<string, string> = {
  confirmed: "Confirmée",
  cancelled: "Annulée",
  done: "Effectuée",
  no_show: "Absent",
};

const DEMO_DOT: Record<string, string> = {
  confirmed: "bg-gold",
  cancelled: "bg-mute",
  done: "bg-success",
  no_show: "bg-destructive",
};

const SLOT_FMT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Conakry",
});
const fmtSlot = (iso: string): string => {
  try {
    return SLOT_FMT.format(new Date(iso));
  } catch {
    return iso;
  }
};
const fmtDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
};

const saasName = (slug: string): string =>
  SAAS_PRODUCTS.find((p) => p.slug === slug)?.name ?? slug;

function StatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-mute">
      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${DEMO_DOT[status] ?? "bg-mute"}`} />
      {DEMO_STATUS[status] ?? status}
    </span>
  );
}

function SlotCard({
  group,
  busyId,
  onStatus,
}: {
  group: DemoSlotGroup;
  busyId: string | null;
  onStatus: (id: string, status: string) => void;
}) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">
          {fmtSlot(group.startsAt)}{" "}
          <span className="text-xs font-normal text-mute">(heure de Conakry)</span>
        </p>
        <span className="text-xs text-mute">
          {group.taken}/{group.capacity} place{group.capacity > 1 ? "s" : ""} prise
          {group.taken > 1 ? "s" : ""}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {group.bookings.length === 0 ? (
          <p className="text-xs text-mute">Aucune réservation sur ce créneau.</p>
        ) : (
          group.bookings.map((b) => (
            <div
              key={b.id}
              className="grid gap-2 rounded-md border border-line/60 bg-surface2/50 p-3 md:grid-cols-[1fr_auto]"
            >
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${DEMO_DOT[b.status] ?? "bg-mute"}`}
                  />
                  {b.lead.firstName} {b.lead.lastName}
                  <span className="font-normal text-mute">· {b.lead.phone}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {b.saasSlug ? (
                    <Badge variant="outline" className="text-[0.65rem] text-mute">
                      {saasName(b.saasSlug)}
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className="text-[0.65rem] text-mute">
                    {b.locale.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-mute">réservée le {fmtDate(b.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center md:w-52">
                <Select
                  value={b.status}
                  disabled={busyId === b.id}
                  onValueChange={(v) => onStatus(b.id, v)}
                >
                  <SelectTrigger
                    aria-label={`Statut de la réservation — ${b.lead.firstName} ${b.lead.lastName}`}
                    className="h-9 w-full bg-surface text-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    {Object.entries(DEMO_STATUS).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export function DemosPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [data, setData] = useState<DemosData | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/demos", { cache: "no-store" });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as { ok: boolean; data?: DemosData };
      setData(json.ok && json.data ? json.data : { upcoming: [], past: [] });
    } catch {
      setData({ upcoming: [], past: [] });
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/demos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setData((d) => {
          if (!d) return d;
          const apply = (g: DemoSlotGroup): DemoSlotGroup => ({
            ...g,
            taken: g.bookings.filter((b) => b.status !== "cancelled").length,
            bookings: g.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
          });
          return { upcoming: d.upcoming.map(apply), past: d.past.map(apply) };
        });
      }
    } catch {
      /* ignore */
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section aria-labelledby="admin-demos-t">
      <h2 id="admin-demos-t" className="font-serif text-xl">
        Démonstrations
      </h2>
      <p className="mt-1 text-sm text-mute">
        Réservations de démonstration, par créneau. Annuler une réservation libère la place
        au recalcul.
      </p>

      {data === null ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      ) : (
        <>
          <h3 className="mt-6 text-xs font-medium uppercase tracking-widest text-mute">
            À venir
          </h3>
          <div className="mt-2 flex flex-col gap-3">
            {data.upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-mute">{"Aucun élément pour le moment."}</p>
            ) : (
              data.upcoming.map((g) => (
                <SlotCard
                  key={g.id}
                  group={g}
                  busyId={busyId}
                  onStatus={(id, status) => void changeStatus(id, status)}
                />
              ))
            )}
          </div>

          <h3 className="mt-8 text-xs font-medium uppercase tracking-widest text-mute">Passées</h3>
          <div className="mt-2 flex flex-col gap-3">
            {data.past.length === 0 ? (
              <p className="py-8 text-center text-sm text-mute">{"Aucun élément pour le moment."}</p>
            ) : (
              data.past.map((g) => (
                <SlotCard
                  key={g.id}
                  group={g}
                  busyId={busyId}
                  onStatus={(id, status) => void changeStatus(id, status)}
                />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default DemosPanel;
