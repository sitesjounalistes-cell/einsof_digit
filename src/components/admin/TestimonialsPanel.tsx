"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ── Témoignages — gestion complète (création, édition, publication, suppression).
 * Panneau autonome de l'Espace équipe ; câblage : <TestimonialsPanel onUnauthorized={() => …} />
 * Citation traduisible (repli français automatique côté site) ; rating optionnel 1-5,
 * jamais inventé. Règle §20.4 : tant que rien n'est publié, la section reste masquée. ── */

type Lang = "fr" | "en" | "es" | "zh" | "de";

interface TestimonialRow {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  sector: string | null;
  quote: Partial<Record<Lang, string>>;
  rating: number | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
}

const LANG_TABS: { id: Lang; label: string; optional: boolean }[] = [
  { id: "fr", label: "Français", optional: false },
  { id: "en", label: "Anglais", optional: true },
  { id: "es", label: "Espagnol", optional: true },
  { id: "zh", label: "Chinois", optional: true },
  { id: "de", label: "Allemand", optional: true },
];

const OPTIONAL_PLACEHOLDER =
  "Laisser vide pour masquer cette langue — repli français automatique côté site";

const emptyTexts = (): Record<Lang, string> => ({ fr: "", en: "", es: "", zh: "", de: "" });

interface FormState {
  authorName: string;
  authorRole: string;
  company: string;
  sector: string;
  quote: Record<Lang, string>;
  rating: string;
  sortOrder: string;
  isPublished: boolean;
}

const emptyForm = (): FormState => ({
  authorName: "",
  authorRole: "",
  company: "",
  sector: "",
  quote: emptyTexts(),
  rating: "",
  sortOrder: "0",
  isPublished: false,
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
const tabsTriggerCls =
  "rounded-md px-4 py-1.5 text-xs uppercase tracking-[0.1em] text-mute data-[state=active]:bg-surface data-[state=active]:text-goldtext dark:data-[state=active]:bg-surface dark:data-[state=active]:text-goldtext";

const quotePayload = (m: Record<Lang, string>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const l of LANG_TABS) {
    const v = m[l.id].trim();
    if (v) out[l.id] = v;
  }
  return out;
};

export function TestimonialsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<TestimonialRow[] | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /* Éditeur : null = liste seule ; id = null (création) ou id du témoignage modifié. */
  const [editor, setEditor] = useState<{ id: string | null } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [lang, setLang] = useState<Lang>("fr");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* ── Liste ─────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/testimonials", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: TestimonialRow[] };
        if (!cancelled) setRows(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, reload]);

  /* ── Publication / masquage ────────────────────────────────── */
  const togglePublished = async (row: TestimonialRow) => {
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, isPublished: !row.isPublished }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setRows((r) =>
          r ? r.map((x) => (x.id === row.id ? { ...x, isPublished: !x.isPublished } : x)) : r
        );
        setNotice(row.isPublished ? "Témoignage masqué du site public." : "Témoignage publié.");
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
  const remove = async (row: TestimonialRow) => {
    if (!window.confirm(`Supprimer définitivement le témoignage de « ${row.authorName} » ?`)) return;
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice("Témoignage supprimé.");
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
    setLang("fr");
    setFormError(null);
    setNotice(null);
    setEditor({ id: null });
  };

  const openEdit = (row: TestimonialRow) => {
    const quote = emptyTexts();
    for (const l of LANG_TABS) quote[l.id] = row.quote[l.id] ?? "";
    setForm({
      authorName: row.authorName,
      authorRole: row.authorRole ?? "",
      company: row.company ?? "",
      sector: row.sector ?? "",
      quote,
      rating: row.rating != null ? String(row.rating) : "",
      sortOrder: String(row.sortOrder),
      isPublished: row.isPublished,
    });
    setLang("fr");
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

    const authorName = form.authorName.trim();
    const frQuote = form.quote.fr.trim();
    const rating = form.rating.trim();
    const sortOrder = form.sortOrder.trim() === "" ? 0 : Number(form.sortOrder);

    if (authorName.length < 2 || authorName.length > 120) {
      setFormError("Le nom de l'auteur est requis (2 à 120 caractères).");
      return;
    }
    if (frQuote.length < 10 || frQuote.length > 600) {
      setFormError("La citation en français est requise (10 à 600 caractères).");
      setLang("fr");
      return;
    }
    for (const l of LANG_TABS) {
      if (!l.optional) continue;
      const v = form.quote[l.id].trim();
      if (v && (v.length < 10 || v.length > 600)) {
        setFormError(`Traduction ${l.label.toLowerCase()} : 10 à 600 caractères, ou vide.`);
        setLang(l.id);
        return;
      }
    }
    if (rating && (!/^[1-5]$/.test(rating) || Number(rating) < 1 || Number(rating) > 5)) {
      setFormError("Note : nombre entier entre 1 et 5, ou vide si aucune note.");
      return;
    }
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 999) {
      setFormError("Ordre d'affichage : nombre entier entre 0 et 999.");
      return;
    }

    const payload: Record<string, unknown> = {
      authorName,
      authorRole: form.authorRole.trim(),
      company: form.company.trim(),
      sector: form.sector.trim(),
      quote: quotePayload(form.quote),
      rating: rating === "" ? null : Number(rating),
      sortOrder,
      isPublished: form.isPublished,
    };
    if (editor.id !== null) payload.id = editor.id;

    setBusy(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: editor.id !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice(editor.id !== null ? "Témoignage enregistré." : "Témoignage créé.");
        setEditor(null);
        setReload((k) => k + 1);
        return;
      }
      if (res.status === 400) {
        setFormError(
          "Valeurs refusées. Vérifiez : nom 2 à 120 caractères, citation 10 à 600 par langue, note entre 1 et 5."
        );
        return;
      }
      if (res.status === 404) {
        setFormError("Témoignage introuvable — il a peut-être été supprimé entre-temps.");
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
    <section aria-labelledby="admin-testimonials-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-testimonials-t" className="font-serif text-xl">
          Témoignages
        </h2>
        {editor === null && (
          <GoldButton onClick={openCreate} className="min-h-9! px-3! text-xs!">
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            Nouveau témoignage
          </GoldButton>
        )}
      </div>
      <p className="mt-1 text-sm text-mute">
        Publiez les retours de vos clients, avec leur accord. La note (1 à 5) et le secteur sont
        optionnels — aucune donnée n&apos;est inventée. Tant qu&apos;aucun témoignage n&apos;est
        publié, la section reste masquée sur le site.
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
              {editor.id !== null ? "Modifier le témoignage" : "Nouveau témoignage"}
            </p>
            <GoldButton variant="outline" onClick={closeEditor} className="min-h-9! px-3! text-xs!">
              Retour à la liste
            </GoldButton>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className={labelCls}>Nom de l&apos;auteur *</span>
              <input
                className={inputCls}
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                maxLength={120}
                placeholder="Prénom et nom"
                aria-required="true"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Fonction (optionnel)</span>
              <input
                className={inputCls}
                value={form.authorRole}
                onChange={(e) => setForm((f) => ({ ...f, authorRole: e.target.value }))}
                maxLength={120}
                placeholder="Directrice générale…"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Entreprise (optionnel)</span>
              <input
                className={inputCls}
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                maxLength={120}
                placeholder="Nom de l'entreprise"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Secteur (optionnel)</span>
              <input
                className={inputCls}
                value={form.sector}
                onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                maxLength={120}
                placeholder="Commerce, santé, éducation…"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Note (optionnel, 1 à 5)</span>
              <input
                className={inputCls}
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value.replace(/[^1-5]/g, "").slice(0, 1) }))
                }
                inputMode="numeric"
                placeholder="Laisser vide si aucune note"
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
          </div>

          <Tabs value={lang} onValueChange={(v) => setLang(v as Lang)} className="mt-5">
            <TabsList className="h-auto flex-wrap justify-start rounded-lg border border-line bg-transparent p-1">
              {LANG_TABS.map((l) => {
                const filled = form.quote[l.id].trim() !== "";
                return (
                  <TabsTrigger key={l.id} value={l.id} className={tabsTriggerCls}>
                    {l.label}
                    {l.optional ? "" : " *"}
                    {filled && <span aria-hidden className="ml-1 h-1.5 w-1.5 rounded-full bg-gold" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {LANG_TABS.map((l) => (
              <TabsContent key={l.id} value={l.id} className="mt-4">
                <label className="grid gap-1.5">
                  <span className={labelCls}>Citation{l.optional ? "" : " *"}</span>
                  <textarea
                    className={`${textareaCls} min-h-[120px]`}
                    value={form.quote[l.id]}
                    maxLength={600}
                    placeholder={
                      l.optional ? OPTIONAL_PLACEHOLDER : "Citation du client en français (10 à 600 caractères)"
                    }
                    aria-required={l.optional ? undefined : "true"}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, quote: { ...f.quote, [l.id]: e.target.value } }))
                    }
                  />
                </label>
              </TabsContent>
            ))}
          </Tabs>

          <label className="mt-4 flex items-center gap-3 text-sm text-mute">
            <Switch
              checked={form.isPublished}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
              aria-label="Publier le témoignage"
            />
            Publier (visible sur le site public)
          </label>

          {formError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {formError}
            </p>
          )}

          <div className="mt-4">
            <GoldButton type="submit" disabled={busy} className="min-h-10! px-4! text-xs!">
              <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              {editor.id !== null ? "Enregistrer les modifications" : "Créer le témoignage"}
            </GoldButton>
          </div>
        </form>
      )}

      {/* Liste des témoignages */}
      <div className="mt-4 flex flex-col gap-3">
        {rows === null ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mute">{"Aucun témoignage pour le moment."}</p>
        ) : (
          rows.map((r) => (
            <article
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">
                  {r.authorName}
                  {r.rating != null && (
                    <span className="ml-2 text-xs font-normal text-mute">{r.rating}/5</span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-xs text-mute">
                  {[r.authorRole, r.company, r.sector].filter(Boolean).join(" · ") || "—"}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-mute/80">
                  {r.quote.fr ?? Object.values(r.quote)[0] ?? ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-mute">{r.isPublished ? "Publié" : "Masqué"}</span>
                <Switch
                  checked={r.isPublished}
                  disabled={busyId === r.id}
                  onCheckedChange={() => void togglePublished(r)}
                  aria-label={`Publication — ${r.authorName}`}
                />
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  aria-label={`Modifier — ${r.authorName}`}
                  className={iconBtn}
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(r)}
                  disabled={busyId === r.id}
                  aria-label={`Supprimer — ${r.authorName}`}
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

export default TestimonialsPanel;
