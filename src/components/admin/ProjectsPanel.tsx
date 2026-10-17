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
  Check,
  ChevronDown,
  FolderOpen,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { GoldButton } from "@/components/site/kit";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Réalisations — gestion complète (création, édition dépliable de TOUS les
 * champs, upload d'image, catégorie via gestionnaire dédié, publication,
 * réordonnancement, suppression).
 * Panneau autonome de l'Espace équipe ; câblage : <ProjectsPanel onUnauthorized={() => …} />
 * L'image alimente l'aperçu du carrousel public (imageUrl ?? capture statique). ── */

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  sector: string | null;
  year: number;
  summary: string;
  description: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  isPublished: boolean;
  sortOrder: number;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  projectCount: number;
}

interface FormState {
  title: string;
  client: string;
  sector: string;
  year: string;
  summary: string;
  description: string;
  linkUrl: string;
  imageUrl: string;
  slug: string;
  sortOrder: string;
  categoryId: string;
  isPublished: boolean;
}

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 Mo (miroir de la validation serveur)

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";
const textareaCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-gold focus:outline-none";
const labelCls = "text-xs text-mute";
const iconBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";
const deleteBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40";

const emptyForm = (nextSort: number): FormState => ({
  title: "",
  client: "",
  sector: "",
  year: String(new Date().getFullYear()),
  summary: "",
  description: "",
  linkUrl: "",
  imageUrl: "",
  slug: "",
  sortOrder: String(nextSort),
  categoryId: "",
  isPublished: false,
});

const formFromRow = (r: ProjectRow): FormState => ({
  title: r.title,
  client: r.client ?? "",
  sector: r.sector ?? "",
  year: String(r.year),
  summary: r.summary,
  description: r.description ?? "",
  linkUrl: r.linkUrl ?? "",
  imageUrl: r.imageUrl ?? "",
  slug: r.slug,
  sortOrder: String(r.sortOrder),
  categoryId: r.categoryId ?? "",
  isPublished: r.isPublished,
});

const URL_RE = /^https?:\/\/\S+\.\S+/i;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validateForm(f: FormState, isEdit: boolean): string | null {
  if (f.title.trim().length < 2) {
    return "Le titre est requis (2 caractères minimum).";
  }
  if (f.summary.trim().length < 4) {
    return "Le résumé est requis (4 caractères minimum).";
  }
  const year = Number(f.year);
  if (!Number.isInteger(year) || year < 2015 || year > 2100) {
    return "Année invalide (entier entre 2015 et 2100).";
  }
  const url = f.linkUrl.trim();
  if (url && !URL_RE.test(url)) {
    return "Le lien doit être une adresse valide commençant par http(s):// — ou rester vide.";
  }
  const sort = Number(f.sortOrder);
  if (
    f.sortOrder.trim() !== "" &&
    (!Number.isInteger(sort) || sort < 0 || sort > 999)
  ) {
    return "Ordre d'affichage : nombre entier entre 0 et 999.";
  }
  if (isEdit) {
    const slug = f.slug.trim();
    if (slug && !SLUG_RE.test(slug)) {
      return "Slug invalide : minuscules, chiffres et tirets uniquement (ex : mon-projet).";
    }
  }
  return null;
}

/** Champs envoyés à l'API — les chaînes vides autorisent la remise à blanc. */
function payloadFrom(f: FormState): Record<string, unknown> {
  return {
    title: f.title.trim(),
    client: f.client.trim(),
    sector: f.sector.trim(),
    year: Number(f.year),
    summary: f.summary.trim(),
    description: f.description.trim(),
    linkUrl: f.linkUrl.trim(),
    imageUrl: f.imageUrl.trim(),
    categoryId: f.categoryId.trim(),
    isPublished: f.isPublished,
    sortOrder: f.sortOrder.trim() === "" ? 0 : Number(f.sortOrder),
  };
}

/* ── Champ image : aperçu miniature + upload (POST /api/admin/upload) ── */

function ImageField({
  value,
  setValues,
  uploading,
  uploadError,
  onPick,
  onClear,
}: {
  value: string;
  setValues: (updater: (f: FormState) => FormState) => void;
  uploading: boolean;
  uploadError: string | null;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-1.5 md:col-span-2">
      <span className={labelCls}>Image de la réalisation (capture d&apos;écran)</span>
      {value ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
            <Image
              src={value}
              alt="Aperçu de l'image de la réalisation"
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={onClear}
              disabled={uploading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
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
      {uploadError && (
        <p role="alert" className="text-xs text-destructive">
          {uploadError}
        </p>
      )}
    </div>
  );
}

/* ── Formulaire partagé : création (isEdit=false) / édition complète ── */

function ProjectForm({
  isEdit,
  initial,
  busy,
  error,
  categories,
  onSubmit,
  onCancel,
  onUnauthorized,
}: {
  isEdit: boolean;
  initial: FormState;
  busy: boolean;
  error: string | null;
  categories: CategoryRow[];
  onSubmit: (values: FormState) => void;
  onCancel: () => void;
  onUnauthorized: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setValues = (updater: (f: FormState) => FormState) =>
    setForm((f) => updater(f));

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
        const url = json.data.url;
        setValues((f) => ({ ...f, imageUrl: url }));
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
        <span className={labelCls}>Titre du projet *</span>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => setValues((f) => ({ ...f, title: e.target.value }))}
          maxLength={120}
          placeholder="Ex : Refonte du site de la banque XYZ"
          aria-required="true"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className={labelCls}>Année *</span>
          <input
            className={inputCls}
            value={form.year}
            onChange={(e) =>
              setValues((f) => ({ ...f, year: e.target.value.replace(/\D/g, "").slice(0, 4) }))
            }
            inputMode="numeric"
            placeholder={String(new Date().getFullYear())}
            aria-required="true"
          />
        </label>
        <label className="grid gap-1.5">
          <span className={labelCls}>Ordre d&apos;affichage</span>
          <input
            className={inputCls}
            value={form.sortOrder}
            onChange={(e) =>
              setValues((f) => ({
                ...f,
                sortOrder: e.target.value.replace(/\D/g, "").slice(0, 3),
              }))
            }
            inputMode="numeric"
            placeholder="0"
          />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className={labelCls}>Client (optionnel)</span>
        <input
          className={inputCls}
          value={form.client}
          onChange={(e) => setValues((f) => ({ ...f, client: e.target.value }))}
          maxLength={120}
          placeholder="Nom du client"
        />
      </label>
      <label className="grid gap-1.5">
        <span className={labelCls}>Secteur (optionnel)</span>
        <input
          className={inputCls}
          value={form.sector}
          onChange={(e) => setValues((f) => ({ ...f, sector: e.target.value }))}
          maxLength={60}
          placeholder="Ex : Logistique & transit"
        />
      </label>
      <label className="grid gap-1.5">
        <span className={labelCls}>Catégorie (optionnelle)</span>
        <Select
          value={form.categoryId === "" ? "__none__" : form.categoryId}
          onValueChange={(v) =>
            setValues((f) => ({ ...f, categoryId: v === "__none__" ? "" : v }))
          }
        >
          <SelectTrigger
            aria-label="Catégorie de la réalisation"
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none data-[placeholder]:text-ink"
          >
            <SelectValue placeholder="— Aucune —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Aucune —</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categories.length === 0 && (
          <span className="text-xs text-mute">
            Aucune catégorie — créez-en dans le gestionnaire ci-dessus.
          </span>
        )}
      </label>
      <label className="grid gap-1.5 md:col-span-2">
        <span className={labelCls}>Résumé affiché sur la carte *</span>
        <textarea
          className={`${textareaCls} min-h-[72px]`}
          value={form.summary}
          onChange={(e) => setValues((f) => ({ ...f, summary: e.target.value }))}
          maxLength={400}
          placeholder="Une ou deux phrases fidèles au projet."
          aria-required="true"
        />
      </label>
      <label className="grid gap-1.5 md:col-span-2">
        <span className={labelCls}>Description détaillée (optionnelle)</span>
        <textarea
          className={`${textareaCls} min-h-[96px]`}
          value={form.description}
          onChange={(e) => setValues((f) => ({ ...f, description: e.target.value }))}
          maxLength={2000}
          placeholder="Contexte, périmètre, résultats — visible en détail sur le site."
        />
      </label>
      <label className="grid gap-1.5">
        <span className={labelCls}>Lien du site livré (optionnel)</span>
        <input
          className={inputCls}
          value={form.linkUrl}
          onChange={(e) => setValues((f) => ({ ...f, linkUrl: e.target.value }))}
          maxLength={300}
          type="url"
          placeholder="https://www.exemple.com"
        />
      </label>
      {isEdit ? (
        <label className="grid gap-1.5">
          <span className={labelCls}>Slug (laisser vide pour conserver)</span>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) =>
              setValues((f) => ({
                ...f,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              }))
            }
            maxLength={80}
            placeholder="mon-projet"
          />
        </label>
      ) : (
        <p className="self-end text-xs text-mute">
          Le slug (adresse de la réalisation) est déduit automatiquement du titre.
        </p>
      )}

      <ImageField
        value={form.imageUrl}
        setValues={setValues}
        uploading={uploading}
        uploadError={uploadError}
        onPick={() => fileRef.current?.click()}
        onClear={() => setValues((f) => ({ ...f, imageUrl: "" }))}
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

      <label className="flex items-center gap-3 text-sm text-mute md:col-span-2">
        <Switch
          checked={form.isPublished}
          onCheckedChange={(v) => setValues((f) => ({ ...f, isPublished: v }))}
          aria-label="Publier la réalisation"
        />
        Publiée (visible sur le site public)
      </label>

      {error && (
        <p role="alert" className="text-sm text-destructive md:col-span-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <GoldButton type="submit" disabled={busy} className="min-h-10! px-4! text-xs!">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
          ) : (
            <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
          )}
          {isEdit ? "Enregistrer les modifications" : "Créer la réalisation"}
        </GoldButton>
        <GoldButton
          variant="outline"
          onClick={onCancel}
          className="min-h-10! px-4! text-xs!"
        >
          Fermer
        </GoldButton>
      </div>
    </form>
  );
}

/* ── Gestionnaire de catégories — repliable en haut du panel ── */

const catInputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";

function CategoryManager({
  categories,
  onUnauthorized,
  onChanged,
}: {
  categories: CategoryRow[];
  onUnauthorized: () => void;
  /** Appelé après toute écriture réussie (rechargement catégories + projets). */
  onChanged: (message?: string) => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameFr = name.trim();
    if (nameFr.length < 2) {
      setError("Le nom de la catégorie doit contenir au moins 2 caractères.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/portfolio-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameFr }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setName("");
        onChanged(`Catégorie « ${nameFr} » créée.`);
      } else {
        setError("Création impossible — vérifiez le nom (2 à 80 caractères).");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  const patchCat = async (id: string, body: Record<string, unknown>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/portfolio-categories", {
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

  const submitRename = async (cat: CategoryRow) => {
    const nameFr = renameValue.trim();
    if (nameFr.length < 2 || nameFr.length > 80) {
      setError("Le nom de la catégorie doit contenir 2 à 80 caractères.");
      return;
    }
    setBusyId(cat.id);
    setError(null);
    const ok = await patchCat(cat.id, { nameFr });
    if (ok) {
      setRenamingId(null);
      onChanged("Catégorie renommée.");
    } else {
      setError("Renommage impossible. Réessayez.");
    }
    setBusyId(null);
  };

  const move = async (cat: CategoryRow, dir: -1 | 1) => {
    if (busyId) return;
    const idx = categories.findIndex((c) => c.id === cat.id);
    const other = categories[idx + dir];
    if (idx < 0 || !other) return;
    setBusyId(cat.id);
    setError(null);
    let catTarget = other.sortOrder;
    let otherTarget = cat.sortOrder;
    if (catTarget === otherTarget) {
      if (dir === -1) {
        if (other.sortOrder === 0) {
          catTarget = 0;
          otherTarget = 1;
        } else {
          catTarget = other.sortOrder - 1;
          otherTarget = other.sortOrder;
        }
      } else {
        catTarget = cat.sortOrder + 1;
        otherTarget = cat.sortOrder;
      }
    }
    const first = await patchCat(cat.id, { sortOrder: catTarget });
    const second = first ? await patchCat(other.id, { sortOrder: otherTarget }) : false;
    if (first && second) {
      onChanged();
    } else if (first) {
      onChanged("Ordre partiellement mis à jour — rechargez et réessayez.");
    } else {
      setError("Réordonnancement impossible. Réessayez.");
    }
    setBusyId(null);
  };

  const remove = async (cat: CategoryRow) => {
    if (
      !window.confirm(
        cat.projectCount > 0
          ? `Supprimer « ${cat.name} » ? ${cat.projectCount} projet(s) seront détachés (pas supprimés).`
          : `Supprimer « ${cat.name} » ?`
      )
    ) {
      return;
    }
    setBusyId(cat.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/portfolio-categories?id=${encodeURIComponent(cat.id)}`,
        { method: "DELETE" }
      );
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json().catch(() => null)) as {
        ok: boolean;
        data?: { detached: number };
      } | null;
      if (res.ok && json?.ok) {
        const detached = json.data?.detached ?? 0;
        if (detached > 0) {
          toast.success(
            `Catégorie supprimée — ${detached} projet${detached > 1 ? "s" : ""} détaché${detached > 1 ? "s" : ""}.`
          );
        } else {
          toast.success("Catégorie supprimée.");
        }
        onChanged();
      } else if (res.status === 404) {
        toast.success("Catégorie déjà supprimée.");
        onChanged();
      } else {
        setError("Suppression impossible. Réessayez.");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <form onSubmit={create} className="flex flex-wrap items-end gap-2">
        <label className="grid min-w-0 flex-1 gap-1.5">
          <span className="text-xs text-mute">Nouvelle catégorie</span>
          <input
            className={catInputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Ex : Site vitrine, Boutique en ligne, Application mobile…"
            aria-label="Nom de la nouvelle catégorie"
          />
        </label>
        <GoldButton type="submit" disabled={busy} className="min-h-10! px-3! text-xs!">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
          )}
          Créer
        </GoldButton>
      </form>

      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="mt-3 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
        {categories.length === 0 ? (
          <p className="py-2 text-center text-xs text-mute">
            Aucune catégorie — créez la première ci-dessus (ex : Site vitrine).
          </p>
        ) : (
          categories.map((c, i) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-bg px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                {renamingId === c.id ? (
                  <>
                    <input
                      className={catInputCls}
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      maxLength={80}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void submitRename(c);
                        }
                      }}
                      aria-label={`Nouveau nom de ${c.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => void submitRename(c)}
                      disabled={busyId === c.id}
                      aria-label={`Valider le renommage de ${c.name}`}
                      className={iconBtn}
                    >
                      <Check className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(null);
                        setError(null);
                      }}
                      aria-label="Annuler le renommage"
                      className={deleteBtn}
                    >
                      <X className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="truncate text-sm">{c.name}</span>
                    <Badge variant="outline" className="shrink-0 text-[0.65rem] text-mute">
                      {c.projectCount} projet{c.projectCount > 1 ? "s" : ""}
                    </Badge>
                  </>
                )}
              </div>
              {renamingId !== c.id && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => void move(c, -1)}
                    disabled={i === 0 || busyId !== null}
                    aria-label={`Monter la catégorie — ${c.name}`}
                    className={iconBtn}
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(c, 1)}
                    disabled={i === categories.length - 1 || busyId !== null}
                    aria-label={`Descendre la catégorie — ${c.name}`}
                    className={iconBtn}
                  >
                    <ArrowDown className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRenameValue(c.name);
                      setError(null);
                      setRenamingId(c.id);
                    }}
                    aria-label={`Renommer — ${c.name}`}
                    className={iconBtn}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(c)}
                    disabled={busyId === c.id}
                    aria-label={`Supprimer — ${c.name}`}
                    className={deleteBtn}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Panneau principal ───────────────────────────────────────── */

export function ProjectsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /* Catégories (gestionnaire + select du formulaire) */
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [catsReload, setCatsReload] = useState(0);
  const [catsOpen, setCatsOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /* ── Liste complète (publiés + brouillons) ─────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/projects", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: ProjectRow[] };
        if (!cancelled) setRows(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, reload]);

  /* ── Catégories ───────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/portfolio-categories", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: CategoryRow[] };
        if (!cancelled) setCategories(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, catsReload]);

  /** PATCH brut (retourne true si succès). */
  const patchRaw = async (id: string, body: Record<string, unknown>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/projects", {
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

  const openCreate = () => {
    const maxSort = rows?.reduce((m, r) => Math.max(m, r.sortOrder), 0) ?? 0;
    setCreateError(null);
    setNotice(null);
    setCreateOpen(true);
    return emptyForm(maxSort + 1);
  };

  const submitCreate = async (values: FormState) => {
    setCreateError(null);
    const invalid = validateForm(values, false);
    if (invalid) {
      setCreateError(invalid);
      return;
    }
    setCreateBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/projects", {
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
        setNotice("Réalisation créée.");
        setReload((k) => k + 1);
      } else if (res.status === 400) {
        setCreateError("Valeurs refusées — vérifiez le titre, le résumé, l'année et le lien.");
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
    const invalid = validateForm(values, true);
    if (invalid) {
      setEditError(invalid);
      return;
    }
    setEditBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, slug: values.slug.trim(), ...payloadFrom(values) }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setEditingId(null);
        setNotice("Modifications enregistrées.");
        setReload((k) => k + 1);
      } else if (res.status === 400) {
        setEditError("Valeurs refusées — vérifiez le titre, le résumé, l'année, le lien et le slug.");
      } else if (res.status === 404) {
        setEditError("Réalisation introuvable — elle a peut-être été supprimée entre-temps.");
      } else {
        setEditError("Enregistrement impossible. Réessayez.");
      }
    } catch {
      setEditError("Erreur réseau. Réessayez.");
    } finally {
      setEditBusy(false);
    }
  };

  const togglePublish = async (row: ProjectRow) => {
    setBusyId(row.id);
    setNotice(null);
    const ok = await patchRaw(row.id, { isPublished: !row.isPublished });
    if (ok) {
      setRows((r) =>
        r ? r.map((x) => (x.id === row.id ? { ...x, isPublished: !x.isPublished } : x)) : r
      );
      setNotice(
        row.isPublished
          ? "Réalisation dépubliée — la section publique retombe sur les travaux statiques si nécessaire."
          : "Réalisation publiée."
      );
    } else {
      setNotice("Modification impossible. Réessayez.");
    }
    setBusyId(null);
  };

  /** Réordonnancement : échange l'ordre avec la voisine (↑ / ↓). */
  const move = async (row: ProjectRow, dir: -1 | 1) => {
    if (!rows || busyId) return;
    const idx = rows.findIndex((r) => r.id === row.id);
    const other = rows[idx + dir];
    if (idx < 0 || !other) return;
    setBusyId(row.id);
    setNotice(null);

    /* Ordres égaux (base fraîchement importée) : on force un écart. */
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

  const remove = async (row: ProjectRow) => {
    if (!window.confirm(`Supprimer définitivement « ${row.title} » ?`)) return;
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice("Réalisation supprimée.");
        setReload((k) => k + 1);
      } else if (res.status === 404) {
        setNotice("Réalisation déjà supprimée.");
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
    <section aria-labelledby="admin-projects-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-projects-t" className="font-serif text-xl">
          Réalisations
        </h2>
        {!createOpen && (
          <GoldButton onClick={openCreate} className="min-h-9! px-3! text-xs!">
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            Nouvelle réalisation
          </GoldButton>
        )}
      </div>
      <p className="mt-1 text-sm text-mute">
        Les réalisations publiées alimentent le carrousel public des travaux (avec leur image).
        Tant qu&apos;aucune n&apos;est publiée, le site retombe sur les travaux statiques.
      </p>

      {/* Gestionnaire de catégories (repliable) */}
      <div className="mt-4 rounded-lg border border-line bg-surface">
        <button
          type="button"
          onClick={() => setCatsOpen((o) => !o)}
          aria-expanded={catsOpen}
          className="flex w-full items-center justify-between gap-3 p-4 text-left"
        >
          <span className="flex items-center gap-2 font-medium">
            <FolderOpen className="h-4 w-4 text-goldtext" strokeWidth={1.25} aria-hidden />
            Catégories des réalisations
            {categories && (
              <span className="text-xs font-normal text-mute">({categories.length})</span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-mute transition-transform ${catsOpen ? "rotate-180" : ""}`}
            strokeWidth={1.25}
            aria-hidden
          />
        </button>
        {catsOpen && categories !== null && (
          <div className="border-t border-line p-4">
            <CategoryManager
              categories={categories}
              onUnauthorized={onUnauthorized}
              onChanged={(message) => {
                setCatsReload((k) => k + 1);
                setReload((k) => k + 1); /* les badges/noms des projets peuvent changer */
                if (message) setNotice(message);
              }}
            />
          </div>
        )}
      </div>

      {notice && (
        <p role="status" className="mt-3 text-sm text-mute">
          {notice}
        </p>
      )}

      {/* Formulaire de création */}
      {createOpen && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-4 md:p-5">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-mute">
            Nouvelle réalisation
          </p>
          <ProjectForm
            isEdit={false}
            initial={emptyForm((rows?.reduce((m, r) => Math.max(m, r.sortOrder), 0) ?? 0) + 1)}
            busy={createBusy}
            error={createError}
            categories={categories ?? []}
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
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mute">
            Aucune réalisation pour le moment — créez la première.
          </p>
        ) : (
          rows.map((p, i) => (
            <article
              key={p.id}
              className="rounded-lg border border-line bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {p.imageUrl ? (
                    <span className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border border-line bg-bg">
                      <Image
                        src={p.imageUrl}
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
                      className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md border border-line bg-bg font-serif text-lg text-goldtext"
                    >
                      {p.title.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      <span className="truncate">{p.title}</span>
                      {p.isPublished ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-gold/40 bg-gold/10 text-[0.65rem] text-goldtext"
                        >
                          Publiée
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 text-[0.65rem] text-mute">
                          Brouillon
                        </Badge>
                      )}
                      {p.categoryName && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-line text-[0.65rem] text-mute"
                        >
                          {p.categoryName}
                        </Badge>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-mute">
                      {[p.year, p.client, p.sector, p.slug].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-mute lg:inline">ordre {p.sortOrder}</span>
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
                  <ProjectForm
                    isEdit
                    initial={formFromRow(p)}
                    busy={editBusy}
                    error={editError}
                    categories={categories ?? []}
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

export default ProjectsPanel;
