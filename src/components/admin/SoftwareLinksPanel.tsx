"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MonitorPlay, Save } from "lucide-react";
import { toast } from "sonner";
import { GoldButton } from "@/components/site/kit";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { SAAS_PRODUCTS } from "@/lib/catalog";
import { parseYouTubeId, youTubeThumbUrl } from "@/lib/youtube";

/* ── Logiciels — liens de démo + vidéos YouTube (table SoftwareLink).
 * Panneau de l'Espace équipe ; câblage : <SoftwareLinksPanel onUnauthorized={() => …} />
 * Pour chacun des 7 produits du catalogue : URL de déma (https, ouverte dans
 * un nouvel onglet) et URL YouTube de la vidéo de présentation (n'importe
 * quel format reconnu — watch, youtu.be, shorts, embed — validée en direct
 * avec aperçu miniature). ── */

interface LinkRow {
  slug: string;
  demoUrl: string | null;
  videoUrl: string | null;
}

interface Draft {
  demoUrl: string;
  videoUrl: string;
}

/* Visuels produit (identiques aux cartes de la section Logiciels). */
const SAAS_THUMB: Record<string, string> = {
  "factura-pro": "/images/saas/saas-factura.png",
  "gestion-comptable": "/images/saas/saas-compta.png",
  "gestion-hospitaliere": "/images/saas/saas-hosp.png",
  "gestion-ecole": "/images/saas/saas-ecole.png",
  "gestion-immobiliere": "/images/saas/saas-immo.png",
  "gestion-pharmacie": "/images/saas/saas-pharma.png",
  "gestion-formation": "/images/saas/saas-formation.png",
};

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-gold focus:outline-none";
const labelCls = "text-xs text-mute";
const URL_RE = /^https:\/\/\S+\.\S+/i;

export function SoftwareLinksPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busySlug, setBusySlug] = useState<string | null>(null);

  /* ── Chargement des liens actuels ──────────────────────────── */
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/software-links", { cache: "no-store" });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const json = (await res.json()) as { ok: boolean; data?: LinkRow[] };
      const next: Record<string, Draft> = {};
      for (const p of SAAS_PRODUCTS) {
        const row = json.data?.find((r) => r.slug === p.slug);
        next[p.slug] = { demoUrl: row?.demoUrl ?? "", videoUrl: row?.videoUrl ?? "" };
      }
      setDrafts(next);
    } catch {
      toast.error("Erreur réseau — impossible de charger les liens des logiciels.");
    } finally {
      setLoaded(true);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  const setField = (slug: string, field: keyof Draft, value: string) =>
    setDrafts((d) => ({ ...d, [slug]: { ...d[slug], [field]: value } }));

  /* ── Enregistrement d'un produit (PUT upsert) ──────────────── */
  const save = async (slug: string, name: string) => {
    if (busySlug) return;
    const draft = drafts[slug];
    if (!draft) return;
    const demoUrl = draft.demoUrl.trim();
    const videoUrl = draft.videoUrl.trim();

    if (demoUrl && !URL_RE.test(demoUrl)) {
      toast.error(`${name} — le lien de démo doit commencer par https://`);
      return;
    }
    if (videoUrl && parseYouTubeId(videoUrl) === null) {
      toast.error(`${name} — l'URL vidéo n'est pas une vidéo YouTube reconnue.`);
      return;
    }

    setBusySlug(slug);
    try {
      const res = await fetch("/api/admin/software-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, demoUrl: demoUrl || null, videoUrl: videoUrl || null }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        toast.success(`${name} — liens enregistrés. Le site public est à jour.`);
      } else {
        toast.error(`${name} — enregistrement refusé. Vérifiez les URL (https, YouTube).`);
      }
    } catch {
      toast.error(`${name} — erreur réseau. Réessayez.`);
    } finally {
      setBusySlug(null);
    }
  };

  /* ── Rendu ─────────────────────────────────────────────────── */
  return (
    <section aria-labelledby="admin-software-links-t">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-software-links-t" className="font-serif text-xl">
          Logiciels — démos &amp; vidéos
        </h2>
        <MonitorPlay className="h-5 w-5 text-gold" strokeWidth={1.25} aria-hidden />
      </div>
      <p className="mt-1 text-sm text-mute">
        Pour chaque logiciel : le lien de la démo en ligne (ouvert dans un nouvel onglet depuis la
        page du produit) et la vidéo YouTube de présentation (intégrée sans cookies). Laissez vide
        pour retirer un lien.
      </p>

      {!loaded ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {SAAS_PRODUCTS.map((p, i) => {
            const draft = drafts[p.slug];
            if (!draft) return null;
            const videoId = parseYouTubeId(draft.videoUrl);
            const videoInvalid = draft.videoUrl.trim() !== "" && videoId === null;
            const demoInvalid =
              draft.demoUrl.trim() !== "" && !URL_RE.test(draft.demoUrl.trim());
            const busy = busySlug === p.slug;
            return (
              <article
                key={p.slug}
                className="rounded-lg border border-line bg-surface p-4 md:p-5"
                aria-label={`Liens — ${p.name}`}
              >
                <div className="flex items-center gap-3">
                  <span className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md border border-line">
                    <Image
                      src={SAAS_THUMB[p.slug]}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">
                      <span className="mr-2 font-serif text-goldtext">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-mute">{p.slug}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {/* Lien de la démo */}
                  <div className="grid content-start gap-1.5">
                    <label htmlFor={`demo-${p.slug}`} className={labelCls}>
                      Lien de la démo
                    </label>
                    <input
                      id={`demo-${p.slug}`}
                      className={inputCls}
                      value={draft.demoUrl}
                      onChange={(e) => setField(p.slug, "demoUrl", e.target.value)}
                      maxLength={500}
                      placeholder="https://demo.einsofdigit.com/…"
                      type="url"
                      aria-invalid={demoInvalid}
                    />
                    <p className="text-xs leading-relaxed text-mute">
                      Le visiteur ouvrira le logiciel dans un nouvel onglet.
                      {demoInvalid && (
                        <span role="alert" className="ml-1 text-destructive">
                          L&apos;URL doit commencer par https://
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Vidéo YouTube */}
                  <div className="grid content-start gap-1.5">
                    <label htmlFor={`video-${p.slug}`} className={labelCls}>
                      Vidéo YouTube
                    </label>
                    <input
                      id={`video-${p.slug}`}
                      className={inputCls}
                      value={draft.videoUrl}
                      onChange={(e) => setField(p.slug, "videoUrl", e.target.value)}
                      maxLength={500}
                      placeholder="https://www.youtube.com/watch?v=…"
                      type="url"
                      aria-invalid={videoInvalid}
                    />
                    {videoInvalid ? (
                      <p role="alert" className="text-xs leading-relaxed text-destructive">
                        Cette URL n&apos;est pas une vidéo YouTube reconnue — collez un lien au
                        format youtube.com/watch?v=…, youtu.be/…, shorts/… ou embed/…
                      </p>
                    ) : videoId ? (
                      <div className="flex items-center gap-3 pt-1">
                        <span
                          role="img"
                          aria-label="Aperçu de la miniature YouTube"
                          className="h-11 w-20 shrink-0 rounded-md border border-gold/40 bg-deep bg-cover bg-center"
                          style={{ backgroundImage: `url(${youTubeThumbUrl(videoId)})` }}
                        />
                        <p className="text-xs leading-relaxed text-mute">
                          Vidéo reconnue — elle sera intégrée en lecteur sans cookies sur la page
                          du logiciel.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed text-mute">
                        Collez n&apos;importe quel format d&apos;URL YouTube — l&apos;aperçu
                        apparaît ici dès qu&apos;elle est reconnue.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <GoldButton
                    onClick={() => void save(p.slug, p.name)}
                    disabled={busy || busySlug !== null}
                    className="min-h-9! px-3! text-xs!"
                    ariaLabel={`Enregistrer les liens de ${p.name}`}
                  >
                    <Save className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    {busy ? "Enregistrement…" : "Enregistrer"}
                  </GoldButton>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default SoftwareLinksPanel;
