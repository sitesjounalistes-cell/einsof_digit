/**
 * Utilitaires YouTube — extraction d'ID et construction d'URL.
 * Utilisé par le tableau de bord (validation live d'une URL collée)
 * et par les pages publiques (intégration iframe youtube-nocookie).
 */

/**
 * Extrait l'ID d'une vidéo depuis n'importe quel format d'URL YouTube :
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 * Renvoie null si l'URL n'est pas une vidéo YouTube reconnaissable.
 * L'ID YouTube fait 11 caractères (lettres, chiffres, - et _).
 */
export function parseYouTubeId(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  const m = u.match(
    /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})(?:[?&#/]|$)/i
  );
  return m ? m[1] : null;
}

/** URL d'intégration (domaine sans cookies, lecteur allégé). */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

/** Miniature HD (utilisée comme aperçu dans le tableau de bord). */
export function youTubeThumbUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
