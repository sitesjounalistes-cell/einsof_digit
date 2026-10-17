"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DEFAULT_MANAGER_MESSAGE,
  SOCIAL_PLATFORMS,
  type SiteSettingsData,
  type SocialItem,
} from "@/lib/site-settings-defaults";

/* ── Réglages Site & Contact — panneau de l'Espace équipe.
 * Panneau autonome ; câblage : <SettingsPanel onUnauthorized={() => …} />
 * Gère : téléphones, e-mails, réseaux sociaux, mot du gérant
 * (photo via /api/admin/upload ou URL manuelle, texte officiel éditable). ── */

interface SettingsState {
  phones: string[];
  emails: string[];
  socials: SocialItem[];
  managerPhotoUrl: string;
  managerPhotoAlt: string;
  managerMessageFr: string;
  managerName: string;
  managerRole: string;
}

const EMPTY: SettingsState = {
  phones: [],
  emails: [],
  socials: [],
  managerPhotoUrl: "",
  managerPhotoAlt: "",
  managerMessageFr: DEFAULT_MANAGER_MESSAGE,
  managerName: "",
  managerRole: "",
};

const MAX_PHONES = 6;
const MAX_EMAILS = 6;
const MAX_SOCIALS = 10;
const MAX_MESSAGE = 2000;

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";
const labelCls = "text-xs text-mute";
const cardCls = "rounded-lg border border-line bg-surface p-4 md:p-5";
const iconBtn =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-gold/60 hover:text-ink";
const deleteBtn =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-destructive/60 hover:text-destructive";
const addBtn =
  "min-h-9! px-3! text-xs! border-line! bg-transparent! text-goldtext! hover:text-ongold!";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const platformLabel = (value: string): string =>
  SOCIAL_PLATFORMS.find((p) => p.value === value)?.label ?? "Autre";

export function SettingsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<SettingsState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  /* ── Chargement initial ─────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: SiteSettingsData };
        if (!cancelled && json.ok && json.data) {
          const d = json.data;
          setForm({
            phones: d.phones.length ? d.phones : [],
            emails: d.emails.length ? d.emails : [],
            socials: d.socials,
            managerPhotoUrl: d.managerPhotoUrl ?? "",
            managerPhotoAlt: d.managerPhotoAlt ?? "",
            managerMessageFr: d.managerMessageFr || DEFAULT_MANAGER_MESSAGE,
            managerName: d.managerName === "Le Gérant" ? "" : d.managerName,
            managerRole:
              d.managerRole === "Fondateur & Gérant — EINSOF" ? "" : d.managerRole,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setError("Chargement impossible. Réessayez.");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized]);

  /* ── Listes dynamiques : téléphones / e-mails ───────────── */
  const updateList = (key: "phones" | "emails", index: number, value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].map((v, i) => (i === index ? value : v)),
    }));

  const addToList = (key: "phones" | "emails") =>
    setForm((f) => ({
      ...f,
      [key]: [...f[key], ""],
    }));

  const removeFromList = (key: "phones" | "emails", index: number) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].filter((_, i) => i !== index),
    }));

  /* ── Réseaux sociaux ────────────────────────────────────── */
  const addSocial = () =>
    setForm((f) => ({
      ...f,
      socials: [...f.socials, { platform: "facebook", label: "Facebook", url: "" }],
    }));

  const updateSocial = (index: number, patch: Partial<SocialItem>) =>
    setForm((f) => ({
      ...f,
      socials: f.socials.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));

  const removeSocial = (index: number) =>
    setForm((f) => ({ ...f, socials: f.socials.filter((_, i) => i !== index) }));

  /* ── Upload photo (route /api/admin/upload — si indisponible,
        l'URL peut toujours être collée manuellement) ─────────── */
  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      setNotice(null);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (res.status === 404) {
          setError(
            "Service de téléversement indisponible pour l'instant — collez l'URL de l'image manuellement ci-dessous."
          );
          return;
        }
        const json = (await res.json().catch(() => null)) as
          | { url?: string; data?: { url?: string; fileUrl?: string }; fileUrl?: string }
          | null;
        const url =
          json?.url ??
          json?.data?.url ??
          json?.data?.fileUrl ??
          json?.fileUrl ??
          null;
        if (res.ok && url) {
          set("managerPhotoUrl", url);
          toast.success("Photo du gérant téléversée.");
        } else {
          setError("Échec du téléversement. Réessayez ou collez une URL manuellement.");
        }
      } catch {
        setError("Erreur réseau pendant le téléversement. Réessayez.");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [onUnauthorized]
  );

  /* ── Enregistrement (PUT) ───────────────────────────────── */
  const save = async () => {
    if (busy) return;
    setError(null);
    setNotice(null);

    const phones = form.phones.map((p) => p.trim()).filter(Boolean);
    const emails = form.emails.map((e) => e.trim()).filter(Boolean);
    const socials = form.socials.map((s) => ({
      platform: s.platform,
      label: s.label.trim() || platformLabel(s.platform),
      url: s.url.trim(),
    }));

    if (phones.length !== phones.filter((p) => p.replace(/\s/g, "").length >= 3).length) {
      setError("Chaque numéro de téléphone doit contenir au moins 3 caractères.");
      return;
    }
    if (emails.some((e) => !EMAIL_RE.test(e))) {
      setError("Une des adresses e-mail n'est pas valide.");
      return;
    }
    const badSocial = socials.find((s) => !s.url.startsWith("https://"));
    if (badSocial) {
      setError(`L'URL de « ${badSocial.label} » doit commencer par https://`);
      return;
    }
    if (!form.managerMessageFr.trim()) {
      setError("Le mot du gérant ne peut pas être vide.");
      return;
    }
    if (form.managerMessageFr.length > MAX_MESSAGE) {
      setError(`Le mot du gérant dépasse ${MAX_MESSAGE} caractères.`);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phones,
          emails,
          socials,
          managerPhotoUrl: form.managerPhotoUrl.trim() || null,
          managerPhotoAlt: form.managerPhotoAlt.trim() || null,
          managerMessageFr: form.managerMessageFr,
          managerName: form.managerName.trim() || undefined,
          managerRole: form.managerRole.trim() || undefined,
        }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        toast.success("Réglages enregistrés — visibles sur le site public.");
        setNotice("Réglages enregistrés.");
        return;
      }
      if (res.status === 400) {
        setError("Valeurs refusées : vérifiez les numéros, e-mails, URL https et la taille du message.");
        return;
      }
      setError("Enregistrement impossible. Réessayez.");
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  /* ── Rendu ──────────────────────────────────────────────── */
  return (
    <section aria-labelledby="admin-settings-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-settings-t" className="font-serif text-xl">
          Site &amp; Contact
        </h2>
      </div>
      <p className="mt-1 text-sm text-mute">
        Coordonnées affichées sur la page Contact et mot du gérant affiché sur la page
        À propos. Tant qu&apos;aucun téléphone / e-mail / réseau n&apos;est renseigné, le
        site garde son affichage actuel.
      </p>

      {notice && (
        <p role="status" className="mt-3 text-sm text-mute">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loaded ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {/* ── Téléphones ─────────────────────────────────── */}
          <div className={cardCls}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4 text-goldtext" strokeWidth={1.25} aria-hidden />
                Téléphones
              </h3>
              <GoldButton
                onClick={() => addToList("phones")}
                disabled={form.phones.length >= MAX_PHONES}
                className={addBtn}
              >
                <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                Ajouter
              </GoldButton>
            </div>
            {form.phones.length === 0 ? (
              <p className="mt-3 text-sm text-mute">
                Aucun numéro — le site n&apos;affiche pas de téléphone pour l&apos;instant.
              </p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {form.phones.map((phone, i) => (
                  <div key={`ph-${i}`} className="flex items-center gap-2">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center">
                      <Phone className="h-4 w-4 text-goldtext" strokeWidth={1.25} />
                    </span>
                    <input
                      type="tel"
                      className={inputCls}
                      value={phone}
                      onChange={(e) => updateList("phones", i, e.target.value)}
                      placeholder="+224 6 …"
                      aria-label={`Téléphone ${i + 1}`}
                      maxLength={40}
                    />
                    <button
                      type="button"
                      onClick={() => removeFromList("phones", i)}
                      aria-label={`Supprimer le téléphone ${i + 1}`}
                      className={deleteBtn}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── E-mails ────────────────────────────────────── */}
          <div className={cardCls}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-goldtext" strokeWidth={1.25} aria-hidden />
                E-mails
              </h3>
              <GoldButton
                onClick={() => addToList("emails")}
                disabled={form.emails.length >= MAX_EMAILS}
                className={addBtn}
              >
                <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                Ajouter
              </GoldButton>
            </div>
            {form.emails.length === 0 ? (
              <p className="mt-3 text-sm text-mute">
                Aucune adresse — le site n&apos;affiche pas d&apos;e-mail pour l&apos;instant.
              </p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {form.emails.map((email, i) => (
                  <div key={`em-${i}`} className="flex items-center gap-2">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center">
                      <Mail className="h-4 w-4 text-goldtext" strokeWidth={1.25} />
                    </span>
                    <input
                      type="email"
                      className={inputCls}
                      value={email}
                      onChange={(e) => updateList("emails", i, e.target.value)}
                      placeholder="contact@einsof.gn"
                      aria-label={`E-mail ${i + 1}`}
                      maxLength={120}
                    />
                    <button
                      type="button"
                      onClick={() => removeFromList("emails", i)}
                      aria-label={`Supprimer l'e-mail ${i + 1}`}
                      className={deleteBtn}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Réseaux sociaux ────────────────────────────── */}
          <div className={cardCls}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium">Réseaux sociaux</h3>
              <GoldButton
                onClick={addSocial}
                disabled={form.socials.length >= MAX_SOCIALS}
                className={addBtn}
              >
                <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                Ajouter
              </GoldButton>
            </div>
            {form.socials.length === 0 ? (
              <p className="mt-3 text-sm text-mute">
                Aucun réseau — aucune rangée d&apos;icônes affichée sur le site.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {form.socials.map((social, i) => (
                  <div
                    key={`so-${i}`}
                    className="grid items-end gap-2 rounded-lg border border-line/60 bg-bg p-3 md:grid-cols-[150px_1fr_1.4fr_auto]"
                  >
                    <label className="grid gap-1.5">
                      <span className={labelCls}>Plateforme</span>
                      <Select
                        value={
                          SOCIAL_PLATFORMS.some((p) => p.value === social.platform)
                            ? social.platform
                            : "autre"
                        }
                        onValueChange={(v) => {
                          updateSocial(i, {
                            platform: v,
                            label:
                              social.label.trim() === "" ||
                              platformLabel(social.platform) === social.label
                                ? platformLabel(v)
                                : social.label,
                          });
                        }}
                      >
                        <SelectTrigger className="h-10! w-full rounded-lg border-line bg-surface px-3 text-sm">
                          <span>{platformLabel(social.platform)}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_PLATFORMS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="grid gap-1.5">
                      <span className={labelCls}>Libellé (accessibilité)</span>
                      <input
                        className={inputCls}
                        value={social.label}
                        onChange={(e) => updateSocial(i, { label: e.target.value })}
                        placeholder="Facebook EINSOF"
                        maxLength={60}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className={labelCls}>URL (https)</span>
                      <input
                        type="url"
                        className={inputCls}
                        value={social.url}
                        onChange={(e) => updateSocial(i, { url: e.target.value })}
                        placeholder="https://facebook.com/…"
                        maxLength={300}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSocial(i)}
                      aria-label={`Supprimer ${social.label || "ce réseau"}`}
                      className={deleteBtn}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Mot du gérant ──────────────────────────────── */}
          <div className={cardCls}>
            <h3 className="text-sm font-medium">Mot du gérant</h3>

            {/* Photo : aperçu + upload + URL manuelle */}
            <div className="mt-4 flex flex-wrap items-start gap-4">
              {form.managerPhotoUrl.trim() ? (
                <img
                  src={form.managerPhotoUrl}
                  alt={form.managerPhotoAlt || "Photo du gérant"}
                  className="h-20 w-20 shrink-0 rounded-full border border-gold/50 object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-surface2 font-serif text-2xl text-goldtext"
                >
                  E
                </span>
              )}
              <div className="grid min-w-0 flex-1 gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file);
                    }}
                    aria-label="Téléverser une photo du gérant"
                  />
                  <GoldButton
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className={addBtn}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Upload className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    )}
                    {uploading ? "Téléversement…" : "Téléverser une photo"}
                  </GoldButton>
                  {form.managerPhotoUrl.trim() && (
                    <GoldButton
                      variant="outline"
                      onClick={() => set("managerPhotoUrl", "")}
                      className={addBtn}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                      Retirer
                    </GoldButton>
                  )}
                </div>
                <label className="grid gap-1.5">
                  <span className={labelCls}>… ou URL de l&apos;image</span>
                  <input
                    type="url"
                    className={inputCls}
                    value={form.managerPhotoUrl}
                    onChange={(e) => set("managerPhotoUrl", e.target.value)}
                    placeholder="https://… ou /uploads/gerant.jpg"
                    maxLength={300}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className={labelCls}>Texte alternatif (accessibilité)</span>
                  <input
                    className={inputCls}
                    value={form.managerPhotoAlt}
                    onChange={(e) => set("managerPhotoAlt", e.target.value)}
                    placeholder="Portrait de …, fondateur d'EINSOF"
                    maxLength={200}
                  />
                </label>
              </div>
            </div>

            {/* Nom + rôle */}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className={labelCls}>Nom affiché</span>
                <input
                  className={inputCls}
                  value={form.managerName}
                  onChange={(e) => set("managerName", e.target.value)}
                  placeholder="Le Gérant (par défaut)"
                  maxLength={80}
                />
              </label>
              <label className="grid gap-1.5">
                <span className={labelCls}>Rôle affiché</span>
                <input
                  className={inputCls}
                  value={form.managerRole}
                  onChange={(e) => set("managerRole", e.target.value)}
                  placeholder="Fondateur & Gérant — EINSOF (par défaut)"
                  maxLength={120}
                />
              </label>
            </div>

            {/* Message */}
            <label className="mt-4 grid gap-1.5">
              <span className={labelCls}>Message (visible sur la page À propos)</span>
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm leading-relaxed focus:border-gold focus:outline-none"
                value={form.managerMessageFr}
                onChange={(e) => set("managerMessageFr", e.target.value.slice(0, MAX_MESSAGE))}
                rows={7}
              />
            </label>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-mute">
                Conseil : 2 paragraphes séparés par une ligne vide — la page affiche un
                guillemet décoratif entre les deux colonnes.
              </p>
              <p
                className={`text-xs tabular-nums ${
                  form.managerMessageFr.length > MAX_MESSAGE ? "text-destructive" : "text-mute"
                }`}
              >
                {form.managerMessageFr.length} / {MAX_MESSAGE}
              </p>
            </div>
          </div>

          {/* ── Enregistrer ────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <GoldButton onClick={save} disabled={busy} className="min-h-10! px-4! text-xs!">
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              )}
              Enregistrer les réglages
            </GoldButton>
          </div>
        </div>
      )}
    </section>
  );
}

export default SettingsPanel;
