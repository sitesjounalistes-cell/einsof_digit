"use client";

import React, { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Download, LogOut, Plus, RefreshCw, Send, Trash2, X } from "lucide-react";
import { GoldButton, Monogram } from "@/components/site/kit";
import { onAdminToggle } from "@/lib/chat-bus";
import { SAAS_PRODUCTS } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PostsPanel } from "@/components/admin/PostsPanel";
import { ProjectsPanel } from "@/components/admin/ProjectsPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { SoftwareLinksPanel } from "@/components/admin/SoftwareLinksPanel";
import { DemosPanel } from "@/components/admin/DemosPanel";
import { PartnersPanel } from "@/components/admin/PartnersPanel";
import { TestimonialsPanel } from "@/components/admin/TestimonialsPanel";
import { DocumentsPanel } from "@/components/admin/DocumentsPanel";

/* ── Typage des données (aucun any) ─────────────────────────── */

interface LeadRow {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  source: string;
  status: string;
  interests: string | null;
  locale: string;
  notes: string | null;
  createdAt: string;
}

interface MessageRow {
  id: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
  lead: { firstName: string; lastName: string; phone: string };
}

interface TrialRow {
  id: string;
  saasSlug: string;
  status: string;
  createdAt: string;
  lead: { firstName: string; lastName: string; phone: string };
}

interface OverviewData {
  stats: {
    totalLeads: number;
    newLeads: number;
    unreadMessages: number;
    chats: number;
    trials: number;
  };
  leads: LeadRow[];
  messages: MessageRow[];
  trials: TrialRow[];
}

type AdminView = "closed" | "login" | "panel";
type AdminTab =
  | "flux"
  | "site"
  | "logiciels"
  | "journal"
  | "realisations"
  | "demos"
  | "partners"
  | "temoignages"
  | "documents"
  | "emails"
  | "push";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "flux", label: "Flux" },
  { id: "site", label: "Site & Contact" },
  { id: "logiciels", label: "Logiciels" },
  { id: "journal", label: "Journal" },
  { id: "realisations", label: "Réalisations" },
  { id: "demos", label: "Démos" },
  { id: "partners", label: "Partenaires" },
  { id: "temoignages", label: "Témoignages" },
  { id: "documents", label: "Documents" },
  { id: "emails", label: "E-mails" },
  { id: "push", label: "Push" },
];

const EMAIL_STATUS: Record<string, string> = {
  sent: "Envoyé",
  mock: "Simulé",
  error: "Erreur",
};

const EMAIL_DOT: Record<string, string> = {
  sent: "bg-success",
  mock: "bg-gold",
  error: "bg-destructive",
};

interface EmailAdminRow {
  id: string;
  toEmail: string;
  subject: string;
  template: string;
  status: string;
  provider: string;
  error: string | null;
  createdAt: string;
}

interface PushSubRow {
  id: string;
  endpoint: string;
  locale: string | null;
  createdAt: string;
}

interface PushAdminData {
  publicKey: string;
  count: number;
  subscriptions: PushSubRow[];
}

/* ── Libellés statiques (outil interne francophone) ─────────── */

const LEAD_STATUS: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  qualified: "Qualifié",
  trial_or_demo: "Essai/Démo",
  proposal: "Proposition",
  won: "Gagné",
  lost: "Perdu",
};

const MESSAGE_STATUS: Record<string, string> = {
  new: "Nouveau",
  read: "Lu",
  answered: "Répondu",
  archived: "Archivé",
};

const TRIAL_STATUS: Record<string, string> = {
  requested: "Demandé",
  activated: "Activé",
  expired: "Expiré",
  converted: "Converti",
  declined: "Refusé",
};

const DOT_COLOR: Record<string, string> = {
  new: "bg-gold",
  contacted: "bg-mute",
  qualified: "bg-success",
  trial_or_demo: "bg-goldlight",
  proposal: "bg-gold",
  won: "bg-success",
  lost: "bg-destructive",
  read: "bg-mute",
  answered: "bg-success",
  archived: "bg-mute",
  requested: "bg-gold",
  activated: "bg-success",
  expired: "bg-mute",
  converted: "bg-success",
  declined: "bg-destructive",
};

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });
const fmtDate = (iso: string): string => {
  try {
    return DATE_FMT.format(new Date(iso));
  } catch {
    return iso;
  }
};

const saasName = (slug: string): string =>
  SAAS_PRODUCTS.find((p) => p.slug === slug)?.name ?? slug;

const iconBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink";

function StatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-mute">
      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${DOT_COLOR[status] ?? "bg-mute"}`} />
      {status}
    </span>
  );
}

function EmptyRow() {
  return <p className="py-8 text-center text-sm text-mute">{"Aucun élément pour le moment."}</p>;
}

/* ── Carte lead ─────────────────────────────────────────────── */

function LeadCard({
  lead,
  onStatus,
  onNotes,
}: {
  lead: LeadRow;
  onStatus: (id: string, status: string) => void;
  onNotes: (id: string, notes: string) => void;
}) {
  const interests = (lead.interests ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <article className="grid gap-3 rounded-lg border border-line bg-surface p-4 md:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <p className="font-medium">
          {lead.firstName} {lead.lastName}
        </p>
        <p className="mt-0.5 text-sm text-mute">
          {lead.phone}
          {lead.email ? ` · ${lead.email}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[0.65rem] text-mute">
            {lead.source}
          </Badge>
          <StatusDot status={LEAD_STATUS[lead.status] ?? lead.status} />
          {interests.map((it) => (
            <Badge key={it} variant="outline" className="text-[0.65rem] text-mute">
              {it}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-xs text-mute">
          {fmtDate(lead.createdAt)} · {lead.locale.toUpperCase()}
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 md:w-60">
        <Select value={lead.status} onValueChange={(v) => onStatus(lead.id, v)}>
          <SelectTrigger
            aria-label={`Statut du lead — ${lead.firstName} ${lead.lastName}`}
            className="h-9 w-full bg-surface text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            {Object.entries(LEAD_STATUS).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          key={`notes-${lead.id}-${lead.notes ?? ""}`}
          type="text"
          defaultValue={lead.notes ?? ""}
          placeholder="Note interne…"
          aria-label={`Note interne — ${lead.firstName} ${lead.lastName}`}
          className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold"
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v !== (lead.notes ?? "")) onNotes(lead.id, v);
          }}
        />
      </div>
    </article>
  );
}

/* ── Barre d'onglets ────────────────────────────────────────── */

function TabBar({ tab, setTab }: { tab: AdminTab; setTab: (t: AdminTab) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Sections de l'Espace équipe"
      className="mb-8 flex gap-1 overflow-x-auto border-b border-line"
    >
      {TABS.map((tb) => (
        <button
          key={tb.id}
          role="tab"
          aria-selected={tab === tb.id}
          type="button"
          onClick={() => setTab(tb.id)}
          className={`-mb-px inline-flex min-h-[44px] cursor-pointer items-center whitespace-nowrap border-b-2 px-4 text-sm transition-colors ${
            tab === tb.id
              ? "border-gold text-goldtext"
              : "border-transparent text-mute hover:text-ink"
          }`}
        >
          {tb.label}
        </button>
      ))}
    </div>
  );
}


/* ── Onglet E-mails — journal de l'adaptateur ───────────────── */

function EmailsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<EmailAdminRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/emails")
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: EmailAdminRow[] };
        if (!cancelled) setRows(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized]);

  return (
    <section aria-labelledby="admin-emails-t">
      <h2 id="admin-emails-t" className="font-serif text-xl">
        E-mails
      </h2>
      <p className="mt-1 text-sm text-mute">
        Journal des e-mails transactionnels. En sandbox (sans RESEND_API_KEY), les envois sont
        simulés et consignés ici ; en production, la clé Resend active l'envoi réel.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {rows === null ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : rows.length === 0 ? (
          <EmptyRow />
        ) : (
          rows.map((m) => (
            <article
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{m.subject}</p>
                <p className="mt-0.5 truncate text-xs text-mute">
                  {m.toEmail} · {m.template} · {fmtDate(m.createdAt)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-mute">
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 rounded-full ${EMAIL_DOT[m.status] ?? "bg-mute"}`}
                />
                {EMAIL_STATUS[m.status] ?? m.status}
                {m.error ? ` — ${m.error}` : ""}
              </span>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

/* ── Onglet Push — abonnés + envoi de test ──────────────────── */

function PushPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [data, setData] = useState<PushAdminData | null>(null);
  const [reload, setReload] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/push")
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: PushAdminData };
        if (!cancelled && json.ok && json.data) setData(json.data);
      })
      .catch(() => {
        /* état conservé */
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, reload]);

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setFeedback(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as {
        ok: boolean;
        data?: { sent: number; failed: number; removed: number };
      };
      if (json.ok && json.data) {
        setFeedback(
          `Envoi terminé : ${json.data.sent} délivrée(s), ${json.data.failed} échec(s)${json.data.removed ? `, ${json.data.removed} abonnement(s) nettoyé(s)` : ""}.`
        );
        setTitle("");
        setBody("");
        setReload((k) => k + 1);
      } else {
        setFeedback("Envoi impossible — vérifiez les champs.");
      }
    } catch {
      setFeedback("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="admin-push-t">
      <h2 id="admin-push-t" className="font-serif text-xl">
        Notifications push
      </h2>
      <p className="mt-1 text-sm text-mute">
        Abonnements des visiteurs (bouton « Notifications » du pied de page). Clés VAPID :
        variables d'environnement, sinon paire générée et persistée automatiquement.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="font-serif text-3xl text-goldtext">{data?.count ?? "—"}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-mute">Abonnés</p>
        </div>
        <form onSubmit={send} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-mute">Notification de test</p>
          <input
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none"
            placeholder="Titre (80 caractères max.)"
            aria-label="Titre de la notification"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
          <input
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none"
            placeholder="Message (280 caractères max.)"
            aria-label="Message de la notification"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={280}
          />
          {feedback && <p className="text-sm text-mute">{feedback}</p>}
          <div>
            <GoldButton type="submit" disabled={busy || !title.trim() || !body.trim()} className="min-h-10! px-4! text-xs!">
              <Send className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              Envoyer
            </GoldButton>
          </div>
        </form>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {data === null ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : data.subscriptions.length === 0 ? (
          <EmptyRow />
        ) : (
          data.subscriptions.map((s) => {
            let host = s.endpoint;
            try {
              host = new URL(s.endpoint).host;
            } catch {
              /* endpoint brut */
            }
            return (
              <article
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{host}</p>
                  <p className="mt-0.5 truncate text-xs text-mute">
                    {s.locale ?? "—"} · {fmtDate(s.createdAt)}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

/* ── Overlay principal ──────────────────────────────────────── */

export function AdminOverlay() {
  const [view, setView] = useState<AdminView>("closed");
  const viewRef = useRef<AdminView>("closed");
  const [data, setData] = useState<OverviewData | null>(null);
  const dataRef = useRef<OverviewData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<AdminTab>("flux");

  const goto = useCallback((v: AdminView) => {
    viewRef.current = v;
    setView(v);
  }, []);

  const loadOverview = useCallback(async () => {
    setRefreshing(true);
    setLoadError(false);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.status === 401) {
        goto("login");
        return;
      }
      if (!res.ok) {
        if (!dataRef.current) setLoadError(true);
        return;
      }
      const json = (await res.json()) as { ok: boolean; data?: OverviewData };
      if (json.ok && json.data) {
        dataRef.current = json.data;
        setData(json.data);
      } else if (!dataRef.current) {
        setLoadError(true);
      }
    } catch {
      if (!dataRef.current) setLoadError(true);
    } finally {
      setRefreshing(false);
    }
  }, [goto]);

  /* Bascule ouverture / fermeture via le bus */
  useEffect(() => {
    const off = onAdminToggle(() => {
      if (viewRef.current === "closed") {
        goto("panel");
        void loadOverview();
      } else {
        goto("closed");
      }
    });
    return off;
  }, [goto, loadOverview]);

  /* Échap pour fermer + verrou du défilement */
  useEffect(() => {
    if (view === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goto("closed");
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [view, goto]);

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || submitting) return;
    setSubmitting(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setLoginError("Mot de passe incorrect.");
        return;
      }
      if (res.status === 429) {
        setLoginError("Trop de tentatives, réessayez dans quelques minutes.");
        return;
      }
      if (!res.ok) {
        setLoginError("Erreur de connexion. Réessayez.");
        return;
      }
      setPassword("");
      goto("panel");
      void loadOverview();
    } catch {
      setLoginError("Erreur de connexion. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* on déconnecte localement quoi qu'il arrive */
    }
    dataRef.current = null;
    setData(null);
    goto("login");
  };

  const patchLead = useCallback(
    async (id: string, patch: { status?: string; notes?: string }) => {
      try {
        const res = await fetch("/api/admin/lead", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...patch }),
        });
        if (res.status === 401) {
          goto("login");
          return;
        }
        if (!res.ok) return;
        setData((d) =>
          d ? { ...d, leads: d.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) } : d
        );
      } catch {
        /* silence : l'état local reste cohérent */
      }
    },
    [goto]
  );

  const patchMessage = useCallback(
    async (id: string, status: string) => {
      try {
        const res = await fetch("/api/admin/message", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (res.status === 401) {
          goto("login");
          return;
        }
        if (!res.ok) return;
        setData((d) =>
          d ? { ...d, messages: d.messages.map((m) => (m.id === id ? { ...m, status } : m)) } : d
        );
      } catch {
        /* silence */
      }
    },
    [goto]
  );

  const exportCsv = () => {
    if (!data) return;
    try {
      const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
      const lines = ["prénom;nom;téléphone;email;source;statut;date"];
      for (const l of data.leads) {
        lines.push(
          [
            l.firstName,
            l.lastName,
            l.phone,
            l.email ?? "",
            l.source,
            LEAD_STATUS[l.status] ?? l.status,
            fmtDate(l.createdAt),
          ]
            .map(esc)
            .join(";")
        );
      }
      const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  };

  if (view === "closed") return null;

  /* ── Vue connexion ────────────────────────────────────────── */
  if (view === "login") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Espace équipe"
        className="fixed inset-0 z-[90] overflow-y-auto bg-bg text-ink"
      >
        <div className="mx-auto mt-[20vh] w-full max-w-sm px-6">
          <div className="glass-panel rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              <Monogram size={48} />
              <h1 className="mt-4 font-serif text-2xl">Espace équipe</h1>
              <p className="mt-1 text-sm text-mute">
                {"Accès réservé à l'équipe de l'agence."}
              </p>
            </div>
            <form onSubmit={submitLogin} className="mt-6 flex flex-col gap-3">
              <label htmlFor="admin-password" className="sr-only">
                {"Mot de passe"}
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="h-11 rounded-lg border border-line bg-surface px-4 text-sm focus:border-gold"
              />
              {loginError && (
                <p role="alert" className="text-sm text-destructive">
                  {loginError}
                </p>
              )}
              <GoldButton type="submit" className="w-full" disabled={submitting || password.length === 0}>
                {submitting ? "Connexion…" : "Se connecter"}
              </GoldButton>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── Vue panneau ──────────────────────────────────────────── */
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Espace équipe"
      className="fixed inset-0 z-[90] overflow-y-auto bg-bg text-ink"
    >
      <header className="glass-panel sticky top-0 z-10 flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Monogram size={32} />
          <span className="font-serif text-lg">Espace équipe</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadOverview()}
            aria-label="Actualiser"
            className={`${iconBtn} w-10 px-0`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.25} />
          </button>
          <button type="button" onClick={() => void logout()} className={iconBtn}>
            <LogOut className="h-4 w-4" strokeWidth={1.25} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
          <button
            type="button"
            onClick={() => goto("closed")}
            aria-label="Fermer"
            className={`${iconBtn} w-10 px-0`}
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 md:px-6">
        {loadError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-sm text-mute">
              {"Impossible de charger les données. Vérifiez votre connexion puis réessayez."}
            </p>
            <GoldButton variant="outline" onClick={() => void loadOverview()}>
              Réessayer
            </GoldButton>
          </div>
        )}

        {!loadError && !data && (
          <div aria-hidden>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[92px] rounded-xl" />
              ))}
            </div>
            <div className="mt-10 space-y-3">
              <Skeleton className="h-8 w-40" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {data && (
          <>
            <TabBar tab={tab} setTab={setTab} />
            {tab === "flux" && (
          <>
            {/* Statistiques */}
            <section aria-label="Statistiques" className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                { value: data.stats.totalLeads, label: "Leads totaux" },
                { value: data.stats.newLeads, label: "Nouveaux" },
                { value: data.stats.unreadMessages, label: "Messages non lus" },
                { value: data.stats.chats, label: "Conversations" },
                { value: data.stats.trials, label: "Essais demandés" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-surface p-5">
                  <p className="font-serif text-3xl text-goldtext">{s.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-mute">{s.label}</p>
                </div>
              ))}
            </section>

            {/* Leads */}
            <section aria-labelledby="admin-leads-t" className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="admin-leads-t" className="font-serif text-xl">
                  Leads
                </h2>
                <GoldButton
                  variant="outline"
                  className="min-h-9! px-3! text-xs!"
                  onClick={exportCsv}
                  disabled={data.leads.length === 0}
                >
                  <Download className="h-4 w-4" strokeWidth={1.25} />
                  Exporter CSV
                </GoldButton>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {data.leads.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onStatus={(id, status) => void patchLead(id, { status })}
                      onNotes={(id, notes) => void patchLead(id, { notes })}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Messages */}
            <section aria-labelledby="admin-messages-t" className="mt-10">
              <h2 id="admin-messages-t" className="font-serif text-xl">
                Messages
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {data.messages.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.messages.map((m) => (
                    <article
                      key={m.id}
                      className="grid gap-3 rounded-lg border border-line bg-surface p-4 md:grid-cols-[1fr_auto]"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{m.subject?.trim() ? m.subject : "(Sans objet)"}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-mute">{m.message}</p>
                        <p className="mt-2 text-xs text-mute">
                          {m.lead.firstName} {m.lead.lastName} · {m.lead.phone} ·{" "}
                          {fmtDate(m.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-start md:justify-end">
                        <Select value={m.status} onValueChange={(v) => void patchMessage(m.id, v)}>
                          <SelectTrigger
                            aria-label={`Statut du message — ${m.lead.firstName} ${m.lead.lastName}`}
                            className="h-9 w-full bg-surface text-xs md:w-44"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            {Object.entries(MESSAGE_STATUS).map(([value, label]) => (
                              <SelectItem key={value} value={value} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* Essais */}
            <section aria-labelledby="admin-trials-t" className="mt-10">
              <h2 id="admin-trials-t" className="font-serif text-xl">
                Essais
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {data.trials.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.trials.map((tr) => (
                    <article
                      key={tr.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{saasName(tr.saasSlug)}</p>
                        <p className="mt-0.5 text-sm text-mute">
                          {tr.lead.firstName} {tr.lead.lastName} · {tr.lead.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusDot status={TRIAL_STATUS[tr.status] ?? tr.status} />
                        <span className="text-xs text-mute">{fmtDate(tr.createdAt)}</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
            )}
            {tab === "journal" && <PostsPanel onUnauthorized={() => goto("login")} />}
            {tab === "site" && <SettingsPanel onUnauthorized={() => goto("login")} />}
            {tab === "logiciels" && <SoftwareLinksPanel onUnauthorized={() => goto("login")} />}
            {tab === "realisations" && <ProjectsPanel onUnauthorized={() => goto("login")} />}
            {tab === "demos" && <DemosPanel onUnauthorized={() => goto("login")} />}
            {tab === "partners" && <PartnersPanel onUnauthorized={() => goto("login")} />}
            {tab === "temoignages" && <TestimonialsPanel onUnauthorized={() => goto("login")} />}
            {tab === "documents" && <DocumentsPanel onUnauthorized={() => goto("login")} />}
            {tab === "emails" && <EmailsPanel onUnauthorized={() => goto("login")} />}
            {tab === "push" && <PushPanel onUnauthorized={() => goto("login")} />}
          </>
        )}
      </div>
    </div>
  );
}
