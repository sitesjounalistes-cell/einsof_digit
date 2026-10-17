"use client";

import React, { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, Megaphone, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAds, type PostAd } from "@/lib/post-ads";
import { parseYouTubeId, youTubeThumbUrl } from "@/lib/youtube";

/* ── Journal — rédaction complète (création, édition, publication, suppression).
 * Panneau autonome de l'Espace équipe ; câblage : <PostsPanel onUnauthorized={() => …} />
 * Le corps est saisi un paragraphe par ligne puis envoyé en tableau ; l'API le
 * sérialise au format du seed : {"fr":"p1\n\np2","en":"…"} (repli fr côté site). ── */

type Lang = "fr" | "en" | "es" | "zh" | "de";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  readingMin: number;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface PostDetail {
  id: string;
  slug: string;
  title: Partial<Record<Lang, string>>;
  excerpt: Partial<Record<Lang, string>>;
  body: Partial<Record<Lang, string>>;
  category: string;
  readingMin: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  ads: PostAd[];
  coverImageUrl: string | null;
  isFeatured: boolean;
  videoUrl: string | null;
}

const LANGS: { id: Lang; label: string; optional: boolean }[] = [
  { id: "fr", label: "Français", optional: false },
  { id: "en", label: "Anglais", optional: true },
  { id: "es", label: "Espagnol", optional: true },
  { id: "zh", label: "Chinois", optional: true },
  { id: "de", label: "Allemand", optional: true },
];

const OPTIONAL_PLACEHOLDER =
  "Laisser vide pour masquer cette langue — repli français automatique côté site";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

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

/** Couleur du compteur de caractères : discret jusqu'à l'idéal, or au-delà,
 * rouge passé la zone raisonnable (alerte visuelle, blocage uniquement à maxLength). */
const counterCls = (len: number, ideal: number): string => {
  if (len <= ideal) return "text-mute";
  if (len <= ideal + 20) return "text-goldtext";
  return "text-destructive";
};

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });
const fmtDate = (iso: string): string => {
  try {
    return DATE_FMT.format(new Date(iso));
  } catch {
    return iso;
  }
};

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

const emptyTexts = (): Record<Lang, string> => ({ fr: "", en: "", es: "", zh: "", de: "" });

interface FormState {
  slug: string;
  category: string;
  readingMin: string;
  isPublished: boolean;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  body: Record<Lang, string>;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ads: AdForm[];
  /* Éditorial enrichi (DASH-5) */
  coverImageUrl: string;
  isFeatured: boolean;
  videoUrl: string;
}

/** Espace publicitaire en cours d'édition — position gardée en chaîne pour
 * la saisie (0 = tout à la fin d'article), convertie à l'enregistrement. */
interface AdForm {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  linkUrl: string;
  ctaLabel: string;
  position: string;
  isActive: boolean;
}

const newAdId = (): string => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* repli ci-dessous */
  }
  return `ad-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const emptyAd = (): AdForm => ({
  id: newAdId(),
  title: "",
  text: "",
  imageUrl: "",
  linkUrl: "",
  ctaLabel: "",
  position: "1",
  isActive: true,
});

const MAX_ADS = 10;

const emptyForm = (): FormState => ({
  slug: "",
  category: "agence",
  readingMin: "",
  isPublished: false,
  title: emptyTexts(),
  excerpt: emptyTexts(),
  body: emptyTexts(),
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ads: [],
  coverImageUrl: "",
  isFeatured: false,
  videoUrl: "",
});

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 Mo (miroir de la validation serveur)

/** Corps : un paragraphe par ligne -> tableau de paragraphes (normalisé \n\n par l'API). */
const toParagraphs = (v: string): string[] =>
  v
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const textPayload = (m: Record<Lang, string>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const l of LANGS) {
    const v = m[l.id].trim();
    if (v) out[l.id] = v;
  }
  return out;
};

const bodyPayload = (m: Record<Lang, string>): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const l of LANGS) {
    const ps = toParagraphs(m[l.id]);
    if (ps.length) out[l.id] = ps;
  }
  return out;
};

export function PostsPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<PostRow[] | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /* Éditeur : null = liste seule ; id = null (création) ou id de l'article modifié. */
  const [editor, setEditor] = useState<{ id: string | null; publishedAt: string | null } | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [lang, setLang] = useState<Lang>("fr");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const slugTouched = useRef(false);

  /* Upload de l'image de couverture (pattern ProjectsPanel) */
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  const uploadCover = async (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      setCoverUploadError("Image trop lourde — 6 Mo maximum.");
      return;
    }
    setCoverUploading(true);
    setCoverUploadError(null);
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
        setForm((f) => ({ ...f, coverImageUrl: json.data!.url }));
      } else {
        const code = json?.error?.code;
        setCoverUploadError(
          code === "too_large"
            ? "Image trop lourde — 6 Mo maximum."
            : code === "bad_type"
              ? "Format non reconnu — JPEG, PNG, WebP, AVIF ou GIF attendu."
              : "Envoi impossible. Réessayez."
        );
      }
    } catch {
      setCoverUploadError("Erreur réseau. Réessayez.");
    } finally {
      setCoverUploading(false);
    }
  };

  const onCoverFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; /* permet de re-choisir le même fichier */
    if (file) void uploadCover(file);
  };

  /* ── Liste ─────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/posts")
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: PostRow[] };
        if (!cancelled) setRows(json.ok && json.data ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized, reload]);

  /* ── Publication / masquage (contrat historique PATCH) ─────── */
  const toggle = async (row: PostRow) => {
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PATCH",
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
        setNotice(row.isPublished ? "Article masqué du site public." : "Article publié.");
      } else {
        setNotice("Publication impossible. Réessayez.");
      }
    } catch {
      setNotice("Erreur réseau. Réessayez.");
    } finally {
      setBusyId(null);
    }
  };

  /* ── Suppression définitive ────────────────────────────────── */
  const remove = async (row: PostRow) => {
    if (!window.confirm(`Supprimer définitivement « ${row.title} » ?`)) return;
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/posts?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setNotice("Article supprimé.");
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

  /* ── Ouverture de l'éditeur ────────────────────────────────── */
  const openCreate = () => {
    setForm(emptyForm());
    slugTouched.current = false;
    setLang("fr");
    setFormError(null);
    setNotice(null);
    setEditor({ id: null, publishedAt: null });
  };

  const closeEditor = () => {
    setEditor(null);
    setFormError(null);
  };

  const openEdit = async (row: PostRow) => {
    setFormError(null);
    setNotice(null);
    setLang("fr");
    setEditor({ id: row.id, publishedAt: null });
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/posts?id=${encodeURIComponent(row.id)}`);
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as { ok: boolean; data?: PostDetail };
      const p = json.ok ? json.data : undefined;
      if (!p) {
        setEditor(null);
        setNotice("Impossible de charger l'article. Réessayez.");
        return;
      }
      const pick = (map: Partial<Record<Lang, string>>): Record<Lang, string> => {
        const out = emptyTexts();
        for (const l of LANGS) out[l.id] = map[l.id] ?? "";
        return out;
      };
      const toLines = (v: string): string => v.split("\n\n").join("\n");
      setForm({
        slug: p.slug,
        category: p.category,
        readingMin: String(p.readingMin ?? ""),
        isPublished: p.isPublished,
        title: pick(p.title),
        excerpt: pick(p.excerpt),
        body: pick({
          fr: toLines(p.body.fr ?? ""),
          en: toLines(p.body.en ?? ""),
          es: toLines(p.body.es ?? ""),
          zh: toLines(p.body.zh ?? ""),
          de: toLines(p.body.de ?? ""),
        }),
        metaTitle: p.metaTitle ?? "",
        metaDescription: p.metaDescription ?? "",
        keywords: p.keywords ?? "",
        coverImageUrl: p.coverImageUrl ?? "",
        isFeatured: p.isFeatured,
        videoUrl: p.videoUrl ?? "",
        ads: parseAds(JSON.stringify(p.ads ?? [])).map((a) => ({
          id: a.id,
          title: a.title ?? "",
          text: a.text ?? "",
          imageUrl: a.imageUrl ?? "",
          linkUrl: a.linkUrl ?? "",
          ctaLabel: a.ctaLabel ?? "",
          position: String(a.position),
          isActive: a.isActive,
        })),
      });
      slugTouched.current = true; /* le slug existant n'est pas écrasé par le titre */
      setEditor({ id: p.id, publishedAt: p.publishedAt });
    } catch {
      setEditor(null);
      setNotice("Erreur réseau. Réessayez.");
    } finally {
      setLoadingDetail(false);
    }
  };

  /* ── Espaces publicitaires : édition locale ────────────────── */
  const updateAd = (index: number, patch: Partial<AdForm>) =>
    setForm((f) => ({
      ...f,
      ads: f.ads.map((a, k) => (k === index ? { ...a, ...patch } : a)),
    }));
  const removeAd = (index: number) =>
    setForm((f) => ({ ...f, ads: f.ads.filter((_, k) => k !== index) }));

  /* ── Enregistrement (POST création / PUT mise à jour) ──────── */
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy || editor === null) return;
    setFormError(null);

    const frTitle = form.title.fr.trim();
    const frExcerpt = form.excerpt.fr.trim();
    const frBody = form.body.fr.trim();
    const slug = form.slug.trim();
    const category = form.category.trim();
    const readingMin = form.readingMin.trim();

    if (frTitle.length < 3) {
      setFormError("Le titre en français est requis (3 caractères minimum).");
      setLang("fr");
      return;
    }
    if (frExcerpt.length < 20) {
      setFormError("L'extrait en français est requis (20 caractères minimum).");
      setLang("fr");
      return;
    }
    if (frBody.length < 100) {
      setFormError("Le corps de l'article en français est requis (100 caractères minimum).");
      setLang("fr");
      return;
    }
    if (slug.length < 3 || slug.length > 80 || !SLUG_RE.test(slug)) {
      setFormError(
        "Le slug doit contenir 3 à 80 caractères : minuscules, chiffres et tirets uniquement (ex. mon-article)."
      );
      return;
    }
    if (category.length < 2 || category.length > 40) {
      setFormError("La catégorie doit contenir entre 2 et 40 caractères.");
      return;
    }
    if (readingMin && (!/^\d+$/.test(readingMin) || Number(readingMin) < 1 || Number(readingMin) > 60)) {
      setFormError(
        "Temps de lecture : nombre entier entre 1 et 60 — laissez vide pour l'estimation automatique."
      );
      return;
    }

    /* Éditorial enrichi : vidéo YouTube valide si renseignée. */
    const videoUrl = form.videoUrl.trim();
    if (videoUrl && parseYouTubeId(videoUrl) === null) {
      setFormError(
        "Lien vidéo invalide — collez une URL YouTube (youtube.com/watch?v=…, youtu.be/…, shorts/…)."
      );
      return;
    }
    const coverUrl = form.coverImageUrl.trim();
    if (coverUrl && !coverUrl.startsWith("/") && !/^https:\/\//.test(coverUrl)) {
      setFormError(
        "L'image de couverture doit être une URL https:// ou un chemin interne commençant par /."
      );
      return;
    }

    /* Espaces publicitaires : validations miroir de l'API (retours immédiats). */
    if (form.ads.length > MAX_ADS) {
      setFormError(`Maximum ${MAX_ADS} espaces publicitaires par article.`);
      return;
    }
    for (let i = 0; i < form.ads.length; i++) {
      const ad = form.ads[i];
      const n = i + 1;
      const link = ad.linkUrl.trim();
      if (link && !/^https:\/\//.test(link)) {
        setFormError(
          `Espace ${n} : le lien de clic doit commencer par https:// (ou rester vide pour un bloc non cliquable).`
        );
        return;
      }
      const img = ad.imageUrl.trim();
      if (img && !img.startsWith("/") && !/^https:\/\//.test(img)) {
        setFormError(
          `Espace ${n} : l'image doit être une URL https:// ou un chemin interne commençant par /.`
        );
        return;
      }
      const pos = ad.position.trim();
      if (pos && (!/^\d+$/.test(pos) || Number(pos) > 999)) {
        setFormError(`Espace ${n} : la position doit être un nombre entier entre 0 et 999.`);
        return;
      }
    }

    const payload: Record<string, unknown> = {
      slug,
      category,
      title: textPayload(form.title),
      excerpt: textPayload(form.excerpt),
      body: bodyPayload(form.body),
      isPublished: form.isPublished,
      /* Chaîne vide = retour au repli automatique côté site (null en base). */
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      keywords: form.keywords.trim(),
      coverImageUrl: form.coverImageUrl.trim(),
      isFeatured: form.isFeatured,
      videoUrl: form.videoUrl.trim(),
      ads: form.ads.map((a) => ({
        id: a.id,
        title: a.title.trim() || undefined,
        text: a.text.trim() || undefined,
        imageUrl: a.imageUrl.trim() || undefined,
        linkUrl: a.linkUrl.trim() || undefined,
        ctaLabel: a.ctaLabel.trim() || undefined,
        position: Math.max(0, Math.floor(Number(a.position.trim() || "0")) || 0),
        isActive: a.isActive,
      })),
    };
    if (readingMin) payload.readingMin = Number(readingMin);
    if (editor.id !== null) {
      payload.id = editor.id;
      if (editor.publishedAt) payload.publishedAt = editor.publishedAt;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: editor.id !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        toast.success(editor.id !== null ? "Article enregistré — SEO et espaces mis à jour." : "Article créé.");
        setNotice(editor.id !== null ? "Article enregistré." : "Article créé.");
        setEditor(null);
        setReload((k) => k + 1);
        return;
      }
      if (res.status === 409) {
        setFormError("Ce slug est déjà utilisé par un autre article. Modifiez-le puis réenregistrez.");
        return;
      }
      if (res.status === 400) {
        setFormError(
          "Valeurs refusées. Vérifiez : titre 3 à 200 caractères, extrait 20 à 400 et texte 100 à 20 000 en français ; traductions 3 caractères minimum ; catégorie 2 à 40 ; vidéo — lien YouTube valide ; espaces publicitaires — maximum 10, lien https et position entière ≥ 0."
        );
        return;
      }
      if (res.status === 404) {
        setFormError("Article introuvable — il a peut-être été supprimé entre-temps.");
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
    <section aria-labelledby="admin-posts-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-posts-t" className="font-serif text-xl">
          Journal
        </h2>
        {editor === null && (
          <GoldButton onClick={openCreate} className="min-h-9! px-3! text-xs!">
            <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            Nouvel article
          </GoldButton>
        )}
      </div>
      <p className="mt-1 text-sm text-mute">
        Rédigez, traduisez, publiez ou masquez les articles du Journal public. Les langues
        optionnelles restent vides : le site affiche alors automatiquement la version française.
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
              {editor.id !== null ? "Modifier l'article" : "Nouvel article"}
            </p>
            <GoldButton variant="outline" onClick={closeEditor} className="min-h-9! px-3! text-xs!">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.25} aria-hidden />
              Retour à la liste
            </GoldButton>
          </div>

          {loadingDetail ? (
            <div className="mt-4 flex flex-col gap-3">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className={labelCls}>Slug (adresse de l&apos;article) *</span>
                  <input
                    className={inputCls}
                    value={form.slug}
                    onChange={(e) => {
                      slugTouched.current = true;
                      setForm((f) => ({ ...f, slug: e.target.value.toLowerCase() }));
                    }}
                    maxLength={80}
                    placeholder="mon-article"
                    aria-required="true"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className={labelCls}>Catégorie *</span>
                  <input
                    className={inputCls}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    maxLength={40}
                    placeholder="web, saas, agence…"
                    aria-required="true"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className={labelCls}>Temps de lecture (minutes, optionnel)</span>
                  <input
                    className={inputCls}
                    value={form.readingMin}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, readingMin: e.target.value.replace(/\D/g, "").slice(0, 2) }))
                    }
                    inputMode="numeric"
                    placeholder="Auto (mots divisés par 200)"
                  />
                </label>
                <label className="mt-1 flex items-center gap-3 text-sm text-mute md:mt-6">
                  <Switch
                    checked={form.isPublished}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
                    aria-label="Publier l'article"
                  />
                  {editor.id !== null ? "Publié" : "Publier immédiatement"}
                </label>
              </div>

              {/* Couverture, mise en avant & vidéo (DASH-5) */}
              <section
                aria-labelledby="admin-posts-media-t"
                className="mt-6 rounded-lg border border-line bg-bg p-4 md:p-5"
              >
                <h3 id="admin-posts-media-t" className="text-xs uppercase tracking-[0.14em] text-goldtext">
                  Couverture, mise en avant &amp; vidéo
                </h3>
                <p className="mt-1 text-xs text-mute">
                  L&apos;image de couverture illustre l&apos;article dans le Journal, « À la une » le
                  place en tête, et la vidéo YouTube est intégrée à l&apos;article.
                </p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {/* Image de couverture : upload + aperçu + URL manuelle */}
                  <div className="grid content-start gap-1.5">
                    <span className={labelCls}>Image de couverture (optionnelle)</span>
                    {form.coverImageUrl ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
                          <Image
                            src={form.coverImageUrl}
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
                            onClick={() => coverFileRef.current?.click()}
                            disabled={coverUploading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {coverUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.25} aria-hidden />
                            ) : (
                              <ImagePlus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                            )}
                            Remplacer
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, coverImageUrl: "" }))}
                            disabled={coverUploading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-mute transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => coverFileRef.current?.click()}
                        disabled={coverUploading}
                        className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm text-mute transition-colors hover:border-gold/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {coverUploading ? (
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
                      value={form.coverImageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
                      maxLength={600}
                      placeholder="…ou collez une URL d'image (https://… ou /uploads/…)"
                      aria-label="URL de l'image de couverture"
                    />
                    {coverUploadError && (
                      <p role="alert" className="text-xs text-destructive">
                        {coverUploadError}
                      </p>
                    )}
                  </div>

                  {/* À la une + vidéo YouTube (validation live, miniature) */}
                  <div className="grid content-start gap-4">
                    <label className="flex items-center gap-3 text-sm text-mute">
                      <Switch
                        checked={form.isFeatured}
                        onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
                        aria-label="Mettre l'article à la une"
                      />
                      <Star
                        className={`h-4 w-4 ${form.isFeatured ? "text-goldtext" : "text-mute"}`}
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      À la une (placé en tête du Journal)
                    </label>

                    <div className="grid gap-1.5">
                      <label htmlFor="post-video-url" className={labelCls}>
                        Vidéo YouTube (lien, optionnelle)
                      </label>
                      <input
                        id="post-video-url"
                        className={inputCls}
                        value={form.videoUrl}
                        onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                        maxLength={500}
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=…"
                        aria-invalid={
                          form.videoUrl.trim() !== "" &&
                          parseYouTubeId(form.videoUrl) === null
                        }
                      />
                      {form.videoUrl.trim() !== "" &&
                      parseYouTubeId(form.videoUrl) === null ? (
                        <p role="alert" className="text-xs leading-relaxed text-destructive">
                          Cette URL n&apos;est pas une vidéo YouTube reconnue — collez un lien au
                          format youtube.com/watch?v=…, youtu.be/…, shorts/… ou embed/…
                        </p>
                      ) : parseYouTubeId(form.videoUrl) ? (
                        <div className="flex items-center gap-3 pt-1">
                          <span
                            role="img"
                            aria-label="Aperçu de la miniature YouTube"
                            className="h-11 w-20 shrink-0 rounded-md border border-gold/40 bg-deep bg-cover bg-center"
                            style={{ backgroundImage: `url(${youTubeThumbUrl(parseYouTubeId(form.videoUrl) ?? "")})` }}
                          />
                          <p className="text-xs leading-relaxed text-mute">
                            Vidéo reconnue — elle sera intégrée en lecteur sans cookies dans
                            l&apos;article.
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed text-mute">
                          L&apos;aperçu de la miniature apparaît dès qu&apos;un lien YouTube valide
                          est collé.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  className="hidden"
                  onChange={onCoverFile}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </section>

              <Tabs value={lang} onValueChange={(v) => setLang(v as Lang)} className="mt-5">
                <TabsList className="h-auto flex-wrap justify-start rounded-lg border border-line bg-transparent p-1">
                  {LANGS.map((l) => {
                    const filled =
                      form.title[l.id].trim() !== "" ||
                      form.excerpt[l.id].trim() !== "" ||
                      form.body[l.id].trim() !== "";
                    return (
                      <TabsTrigger key={l.id} value={l.id} className={tabsTriggerCls}>
                        {l.label}
                        {l.optional ? "" : " *"}
                        {filled && <span aria-hidden className="ml-1 h-1.5 w-1.5 rounded-full bg-gold" />}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {LANGS.map((l) => (
                  <TabsContent key={l.id} value={l.id} className="mt-4 grid gap-3">
                    <label className="grid gap-1.5">
                      <span className={labelCls}>Titre{l.optional ? "" : " *"}</span>
                      <input
                        className={inputCls}
                        value={form.title[l.id]}
                        maxLength={200}
                        placeholder={l.optional ? OPTIONAL_PLACEHOLDER : "Titre de l'article"}
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
                      <span className={labelCls}>Extrait{l.optional ? "" : " *"}</span>
                      <textarea
                        className={`${textareaCls} min-h-[72px]`}
                        value={form.excerpt[l.id]}
                        maxLength={400}
                        placeholder={
                          l.optional
                            ? OPTIONAL_PLACEHOLDER
                            : "Résumé affiché sur la carte du Journal (20 à 400 caractères)"
                        }
                        aria-required={l.optional ? undefined : "true"}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, excerpt: { ...f.excerpt, [l.id]: e.target.value } }))
                        }
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className={labelCls}>Corps — un paragraphe par ligne{l.optional ? "" : " *"}</span>
                      <textarea
                        className={`${textareaCls} min-h-[240px]`}
                        value={form.body[l.id]}
                        placeholder={
                          l.optional
                            ? OPTIONAL_PLACEHOLDER
                            : "Premier paragraphe…\nDeuxième paragraphe…"
                        }
                        aria-required={l.optional ? undefined : "true"}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, body: { ...f.body, [l.id]: e.target.value } }))
                        }
                      />
                    </label>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Référencement (SEO) — vide = repli automatique sur le titre / l'extrait */}
              <section
                aria-labelledby="admin-posts-seo-t"
                className="mt-6 rounded-lg border border-line bg-bg p-4 md:p-5"
              >
                <h3 id="admin-posts-seo-t" className="text-xs uppercase tracking-[0.14em] text-goldtext">
                  Référencement (SEO)
                </h3>
                <p className="mt-1 text-xs text-mute">
                  Champs vides : le site réutilise automatiquement le titre et l&apos;extrait de
                  l&apos;article — le compteur indique la longueur idéale pour Google.
                </p>
                <div className="mt-3 grid gap-3">
                  <label className="grid gap-1.5">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={labelCls}>Titre SEO — affiché dans les résultats Google</span>
                      <span
                        className={`shrink-0 text-xs tabular-nums ${counterCls(form.metaTitle.length, 60)}`}
                      >
                        {form.metaTitle.length}/60
                      </span>
                    </span>
                    <input
                      className={inputCls}
                      value={form.metaTitle}
                      maxLength={200}
                      placeholder="Vide = titre de l'article"
                      onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={labelCls}>Meta description — résumé sous le lien Google</span>
                      <span
                        className={`shrink-0 text-xs tabular-nums ${counterCls(form.metaDescription.length, 160)}`}
                      >
                        {form.metaDescription.length}/160
                      </span>
                    </span>
                    <textarea
                      className={`${textareaCls} min-h-[72px]`}
                      value={form.metaDescription}
                      maxLength={400}
                      placeholder="Vide = extrait de l'article"
                      onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className={labelCls}>Mots-clés (séparés par des virgules, optionnel)</span>
                    <input
                      className={inputCls}
                      value={form.keywords}
                      maxLength={600}
                      placeholder="creation site web guinée, logiciel de gestion…"
                      onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                    />
                  </label>
                </div>
              </section>

              {/* Espaces publicitaires — blocs « partenaire » insérés dans le texte */}
              <section
                aria-labelledby="admin-posts-ads-t"
                className="mt-4 rounded-lg border border-line bg-bg p-4 md:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 id="admin-posts-ads-t" className="text-xs uppercase tracking-[0.14em] text-goldtext">
                      Espaces publicitaires
                    </h3>
                    <p className="mt-1 text-xs text-mute">
                      Blocs « partenaire » insérés dans le texte après le paragraphe choisi
                      (0 = tout à la fin). Maximum {MAX_ADS} par article.
                    </p>
                  </div>
                  <GoldButton
                    variant="outline"
                    onClick={() => setForm((f) => ({ ...f, ads: [...f.ads, emptyAd()] }))}
                    disabled={form.ads.length >= MAX_ADS}
                    className="min-h-9! px-3! text-xs!"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    Ajouter un espace
                  </GoldButton>
                </div>

                {form.ads.length === 0 ? (
                  <p className="mt-3 text-xs text-mute">
                    Aucun espace publicitaire sur cet article.
                  </p>
                ) : (
                  <div className="mt-3 flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
                    {form.ads.map((ad, i) => (
                      <div key={ad.id} className="rounded-lg border border-line bg-surface p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-mute">
                            <Megaphone className="h-3.5 w-3.5 text-goldtext" strokeWidth={1.25} aria-hidden />
                            Espace {i + 1} — {ad.isActive ? "actif" : "masqué"}
                          </p>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs text-mute">
                              <Switch
                                checked={ad.isActive}
                                onCheckedChange={(v) => updateAd(i, { isActive: v })}
                                aria-label={`Espace ${i + 1} actif`}
                              />
                              Actif
                            </label>
                            <button
                              type="button"
                              onClick={() => removeAd(i)}
                              aria-label={`Supprimer l'espace ${i + 1}`}
                              className={deleteBtn}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <label className="grid gap-1.5">
                            <span className={labelCls}>Étiquette du bloc (badge)</span>
                            <input
                              className={inputCls}
                              value={ad.title}
                              maxLength={120}
                              placeholder="Espace partenaire"
                              onChange={(e) => updateAd(i, { title: e.target.value })}
                            />
                          </label>
                          <label className="grid gap-1.5">
                            <span className={labelCls}>Libellé du bouton</span>
                            <input
                              className={inputCls}
                              value={ad.ctaLabel}
                              maxLength={60}
                              placeholder="Découvrir"
                              onChange={(e) => updateAd(i, { ctaLabel: e.target.value })}
                            />
                          </label>
                          <label className="grid gap-1.5 md:col-span-2">
                            <span className={labelCls}>Texte de la publicité (1-2 phrases)</span>
                            <textarea
                              className={`${textareaCls} min-h-[56px]`}
                              value={ad.text}
                              maxLength={600}
                              placeholder="Ex. Notre agence conçoit des logiciels de gestion sur mesure pour les entreprises guinéennes."
                              onChange={(e) => updateAd(i, { text: e.target.value })}
                            />
                          </label>
                          <label className="grid gap-1.5">
                            <span className={labelCls}>Image (URL https ou /images/…, optionnelle)</span>
                            <input
                              className={inputCls}
                              value={ad.imageUrl}
                              maxLength={600}
                              placeholder="https://… ou /images/banniere.png"
                              onChange={(e) => updateAd(i, { imageUrl: e.target.value })}
                            />
                          </label>
                          <label className="grid gap-1.5">
                            <span className={labelCls}>Lien du clic (https://…, vide = non cliquable)</span>
                            <input
                              className={inputCls}
                              value={ad.linkUrl}
                              maxLength={600}
                              placeholder="https://www.einsofdigit.com/logiciels"
                              onChange={(e) => updateAd(i, { linkUrl: e.target.value })}
                            />
                          </label>
                          <label className="grid gap-1.5">
                            <span className={labelCls}>
                              Insérer après le paragraphe n° (0 = fin d&apos;article)
                            </span>
                            <input
                              className={inputCls}
                              value={ad.position}
                              inputMode="numeric"
                              maxLength={3}
                              placeholder="1"
                              onChange={(e) =>
                                updateAd(i, { position: e.target.value.replace(/\D/g, "").slice(0, 3) })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {formError && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <div className="mt-4">
                <GoldButton type="submit" disabled={busy} className="min-h-10! px-4! text-xs!">
                  <Pencil className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  {editor.id !== null ? "Enregistrer les modifications" : "Créer l'article"}
                </GoldButton>
              </div>
            </>
          )}
        </form>
      )}

      {/* Liste des articles */}
      <div className="mt-4 flex flex-col gap-3">
        {rows === null ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mute">{"Aucun élément pour le moment."}</p>
        ) : (
          rows.map((p) => (
            <article
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium">
                  <span className="truncate">{p.title}</span>
                  {p.isFeatured && (
                    <Star
                      className="h-3.5 w-3.5 shrink-0 fill-goldtext text-goldtext"
                      strokeWidth={1.25}
                      aria-label="À la une"
                    />
                  )}
                </p>
                <p className="mt-0.5 truncate text-xs text-mute">
                  /{p.slug} · {p.category} · {p.readingMin} min · {fmtDate(p.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-mute">
                  {p.isPublished
                    ? `Publié${p.publishedAt ? ` — ${fmtDate(p.publishedAt)}` : ""}`
                    : "Masqué"}
                </span>
                <Switch
                  checked={p.isPublished}
                  disabled={busyId === p.id}
                  onCheckedChange={() => void toggle(p)}
                  aria-label={`Publication — ${p.title}`}
                />
                <button
                  type="button"
                  onClick={() => void openEdit(p)}
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
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default PostsPanel;
