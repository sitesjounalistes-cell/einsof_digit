"use client";

import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Documents / ressources — gestion complète (création, édition, publication, suppression).
 * Panneau autonome de l'Espace équipe ; câblage : <DocumentsPanel onUnauthorized={() => …} />
 * Visibilité : public (listé publiquement), lead (réservé aux prospects — jamais listé
 * publiquement ici), team (interne). Les liens doivent être réels (H-08).
 * Règle §20.4 : tant qu'aucun document public n'est publié, la section reste masquée. ── */

type Lang = "fr" | "en" | "es" | "zh" | "de";

interface DocumentRow {
  id: string;
  slug: string;
  title: Partial<Record<Lang, string>>;
  description: Partial<Record<Lang, string>>;
  category: string | null;
  fileUrl: string;
  fileKind: string | null;
  visibility: string;
  isPublished: boolean;
  sortOrder: number;
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

const FILE_KINDS: { value: string; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "xlsx", label: "Feuille de calcul (Excel)" },
  { value: "docx", label: "Document (Word)" },
  { value: "link", label: "Lien externe" },
];

const VISIBILITIES: { value: string; label: string }[] = [
  { value: "public", label: "Public (section ressources du site)" },
  { value: "lead", label: "Prospect (jamais listé publiquement)" },
  { value: "team", label: "Équipe (usage interne)" },
];

const VISIBILITY_LABEL: Record<string, string> = {
  public: "Public",
  lead: "Prospect",
  team: "Équipe",
};

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const emptyTexts = (): Record<Lang, string> => ({ fr: "", en: "", es: "", zh: "", de: "" });

interface FormState {
  slug: string;
  category: string;
  fileUrl: string;
  fileKind: string;
  visibility: string;
  sortOrder: string;
  isPublished: boolean;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
}

const emptyForm = (): FormState => ({
  slug: "",
  category: "",
  fileUrl: "",
  fileKind: "pdf",
  visibility: "public",
  sortOrder: "0",
  isPublished: false,
  title: emptyTexts(),
  description: emptyTexts(),
});

function slugify(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  );
}

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

const localePayload = (m: Record<Lang, string>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const l of LANG_TABS) {
    const v = m[l.id].trim();
    if (v) out[l.id] = v;
  }
  return out;
};

export function DocumentsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<DocumentRow[] | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /* Éditeur : null = liste seule ; id = null (création) ou id du document modifié. */
  const [editor, setEditor] = useState<{ id: string | null } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [lang, setLang] = useState<Lang>("fr");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const slugTouched = useRef(false);

  /* ── Liste ─────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/documents", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: DocumentRow[] };
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
  const togglePublished = async (row: DocumentRow) => {
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/documents", {
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
        setNotice(
          row.isPublished
            ? "Document masqué — il reste invisible du site public."
            : row.visibility === "public"
              ? "Document publié."
              : "Document publié, mais sa visibilité n'est pas « public » : il n'apparaît pas dans la section ressources."
        );
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
  const remove = async (row: DocumentRow) => {
    if (!window.confirm(`Supprimer définitivement « ${row.title.fr ?? row.slug} » ?`)) return;
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice("Document supprimé.");
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
    slugTouched.current = false;
    setLang("fr");
    setFormError(null);
    setNotice(null);
    setEditor({ id: null });
  };

  const openEdit = (row: DocumentRow) => {
    const title = emptyTexts();
    const description = emptyTexts();
    for (const l of LANG_TABS) {
      title[l.id] = row.title[l.id] ?? "";
      description[l.id] = row.description[l.id] ?? "";
    }
    setForm({
      slug: row.slug,
      category: row.category ?? "",
      fileUrl: row.fileUrl,
      fileKind: row.fileKind ?? "pdf",
      visibility: row.visibility,
      sortOrder: String(row.sortOrder),
      isPublished: row.isPublished,
      title,
      description,
    });
    slugTouched.current = true; /* le slug existant n'est pas écrasé par le titre */
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

    const frTitle = form.title.fr.trim();
    const slug = form.slug.trim();
    const fileUrl = form.fileUrl.trim();
    const category = form.category.trim();
    const sortOrder = form.sortOrder.trim() === "" ? 0 : Number(form.sortOrder);

    if (frTitle.length < 3 || frTitle.length > 200) {
      setFormError("Le titre en français est requis (3 à 200 caractères).");
      setLang("fr");
      return;
    }
    for (const l of LANG_TABS) {
      if (!l.optional) continue;
      const t = form.title[l.id].trim();
      const d = form.description[l.id].trim();
      if ((t && t.length < 3) || (d && d.length < 3)) {
        setFormError(`Traductions ${l.label.toLowerCase()} : 3 caractères minimum, ou vide.`);
        setLang(l.id);
        return;
      }
    }
    if (slug.length < 3 || slug.length > 80 || !SLUG_RE.test(slug)) {
      setFormError(
        "Le slug doit contenir 3 à 80 caractères : minuscules, chiffres et tirets uniquement (ex. guide-facturation)."
      );
      return;
    }
    if (!fileUrl || fileUrl.length > 500) {
      setFormError("Le lien du fichier est requis (1 à 500 caractères) : URL complète ou chemin.");
      return;
    }
    if (category.length > 40) {
      setFormError("La catégorie ne doit pas dépasser 40 caractères.");
      return;
    }
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 999) {
      setFormError("Ordre d'affichage : nombre entier entre 0 et 999.");
      return;
    }

    const payload: Record<string, unknown> = {
      slug,
      title: localePayload(form.title),
      description: localePayload(form.description),
      category,
      fileUrl,
      fileKind: form.fileKind,
      visibility: form.visibility,
      sortOrder,
      isPublished: form.isPublished,
    };
    if (editor.id !== null) payload.id = editor.id;

    setBusy(true);
    try {
      const res = await fetch("/api/admin/documents", {
        method: editor.id !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice(editor.id !== null ? "Document enregistré." : "Document créé.");
        setEditor(null);
        setReload((k) => k + 1);
        return;
      }
      if (res.status === 409) {
        setFormError("Ce slug est déjà utilisé par un autre document. Modifiez-le puis réenregistrez.");
        return;
      }
      if (res.status === 400) {
        setFormError(
          "Valeurs refusées. Vérifiez : titre 3 à 200 caractères par langue, slug valide, lien du fichier (1 à 500), catégorie 40 max."
        );
        return;
      }
      if (res.status === 404) {
        setFormError("Document introuvable — il a peut-être été supprimé entre-temps.");
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
    <section aria-labelledby="admin-documents-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-documents-t" className="font-serif text-xl">
          Ressources
        </h2>
        {editor === null && (
          <GoldButton onClick={openCreate} className="min-h-9! px-3! text-xs!">
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            Nouveau document
          </GoldButton>
        )}
      </div>
      <p className="mt-1 text-sm text-mute">
        Guides et documents en accès libre. Seuls les documents publiés de visibilité « public »
        alimentent la section du site ; les visibilités « prospect » et « équipe » ne sont jamais
        listées publiquement. Le lien du fichier doit être une URL réelle fournie par le client.
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
              {editor.id !== null ? "Modifier le document" : "Nouveau document"}
            </p>
            <GoldButton variant="outline" onClick={closeEditor} className="min-h-9! px-3! text-xs!">
              Retour à la liste
            </GoldButton>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className={labelCls}>Slug (adresse du document) *</span>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => {
                  slugTouched.current = true;
                  setForm((f) => ({ ...f, slug: e.target.value.toLowerCase() }));
                }}
                maxLength={80}
                placeholder="guide-facturation"
                aria-required="true"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Catégorie (optionnel)</span>
              <input
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                maxLength={40}
                placeholder="Guide, modèle, support…"
              />
            </label>
            <label className="grid gap-1.5 md:col-span-2">
              <span className={labelCls}>Lien du fichier * (URL réelle ou chemin)</span>
              <input
                className={inputCls}
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                maxLength={500}
                placeholder="https://… ou /documents/guide.pdf"
                aria-required="true"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Type de fichier</span>
              <Select value={form.fileKind} onValueChange={(v) => setForm((f) => ({ ...f, fileKind: v }))}>
                <SelectTrigger aria-label="Type de fichier" className="h-10 w-full bg-surface text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {FILE_KINDS.map((k) => (
                    <SelectItem key={k.value} value={k.value} className="text-sm">
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Visibilité</span>
              <Select
                value={form.visibility}
                onValueChange={(v) => setForm((f) => ({ ...f, visibility: v }))}
              >
                <SelectTrigger aria-label="Visibilité du document" className="h-10 w-full bg-surface text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {VISIBILITIES.map((v) => (
                    <SelectItem key={v.value} value={v.value} className="text-sm">
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <label className="mt-1 flex items-center gap-3 text-sm text-mute md:mt-6">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
                aria-label="Publier le document"
              />
              {editor.id !== null ? "Publié" : "Publier immédiatement"}
            </label>
          </div>

          <Tabs value={lang} onValueChange={(v) => setLang(v as Lang)} className="mt-5">
            <TabsList className="h-auto flex-wrap justify-start rounded-lg border border-line bg-transparent p-1">
              {LANG_TABS.map((l) => {
                const filled = form.title[l.id].trim() !== "" || form.description[l.id].trim() !== "";
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
              <TabsContent key={l.id} value={l.id} className="mt-4 grid gap-3">
                <label className="grid gap-1.5">
                  <span className={labelCls}>Titre{l.optional ? "" : " *"}</span>
                  <input
                    className={inputCls}
                    value={form.title[l.id]}
                    maxLength={200}
                    placeholder={
                      l.optional ? OPTIONAL_PLACEHOLDER : "Titre du document (ex. Guide de facturation)"
                    }
                    aria-required={l.optional ? undefined : "true"}
                    onChange={(e) =>
                      setForm((f) => {
                        const title = { ...f.title, [l.id]: e.target.value };
                        /* Création : le slug suit le titre français jusqu'à intervention manuelle. */
                        if (l.id === "fr" && editor.id === null && !slugTouched.current) {
                          return { ...f, title, slug: slugify(e.target.value) };
                        }
                        return { ...f, title };
                      })
                    }
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className={labelCls}>Description (optionnelle)</span>
                  <textarea
                    className={`${textareaCls} min-h-[72px]`}
                    value={form.description[l.id]}
                    maxLength={600}
                    placeholder={l.optional ? OPTIONAL_PLACEHOLDER : "Quelques mots sur le contenu"}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: { ...f.description, [l.id]: e.target.value } }))
                    }
                  />
                </label>
              </TabsContent>
            ))}
          </Tabs>

          {formError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {formError}
            </p>
          )}

          <div className="mt-4">
            <GoldButton type="submit" disabled={busy} className="min-h-10! px-4! text-xs!">
              <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              {editor.id !== null ? "Enregistrer les modifications" : "Créer le document"}
            </GoldButton>
          </div>
        </form>
      )}

      {/* Liste des documents */}
      <div className="mt-4 flex flex-col gap-3">
        {rows === null ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mute">{"Aucun document pour le moment."}</p>
        ) : (
          rows.map((d) => (
            <article
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{d.title.fr ?? d.slug}</p>
                <p className="mt-0.5 truncate text-xs text-mute">
                  /{d.slug}
                  {d.category ? ` · ${d.category}` : ""}
                  {` · ${VISIBILITY_LABEL[d.visibility] ?? d.visibility}`}
                  {` · ${d.fileKind ?? "fichier"}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-mute">
                  {d.isPublished
                    ? d.visibility === "public"
                      ? "Publié"
                      : "Publié (non public)"
                    : "Masqué"}
                </span>
                <Switch
                  checked={d.isPublished}
                  disabled={busyId === d.id}
                  onCheckedChange={() => void togglePublished(d)}
                  aria-label={`Publication — ${d.title.fr ?? d.slug}`}
                />
                <button
                  type="button"
                  onClick={() => openEdit(d)}
                  aria-label={`Modifier — ${d.title.fr ?? d.slug}`}
                  className={iconBtn}
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(d)}
                  disabled={busyId === d.id}
                  aria-label={`Supprimer — ${d.title.fr ?? d.slug}`}
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

export default DocumentsPanel;
