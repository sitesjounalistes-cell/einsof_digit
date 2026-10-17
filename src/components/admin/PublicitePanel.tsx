"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BellRing,
  History,
  Megaphone,
  MousePointerClick,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { GoldButton, Monogram } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Publicité & Notifications — Espace équipe (spec §6/§14/§28).
 * Panneau prêt à câbler : <PublicitePanel onUnauthorized={() => …} />
 * Composer de notifications push + rappels publicitaires pré-remplis
 * + journal des envois (NotificationLog via /api/admin/push). ── */

interface NotifLog {
  id: string;
  title: string;
  body: string;
  url: string | null;
  kind: string;
  sentTo: number;
  delivered: number;
  failed: number;
  opened: number;
  createdAt: string;
}

interface PushAdminData {
  count: number;
  logs: NotifLog[];
}

/* Pages proposées au clic — « custom » révèle le champ chemin libre. */
const PAGE_CHOICES = [
  { value: "/", label: "Accueil ( / )" },
  { value: "/services", label: "Services" },
  { value: "/logiciels", label: "Logiciels" },
  { value: "/tarifs", label: "Tarifs" },
  { value: "/realisations", label: "Réalisations" },
  { value: "/blog", label: "Journal (blog)" },
  { value: "/podcast", label: "Podcast" },
  { value: "/contact", label: "Contact" },
  { value: "custom", label: "Autre chemin…" },
] as const;
const CUSTOM = "custom";

/* Rappels publicitaires — un clic remplit le composer, le gérant
   adapte puis envoie. Titres/message/tests validés côté API. */
interface Template {
  title: string;
  body: string;
  url: string;
}

const TEMPLATES: Template[] = [
  {
    title: "🎉 Promo : -20 % sur votre site vitrine ce mois-ci",
    body: "Offre limitée : votre site vitrine à -20 % pendant tout le mois. Demandez votre devis gratuit dès aujourd'hui.",
    url: "/tarifs",
  },
  {
    title: "📲 Votre site en application mobile, demandez une démo",
    body: "EINSOF transforme votre site web en application installable sur téléphone. Demandez une démonstration gratuite.",
    url: "/contact",
  },
  {
    title: "🧾 Factura Pro : essayez 7 jours gratuitement",
    body: "Factures, clients et relances simplifiés — testez Factura Pro pendant 7 jours, sans engagement ni carte bancaire.",
    url: "/logiciels/factura-pro",
  },
  {
    title: "🎙️ Nouvel épisode du podcast EINSOF",
    body: "Le nouveau numéro est en ligne : stratégie digitale et business en Guinée. Écoutez-le maintenant.",
    url: "/podcast",
  },
  {
    title: "🗓️ Réservez votre démo privée",
    body: "Choisissez votre créneau et découvrez nos logiciels de gestion en direct avec l'équipe EINSOF.",
    url: "/contact",
  },
];

const KIND_LABELS: Record<string, string> = {
  article: "Article",
  promo: "Promo",
  test: "Test",
};

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";

function frRate(n: number): string {
  return String(n).replace(".", ",");
}
function logRate(l: NotifLog): number {
  return l.delivered > 0 ? Math.round((l.opened / l.delivered) * 1000) / 10 : 0;
}
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function PublicitePanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [data, setData] = useState<PushAdminData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reload, setReload] = useState(0);

  /* Composer */
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pageChoice, setPageChoice] = useState<string>("/");
  const [customPath, setCustomPath] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/push", { cache: "no-store" });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as { ok: boolean; data?: PushAdminData };
      if (json.ok && json.data) setData({ count: json.data.count, logs: json.data.logs ?? [] });
    } catch {
      toast.error("Erreur réseau — impossible de charger les abonnés et le journal.");
    } finally {
      setLoaded(true);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load, reload]);

  /* Chemin effectif : choix de la liste OU chemin libre validé */
  const effectiveUrl = useMemo(
    () => (pageChoice === CUSTOM ? customPath.trim() : pageChoice),
    [pageChoice, customPath]
  );
  const urlValid = effectiveUrl.startsWith("/") && effectiveUrl.length >= 1 && effectiveUrl.length <= 300;
  const composerValid =
    title.trim().length >= 2 && message.trim().length >= 2 && urlValid && !busy;

  const applyTemplate = (tpl: Template) => {
    setTitle(tpl.title);
    setMessage(tpl.body);
    if (PAGE_CHOICES.some((p) => p.value === tpl.url)) {
      setPageChoice(tpl.url);
    } else {
      setPageChoice(CUSTOM);
      setCustomPath(tpl.url);
    }
  };

  const send = async () => {
    if (busy || !composerValid) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: message.trim(),
          url: effectiveUrl,
          kind: "promo",
        }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as {
        ok: boolean;
        data?: { sent: number; failed: number; removed: number; logId: string | null };
      };
      if (json.ok && json.data) {
        toast.success(`Envoyées : ${json.data.sent} · Échecs : ${json.data.failed}`);
        setTitle("");
        setMessage("");
        setReload((k) => k + 1);
      } else {
        toast.error("Envoi impossible — vérifiez le titre (2-80), le message (2-280) et le chemin.");
      }
    } catch {
      toast.error("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="admin-publicite-t">
      {/* En-tête + compteur abonnés */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 id="admin-publicite-t" className="font-serif text-xl">
            Publicité &amp; Notifications
          </h2>
          <Megaphone className="h-5 w-5 text-gold" strokeWidth={1.25} aria-hidden />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2">
          <BellRing className="h-5 w-5 text-gold" strokeWidth={1.25} aria-hidden />
          <div>
            <p className="font-serif text-xl leading-none text-goldtext">
              {loaded && data ? data.count : "—"}
            </p>
            <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-mute">
              Abonnés push
            </p>
          </div>
        </div>
      </div>
      <p className="mt-1 text-sm text-mute">
        Envoyez une promotion ou une annonce à tous les abonnés des notifications — chaque envoi est
        journalisé (délivrées, échecs, ouvertures).
      </p>

      {!loaded ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          {/* ── Composer ─────────────────────────────────────── */}
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 md:p-5">
            <p className="label-caps">Nouvelle notification</p>

            {/* Titre */}
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="pub-title" className="text-xs text-mute">
                  Titre
                </label>
                <span
                  className={`text-xs ${title.length > 72 ? "text-destructive" : "text-mute"}`}
                  aria-live="polite"
                >
                  {title.length}/80
                </span>
              </div>
              <input
                id="pub-title"
                className={`${inputCls} h-10`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                placeholder="Ex. 🎉 Promo : -20 % ce mois-ci"
              />
            </div>

            {/* Message */}
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="pub-body" className="text-xs text-mute">
                  Message
                </label>
                <span
                  className={`text-xs ${message.length > 260 ? "text-destructive" : "text-mute"}`}
                  aria-live="polite"
                >
                  {message.length}/280
                </span>
              </div>
              <textarea
                id="pub-body"
                className={`${inputCls} min-h-20 resize-y`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={280}
                placeholder="Le texte qui s'affichera sous le titre de la notification…"
              />
            </div>

            {/* Page à ouvrir au clic */}
            <div className="grid gap-1.5">
              <label htmlFor="pub-page" className="text-xs text-mute">
                Page à ouvrir au clic
              </label>
              <Select value={pageChoice} onValueChange={(v) => setPageChoice(v)}>
                <SelectTrigger id="pub-page" className="h-10 border-line bg-surface text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_CHOICES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pageChoice === CUSTOM && (
                <div className="mt-1 grid gap-1.5">
                  <label htmlFor="pub-custom-path" className="text-xs text-mute">
                    Chemin libre (commence par « / »)
                  </label>
                  <input
                    id="pub-custom-path"
                    className={`${inputCls} h-10 ${customPath.trim() && !customPath.trim().startsWith("/") ? "border-destructive" : ""}`}
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    maxLength={300}
                    placeholder="Ex. /logiciels/factura-pro"
                    aria-invalid={customPath.trim() !== "" && !customPath.trim().startsWith("/")}
                  />
                  {customPath.trim() !== "" && !customPath.trim().startsWith("/") && (
                    <p role="alert" className="text-xs text-destructive">
                      Le chemin doit commencer par « / » (lien interne au site).
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Aperçu de la notification */}
            <div className="rounded-xl border border-line bg-deep p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.14em] text-mute">
                Aperçu de la notification
              </p>
              <div className="flex items-start gap-3 rounded-lg border border-line bg-surface p-3 shadow-lg">
                <Monogram size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-mute">
                      EINSOF · maintenant
                    </p>
                    <MousePointerClick className="h-3.5 w-3.5 text-mute" aria-hidden />
                  </div>
                  <p className="mt-0.5 truncate font-medium">{title.trim() || "Titre de la notification"}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-mute">
                    {message.trim() || "Votre message s'affichera ici, sur deux lignes maximum."}
                  </p>
                  <p className="mt-1 truncate text-xs text-goldtext">
                    Ouvre : {urlValid ? effectiveUrl : "— chemin invalide —"}
                  </p>
                </div>
              </div>
            </div>

            {/* Envoi */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              {!urlValid && (
                <p className="text-xs text-destructive">Choisissez une page ou saisissez un chemin valide.</p>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <GoldButton disabled={!composerValid} className="min-h-11! px-5! text-xs!">
                    {busy ? (
                      <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden />
                    ) : (
                      <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    )}
                    {busy ? "Envoi en cours…" : "Envoyer à tous les abonnés"}
                  </GoldButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Envoyer cette notification ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Elle sera envoyée immédiatement à {data?.count ?? 0} abonné(s) et ouvrira la
                      page « {urlValid ? effectiveUrl : "/"} ». Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void send()}>Envoyer maintenant</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* ── Rappels publicitaires ────────────────────────── */}
          <aside className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 md:p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden />
              <p className="label-caps">Rappels publicitaires</p>
            </div>
            <p className="text-xs leading-relaxed text-mute">
              Un clic remplit le formulaire — adaptez le texte puis envoyez.
            </p>
            <div className="flex flex-col gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="group rounded-lg border border-line bg-deep/40 p-3 text-left transition-colors hover:border-gold/60 focus:border-gold focus:outline-none"
                  aria-label={`Remplir avec : ${tpl.title}`}
                >
                  <p className="text-sm font-medium leading-snug group-hover:text-goldtext">
                    {tpl.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-mute">{tpl.body}</p>
                  <p className="mt-1.5 text-xs text-goldtext">Ouvre : {tpl.url}</p>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* ── Historique des envois ───────────────────────────── */}
      <div className="mt-4 rounded-xl border border-line bg-surface p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden />
            <p className="label-caps">Historique des notifications</p>
          </div>
          <GoldButton
            variant="outline"
            className="min-h-9! px-3! text-xs!"
            onClick={() => setReload((k) => k + 1)}
            ariaLabel="Rafraîchir l'historique"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Rafraîchir
          </GoldButton>
        </div>

        {!loaded ? (
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        ) : !data || data.logs.length === 0 ? (
          <p className="mt-3 text-sm text-mute">
            Aucune notification envoyée pour le moment — les envois (publicités, articles, tests)
            apparaîtront ici.
          </p>
        ) : (
          <div className="mt-3 flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
            {data.logs.map((l) => (
              <article key={l.id} className="rounded-lg border border-line bg-deep/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-gold/40 px-2 py-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-goldtext"
                  >
                    {KIND_LABELS[l.kind] ?? l.kind}
                  </Badge>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium" title={l.title}>
                    {l.title}
                  </p>
                  <time className="shrink-0 text-xs text-mute" dateTime={l.createdAt}>
                    {formatDate(l.createdAt)}
                  </time>
                </div>
                <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-mute">{l.body}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mute">
                  <span>Envoyées : {l.sentTo}</span>
                  <span className="text-goldtext">Délivrées : {l.delivered}</span>
                  <span className={l.failed > 0 ? "text-destructive" : undefined}>
                    Échecs : {l.failed}
                  </span>
                  <span>
                    Ouvertes : {l.opened} ({frRate(logRate(l))} %)
                  </span>
                  {l.url ? <span className="text-goldtext">→ {l.url}</span> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PublicitePanel;
