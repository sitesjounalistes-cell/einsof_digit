"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

/* ── Partenaires — gestion complète (création, édition, activation, suppression).
 * Panneau autonome de l'Espace équipe ; câblage : <PartnersPanel onUnauthorized={() => …} />
 * Règle §20.4 : tant qu'aucun partenaire n'est actif, la section publique reste masquée. ── */

interface PartnerRow {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface FormState {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm = (): FormState => ({
  name: "",
  logoUrl: "",
  websiteUrl: "",
  description: "",
  sortOrder: "0",
  isActive: true,
});

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";
const textareaCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-gold focus:outline-none";
const labelCls = "text-xs text-mute";
const iconBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-gold/60 hover:text-ink";
const deleteBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-destructive/60 hover:text-destructive";

const URL_RE = /^https?:\/\/\S+\.\S+/i;

const isBlankUrl = (v: string): boolean => v.trim() === "";
const urlValid = (v: string): boolean => isBlankUrl(v) || URL_RE.test(v.trim());
/** Logo : https ou chemin interne (/uploads/… issu de /api/admin/upload). */
const logoUrlValid = (v: string): boolean =>
  isBlankUrl(v) || v.trim().startsWith("/") || URL_RE.test(v.trim());

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 Mo (miroir de la validation serveur)

export function PartnersPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<PartnerRow[] | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /* Éditeur : null = liste seule ; id = null (création) ou id du partenaire modifié. */
  const [editor, setEditor] = useState<{ id: string | null } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* Upload du logo (pattern ProjectsPanel — /api/admin/upload) */
  const logoFileRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  const uploadLogo = async (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      setLogoUploadError("Image trop lourde — 6 Mo maximum.");
      return;
    }
    setLogoUploading(true);
    setLogoUploadError(null);
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
        setForm((f) => ({ ...f, logoUrl: json.data!.url }));
      } else {
        const code = json?.error?.code;
        setLogoUploadError(
          code === "too_large"
            ? "Image trop lourde — 6 Mo maximum."
            : code === "bad_type"
              ? "Format non reconnu — JPEG, PNG, WebP, AVIF ou GIF attendu."
              : "Envoi impossible. Réessayez."
        );
      }
    } catch {
      setLogoUploadError("Erreur réseau. Réessayez.");
    } finally {
      setLogoUploading(false);
    }
  };

  const onLogoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; /* permet de re-choisir le même fichier */
    if (file) void uploadLogo(file);
  };

  /* ── Liste ─────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/partners", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: PartnerRow[] };
        if (!cancelled) setRows(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, reload]);

  /* ── Activation / désactivation ────────────────────────────── */
  const toggleActive = async (row: PartnerRow) => {
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, isActive: !row.isActive }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setRows((r) =>
          r ? r.map((x) => (x.id === row.id ? { ...x, isActive: !x.isActive } : x)) : r
        );
        setNotice(row.isActive ? "Partenaire désactivé — retiré du site public." : "Partenaire activé.");
      } else {
        setNotice("Modification impossible. Réessayez.");
      }
    } catch {
      setNotice("Erreur réseau. Réessayez.");
    } finally {
      setBusyId(null);
    }
  };

  /* ── Suppression définitive ────────────────────────────────── */
  const remove = async (row: PartnerRow) => {
    if (!window.confirm(`Supprimer définitivement « ${row.name} » ?`)) return;
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/partners?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice("Partenaire supprimé.");
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

  /* ── Ouverture / fermeture de l'éditeur ────────────────────── */
  const openCreate = () => {
    setForm(emptyForm());
    setFormError(null);
    setNotice(null);
    setEditor({ id: null });
  };

  const openEdit = (row: PartnerRow) => {
    setForm({
      name: row.name,
      logoUrl: row.logoUrl ?? "",
      websiteUrl: row.websiteUrl ?? "",
      description: row.description ?? "",
      sortOrder: String(row.sortOrder),
      isActive: row.isActive,
    });
    setFormError(null);
    setNotice(null);
    setEditor({ id: row.id });
  };

  const closeEditor = () => {
    setEditor(null);
    setFormError(null);
  };

  /* ── Enregistrement (POST création / PUT mise à jour) ──────── */
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy || editor === null) return;
    setFormError(null);

    const name = form.name.trim();
    if (name.length < 2 || name.length > 120) {
      setFormError("Le nom du partenaire est requis (2 à 120 caractères).");
      return;
    }
    if (!logoUrlValid(form.logoUrl)) {
      setFormError(
        "L'URL du logo doit être une adresse valide commençant par http(s):// ou un chemin interne commençant par / — ou vide."
      );
      return;
    }
    if (!urlValid(form.websiteUrl)) {
      setFormError("L'URL du site doit être une adresse valide commençant par http(s):// — ou vide.");
      return;
    }
    if (form.description.trim().length > 500) {
      setFormError("La description ne doit pas dépasser 500 caractères.");
      return;
    }
    const sortOrder = form.sortOrder.trim() === "" ? 0 : Number(form.sortOrder);
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 999) {
      setFormError("Ordre d'affichage : nombre entier entre 0 et 999.");
      return;
    }

    const payload: Record<string, unknown> = {
      name,
      logoUrl: form.logoUrl.trim(),
      websiteUrl: form.websiteUrl.trim(),
      description: form.description.trim(),
      sortOrder,
      isActive: form.isActive,
    };
    if (editor.id !== null) payload.id = editor.id;

    setBusy(true);
    try {
      const res = await fetch("/api/admin/partners", {
        method: editor.id !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice(editor.id !== null ? "Partenaire enregistré." : "Partenaire créé.");
        setEditor(null);
        setReload((k) => k + 1);
        return;
      }
      if (res.status === 400) {
        setFormError("Valeurs refusées. Vérifiez le nom (2 à 120 caractères), les URL et l'ordre d'affichage.");
        return;
      }
      if (res.status === 404) {
        setFormError("Partenaire introuvable — il a peut-être été supprimé entre-temps.");
        return;
      }
      setFormError("Enregistrement impossible. Réessayez.");
    } catch {
      setFormError("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  /* ── Rendu ─────────────────────────────────────────────────── */
  return (
    <section aria-labelledby="admin-partners-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-partners-t" className="font-serif text-xl">
          Partenaires
        </h2>
        {editor === null && (
          <GoldButton onClick={openCreate} className="min-h-9! px-3! text-xs!">
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            Nouveau partenaire
          </GoldButton>
        )}
      </div>
      <p className="mt-1 text-sm text-mute">
        Les partenaires actifs alimentent la section publique éponyme. Tant qu&apos;aucun n&apos;est
        actif, la section reste masquée sur le site (aucun contenu fictif).
      </p>

      {notice && (
        <p role="status" className="mt-3 text-sm text-mute">
          {notice}
        </p>
      )}

      {/* Éditeur (création / édition) */}
      {editor !== null && (
        <form onSubmit={submit} className="mt-4 rounded-lg border border-line bg-surface p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.14em] text-mute">
              {editor.id !== null ? "Modifier le partenaire" : "Nouveau partenaire"}
            </p>
            <GoldButton variant="outline" onClick={closeEditor} className="min-h-9! px-3! text-xs!">
              Retour à la liste
            </GoldButton>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className={labelCls}>Nom *</span>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={120}
                placeholder="Nom du partenaire"
                aria-required="true"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Ordre d&apos;affichage</span>
              <input
                className={inputCls}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value.replace(/\D/g, "").slice(0, 3) }))
                }
                inputMode="numeric"
                placeholder="0"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>URL du logo (optionnel)</span>
              {form.logoUrl.trim() !== "" && (
                <span className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-lg border border-line bg-bg p-2">
                  <Image
                    src={form.logoUrl}
                    alt="Aperçu du logo"
                    width={112}
                    height={64}
                    className="max-h-full max-w-full object-contain"
                    unoptimized
                  />
                </span>
              )}
              <span className="flex flex-wrap items-center gap-2">
                <input
                  className={inputCls}
                  value={form.logoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                  maxLength={300}
                  placeholder="https://exemple.com/logo.png ou /uploads/…"
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={logoUploading}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {logoUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
                  ) : (
                    <ImagePlus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  )}
                  Envoyer
                </button>
              </span>
              {logoUploadError && (
                <p role="alert" className="text-xs text-destructive">
                  {logoUploadError}
                </p>
              )}
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>URL du site (optionnel)</span>
              <input
                className={inputCls}
                value={form.websiteUrl}
                onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                maxLength={300}
                placeholder="https://exemple.com"
                type="url"
              />
            </label>
            <label className="grid gap-1.5 md:col-span-2">
              <span className={labelCls}>Description (optionnelle)</span>
              <textarea
                className={`${textareaCls} min-h-[72px]`}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                maxLength={500}
                placeholder="Une phrase sur le partenariat (visible sur la carte publique)."
              />
            </label>
            <label className="mt-1 flex items-center gap-3 text-sm text-mute md:col-span-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                aria-label="Partenaire actif"
              />
              Partenaire actif (visible sur le site public)
            </label>
          </div>

          {formError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {formError}
            </p>
          )}

          <input
            ref={logoFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="hidden"
            onChange={onLogoFile}
            tabIndex={-1}
            aria-hidden="true"
          />

          <div className="mt-4">
            <GoldButton type="submit" disabled={busy} className="min-h-10! px-4! text-xs!">
              <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              {editor.id !== null ? "Enregistrer les modifications" : "Créer le partenaire"}
            </GoldButton>
          </div>
        </form>
      )}

      {/* Liste des partenaires */}
      <div className="mt-4 flex flex-col gap-3">
        {rows === null ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mute">{"Aucun partenaire pour le moment."}</p>
        ) : (
          rows.map((p) => (
            <article
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{p.name}</p>
                <p className="mt-0.5 truncate text-xs text-mute">
                  {[p.websiteUrl, `ordre ${p.sortOrder}`].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-mute">{p.isActive ? "Actif" : "Inactif"}</span>
                <Switch
                  checked={p.isActive}
                  disabled={busyId === p.id}
                  onCheckedChange={() => void toggleActive(p)}
                  aria-label={`Activation — ${p.name}`}
                />
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  aria-label={`Modifier — ${p.name}`}
                  className={iconBtn}
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(p)}
                  disabled={busyId === p.id}
                  aria-label={`Supprimer — ${p.name}`}
                  className={deleteBtn}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default PartnersPanel;
