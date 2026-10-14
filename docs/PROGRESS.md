# PROGRESS — Site premium EINSOF (cahier des charges §1–32)

## ✅ Livré (version sandbox mono-route)

### Design system « Obsidienne et Or » (section 32)
- [x] Jetons couleurs exacts (§22/§32.2) : noir #0A0A0A, ivoire #FAF8F3, or #D4AF37, dégradé or, verre noir, grain + vignette
- [x] Typographie : Cormorant Garamond (titres) + Inter (texte), échelle fluide clamp, libellés majuscules espacés
- [x] Thème sombre (signature) + thème clair ivoire, mémorisé (next-themes)
- [x] Mouvement : révélations au scroll, compteurs 1,6 s, marquee, boutons magnétiques, inclinaison 3D, reflet doré sur les boutons, filet d'or à point lumineux, particules or (40 pts max), projecteur suivant la souris
- [x] Mode léger automatique (appareil faible / prefers-reduced-motion / 2G-3G) + interrupteur « Animations réduites » dans le pied de page
- [x] Or ≤ 8 % de la surface, filets 1 px, coins 4/12 px, cibles tactiles ≥ 44 px

### Pages / sections publiques (section 23)
- [x] Hero plein écran : image de marque générée, particules, titre mot à mot avec italique doré, salutation selon l'heure, 2 CTA, indicateur de défilement
- [x] Chiffres clés : 7 ans · 10 experts · 5 langues · 6 SaaS (réels, §1/§2)
- [x] Services : 7 cartes (dont « Stratégie d'entreprise — Bientôt ») avec prix §19
- [x] Les deux piliers (§19.3) en alternance
- [x] SaaS : 6 cartes avec maquettes CSS inclinées + tarifs exacts (dont école 9 mois, hospitalière 3 forfaits)
- [x] Secteurs : bandeau défilant des 14 secteurs (§3)
- [x] Méthode : 5 étapes avec ligne dorée
- [x] Tarifs : onglets Sites web / Logiciels / SaaS — prix exacts §19, offre vedette à bordure dorée animée, renouvellement 500 000 GNF/an, inclusions, conditions & clauses (bugs gratuits vs évolutions payantes)
- [x] FAQ : 6 questions fidèles au cahier des charges
- [x] À propos : histoire, 4 valeurs (provisoires, marquées), visuel de marque généré
- [x] Bandeau essai gratuit 7 jours (formulaire court) + Contact complet + pied de page riche (filigrane marque, légal en modales, newsletter, Espace équipe, animations réduites)

### Conversion (sections 6, 10, 12, 25)
- [x] Essai gratuit : validation Zod, anti-doublon (1 essai/personne/SaaS → 409), téléphone normalisé E.164 (+224 par défaut), fusion des leads existants, lead_events horodatés
- [x] Contact / devis : sujet, consentement obligatoire non pré-coché, création contact_message + lead (source quote/contact)
- [x] Newsletter → lead source newsletter
- [x] Rate limiting 5 req/min/IP sur les routes publiques d'écriture
- [x] Consentements enregistrés en base (cookies/stats, conversations, micro) ; aucun suivi avant accord ; bandeau à catégories
- [x] Analytics anonymes (analytics_events) : cta_click, form_submit, trial_requested, chat_*, pwa_installed… déclenchés après consentement

### Chatbot vendeur IA + mode Omnis (sections 7, 13, 27, 32.9)
- [x] Bulle flottante or avec pulsation 8 s et infobulle d'invitation (12 s, 1×/session)
- [x] Fenêtre verre noir 380×600, en-tête « En ligne », messages au fil de l'eau (SSE), filet doré assistant, suggestions, pouces ↑/↓, bouton « Parler à l'équipe »
- [x] Prompt système §27 strict : uniquement les tarifs de la base, deux piliers, contexte guinéen, anti-injection, repli d'erreur poli
- [x] Actions outils validées serveur : navigate (sections du registre), open_form, create_lead (consentement requis), handoff_human
- [x] Capture de lead par le chat (testé : nom + téléphone normalisés, source « chat »)
- [x] Conservation des conversations UNIQUEMENT avec consentement chat_storage (mode éphémère sinon)
- [x] Mode Omnis plein écran : anneau doré respirant, états idle/écoute/réflexe/parole, transcription live, synthèse vocale, « Écrire à la place », Escape, consentement micro enregistré, replis unsupported/mic-refusé

### Tableau de bord « Espace équipe » (section 26, périmètre sandbox)
- [x] Connexion protégée (cookie httpOnly, verrouillage 5 essais/5 min), session 8 h, déconnexion
- [x] Vue d'ensemble : leads totaux/nouveaux, messages non lus, conversations, essais
- [x] Leads : statuts §12 (nouveau → gagné/perdu) avec events horodatés, notes internes, badges source/intérêts
- [x] Messages de contact (statuts), Essais gratuits, Export CSV (BOM, `;`)
- [x] Design sobre noir/or (§32.8)
- [x] **9 onglets** : Flux, Journal (rédaction complète), Réalisations (CRUD), Démos, Partenaires, Témoignages, Documents, E-mails, Push

### Compléments livrés (session « achèvement » — 14/10/2026)
- [x] **Rédaction du Journal dans l'admin** (§26) : création/édition/suppression d'articles, onglets de langue fr requis + en/es/zh/de optionnels (repli fr), slug auto-suggéré, catégorie, temps de lecture auto-estimé (mots/200), publication par interrupteur — format de sérialisation identique au seed (`{"fr":"p1\n\np2"}`)
- [x] **Réservation de démonstration** (§24/§27) : tables DemoSlot/DemoBooking, 12 créneaux seedés (mardi/jeudi 10 h & 15 h, heure de Conakry, capacité 2, idempotent), API publique `GET /api/demo/slots` + `POST /api/demo/book` (rate-limit 5/min, anti-surréservation en transaction Prisma, déduplication par téléphone → 409), outils chatbot `suggest_slots`/`book_demo` (procédure : coordonnées → créneaux → créneau choisi explicitement, jamais inventé), carte de créneaux dans le chat avec formulaire inline et confirmation bordée or (fuseau Africa/Conakry), panneau admin Démos (à venir/passées, statuts confirmé/annulé/terminé/no-show, annulation libère la place)
- [x] **Outils chatbot `switch_locale`/`switch_theme`** (§27) : changement de langue et de thème depuis la conversation
- [x] **E-mails transactionnels** (§25) : adaptateur Resend (envoi réel si `RESEND_API_KEY`, sinon simulé + journalisé), accusés contact / essai gratuit / newsletter, champ e-mail optionnel ajouté au formulaire d'essai, journal consultable dans l'admin (onglet E-mails)
- [x] **Notifications push** (§6/§14/§28) : clés VAPID auto-générées et persistées (ou `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`), abonnement depuis le pied de page (consentement), `POST /api/push/subscribe`, envoi de test depuis l'admin (onglet Push), nettoyage des abonnements morts 404/410, handlers `push`/`notificationclick` dans le service worker
- [x] **Tâche planifiée** (§25) : `/api/cron/maintenance` protégé par `CRON_SECRET` — expiration des essais à 7 jours, clôture des chats > 24 h, purge analytics > 12 mois et e-mails > 90 jours ; planifié dans `vercel.json` (3 h)
- [x] **Infrastructure Partenaires / Témoignages / Documents** (§23/§24) : tables Partner/Testimonial/Document, API publiques (documents filtrés `visibility="public"`), CRUD admin complet, sections publiques **masquées tant que vide** (règle §20.4 — testé : apparaissent dès la première donnée, se masquent à la suppression), i18n ×5 langues
- [x] Base de connaissances chatbot enrichie (section Essais et Démos — démo 30 min en visio, aucun prix inventé)

### PWA & technique (sections 9, 21, 28)
- [x] Manifeste (nom de marque, icônes 192/512/maskable, couleurs #0A0A0A, standalone)
- [x] Service worker : réseau d'abord pour les navigations, cache d'abord pour les images, jamais /api
- [x] Bannière d'installation (2 visites ou 45 s, refus mémorisé 30 j) + guide iOS 3 étapes
- [x] Barre d'action mobile (Essai gratuit / Devis) après 30 % de scroll, repliée quand le chat s'ouvre
- [x] Accessibilité : focus doré visible, aria-labels, contrastes, nav clavier, Escape sur les surcouches
- [x] Lint ESLint : 0 erreur · TypeScript strict : 0 erreur

## ⏳ Reste (reporté — voir docs/TODO-HUMAN.md)
- Espace client, paiement en ligne (hors v1 §18/§20)
- Relecture humaine des traductions es/zh/de (complètes à 100 %, H-09) et validation des textes (H-07)
- Migration PostgreSQL/pgvector + Auth.js/TOTP pour la production + compte Resend/VAPID de production (H-03/H-05)
- Jeu de 100 questions du chatbot + revue hebdomadaire (H-11)
- Fichiers réels des documents/ressources (H-08) — l'infrastructure est prête

## 🧪 Vérification navigateur (agent-browser) — complétée le 14/10/2026 (session achèvement)
- **Réservation de démo de bout en bout** : chat → demande démo → coordonnées → carte des créneaux (Africa/Conakry) → formulaire inline → confirmation « Démo confirmée · 10:00 (Conakry) » → DemoBooking + Lead `source=demo` + LeadEvent en base, 2/2 places prises visibles dans l'admin
- **Journal** : création d'article via l'admin (201), notice « Article créé », publication, suppression avec dialogue de confirmation ; API publique cohérente
- **Partenaires** : création dans l'admin → section publique apparaît (masquée-si-vide vérifié dans les deux sens), carte rendue en thèmes sombre et clair
- **E-mails** : newsletter → POST 201 → EmailLog `newsletter_welcome` visible dans l'onglet E-mails (« Simulé » en sandbox)
- **Base purgée de toute donnée de test** après vérification : 0 lead/réservation/e-mail/chat/consentement, 3 articles éditoriaux, 12 créneaux opérationnels
- Sections re-masquées automatiquement après purge ; lint 0 erreur, tsc 0 erreur, dev.log sans erreur
- Vérifications antérieures (14/10) : rendu sombre + clair, desktop/mobile, chatbot tarifs exacts §19, essai 201/409, contact 201/400, admin flux/CSV, Omnis, PWA
