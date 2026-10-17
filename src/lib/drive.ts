/**
 * Liens Google Drive → URL audio directement jouable.
 *
 * Le gérant colle un lien de partage Drive dans le tableau de bord ;
 * on en extrait l'identifiant de fichier puis on construit une URL
 * de téléchargement directe lisible par <audio>. Les liens déjà
 * directs (mp3/ogg/m4a/wav…) sont laissés intacts.
 *
 * Formats Drive reconnus :
 *  - https://drive.google.com/file/d/<ID>/view?usp=sharing
 *  - https://drive.google.com/open?id=<ID>
 *  - https://drive.google.com/uc?export=download&id=<ID>
 *  - https://docs.google.com/uc?id=<ID>
 *  - https://drive.usercontent.google.com/download?id=<ID>
 */

const DRIVE_ID_RE =
  /(?:drive|docs)\.google\.com\/(?:file\/d\/|open\?|uc\?(?:export=download&)?|download\?)[^"'\s]*?(?:id=)?([A-Za-z0-9_-]{10,})/;

const AUDIO_EXT_RE = /\.(mp3|ogg|oga|m4a|aac|wav|flac|opus|webm|mp4)(\?.*)?$/i;

export function parseDriveFileId(url: string): string | null {
  if (!url) return null;
  const m = url.match(DRIVE_ID_RE);
  return m ? m[1] : null;
}

/** Le lien est-il un lien Google Drive ? */
export function isDriveLink(url: string): boolean {
  return typeof url === "string" && /(?:drive|docs)\.google\.com\//.test(url);
}

/**
 * Convertit n'importe quel lien (Drive ou direct) en URL jouable.
 * Retourne null si le lien est vide ou manifestement invalide.
 */
export function toPlayableAudioUrl(link: string): string | null {
  const url = (link ?? "").trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) return null;

  if (isDriveLink(url)) {
    const id = parseDriveFileId(url);
    if (!id) return null;
    // Endpoint de téléchargement direct (contenu utilisateur) — le plus
    // fiable pour les fichiers audio partagés en lecture publique.
    return `https://drive.usercontent.google.com/download?id=${id}&export=download`;
  }

  return url;
}

/** Extension audio reconnue ? (informationnel, la lecture ne dépend pas de l'extension) */
export function looksLikeAudioUrl(url: string): boolean {
  if (!url) return false;
  return AUDIO_EXT_RE.test(url) || isDriveLink(url);
}
