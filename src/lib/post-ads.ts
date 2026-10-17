/* ── Espaces publicitaires insérés dans les articles du Journal (DASH-3) ──
 * Stockage : BlogPost.adsJson — chaîne JSON [{ id, title?, text?, imageUrl?,
 * linkUrl?, ctaLabel?, position, isActive }]. Parsing défensif : une entrée
 * invalide est ignorée, jamais d'exception remontée au rendu public. */

export interface PostAd {
  id: string;
  /** Ex. « Espace partenaire » — badge du bloc. */
  title?: string;
  /** 1-2 phrases de la publicité. */
  text?: string;
  /** Image optionnelle (URL https ou chemin interne /uploads/…). */
  imageUrl?: string;
  /** Destination au clic (https uniquement — bloc non cliquable si absent). */
  linkUrl?: string;
  /** Ex. « Découvrir ». */
  ctaLabel?: string;
  /** Insérée après le Nième paragraphe (1-based) ; 0 = tout à la fin. */
  position: number;
  isActive: boolean;
}

/** Variante d'entrée (payload API) : id généré à la sérialisation si absent. */
export interface PostAdInput extends Omit<PostAd, "id"> {
  id?: string;
}

/** Nettoie une chaîne optionnelle : vide / non-string → undefined. */
function optString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

/** Position sûre : entier ≥ 0, repli 0 (fin d'article). */
function safePosition(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
    return Math.min(999, Math.floor(v));
  }
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) return Math.min(999, Math.floor(n));
  }
  return 0;
}

/** Parse adsJson (chaîne du modèle BlogPost) en tableau d'espaces valides.
 * Tolère JSON cassé, entrées non-objets, champs manquants. */
export function parseAds(adsJson: string | null | undefined): PostAd[] {
  if (!adsJson) return [];
  try {
    const v: unknown = JSON.parse(adsJson);
    if (!Array.isArray(v)) return [];
    const out: PostAd[] = [];
    for (let i = 0; i < v.length; i++) {
      const e: unknown = v[i];
      if (!e || typeof e !== "object" || Array.isArray(e)) continue;
      const o = e as Record<string, unknown>;
      const fallbackId = `ad-${i + 1}`;
      out.push({
        id: optString(o.id) ?? fallbackId,
        title: optString(o.title),
        text: optString(o.text),
        imageUrl: optString(o.imageUrl),
        linkUrl: optString(o.linkUrl),
        ctaLabel: optString(o.ctaLabel),
        position: safePosition(o.position),
        isActive: o.isActive !== false,
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** Sérialise des espaces publicitaires en JSON compact (champs vides omis,
 * id garanti, position entière ≥ 0, isActive vrai par défaut). */
export function stringifyAds(ads: PostAdInput[]): string {
  const clean = ads.slice(0, 10).map((ad, i) => {
    const id = optString(ad.id) ?? `ad-${i + 1}-${Date.now().toString(36)}`;
    return {
      id,
      ...(optString(ad.title) ? { title: optString(ad.title) } : {}),
      ...(optString(ad.text) ? { text: optString(ad.text) } : {}),
      ...(optString(ad.imageUrl) ? { imageUrl: optString(ad.imageUrl) } : {}),
      ...(optString(ad.linkUrl) ? { linkUrl: optString(ad.linkUrl) } : {}),
      ...(optString(ad.ctaLabel) ? { ctaLabel: optString(ad.ctaLabel) } : {}),
      position: safePosition(ad.position),
      isActive: ad.isActive !== false,
    };
  });
  return JSON.stringify(clean);
}

/** Mots-clés CSV (« a, b, c ») → tableau propre (vide → []). */
export function parseKeywordsCsv(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 40);
}
