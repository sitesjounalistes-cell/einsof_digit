/**
 * Génère une paire de clés VAPID pour les notifications push (spec §14/§28).
 * Exécution : bun scripts/push-keys.ts
 * Puis définir VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY (et VAPID_SUBJECT) dans l'environnement.
 * Sans variables, le serveur génère et persiste automatiquement une paire (table Setting).
 */
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log("VAPID_PUBLIC_KEY=%s", keys.publicKey);
console.log("VAPID_PRIVATE_KEY=%s", keys.privateKey);
console.log("# VAPID_SUBJECT=mailto:contact@votre-domaine.com");
