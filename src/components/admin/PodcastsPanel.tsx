"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  AudioLines,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { GoldButton } from "@/components/site/kit";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { isDriveLink, toPlayableAudioUrl } from "@/lib/drive";

/* ── Podcasts — gestion complète (création, édition dépliable de TOUS les
 * champs, lien Drive converti automatiquement en audio jouable avec validation
 * en direct, image de couverture, publication, réordonnancement, suppression).
 * Panneau autonome de l'Espace équipe ; câblage : <PodcastsPanel onUnauthorized={() => …} />
 * La première publication déclenche une notification push côté serveur. ── */

interface PodcastRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  audioUrl: string;
  sourceUrl: string | null;
  durationSec: number | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  sortOrder: number;
  createdAt: string;
}

interface FormState {
  title: string;
  description: string;
  sourceUrl: string;
  durationMin: string;
  coverImageUrl: string;
  sortOrder: string;
  isPublished: boolean;
}

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 Mo (miroir de la validation serveur)

const inputCls =
  "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";
const textareaCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-gold focus:outline-none";
const labelCls = "text-xs uppercase tracking-[0.14em] text-mute";
const iconBtn =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";
const deleteBtn =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40";

const emptyForm = (nextSort: number): FormState => ({
  title: "",
  description: "",
  sourceUrl: "",
  durationMin: "",
  coverImageUrl: "",
  sortOrder: String(nextSort),
  isPublished: false,
});

const formFromRow = (r: PodcastRow): FormState => ({
  title: r.title,
  description: r.description ?? "",
  sourceUrl: r.sourceUrl ?? r.audioUrl,
  durationMin:
    r.durationSec != null && r.durationSec > 0 ? String(Math.round(r.durationSec / 60)) : "",
  coverImageUrl: r.coverImageUrl ?? "",
  sortOrder: String(r.sortOrder),
  isPublished: r.isPublished,
});

/** Durée lisible : « 3 min », « 1 h 04 »… ou « — ». */
function fmtDuration(sec: number | null): string {
  if (sec == null || sec <= 0) return "—";
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s > 0 ? `${m} min ${String(s).padStart(2, "0")}` : `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${String(m % 60).padStart(2, "0")}`;
}

function validateForm(f: FormState): string | null {
  if (f.title.trim().length < 2 || f.title.trim().length > 160) {
    return "Le titre est requis (2 à 160 caractères).";
  }
  if (f.description.trim().length > 2000) {
    return "La description ne doit pas dépasser 2000 caractères.";
  }
  const src = f.sourceUrl.trim();
  if (!src) {
    return "Le lien Google Drive ou l'URL audio est requise.";
  }
  if (!/^https:\/\//i.test(src)) {
    return "Le lien doit commencer par https:// (partage Google Drive ou mp3 direct).";
  }
  if (toPlayableAudioUrl(src) === null) {
    return "Lien non reconnu — collez un lien de partage Google Drive ou une URL audio directe.";
  }
  const dur = f.durationMin.trim();
  if (dur && (!/^\d+$/.test(dur) || Number(dur) > 1440)) {
    return "Durée : nombre entier de minutes (0 à 1440), ou vide.";
  }
  const sort = f.sortOrder.trim();
  if (sort && (!/^\d+$/.test(sort) || Number(sort) > 999)) {
    return "Ordre d'affichage : nombre entier entre 0 et 999.";
  }
  return null;
}

function payloadFrom(f: FormState): Record<string, unknown> {
  const src = f.sourceUrl.trim();
  return {
    titleFr: f.title.trim(),
    descriptionFr: f.description.trim(),
    sourceUrl: src,
    durationSec:
      f.durationMin.trim() === "" ? null : Math.min(86400, Number(f.durationMin.trim()) * 60),
    coverImageUrl: f.coverImageUrl.trim(),
    isPublished: f.isPublished,
    sortOrder: f.sortOrder.trim() === "" ? 0 : Number(f.sortOrder.trim()),
  };
}

/* ── Champ lien audio : validation en direct + indication Drive ── */

function SourceUrlField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const src = value.trim();
  const playable = src ? toPlayableAudioUrl(src) : null;
  const invalid = src !== "" && playable === null;
  const drive = src !== "" && isDriveLink(src);
  const notHttps = src !== "" && !/^https:\/\//i.test(src);

  return (
    <label className="grid gap-1.5 md:col-span-2">
      <span className={labelCls}>Lien Google Drive ou URL audio *</span>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={600}
        type="url"
        placeholder="https://drive.google.com/file/d/…  ou  https://exemple.com/episode.mp3"
        aria-required="true"
        aria-invalid={invalid || notHttps}
      />
      {notHttps ? (
        <p role="alert" className="text-xs text-destructive">
          Le lien doit commencer par https://
        </p>
      ) : invalid ? (
        <p role="alert" className="text-xs text-destructive">
          Lien non reconnu — collez un lien de partage Google Drive
          (drive.google.com/file/d/…) ou une URL audio directe (.mp3, .m4a, .ogg…).
        </p>
      ) : drive ? (
        <p role="status" className="flex items-center gap-1.5 text-xs text-goldtext">
          <AudioLines className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
          Lien Drive converti automatiquement en audio jouable — aucun réglage nécessaire.
        </p>
      ) : playable ? (
        <p className="text-xs text-mute">URL audio directe — elle sera jouable telle quelle.</p>
      ) : (
        <p className="text-xs text-mute">
          Collez un lien de partage Drive ou l&apos;adresse directe d&apos;un fichier audio —
          la conversion est automatique.
        </p>
      )}
    </label>
  );
}

/* ── Champ image de couverture : aperçu + upload (+ URL manuelle) ── */

function CoverField({
  value,
  onChange,
  uploading,
  uploadError,
  onPick,
}: {
  value: string;
  onChange: (v: string) => void;
  uploading: boolean;
  uploadError: string | null;
  onPick: () => void;
}) {
  return (
    <div className="grid gap-1.5 md:col-span-2">
      <span className={labelCls}>Image de couverture (optionnelle)</span>
      {value ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
            <Image
              src={value}
              alt="Aperçu de l'image de couverture"
              fill
              sizes="112px"
              className="object-cover"
              unoptimized
            />
          </span>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onPick}
              disabled={uploading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
              ) : (
                <ImagePlus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              )}
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={uploading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            >
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          disabled={uploading}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
              Envoi en cours…
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              Choisir une image — JPEG, PNG, WebP, AVIF, GIF (6 Mo max)
            </>
          )}
        </button>
      )}
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={600}
        placeholder="…ou collez une URL d'image (https://… ou /uploads/…)"
        aria-label="URL de l'image de couverture"
      />
      {uploadError && (
        <p role="alert" className="text-xs text-destructive">
          {uploadError}
        </p>
      )}
    </div>
  );
}

/* ── Formulaire partagé : création / édition ─────────────────── */

function PodcastForm({
  isEdit,
  initial,
  busy,
  error,
  onSubmit,
  onCancel,
  onUnauthorized,
}: {
  isEdit: boolean;
  initial: FormState;
  busy: boolean;
  error: string | null;
  onSubmit: (values: FormState) => void;
  onCancel: () => void;
  onUnauthorized: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setValues = (updater: (f: FormState) => FormState) => setForm((f) => updater(f));

  const upload = async (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("Image trop lourde — 6 Mo maximum.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json().catch(() => null)) as {
        ok: boolean;
        data?: { url: string };
        error?: { code?: string };
      } | null;
      if (res.ok && json?.ok && json.data?.url) {
        setValues((f) => ({ ...f, coverImageUrl: json.data!.url }));
      } else {
        const code = json?.error?.code;
        setUploadError(
          code === "too_large"
            ? "Image trop lourde — 6 Mo maximum."
            : code === "bad_type"
              ? "Format non reconnu — JPEG, PNG, WebP, AVIF ou GIF attendu."
              : "Envoi impossible. Réessayez."
        );
      }
    } catch {
      setUploadError("Erreur réseau. Réessayez.");
    } finally {
      setUploading(false);
    }
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; /* permet de re-choisir le même fichier */
    if (file) void upload(file);
  };

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!busy) onSubmit(form);
      }}
      className="grid gap-3 md:grid-cols-2"
    >
      <label className="grid gap-1.5">
        <span className={labelCls}>Titre de l&apos;épisode *</span>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => setValues((f) => ({ ...f, title: e.target.value }))}
          maxLength={160}
          placeholder="Ex : Transformer son commerce par le digital"
          aria-required="true"
        />
      </label>
      <label className="grid gap-1.5">
        <span className={labelCls}>Durée en minutes (optionnelle)</span>
        <input
          className={inputCls}
          value={form.durationMin}
          onChange={(e) =>
            setValues((f) => ({ ...f, durationMin: e.target.value.replace(/\D/g, "").slice(0, 4) }))
          }
          inputMode="numeric"
          placeholder="Ex : 12"
        />
      </label>
      <label className="grid gap-1.5 md:col-span-2">
        <span className={labelCls}>Description (optionnelle)</span>
        <textarea
          className={`${textareaCls} min-h-[88px]`}
          value={form.description}
          onChange={(e) => setValues((f) => ({ ...f, description: e.target.value }))}
          maxLength={2000}
          placeholder="De quoi parle cet épisode — résumé affiché sur la page podcast."
        />
      </label>

      <SourceUrlField
        value={form.sourceUrl}
        onChange={(v) => setValues((f) => ({ ...f, sourceUrl: v }))}
      />

      <CoverField
        value={form.coverImageUrl}
        onChange={(v) => setValues((f) => ({ ...f, coverImageUrl: v }))}
        uploading={uploading}
        uploadError={uploadError}
        onPick={() => fileRef.current?.click()}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={onFile}
        tabIndex={-1}
        aria-hidden="true"
      />

      <label className="grid gap-1.5">
        <span className={labelCls}>Ordre d&apos;affichage</span>
        <input
          className={inputCls}
          value={form.sortOrder}
          onChange={(e) =>
            setValues((f) => ({ ...f, sortOrder: e.target.value.replace(/\D/g, "").slice(0, 3) }))
          }
          inputMode="numeric"
          placeholder="0"
        />
      </label>
      <label className="flex items-center gap-3 self-end text-sm text-mute">
        <Switch
          checked={form.isPublished}
          onCheckedChange={(v) => setValues((f) => ({ ...f, isPublished: v }))}
          aria-label="Publier le podcast"
        />
        Publié (visible sur le site public)
      </label>

      {error && (
        <p role="alert" className="text-sm text-destructive md:col-span-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <GoldButton type="submit" disabled={busy} className="min-h-11! px-4! text-xs!">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
          ) : (
            <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
          )}
          {isEdit ? "Enregistrer les modifications" : "Créer l'épisode"}
        </GoldButton>
        <GoldButton variant="outline" onClick={onCancel} className="min-h-11! px-4! text-xs!">
          Fermer
        </GoldButton>
      </div>
    </form>
  );
}

/* ── Panneau principal ───────────────────────────────────────── */

export function PodcastsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<PodcastRow[] | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /* ── Liste complète (publiés + brouillons) ─────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/podcasts", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: PodcastRow[] };
        if (!cancelled) setRows(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, reload]);

  /** PATCH brut (retourne true si succès). */
  const patchRaw = async (id: string, body: Record<string, unknown>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/podcasts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return false;
      }
      return res.ok;
    } catch {
      return false;
    }
  };

  const submitCreate = async (values: FormState) => {
    setCreateError(null);
    const invalid = validateForm(values);
    if (invalid) {
      setCreateError(invalid);
      return;
    }
    setCreateBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFrom(values)),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setCreateOpen(false);
        toast.success("Épisode créé — le lien Drive a été converti en audio jouable.");
        setNotice("Épisode créé.");
        setReload((k) => k + 1);
      } else if (res.status === 400) {
        setCreateError("Valeurs refusées — vérifiez le titre et le lien audio (https, Drive).");
      } else {
        setCreateError("Création impossible. Réessayez.");
      }
    } catch {
      setCreateError("Erreur réseau. Réessayez.");
    } finally {
      setCreateBusy(false);
    }
  };

  const submitEdit = async (id: string, values: FormState) => {
    setEditError(null);
    const invalid = validateForm(values);
    if (invalid) {
      setEditError(invalid);
      return;
    }
    setEditBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/podcasts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payloadFrom(values) }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setEditingId(null);
        toast.success("Épisode enregistré.");
        setNotice("Modifications enregistrées.");
        setReload((k) => k + 1);
      } else if (res.status === 400) {
        setEditError("Valeurs refusées — vérifiez le titre et le lien audio (https, Drive).");
      } else if (res.status === 404) {
        setEditError("Épisode introuvable — il a peut-être été supprimé entre-temps.");
      } else {
        setEditError("Enregistrement impossible. Réessayez.");
      }
    } catch {
      setEditError("Erreur réseau. Réessayez.");
    } finally {
      setEditBusy(false);
    }
  };

  const togglePublish = async (row: PodcastRow) => {
    setBusyId(row.id);
    setNotice(null);
    const ok = await patchRaw(row.id, { isPublished: !row.isPublished });
    if (ok) {
      setRows((r) =>
        r ? r.map((x) => (x.id === row.id ? { ...x, isPublished: !x.isPublished } : x)) : r
      );
      if (!row.isPublished) {
        toast.success("Épisode publié — les abonnés ont été notifiés.");
        setNotice("Épisode publié.");
      } else {
        setNotice("Épisode dépublié.");
      }
    } else {
      setNotice("Modification impossible. Réessayez.");
    }
    setBusyId(null);
  };

  /** Réordonnancement : échange l'ordre avec le voisin (↑ / ↓). */
  const move = async (row: PodcastRow, dir: -1 | 1) => {
    if (!rows || busyId) return;
    const idx = rows.findIndex((r) => r.id === row.id);
    const other = rows[idx + dir];
    if (idx < 0 || !other) return;
    setBusyId(row.id);
    setNotice(null);

    /* Ordres égaux : on force un écart. */
    let rowTarget = other.sortOrder;
    let otherTarget = row.sortOrder;
    if (rowTarget === otherTarget) {
      if (dir === -1) {
        if (other.sortOrder === 0) {
          rowTarget = 0;
          otherTarget = 1;
        } else {
          rowTarget = other.sortOrder - 1;
          otherTarget = other.sortOrder;
        }
      } else {
        rowTarget = row.sortOrder + 1;
        otherTarget = row.sortOrder;
      }
    }

    const first = await patchRaw(row.id, { sortOrder: rowTarget });
    const second = first ? await patchRaw(other.id, { sortOrder: otherTarget }) : false;
    if (first && second) {
      setReload((k) => k + 1);
    } else if (first) {
      setNotice("Ordre partiellement mis à jour — rechargez et réessayez.");
      setReload((k) => k + 1);
    } else {
      setNotice("Réordonnancement impossible. Réessayez.");
    }
    setBusyId(null);
  };

  const remove = async (row: PodcastRow) => {
    if (!window.confirm(`Supprimer définitivement « ${row.title} » ?`)) return;
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/podcasts?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        toast.success("Épisode supprimé.");
        setNotice("Épisode supprimé.");
        setReload((k) => k + 1);
      } else if (res.status === 404) {
        setNotice("Épisode déjà supprimé.");
        setReload((k) => k + 1);
      } else {
        setNotice("Suppression impossible. Réessayez.");
      }
    } catch {
      setNotice("Erreur réseau. Réessayez.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section aria-labelledby="admin-podcasts-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-podcasts-t" className="font-serif text-xl">
          Podcasts
        </h2>
        {!createOpen && (
          <GoldButton
            onClick={() => {
              setCreateError(null);
              setNotice(null);
              setCreateOpen(true);
            }}
            className="min-h-9! px-3! text-xs!"
          >
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            Nouvel épisode
          </GoldButton>
        )}
      </div>
      <p className="mt-1 text-sm text-mute">
        Collez un lien Google Drive ou une URL audio : la conversion en lecture directe est
        automatique. La première publication d&apos;un épisode notifie les abonnés.
      </p>

      {notice && (
        <p role="status" className="mt-3 text-sm text-mute">
          {notice}
        </p>
      )}

      {/* Formulaire de création */}
      {createOpen && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-4 md:p-5">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-mute">
            Nouvel épisode
          </p>
          <PodcastForm
            isEdit={false}
            initial={emptyForm((rows?.reduce((m, r) => Math.max(m, r.sortOrder), 0) ?? 0) + 1)}
            busy={createBusy}
            error={createError}
            onSubmit={(values) => void submitCreate(values)}
            onCancel={() => {
              setCreateOpen(false);
              setCreateError(null);
            }}
            onUnauthorized={onUnauthorized}
          />
        </div>
      )}

      {/* Liste éditable */}
      <div className="mt-4 flex flex-col gap-3">
        {rows === null ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mute">
            Aucun épisode pour le moment — créez le premier.
          </p>
        ) : (
          rows.map((p, i) => (
            <article key={p.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {p.coverImageUrl ? (
                    <span className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border border-line bg-bg">
                      <Image
                        src={p.coverImageUrl}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md border border-line bg-bg text-goldtext"
                    >
                      <AudioLines className="h-5 w-5" strokeWidth={1.25} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-medium">
                      <span className="truncate">{p.title}</span>
                      {p.isPublished ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-gold/40 bg-gold/10 text-[0.65rem] text-goldtext"
                        >
                          Publié
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 text-[0.65rem] text-mute">
                          Brouillon
                        </Badge>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-mute">
                      {[fmtDuration(p.durationSec), `ordre ${p.sortOrder}`, p.slug]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void move(p, -1)}
                    disabled={i === 0 || busyId !== null}
                    aria-label={`Monter — ${p.title}`}
                    className={iconBtn}
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(p, 1)}
                    disabled={i === rows.length - 1 || busyId !== null}
                    aria-label={`Descendre — ${p.title}`}
                    className={iconBtn}
                  >
                    <ArrowDown className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                  <Switch
                    checked={p.isPublished}
                    disabled={busyId === p.id}
                    onCheckedChange={() => void togglePublish(p)}
                    aria-label={`Publication — ${p.title}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditError(null);
                      setEditingId((cur) => (cur === p.id ? null : p.id));
                    }}
                    aria-expanded={editingId === p.id}
                    aria-label={`Modifier — ${p.title}`}
                    className={iconBtn}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(p)}
                    disabled={busyId === p.id}
                    aria-label={`Supprimer — ${p.title}`}
                    className={deleteBtn}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                </div>
              </div>

              {/* Éditeur dépliable — tous les champs */}
              {editingId === p.id && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.14em] text-mute">
                    Modifier — {p.title}
                  </p>
                  <PodcastForm
                    isEdit
                    initial={formFromRow(p)}
                    busy={editBusy}
                    error={editError}
                    onSubmit={(values) => void submitEdit(p.id, values)}
                    onCancel={() => {
                      setEditingId(null);
                      setEditError(null);
                    }}
                    onUnauthorized={onUnauthorized}
                  />
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default PodcastsPanel;
