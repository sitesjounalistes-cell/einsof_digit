# Worklog — Site premium agence digitale (cahier des charges EINSOF)

Projet : site vitrine + machine de vente « Obsidienne et Or », mono-route `/` (contrainte sandbox),
Next.js 16 / TS / Tailwind 4 / shadcn / Prisma SQLite / z-ai-web-dev-sdk.

Spécification source : cahier des charges fourni par le client (sections 1–32).
Priorité design : section 32 (Obsidienne & Or) > section 22 > reste.
Règle d'or : aucun tarif hors section 19, aucun nom inventé ; sections vides masquées.

---
Task ID: 1
Agent: orchestrator (Z.ai Code)
Task: Fondations complètes du projet

Work Log:
- Analyse du cahier des charges (32 sections) et du projet existant
- Création des tokens design (globals.css) : noir obsidienne #0A0A0A, ivoire #FAF8F3, or #D4AF37, gradients, grain, vignette
- Polices : Cormorant Garamond (titres) + Inter (texte) via next/font
- Providers : thème (next-themes, dark par défaut), langue (fr/en/es/zh/de, repli fr), mode léger (motion), consentement
- Catalogue commercial (lib/catalog.ts) : tarifs exacts de la section 19 en GNF
- Registre des sections (data-section-id) pour la navigation du chatbot
- Bibliothèque de mouvement : Reveal, Counter, Marquee, Magnetic, Tilt, GoldParticles, ScrollProgress, GoldRule, SectionHeading, GoldButton
- Schéma Prisma : Lead, LeadEvent, TrialRequest, ContactMessage, ChatSession, ChatMessage, Consent, AnalyticsEvent
- APIs : /api/trial, /api/contact, /api/newsletter, /api/consent, /api/analytics, /api/chat/*, /api/admin/*
- Chatbot IA vendeur (z-ai-web-dev-sdk) avec actions navigate/open_form/create_lead + mode Omnis vocal

Stage Summary:
- Contrainte sandbox respectée : une seule route `/` ; le tableau de bord est un overlay client « Espace équipe »
- Décisions consignées dans docs/DECISIONS.md (SQLite au lieu de PostgreSQL, etc.)
- Agents suivants : lire ce fichier avant de travailler, puis y ajouter leur section

---
Task ID: 2-a
Agent: frontend-styling-expert
Task: Sections premium « Obsidienne et Or » — Navbar, Hero, Stats, Services, Piliers, Secteurs, Méthode (7 fichiers "use client")

Work Log:
- Lecture des contrats (worklog, globals.css, translations.ts, i18n, kit, motion, gold-particles, providers, chat-bus, catalog, analytics, brand) — aucun fichier hors périmètre modifié
- Navbar.tsx : barre fixe z-40 (h-16/20), glass-panel après 24 px, masquée au défilement bas / réapparition au défilement haut ; lien actif via IntersectionObserver sur section-<id> avec point d'or ; sélecteur de langue (LANGS, noms complets, sans drapeaux), bascule thème Sun/Moon pivotantes (aria-label themeLabel), CTA or → scrollToSection("contact") + trackCta("hero","nav-cta") ; tiroir plein écran mobile (liens serif text-3xl en cascade CSS, liste de langues, thème, CTA), inert/aria-hidden quand fermé, Échap + verrouillage du défilement
- Hero.tsx : section min-h-[100svh] hors wrapper Section (id/data-section-id hero) ; image /images/hero-obsidienne.png (fill, priority, sizes 100vw, opacity-40/30), voiles bg-gradient from-bg, GoldParticles + Spotlight ; salutation selon l'heure rendue en label-caps (useSyncExternalStore → zéro écart d'hydratation) ; h1 display-1 WordMask t1 puis bloc em gold-text-gradient font-serif italic avec WordMask tGold delay 400 ms ; GoldBadge Sparkles mb-6, lead-text, CTA primaire magnétique → contact + trackCta("hero","cta-primary") et outline MessageCircle → openChat() + trackCta("hero","chat") ; indicateur scroll-indicator-line 1×48 px or + label scroll
- StatsSection.tsx : Section id="stats" tone="surface", grille 2→4 col, Counter (7, 10, 5, 6 — seuls chiffres réels autorisés), filet d'or 32 px sous chaque valeur, label mute, Reveal delay i*80
- ServicesSection.tsx : 7 cartes dans l'ordre web, software, saas, community, acquisition, training, strategy via tr("services.items.*") ; Tilt + article card-lift (bordure line, bg-surface, p-6), numéro fantôme 01–07 or 7 %, icônes lucide or dans pastille border-gold/30 (Globe, Code2, Boxes, Megaphone, Target, GraduationCap, Compass) ; tarifs EXACTS §19 via formatGNF (1 500 000 / 20 000 000 / 100 000 + pricing.perMonth) ou pricing.quoteLabel ; strategy sans prix + GoldBadge badge + opacité-80 ; carte entière = bouton → openForm("quote",{subject:name}) + trackCta("services",key), flèche ArrowUpRight animée ; CTA centré mt-12 → openForm("quote") + trackCta("services","cta")
- PillarsSection.tsx : tone="deep", rangées alternées lg:grid-cols-12 (texte 7 / anneaux 5), kicker label-caps, citation serif text-2xl→4xl entre «…», descriptif mute ; ShieldCheck puis Gem (80, stroke 1, text-gold/40) dans anneaux concentriques or (breathe) ; GoldRule entre rangées, Reveal delay 0/120
- SectorsSection.tsx : SectionHeading centré + Marquee duration 45 de pilules (dot or 6 px, bordure line, bg-surface, px-6 py-3) depuis tr("sectors.items") ; fondus latéraux absolus from-bg
- ProcessSection.tsx : 5 étapes tr("process.steps") ; bureau = grille grid-cols-5 sur gold-rule absolue top-3 passant par le centre des nœuds cerclés or (z-10, bg-bg) ; mobile = liste verticale border-l border-gold/30 pl-6, nœuds sur le filet (-left-3) ; numéros serif or 01–05, Reveal delay i*80
- Règles respectées : tout texte via t()/tr() (chiffres et ids exceptés), aucun emoji, icônes lucide strokeWidth 1.25, or rare (accents), pas de bleu/indigo, cibles tactiles ≥ 44 px, aria-labels sur boutons icônes
- Qualité : bunx tsc --noEmit → 0 erreur dans mes fichiers ; bun run lint → 0 erreur dans mes 7 fichiers (5 erreurs préexistantes hors périmètre : motion/index.tsx, providers.tsx, consent.tsx, i18n/index.tsx — règle react-hooks/set-state-in-effect, fichiers interdits de modification)

Stage Summary:
- Écarts assumés : GoldButton n'a pas de prop size → CTA nav compacté via className="px-4" (min-h 44 px conservé) ; display-3 (CSS non-layered) écraserait text-lg → classe text-lg! (Tailwind v4) pour honorer « display-3 text-lg » ; ligne bureau de la méthode à top-3 sans pt-2 interne afin de traverser exactement le centre des nœuds ; salutation + « mounted » du thème via useSyncExternalStore pour satisfaire la règle lint react-hooks/set-state-in-effect sans flag de montage ; section deep : texte hérité #f5f2ea pour la lisibilité du thème clair (le contraste label-caps/mute sur tone="deep" reste un point kit à arbitrer à l'orchestrateur)
- Tiroir mobile : délai 80 ms avant scrollToSection pour libérer le verrou de défilement avant le scroll doux
- Prêt à câbler dans page.tsx : <Navbar/>, <Hero/>, <StatsSection/>, <ServicesSection/>, <PillarsSection/>, <SectorsSection/>, <ProcessSection/>
- Agents suivants : réutiliser scrollToSection/openForm/openChat/trackCta et les ids section-* ; penser au contraste en thème clair pour toute future section tone="deep"

---
Task ID: 2-b
Agent: frontend-styling-expert
Task: Sections SaaS / Tarifs / FAQ / Essai / À propos / Contact + Footer (design « Obsidienne et Or »)

Work Log:
- Lecture du worklog et des fichiers contractuels (kit, motion, i18n, catalog, chat-bus, api-client, analytics, brand, consent, providers, globals.css, composants shadcn)
- src/components/site/SaasSection.tsx : grille 3 colonnes sur SAAS_PRODUCTS, maquette d'interface 100 % CSS (fenêtre + barre latérale + blocs) sous Tilt, PriceTag par produit (forfait hôpital en plage 1 – 5 000 000 GNF/mois bornée par le catalogue, note école 9 mois), CTA démo via openForm + trackCta, lien essai → section trial
- src/components/site/PricingSection.tsx : Tabs shadcn (web/logiciels/SaaS), cartes offres web (vedette web-dashboard avec gold-frame + translate), bandeau renouvellement via formatGNF(WEB_RENEWAL.amount), panneau « Inclus » avec Check dorés, cartes logiciels + note index 2, lignes SaaS avec CTA démo fantôme, panneau des conditions en pied de section
- src/components/site/FaqSection.tsx : Accordion shadcn single/collapsible max-w-3xl, items via tr("faq.items"), Reveal delay i*60 (bordures portées par le wrapper Reveal pour préserver les séparateurs)
- src/components/site/TrialSection.tsx : machine d'état idle/submitting/success, 3 inputs h-12 + Select des 6 SaaS, Checkbox consentement, validation téléphone (≥8 chiffres), submitTrial + track("trial_requested")/trackCta, toasts 409/erreur (sonner), état succès (cercle or + Check)
- src/components/site/AboutSection.tsx : Image about-sculpture.png + bordure dorée décalée + GoldBadge teamNote, texte à droite, valeurs en dl (4 mini-cartes), CTA → contact + trackCta
- src/components/site/ContactSection.tsx : formulaire complet avec labels, validation inline (requis, téléphone ≥8, message ≥10, consentement), Select sujet (options i18n + item conditionnel « Démo »), succès (Check or) + track("form_submit"), écoute onOpenForm (démo→sujet Démo + message prérempli, devis→sujet) avec scrollIntoView + focus prénom, panneau latéral (horaires/adresse/WhatsApp « à venir », GoldRule, CTA openChat)
- src/components/site/Footer.tsx : filigrane BRAND en text-stroke or 13vw, 4 colonnes (Monogramme, navigation scrollToSection, légal avec Dialog shadcn + note TODO H-10, newsletter submitNewsletter avec toasts), barre inférieure (© dynamique, bascule animations réduites via useMotionMode.setOverride + toast, Espace équipe toggleAdmin)
- Vérifications : `bun run lint` → 0 erreur dans les 7 nouveaux fichiers ; `bunx tsc --noEmit` → 0 erreur dans src/components/site (erreurs préexistantes hors périmètre : examples/, skills/, api/chat)

Stage Summary:
- 7 fichiers créés, aucun autre fichier modifié ; tout texte visible via t()/tr(), tarifs exclusivement issus de lib/catalog.ts via PriceTag/formatGNF
- Écarts maîtrisés : footnote rendue une seule fois (strip du champ avant PriceTag pour éviter le doublon) ; `lg:grid-cols-[1fr_360px]` (underscore) au lieu de la virgule invalide en Tailwind ; variantes `dark:` explicites sur les TabsTrigger/SelectTrigger pour vaincre les défauts shadcn en thème sombre ; exports nommés + default sur chaque section pour faciliter le câblage de page.tsx
- Libellés de formulaires d'essai accessibles via aria-label (design sans label visible) ; messages openForm « Démo / Devis — » conformes au contrat du bus
- Prochain agent : câbler les sections dans src/app/page.tsx (Hero/Services par l'agent 2-a, puis mes 7 sections + Footer)

---
Task ID: 4
Agent: full-stack-developer
Task: UI overlays — Espace équipe (AdminOverlay), bandeau de consentement, invitation PWA, barre d'action mobile, curseur personnalisé (5 fichiers "use client")

Work Log:
- Lecture du worklog et des contrats (globals.css, translations.ts, i18n, providers, consent, chat-bus, analytics, brand, kit, ui/*) — aucun fichier hors périmètre modifié
- src/components/admin/AdminOverlay.tsx : machine closed|login|panel sur onAdminToggle (sonde GET /api/admin/overview à l'ouverture : 401 → login, sinon panneau + squelettes ui/skeleton) ; login carte max-w-sm mt-[20vh] (Monogram, h1 serif « Espace équipe », input h-11 focus:border-gold, GoldButton primaire, 401 → « Mot de passe incorrect. », 429 → message anti-bruteforce, rôle dialog + Échap + verrou du défilement) ; panneau header sticky glass-panel h-16 (Monogram, Actualiser RefreshCw avec spin, Déconnexion → POST logout, fermer X) ; corps max-w-7xl : 5 cartes stats (font-serif text-3xl text-goldtext), section Leads (cartes grid md:grid-cols-[1fr_auto], Badge outline source, pastille de statut colorée, badges centres d'intérêt, Select shadcn 7 statuts → PATCH /api/admin/lead, note interne onBlur → PATCH {notes}, date Intl fr-FR), Export CSV client (BOM \uFEFF, séparateur « ; », champs quotés, download leads.csv), section Messages (Select 4 statuts → PATCH /api/admin/message, sujet/message line-clamp-2, expéditeur + téléphone), section Essais (nom SaaS via catalogue, statut en pastille, date) ; états vides « Aucun élément pour le moment. », panneau d'erreur réseau avec Réessayer, SelectContent z-[100] pour passer au-dessus de l'overlay z-[90], tout typé par interfaces (LeadRow/MessageRow/TrialRow/OverviewData), try/catch sur chaque fetch
- src/components/site/ConsentBanner.tsx : null si decided ; fixe bottom-4 inset-x-4 z-[85] (sm: max-w-md right-6), glass-panel rounded-xl p-5 shadow-2xl, role="dialog" aria-live polite ; 3 boutons (accepter → decide(true,true), refuser → decide(false,false), Personnaliser en ghost souligné → vue étendue animée) ; vue étendue : 3 lignes catégorie (border-line bg-surface/60, Switch shadcn — essentiels disabled checked) + bouton Enregistrer → decide(ana, chat) ; entrée translate-y via animate-in/slide-in-from-bottom (tw-animate-css, zéro setState d'effet)
- src/components/site/PwaPrompt.tsx : rendu seulement si consent decided (jamais simultané au bandeau) ; compteur « eins-visits » + garde sessionStorage (1 incrément/session), conditions : pas de « eins-pwa-dismissed » < 30 jours ET (visites ≥ 2 → 400 ms, sinon minuteur 45 s) ET pas display-mode standalone ; beforeinstallprompt capté dans un ref (preventDefault), appinstalled → track("pwa_installed") ; Installer → deferred.prompt() + enregistrement du licenciement, sinon panneau iOS (3 étapes numérotées en cercles or, titre iosT, bouton Compris) ; Plus tard → localStorage + fermeture ; garde closedRef empêchant toute réapparition après fermeture manuelle
- src/components/site/MobileActionBar.tsx : nav fixe z-[75] md:hidden glass-panel border-t, padding safe-area iOS (env(safe-area-inset-bottom)) ; visible après 30 % du défilement, masquée près du bas (scrollY + vh > docH - 200), masquée à vie après onChatOpen (ref) ; translation translate-y-full ↔ 0 + inert/aria-hidden quand cachée ; deux GoldButton flex-1 → scrollToSection("trial"/"contact") + trackCta("mobilebar", …) ; pr-16 pour dégager la zone du bouton chat
- src/components/site/CustomCursor.tsx : desktop seulement (useMotionMode desktop + !lightMode, doublé de hidden lg:block) ; point 10 px bg-gold + anneau 36 px border-gold/50 en z-[95] pointer-events-none ; rAF permanent : lerp point 0.6 / anneau 0.15, scale anneau vers 1.8 sur éléments interactifs (mouseover + closest a/button/[role=button]/input/textarea/select), point fondu au survol, anneau fondu sur champs texte ; invisible avant le premier mousemove ; translate3d + will-change transform, ZÉRO setState (refs + styles directs), nettoyage complet des listeners
- Règles respectées : t() pour consent.*/pwa.*/mobilebar.*, français codé en dur uniquement dans l'admin (outil interne) ; aucune modification hors des 5 fichiers ; or réservé aux actions primaires + stats ; icônes lucide strokeWidth 1.25 ; aria-labels/role=dialog partout ; cibles tactiles ≥ 44 px (min-h conservé, ajustements via modificateur ! de Tailwind v4)
- Qualité : bunx tsc --noEmit → 0 erreur dans mes 5 fichiers ; bun run lint → 0 erreur dans mes 5 fichiers (5 erreurs préexistantes hors périmètre : motion/index.tsx ×2, providers.tsx, consent.tsx, i18n/index.tsx — règle react-hooks/set-state-in-effect)

Stage Summary:
- 5 fichiers créés (src/components/admin/AdminOverlay.tsx + 4 overlays site), aucune autre modification
- Écarts maîtrisés : GoldButton n'ayant pas de prop size, les boutons compacts passent par modificateurs d'importance Tailwind v4 (min-h-11!/px-*/text-xs!) pour vaincre la concatération de classes sans twMerge du kit ; SelectContent en z-[100] car le portail Radix est en dehors du contexte d'empilement de l'overlay z-[90] ; l'ouverture de l'admin sonde /api/admin/overview (401 → login) pour éviter de redemander le mot de passe à une session valide ; PwaPrompt garde un ref « closed » pour qu'aucun minuteur ne rouvre le bandeau après une fermeture manuelle ; curseur sans cursor:none (conservé, le point/anneau accompagnent le curseur natif)
- Non câblés volontairement dans page.tsx : montage à l'orchestrateur (AdminOverlay, ConsentBanner, PwaPrompt, MobileActionBar, CustomCursor) — les importations par défaut sont des exports nommés
- Agents suivants : MobileActionBar suppose un FAB de chat en bas à droite (pr-16 dégagé, z-75 < overlays) ; le curseur personnalisé ne doit pas être monté avec le mode léger forcé (il se désactive tout seul via useMotionMode)

---
Task ID: 1 (finalisation)
Agent: orchestrator (Z.ai Code)
Task: Intégration finale, vérification navigateur et corrections

Work Log:
- Composition de page.tsx : 12 sections + footer + chat + Omnis + admin + bannières + barre mobile
- Corrections suite à la vérification agent-browser :
  * Polices : variables next/font déplacées sur <html> (la résolution var(--font-serif) sur :root échouait sinon)
  * GoldButton : ajout de "relative" (les remplissages absolute s'ancraient sur le conteneur parent et s'étalaient sur la page)
  * normalizePhone : numéros locaux guinéens à 9 chiffres (6XX) → +224 désormais corrects
  * useSyncExternalStore : snapshots serveurs mémoïsés (fin du warning getServerSnapshot)
  * refonte consent.tsx / i18n / providers en stores externes hydration-safe (règle react-hooks/set-state-in-effect)
- Tests navigateur validés : rendu dark/light, desktop/mobile, chatbot (tarifs exacts, navigate, create_lead), essai gratuit (201 + 409 doublon), contact (201/400), admin (login, stats, statut, CSV), Omnis (états + replis), PWA prompt, barre mobile, sticky footer
- Bases de données vérifiées : leads, trials, events, consents, analytics remplis par les parcours réels
- docs/ créés : DECISIONS.md, TODO-HUMAN.md, PROGRESS.md

Stage Summary:
- Site complet livré sur la route / : design Obsidienne & Or conforme §32, chatbot vendeur IA + Omnis, capture de leads fonctionnelle de bout en bout, Espace équipe, PWA
- Lint 0 erreur, tsc 0 erreur, dev.log propre
- Agents : 2-a (sections 1-7), 2-b (sections 8-14), 4 (overlays) — intégrés et vérifiés

---
Task ID: 5-a
Agent: general-purpose
Task: Traductions es/zh/de complètes à 100 % (translations.ts)

Work Log:
- Lecture du worklog (règle du projet) puis du fichier src/lib/i18n/translations.ts en entier : fr (source, 477 lignes, 344 clés-feuilles + 6 tableaux) et en (complet) analysés clé par clé, y compris les clés récentes projects et journal et les labels renumérotés (11 — Essai gratuit, 12 — Contact)
- Vérification préalable des caractères non ASCII (aucun NBSP/U+202F : les montants « 1 500 000 GNF » utilisent des espaces simples — repris tels quels, sans reformatage)
- Remplacement des 3 blocs partiels par l'outil Edit (un par langue, ni fr, ni en, ni l'export DICTS touchés) :
  * es : Partial<Dict> → Dict complet (tú, « ¿…? », guillemets « »), 344 valeurs
  * zh : Partial<Dict> → Dict complet (chinois simplifié, 您, ponctuation pleine large ，。？！, quotes «“”»), 344 valeurs
  * de : Partial<Dict> → Dict complet (vouvoiement Sie, guillemets „ “, AGB/Impressum/Datenschutzerklärung), 344 valeurs
- Clés existantes (brand, nav, hero, common) conservées à l'identique ; structure copiée sur fr : mêmes objets imbriqués, mêmes tableaux dans le même ordre (sectors.items ×14, process.steps ×5, pricing.included.items ×8, pricing.notes.items ×4, faq.items ×6, about.values ×4), badge « Bientôt » conservé sur services.items.strategy
- Commentaire d'en-tête du fichier mis à jour (es/zh/de complets, repli fr conservé) ; mention TODO-HUMAN H-09 (relecture humaine) maintenue
- Vérifications : bunx tsc --noEmit → 0 erreur sur translations.ts/i18n (4 erreurs préexistantes hors périmètre : examples/websocket ×2, skills/image-edit, skills/stock-analysis) ; bun run lint → 0 erreur ; grep 'label:' → 65 (13 par langue = 12 sections numérotées + hero.label) ; script bun de comparaison structurelle → en/es/zh/de 100 % identiques à fr (350 chemins chacun, tableaux de même longueur, aucune valeur vide) ; scan emoji → aucun ; registres vérifiés (tú / 您 ×50 / Sie ×40)

Stage Summary:
- Couverture es/zh/de portée de ~30 clés à 344 clés-feuilles = 100 % des clés du français, typées Dict (TypeScript garantit désormais l'exhaustivité à la compile) ; DICTS reste en Record<Lang, Partial<Dict>> intouché
- Décisions de traduction notables : « sur devis » → « A consultar » (es) / « 按需报价 » (zh) / « Auf Angebot » (de), cohérentes entre pricing, notes, faq et legal ; journal → « Blog » (es) / « 博客 » (zh) / « Journal » (de) ; de BTP → « Hoch- & Tiefbau » ; factura (trésorerie) → « Treasury-Management » (de) ; noms propres inchangés (Factura Pro implicite via tags, SaaS, GNF, WhatsApp, Gmail, Mobile Money, Omnis) ; conditions légales provisoires (H-10) et horaires « à confirmer » traduits fidèlement sans invention
- Agents suivants : rien à câbler (même clé export DICTS) ; toute nouvelle clé fr doit désormais être ajoutée dans les 5 langues sous peine d'erreur tsc ; H-09 (relecture humaine es/zh/de) reste ouvert dans docs/TODO-HUMAN.md

---
Task ID: 6-a
Agent: general-purpose
Task: E-mails transactionnels — sendTrialAck + sendNewsletterWelcome et câblage essai/newsletter

Work Log:
- Lecture du worklog (règle du projet) puis des contrats : src/lib/adapters/email.ts (sendEmail + sendContactAck, mode mock via EmailLog si RESEND_API_KEY absente — vérifiée absente), src/app/api/contact/route.ts (câblage de référence), src/lib/catalog.ts (findSaas/SAAS_PRODUCTS), src/lib/leads.ts (upsertLead retourne { lead, isNew }, accepte email), src/lib/brand.ts (BRAND), prisma/schema.prisma (modèle EmailLog) — aucun autre fichier modifié
- src/lib/adapters/email.ts : ajout de sendTrialAck(email, firstName, saasName, leadId) — template « trial_ack », sujet « Votre demande d'essai gratuit — {BRAND} », essai 7 jours du SaaS nommé, activation par l'équipe + recontacte rapidement, rappel « entièrement gratuit — aucune carte bancaire » ; ajout de sendNewsletterWelcome(email, leadId) — template « newsletter_welcome », sujet « Votre inscription est confirmée — {BRAND} », partage occasionnel de conseils et actualités, mention du Journal du site sans lien ; signature « — L'équipe {BRAND} » partout, texte brut multiligne join("\n"), logs via sendEmail ; commentaire de l'interface SendEmailInput mis à jour (liste des templates) — sendEmail et sendContactAck inchangés
- Vérification demandée par la mission : le champ email N'EXISTAIT PAS dans le schéma de /api/trial (formulaire : prénom, nom, téléphone, saasSlug, consent, locale) → ajout en OPTIONNEL dans le schéma Zod, strictement calqué sur contact/route.ts (z.string().email().optional().or(z.literal(""))), transmis à upsertLead (email: d.email || null) ; l'appel sendTrialAck est conditionné à if (d.email) — si l'e-mail est absent ou vide, aucun envoi, aucun crash (règle « destinataires réels uniquement » respectée : le frontend actuel n'envoie pas d'e-mail, donc rien ne part tant que le formulaire ne le collecte pas)
- src/app/api/trial/route.ts : après création lead + trialRequest + leadEvent, await sendTrialAck(d.email, d.firstName, findSaas(d.saasSlug)?.name ?? d.saasSlug, lead.id) dans un try/catch silencieux (console.error "[trial] ack email") AVANT la réponse 201 — le nom d'affichage du SaaS vient exclusivement du catalogue via findSaas (déjà validé par SAAS_SLUGS), jamais inventé
- src/app/api/newsletter/route.ts : upsertLead désormais déstructuré ({ lead }), puis await sendNewsletterWelcome(parsed.data.email, lead.id) en try/catch silencieux (console.error "[newsletter] welcome email") avant la réponse 201 ; garde if (parsed.data.email) conservée bien que l'e-mail soit requis par le schéma
- Smoke test bout en bout en mode mock (sans RESEND_API_KEY) : POST /api/newsletter → 201 + EmailLog { template: newsletter_welcome, status: mock } ; POST /api/trial avec email → 201 + EmailLog { template: trial_ack, status: mock, sujet « Votre demande d'essai gratuit — EINSOF » } ; POST /api/trial sans email → 201 et AUCUN EmailLog (chemin d'évitement vérifié) ; données de test (leads + email_logs example.test) supprimées ensuite — base rendue à son état antérieur

Stage Summary:
- 3 fichiers modifiés : src/lib/adapters/email.ts (+ sendTrialAck, + sendNewsletterWelcome), src/app/api/trial/route.ts (+ champ email optionnel, + envoi conditionnel), src/app/api/newsletter/route.ts (+ envoi de bienvenue) — aucune dépendance ajoutée, aucun emoji, aucun lien ni numéro inventé, tout en français sobre signé « — L'équipe EINSOF » via la constante BRAND
- Décision clé : le champ email étant absent du schéma d'essai (contrairement à l'hypothèse de la mission), il a été ajouté en optionnel au lieu de forcer un destinataire ; un échec d'e-mail ne peut jamais faire échouer une réponse 201 (try/catch silencieux, motif identique à contact/route.ts) ; en mode mock chaque envoi est tracé dans email_logs et visible dans l'Espace équipe
- Vérifications : bun run lint → 0 erreur (exit 0, sortie vide) ; bunx tsc --noEmit → 0 erreur dans mes fichiers (4 erreurs préexistantes hors périmètre : examples/websocket ×2, skills/image-edit, skills/stock-analysis) ; dev.log → aucune erreur serveur (seule une alerte pre-existing allowedDevOrigins du sandbox)
- Agents suivants : si le formulaire d'essai (TrialSection) collecte un jour l'e-mail, il suffit d'ajouter le champ au payload submitTrial (api-client.ts) — l'API l'accepte déjà et enverra l'accusé ; les 4 templates email (contact_ack, trial_ack, newsletter_welcome, custom) transitent tous par sendEmail (Resend si RESEND_API_KEY, sinon journalisation EmailLog)

---
Task ID: 6-b
Agent: general-purpose
Task: CRUD éditorial complet du Journal (API POST/PUT/DELETE + panneau admin PostsPanel)

Work Log:
- Lecture du worklog, du schéma BlogPost, de l'ancienne route admin/posts (GET + PATCH publication), d'AdminOverlay.tsx (conventions des panneaux), de seed-content.ts, de /api/posts + JournalSection.tsx (format de lecture public) et du pattern CRUD admin/projects
- Format de sérialisation verrouillé (identique au seed) : title/excerpt = JSON {"fr":"…","en":"…"} (chaînes simples) ; body = JSON {"fr":"p1\n\np2","en":"…"} — chaque locale est une CHAÎNE de paragraphes jointe par \n\n (parseLocaleJson ne garde que les valeurs string et JournalSection fait pickLocale(body, lang).split("\n\n") : un tableau casserait le rendu public)
- src/app/api/admin/posts/route.ts réécrit (GET + PATCH historiques conservés compatibles) : GET sans paramètre = liste inchangée + readingMin ajouté ; GET ?id= = détail complet multilingue (title/excerpt/body renvoyés en cartes {fr,en,…}) pour préremplir l'éditeur, 404 si inconnu ; POST = création (Zod : slug regex ^[a-z0-9]+(-[a-z0-9]+)*$ 3-80 + unicité → 409 slug_exists ; title fr 3-200 requis, en/es/zh/de optionnels ≥3 ; excerpt fr 20-400 requis, optionnels ≥3 ; body fr 100-20000 requis, optionnels ≥3, accepte chaîne ou tableau de paragraphes normalisé en \n\n ; category 2-40 ; readingMin int 1-60 optionnel sinon estimation mots/200 arrondi sup bornée [1,60] ; isPublished défaut false ; publishedAt ISO optionnel, mis à now si publication sans date) ; PUT = mise à jour par id, tous champs optionnels sauf id, title/excerpt/body fournis REMPLACENT l'objet entier par locale, readingMin ré-estimé si body modifié sans readingMin explicite, 404 si id inconnu, 409 si nouveau slug pris ; DELETE = ?id= définitif (vérification d'existence → 404, plus sûr que projects qui laisse P2025 → 500) ; toutes les routes : isAdmin() → 401, bad JSON → 400, enveloppe {ok, data|error}, console.error "[admin/posts <MÉTHODE>]", 400 validation renvoie fields: error.flatten().fieldErrors (pattern projects)
- src/components/admin/PostsPanel.tsx créé (autonome, "use client", export nommé PostsPanel + default, props { onUnauthorized }) : liste GET /api/admin/posts (titre, /slug · catégorie · X min · date, statut Publié—date/Masqué, Switch publication PATCH, boutons Modifier/Supprimer icônes lucide h-10 w-10, Supprimer via window.confirm comme ProjectsPanel) ; éditeur inline (panneau large au-dessus de la liste, retenu plutôt qu'un Dialog Radix pour éviter le conflit de z-index et le double-Échap avec l'overlay z-[90]) : champs communs (slug auto-suggéré depuis le titre fr — NFD, diacritiques retirés, minuscules/tirets, 80 max — éditable et non écrasé ensuite ; catégorie libre ; readingMin numérique optionnel ; Switch Publier) + Tabs par langue fr/en/es/zh/de (fr marqué *, optionnels avec placeholder exact « Laisser vide pour masquer cette langue — repli français automatique côté site », point or si une langue optionnelle est remplie, Titre Input / Extrait Textarea / Corps Textarea un paragraphe par ligne) ; corps sérialisé en tableau de paragraphes au submit (lignes vides filtrées), l'API joignant par \n\n ; validation client (fr titre ≥3, extrait ≥20, corps ≥100, slug regex 3-80, catégorie 2-40, readingMin 1-60) + messages serveur en français (409 slug pris, 400 bornes, 404 introuvable, réseau) ; notices role="status" (créé/enregistré/publié/masqué/supprimé) ; préremplissage édition via GET ?id= (body \n\n → \n à l'affichage)
- Style conforme à l'admin : border-line, bg-surface, focus:border-gold, text-mute, h-10 inputs, GoldButton (min-h-9!/10! px-3!/4! text-xs!), Tabs stylées comme PricingSection (TabsList border-line bg-transparent, trigger data-[state=active]:text-goldtext), aucune couleur bleue, aucun emoji, font-serif pour les titres, aria-label/aria-required/role=alert, tout en français
- Aucune modification hors des 2 fichiers autorisés (AdminOverlay.tsx et prisma/schema.prisma intacts — l'orchestrateur câblera <PostsPanel onUnauthorized={() => …} /> à la place du panneau interne)
- Tests curl (port 3000) : POST/PUT/DELETE/GET sans session → 401 ; login → cookie ; POST création 201 (corps tableau + en, readingMin estimé à 1, publishedAt auto) ; POST doublon → 409 slug_exists ; POST invalide → 400 + fields (slug/title/excerpt/body/category) ; GET ?id= → détail au format seed ("p1\n\np2") ; GET id inconnu → 404 ; PUT → 200 (remplacement par locale vérifié : es ajoutée, en d'excerpt supprimée, readingMin=7 respecté, publishedAt intact si isPublished=false) ; PUT conflit slug → 409 ; PATCH → 200 ; /api/posts public expose l'article de test avec body.fr string (split("\n\n") OK) ; DELETE → 200 puis 404 ; base rendue aux 3 articles seed
- Qualité : bun run lint → 0 erreur (projet entier) ; bunx tsc --noEmit → 0 erreur dans mes fichiers (erreurs préexistantes hors périmètre : examples/websocket ×2, skills/image-edit, skills/stock-analysis)

Stage Summary:
- L'Espace équipe dispose désormais d'une rédaction complète du Journal : créer, traduire (5 langues, repli fr automatique), publier/masquer, corriger et supprimer — sans toucher au seed
- Contrat API (enveloppe {ok, data|error} partout, 401 sans session) : GET /api/admin/posts → data: [{id, slug, title(fr), category, readingMin, isPublished, publishedAt, createdAt}] ; GET ?id= → data: {id, slug, title:{fr,en?,…}, excerpt:{…}, body:{…}, category, readingMin, isPublished, publishedAt, createdAt} ; POST {slug, title, excerpt, body(string|[] par locale), category, readingMin?, isPublished?, publishedAt?} → 201 {id} | 409 slug_exists | 400 validation ; PUT {id, …champs optionnels} → {id} | 404 | 409 | 400 ; PATCH {id, isPublished} (inchangé, +publishedAt si publication) ; DELETE ?id= → {ok:true} | 404 | 400
- Format de stockage retenu : body par locale = chaîne de paragraphes jointe \n\n (l'API accepte aussi un tableau et normalise) — compatibilité totale /api/posts + JournalSection et des 3 articles seed vérifiée
- Import pour l'orchestrateur : import { PostsPanel } from "@/components/admin/PostsPanel" (ou default) puis {tab === "journal" && <PostsPanel onUnauthorized={() => goto("login")} />} — signature identique aux autres panneaux ; l'ancien PostsPanel interne d'AdminOverlay.tsx peut être retiré sans autre dépendance
- Agents suivants : les limites par langue sont fr strict (3-200 / 20-400 / 100-20000) et traductions souples (≥3) ; readingMin se ré-estime à chaque PUT de body sans valeur explicite ; le champ category reste une clé libre affichée en badge côté public (journal.categories.* si traduite)

---
Task ID: 6-c
Agent: general-purpose
Task: Réservation de démo (tables+seed+API+chatbot suggest_slots/book_demo+switch_locale/theme+DemosPanel)

Work Log:
- Lecture des contrats (worklog, schema.prisma, chat/message, prompt.ts, knowledge.ts, chat/, leads.ts, rate-limit.ts, catalog.ts, translations.ts, AdminOverlay.tsx) — AdminOverlay.tsx, page.tsx et les composants site/ NON modifiés
- Schéma (§24) : modèles DemoSlot (startsAt, capacity @default(1), isActive @default(true)) et DemoBooking (slotId/leadId, saasSlug?, status @default("confirmed") // confirmed|cancelled|done|no_show, locale @default("fr")) + relation inverse demoBookings sur Lead ; `bun run db:push` réussi (client régénéré)
- scripts/seed-demo-slots.ts (bun, idempotent) : 3 semaines, mardi/jeudi 10:00 et 15:00 heure de Conakry (GMT+0 → stockées telles quelles en UTC), capacité 2, upsert par findFirst date+heure ; exécuté → 12 créneaux créés, contre-vérification du compte (12), re-exécution → « 0 créneaux créés, 12 déjà présents »
- src/lib/demo.ts (partagé API + chatbot) : listUpcomingSlots(limit) (startsAt > now, isActive, remaining = capacity − count(bookings status != cancelled), créneaux pleins écartés, tri asc) et bookDemoSlot(input) — normalisePhone, contrôles rapides (créneau inexistant/inactif/passé → invalid_slot ; dédup téléphone : une réservation confirmée future max → already_booked), upsertLead (source "demo", interests = saasSlug ou "demo", message « Réservation de démo — créneau du … » en fr avec Intl/Conakry), LeadEvent "demo_requested" horodaté, puis $transaction interactive Prisma qui RE-vérifie capacité avant create (full → rollback, aucune réservation orpheline) ; bookDemoSchema Zod partagé (firstName/lastName 1-80, phone regex 7-20 chiffres/espaces/+ avec ≥7 chiffres, email optionnel, saasSlug ∈ SAAS_SLUGS optionnel, slotId uuid, locale 2 (défaut fr), consentContact literal true)
- API publique : GET /api/demo/slots → {ok, data:[{id, startsAt(ISO), remaining}]} limité à 12, Cache-Control no-store ; POST /api/demo/book → rate-limit 5/min (pattern contact, clé demo:IP), Zod (consentContact literal true sinon 400), 201 {ok, data:{bookingId, startsAt}} ; invalid_slot → 400, full/already_booked → 409, échec serveur → 500
- Chatbot : prompt.ts — 4 nouveaux outils documentés EXACTEMENT comme les existants (suggest_slots {args:{}} avec interdiction de citer une heure soi-même ; book_demo {slot_id, first_name, last_name, phone, email?, saas_slug?} avec procédure obligatoire : coordonnées → suggest_slots → book_demo sur créneau EXPLICITEMENT choisi, slot_id jamais inventé, réservation = accord de recontact pour la démo ; switch_locale {locale: fr|en|es|zh|de} ; switch_theme {theme: dark|light}) + create_lead rappelé prioritaire hors créneau ; ModelAction/parseActions étendus ; knowledge.ts — section ESSAIS ET DÉMOS réécrite (démo 30 min en visio pour logiciels/SaaS, mardi/jeudi 10h et 15h heure de Conakry, places limitées, jamais de créneau/prix de démo inventé — aucune promesse au-delà)
- message/route.ts : filterActions étendu — book_demo cap de sécurité strict (nom, téléphone ≥7 chiffres, slot_id uuid, saas_slug ∈ catalogue, e-mail valide, sinon action ABANDONNÉE) ; switch_locale/switch_theme validés contre les listes fr|en|es|zh|de et dark|light ; suggest_slots → listUpcomingSlots(4), args REMPLACÉS par les créneaux réels {slots:[{id,startsAt,remaining}]} (aucune donnée du LLM transmise), action abandonnée si vide ; book_demo → bookDemoSlot, args remplacés par {ok:true, startsAt} ou {ok:false, reason:"full"|"already_booked"|"invalid_slot"|"error"} ; un seul canal d'actions existant (SSE « action » après les tokens) ; dégradation sûre si la base est indisponible (pas de crash, pas d'invention)
- Client chat : chat-context.tsx — ChatMsg {kind?: "demo-slots"|"demo-system", slots?, startsAt?} ; handlers suggest_slots (carte dans le fil), book_demo ({ok:true} → retire la carte utilisée + confirmation système ; {ok:false} → messages traduits, 409 full/invalid_slot → re-proposition via GET /api/demo/slots), switch_locale → useI18n().setLang (LANGS validé), switch_theme → next-themes setTheme ; contexte expose demoBooked/demoFailed ; DemoSlotsCard.tsx (nouveau) — carte « Créneaux de démonstration » : liste des slots (Intl.DateTimeFormat timeZone Africa/Conakry, ex. « mar. 21 oct. · 10:00 (Conakry) » + places restantes), bouton Réserver ≥44px → mini-formulaire inline (Input/Button/Select shadcn, prénom/nom/téléphone/e-mail optionnel/SaaS optionnel, note de consentement) → POST /api/demo/book ; ChatWidget.tsx — rendu des deux nouveaux kinds (carte + confirmation bordée or avec CalendarCheck2, texte via t("chat.demo.confirmed") {date})
- i18n : 20 nouvelles clés chat.demo.* (title, intro, seats {n}, book, formT, firstName, lastName, phone, email, saas, saasNone, consentNote, submit, cancel, confirmed {date}, full, already, invalidSlot, error, tz) ajoutées dans les 5 langues (fr source ; en/es tú/zh 您/de Sie soignés ; vérification bun : 20/20/20/20/20 ; tsc Dict exhaustif OK)
- Admin : GET /api/admin/demos (isAdmin 401 ; réservations groupées par créneau : upcoming asc / past desc, {id, startsAt, capacity, taken, bookings:[{id, status, saasSlug, locale, createdAt, lead{firstName,lastName,phone}}]}) ; PATCH {id, status ∈ confirmed|cancelled|done|no_show} (401/400/500, enveloppe standard) ; DemosPanel.tsx (nouveau, "use client", export nommé + default, props {onUnauthorized}) — « À venir »/« Passées », header créneau + taken/capacity, réservations avec pastille de statut, nom, téléphone, Badge SaaS (nom via catalogue), locale, Select shadcn z-[100] de statut, Skeleton/états vides, tout en FRANÇAIS codé en dur, style AdminOverlay (border-line, bg-surface, focus:border-gold, aucun emoji, aucun bleu)
- Qualité : bunx tsc --noEmit → 0 erreur dans mes fichiers (4 préexistantes examples/ et skills/ ignorées) ; bun run lint → 0 erreur (projet entier) ; aucun emoji, aucune couleur bleue/indigo dans mes fichiers (grep) ; SSE chat re-testée (tokens + done OK, aucune action fabriquée)
- Tests réservation via exécution directe du module (bun) : 400 Zod ✓, réservation ok ✓, doublon téléphone → already_booked ✓, capacité 2 remplie puis sur-réservation → full SANS réservation orpheline (rollback) ✓, uuid inconnu → invalid_slot ✓, lead source=demo interests=factura-pro + LeadEvent demo_requested ✓, remaining recalculés (2→1) ✓ ; données de test conservées : 1 réservation confirmée « Test Démo » (marqueur DEMO_TEST_6C dans notes du lead) sur le premier créneau
- curl sur le serveur de dev : POST /api/demo/book {bad json → 400, consent manquant → 400 « expected true », téléphone invalide → 400} ✓ ; GET/PATCH /api/admin/demos sans auth → 401 ✓ ; GET /api/demo/slots → 500 ACTUELLEMENT : le processus next dev démarré AVANT db:push garde en cache l'ancien client Prisma (TypeError db.demoSlot undefined, cf. dev.log) — le rechargement .env (soft) ne suffit pas ; logique et données vérifiées par exécution directe (12 créneaux, remaining=2) → UN redémarrage du serveur de dev par l'orchestrateur rendra GET /api/demo/slots opérationnel (aucun restart exécuté, consigne respectée ; même contrainte que pour tout ajout de modèle Prisma à chaud)
- dev.log : aucune erreur nouvelle hors ces 500 dus au client Prisma périmé (4 occurrences du même TypeError) ; POST /api/chat/message 200

Stage Summary:
- Réservation de démo de bout en bout : schéma §24 (DemoSlot/DemoBooking + demoBookings sur Lead), seed idempotent (12 créneaux réels, mardi/jeudi 10:00 & 15:00 Conakry, capacité 2), API publique rate-limitée avec anti-surréservation transactionnelle et dédup téléphone, chatbot outillé sans aucune donnée inventée, carte de réservation inline dans le chat, panneau admin Démonstrations prêt à câbler
- CONTRAT DES ACTIONS CHAT (canal SSE existant, événement {"type":"action","tool":…,"args":…}, une seule action par réponse, émise APRÈS les tokens) :
  * {"tool":"suggest_slots","args":{"slots":[{"id":"<uuid>","startsAt":"2026-10-20T10:00:00.000Z","remaining":2}, …]}} — 4 créneaux max, uniquement des données réelles ; args remplacés par le serveur
  * {"tool":"book_demo","args":{"ok":true,"startsAt":"<ISO>"}} ou {"tool":"book_demo","args":{"ok":false,"reason":"full"|"already_booked"|"invalid_slot"|"error"}} — le serveur exécute la réservation transactionnelle AVANT l'émission
  * {"tool":"switch_locale","args":{"locale":"fr"|"en"|"es"|"zh"|"de"}} et {"tool":"switch_theme","args":{"theme":"dark"|"light"}} — transmis tels quels, appliqués par le client (setLang / setTheme)
  * create_lead reste prioritaire si coordonnées sans créneau ; les actions à données manquantes/inventées sont abandonnées côté serveur (jamais transmises)
- Intégration : <DemosPanel onUnauthorized={() => …} /> (import { DemosPanel } from "@/components/admin/DemosPanel" ou default) à câbler dans AdminOverlay par l'orchestrateur — même signature que PostsPanel ; client chat : nouveaux hooks de contexte demoBooked(startsAt)/demoFailed(reason) + ChatMsg.kind
- IMPORTANT orchestrateur : redémarrer UNE FOIS le serveur de dev pour charger le client Prisma régénéré (DemoSlot/DemoBooking) — GET /api/demo/slots répondra {ok, data:[…remaining…]} ; en attendant, le chat dégrade proprement (aucune carte, aucune erreur visible)
- Agents suivants : réutiliser listUpcomingSlots/bookDemoSlot de src/lib/demo.ts pour toute nouvelle entrée (Omnis, e-mail) ; une place est occupée tant que le statut de la réservation est != "cancelled" (cancelled libère la place au recalcul, done/no_show conservent l'historique sans libérer)
---
Task ID: 7
Agent: general-purpose
Task: Partenaires / Témoignages / Documents — tables, API publiques+admin, 3 sections publiques masquées si vides, 3 panneaux admin, i18n ×5

Work Log:
- Lecture des contrats (worklog 5-a/6-a/6-b/6-c, schema.prisma, ProjectsSection, api/projects, api/admin/projects, AdminOverlay/ProjectsPanel, kit.tsx, locale-json, translations, analytics, chat-bus) — AdminOverlay.tsx et page.tsx NON modifiés
- Schéma (§23/§24) : 3 nouveaux modèles — Partner (name, logoUrl?, websiteUrl?, description?, sortOrder, isActive @default(true)), Testimonial (authorName, authorRole?, company?, sector?, quote JSON {"fr":…} // repli fr, rating? 1-5 // donnée réelle jamais inventée, sortOrder, isPublished @default(false)), Document (slug @unique regex ^[a-z0-9]+(-[a-z0-9]+)*$, title JSON multi-langues, description? JSON, category?, fileUrl // lien réel client TODO-HUMAN H-08, fileKind? // pdf|xlsx|docx|link, visibility @default("public") // public|lead|team, isPublished @default(false), sortOrder) ; `bun run db:push` réussi (client Prisma régénéré)
- API publiques (enveloppe {ok, data}, try/catch 500, force-dynamic, console.error "[…]") : GET /api/partners (isActive, tri sortOrder puis name, jamais de limite d'inventaire), GET /api/testimonials (isPublished, tri sortOrder puis createdAt, take 12), GET /api/documents (isPublished ET visibility="public" — « lead » et « team » JAMAIS listés ; items {id, slug, title, description, category, fileUrl, fileKind}, take 24)
- API admin (pattern projects : isAdmin→401, Zod, enveloppe {ok, data|error}) — GET liste complète + POST 201 + PUT + DELETE ?id=, P2025→404, P2002→409 slug_exists, console.error "[admin/… POST|PUT|DELETE]" :
  * /api/admin/partners — name 2-120, logoUrl/websiteUrl URL optionnelle (""→null), description 0-500, sortOrder 0-999, isActive bool
  * /api/admin/testimonials — authorName 2-120, authorRole/company/sector 0-120 nullables, quote = objet {fr 10-600 requis + en/es/zh/de optionnels 10-600} sérialisé JSON.stringify, rating int 1-5 nullable, sortOrder, isPublished
  * /api/admin/documents — slug regex 3-80 unique (vérif findUnique + catch P2002 → 409), title {fr 3-200 requis + traductions optionnelles}, description optionnelle même pattern, category 0-40, fileUrl 1-500 (URL ou chemin), fileKind enum pdf|xlsx|docx|link, visibility enum public|lead|team, isPublished, sortOrder
- Sections publiques (pattern EXACT ProjectsSection : "use client", fetch au montage, return null si vide/erreur, Reveal, card-lift, or rare, aucun emoji, aucun bleu) :
  * PartnersSection (id="partners", tone="surface") — grille sm:2/lg:3 ; logoUrl → next/image fill sizes object-contain unoptimized dans cadre h-20 (unoptimized = compatible avec toute URL externe sans remotePatterns) ; sinon bloc typographique font-serif (jamais d'image générée) ; description ; websiteUrl → lien externe rel="noopener noreferrer" target="_blank" ArrowUpRight + trackCta("partners", id) ; CTA partners.become → trackCta + openForm("contact") via chat-bus
  * TestimonialsSection (id="testimonials", tone="deep" + text-[#f5f2ea] comme PillarsSection) — guillemet serif décoratif or, citation text-lg/md:text-xl, auteur + rôle — entreprise, GoldBadge secteur, étoiles lucide Star UNIQUEMENT si rating réel (n remplies or, reste muettes, aria-label "n/5") ; pickLocale pour quote
  * DocumentsSection (id="documents", tone="surface") — liste de rangées : icône lucide selon fileKind (pdf→FileText, xlsx→FileSpreadsheet, docx→File, link→Link2, défaut→File) dans cadre bordé or, titre serif + GoldBadge catégorie + description, bouton ≥44px (a href fileUrl, download="" si fichier, target _blank pour tous, icône Download/Link2) → trackCta("documents", slug) ; note documents.emptyNote sous la liste
- i18n : 17 nouvelles clés ×5 langues — partners.{label,title,tGold,sub,become,visit}, testimonials.{label,title,tGold,sub}, documents.{label,title,tGold,sub,download,emptyNote} ; labels numérotés 13/14/15 (les sections 11 Essai et 12 Contact existant déjà) ; fr source, en naturel, es (tú), zh (您 + ponctuation pleine largeur), de (Sie) ; textes neutres §20.4 (aucun client fictif, sub précise « seules celles qui nous autorisent à les citer ») ; vérification bun : 358/358/358/358/358 clés, 0 manquante, 0 extra (Dict exhaustif OK)
- Panneaux admin (pattern PostsPanel/ProjectsPanel : "use client", props {onUnauthorized}, export nommé + default, fetch + 401 → onUnauthorized(), tout FRANÇAIS, border-line/bg-surface/h-10/focus:border-gold, aucun emoji) :
  * PartnersPanel — liste (nom, domaine, ordre, Switch activation → PUT immédiat) + éditeur création/édition (nom, logoUrl, websiteUrl, description, sortOrder, Switch isActive) + suppression confirm()
  * TestimonialsPanel — liste (auteur, note/5, rôle·entreprise·secteur, aperçu citation, Switch publication) + éditeur avec onglets de langue (approche PostsPanel : Tabs fr requis + 4 traductions optionnelles, pastille or si remplie) + rating optionnel 1-5 + ordre
  * DocumentsPanel — liste (titre, slug, catégorie, visibilité, type, état "Publié (non public)" si visibility≠public) + éditeur : slug auto-suggéré depuis titre fr (slugTouched ref, comme PostsPanel), Tabs titre/description ×5 langues, catégorie, lien fichier, Select shadcn type (pdf/xlsx/docx/link) et visibilité (public/lead/team, z-[100] comme DemosPanel), ordre, Switch publication ; notice explicite si publication d'un document non-public
- Tests (bun direct, serveur NON redémarré, cache Prisma périmé respecté) :
  * scripts/test-7-trust-content.ts — crée 1 partenaire + 1 témoignage + 1 document TEST_7 (+ 1 variante masquée de chacun) via Prisma, vérifie les requêtes publiques (mêmes where que les routes) : actif listé/inactif exclu, publié listé/non publié exclu, public listé/« lead » JAMAIS listé, JSON {fr,en} lisible — 8/8 OK puis SUPPRESSION totale, base rendue vierge (0 TEST_7 restant, règle §20.4)
  * Handlers publics invoqués directement via bun : GET /api/partners, /api/testimonials, /api/documents → 200 {ok, data:[]} (base vide → sections masquées) ; les handlers admin exigent le scope requête Next (cookies()) — comportement attendu hors serveur, 401 sans session en runtime
- Qualité : bun run lint → 0 erreur (projet entier) ; bunx tsc --noEmit → 0 erreur dans mes fichiers (4 préexistantes examples/ et skills/ ignorées) ; grep bleu/indigo/emoji → aucun ; dev.log → aucune erreur nouvelle (compilations OK, Fast Refresh reloads dus à translations.ts, /api/projects et /api/posts 200)

Stage Summary:
- L'infrastructure « confiance » (§23) et « ressources » (§24) est complète : 3 tables (Partner/Testimonial/Document), 3 API publiques filtrées (isActive / isPublished / isPublished+visibility="public"), 3 API admin CRUD (GET/POST/PUT/DELETE, Zod, enveloppe {ok, data|error}, 401/400/404/409), 3 sections publiques TOUTES MASQUÉES tant que le client n'a rien fourni (§20.4 : base actuelle vide, aucune donnée fictive), 3 panneaux admin prêts à câbler
- SIGNATURES D'IMPORT (l'orchestrateur câble page.tsx + AdminOverlay) :
  * import { PartnersSection } from "@/components/site/PartnersSection" (ou default) → <PartnersSection /> (aucune prop)
  * import { TestimonialsSection } from "@/components/site/TestimonialsSection" → <TestimonialsSection />
  * import { DocumentsSection } from "@/components/site/DocumentsSection" → <DocumentsSection />
  * import { PartnersPanel } from "@/components/admin/PartnersPanel" → <PartnersPanel onUnauthorized={() => goto("login")} />
  * import { TestimonialsPanel } from "@/components/admin/TestimonialsPanel" → <TestimonialsPanel onUnauthorized={() => goto("login")} />
  * import { DocumentsPanel } from "@/components/admin/DocumentsPanel" → <DocumentsPanel onUnauthorized={() => goto("login")} />
- Clés i18n ajoutées (fr/en/es/zh/de) : partners.label "13 — Partenaires", partners.title "Ils nous font", partners.tGold "confiance.", partners.sub, partners.become "Devenir partenaire", partners.visit "Visiter le site" ; testimonials.label "14 — Témoignages", testimonials.title "Ce que disent", testimonials.tGold "nos clients.", testimonials.sub ; documents.label "15 — Ressources", documents.title "Documents et", documents.tGold "ressources utiles.", documents.sub, documents.download "Télécharger", documents.emptyNote. Ordre d'insertion suggéré : Partners/Testimonials/Documents après ProjectsSection et avant JournalSection (les numéros 13-15 sont indicatifs, à renuméroter si l'orchestrateur insère ailleurs)
- Contrats : les documents visibility="lead" sont prévus pour un futur blocage de téléchargement derrière formulaire (jamais listés publiquement dès maintenant) ; l'édition des panneaux recharge la liste depuis GET (données complètes retournées, y compris multi-langues) ; scripts/test-7-trust-content.ts ré-exécutable (idempotent, auto-nettoyant)
- IMPORTANT orchestrateur : redémarrer le serveur de dev (comme prévu après l'agent 6-c) pour charger le client Prisma régénéré (Partner/Testimonial/Document) — les routes répondront alors {ok, data:[…]} ; en attendant, les sections se masquent proprement (fetch catch → [])

---
Task ID: 8-9-10 (orchestration finale)
Agent: orchestrator (Z.ai Code)
Task: Intégration des livraisons 6-a/6-b/6-c/7, vérification navigateur complète, documentation

Work Log:
- Câblage AdminOverlay.tsx : 9 onglets (Flux, Journal→PostsPanel externe, Réalisations, Démos, Partenaires, Témoignages, Documents, E-mails, Push), suppression de l'ancien PostsPanel interne et de l'interface PostAdminRow
- Câblage page.tsx : PartnersSection + TestimonialsSection + DocumentsSection insérées entre Journal et Essai
- Renumérotation des étiquettes de sections dans les 5 langues (Partenaires 11, Témoignages 12, Ressources 13, Essai 14, Contact 15) pour conserver la cohérence numéro/ordre d'affichage
- Champ e-mail optionnel ajouté au formulaire d'essai (TrialSection + TrialPayload + clé trial.email ×5 langues) pour activer l'accusé sendTrialAck
- Redémarrage unique du serveur de dev (cache client Prisma périmé après db:push — modèles DemoSlot/DemoBooking/Partner/Testimonial/Document)
- Vérification agent-browser : réservation de démo de bout en bout (chat → coordonnées → carte créneaux Africa/Conakry → formulaire inline → confirmation → DemoBooking + Lead source=demo + LeadEvent), admin Démos (2/2 places), Journal CRUD (création 201 + suppression avec confirm), partenaire créé → section publique apparaît, supprimé → se remasque, newsletter → EmailLog newsletter_welcome visible onglet E-mails, mobile 390 px (footer collant), thème clair
- Apprentissages debug : les snapshots/refs agent-browser peuvent être obsolètes — vérifier via eval DOM direct ; le widget chat ouvert recouvre le bouton Subscribe du footer (occlusion, pas un bug) ; un article de test < 100 caractères est refusé par la validation (comportement voulu)
- Purge complète des données de test (leads, réservations, e-mails, chats, consentements, analytics, partenaire) — base livrée : 3 articles éditoriaux, 12 créneaux, 0 contenu fictif
- Docs mises à jour : PROGRESS.md (section « Compléments livrés » + nouvelle vérification), DECISIONS.md (push/e-mails/multilingue/démos), TODO-HUMAN.md (H-05/H-08/H-09 au niveau 🟡)
- Lint 0 erreur · tsc 0 erreur (projet) · dev.log propre

Stage Summary:
- Écart assumé : l'éditeur d'articles ne publie pas automatiquement à la création (isPublished=false par défaut) — publication volontaire par interrupteur, conforme au contrôle éditorial
- Le chatbot peut promettre des créneaux dans un tour puis les afficher au tour suivant (non-déterminisme LLM) ; la carte s'affiche dès que suggest_slots est émis — acceptable
- Site complet : 15 sections + 5 nouvelles infrastructures de contenu, chatbot à 6 outils, admin à 9 onglets, i18n ×5 complets, e-mails + push + cron opérationnels en sandbox

---
Task ID: 11
Agent: orchestrator (Z.ai Code)
Task: Refonte complète de la bibliothèque d'animation (demande client : interface « très très animée » — animations de blocs + chiffres)

Work Log:
- Réécriture de src/components/motion/index.tsx autour de framer-motion v12 : Reveal (6 variantes up/down/left/right/scale/blur), Stagger + StaggerItem (orchestration spring), Parallax, Float, Shimmer, Beam (bordure or rotative), SpotlightCard (halo suivant curseur), DrawRule (filet qui se dessine), Counter (spring + prefix/suffix), VelocityRow (ruban réactif au scroll), LettersReveal, PopIn, PulseGlow, CurtainIntro (rideau d'ouverture), CollapseMotion, ScrollProgress spring
- globals.css : .shimmer-text, .text-outline / .text-outline-faint, .glow-pulse, .spin-slower / .spin-reverse, .spot-card (halo interne), @property --beam-angle + .beam-wrap
- kit.tsx : SectionHeading animée (WordMask titre + filet DrawRule + sous-titre Reveal), GoldButton primary avec lift + glow renforcé, export GoldRuleDraw
- page.tsx : monté CurtainIntro

Stage Summary:
- Toutes les primitives respectent lightMode (reduce-motion / appareil faible) : rendu statique sans animation
- API 100 % rétrocompatible : Reveal/Counter/Marquee/Magnetic/Tilt/ScrollProgress/WordMask conservent leurs props
- Les sections restent à animer (tâches 12-a..d) : chaque section doit utiliser Stagger/StaggerItem + SpotlightCard + Beam + DrawRule + Parallax + Float + Shimmer

---
Task ID: 12-b
Agent: animations-blocs (Z.ai Code)
Task: Chorégraphie riche des 4 sections Services / Piliers / SaaS / Secteurs (motif « cartes spectaculaires »)

Work Log:
- Lecture worklog (tâches 1→11), bibliothèque src/components/motion/index.tsx (API complète), kit.tsx, globals.css (classes .beam-wrap/.spot-card/.text-outline-faint/.glow-pulse/.label-caps vérifiées) et i18n fr (services.tGold, strategy.badge « Bientôt », saas.items ×6, sectors.items ×14)
- ServicesSection.tsx : grille Reveal → Stagger step 0.08 + StaggerItem ; chaque carte = Tilt > Beam(hover ; always sur « strategy » qui garde opacity-80) > SpotlightCard > article.card-lift (classes et handler openForm/trackCta conservés) ; icônes Lucide dans PopIn delay écho i*0.08 + group-hover:rotate-6 group-hover:scale-110 ; numéro en filigrane text-7xl text-gold opacity-[0.07] avec group-hover:opacity-[0.15] transition-opacity ; flèche ArrowUpRight group-hover:-translate-y-1 group-hover:translate-x-1 + transition-[transform,color] group-hover:text-goldlight ; badge « Bientôt » enveloppé dans PulseGlow ; filigrane géant aria-hidden text-outline-faint de services.tGold en absolu derrière la grille (clip overflow-hidden, Parallax speed 0.25) ; DrawRule pleine largeur avant le CTA final
- PillarsSection.tsx : entrées alternées Reveal variant="left" (engagement 01) / variant="right" (engagement 02) ; citations serif passées dans WordMask (delay 0.12) ; anneaux dorés lévités via Float (y 10-12, duration 7-8, delay décalé) ; icônes ShieldCheck/Gem dans PopIn (0.35/0.5) ; GoldRule statique remplacée par DrawRule (filet qui se dessine) entre les items ; aucun Counter ajouté (aucun chiffre dans le contenu i18n — règle « ne rien inventer » respectée)
- SaasSection.tsx : 6 produits → Stagger step 0.06 ; motif commun Tilt > Beam (always conditionné à offers[0]?.featured — aucun produit SaaS featured aujourd'hui) > SpotlightCard > article.card-lift (+ classe group/relative) ; DeviceMockup : Tilt interne retiré (double inclinaison) remplacé par group-hover:scale-[1.02] transition ease-cubic ; mockup dans PopIn delay écho i*0.08 ; numéro filigrane absolu sur la maquette (0.07 → 0.15 au hover) ; blocs prix (PriceTag formatGNF + plage hôpital EXACTE conservée) dans Reveal variant="scale" delay 0.2 ; DrawRule pleine largeur avant le CTA essai ; handlers openForm("demo")/trackCta/scrollToSection inchangés
- SectorsSection.tsx : Marquee remplacé par VelocityRow baseVelocity 1.8 (réactif à la vitesse de scroll) ; badges secteurs : group + transition-all hover:-translate-y-1 hover:border-gold/60 hover:text-goldtext, point or group-hover:scale-[1.9] (pop) ; entrée de l'ensemble en Reveal variant="blur" ; fondus latéraux conservés
- Validation : bunx eslint sur les 4 fichiers → 0 erreur 0 warning ; bun run lint projet → seules 2 erreurs PRÉEXISTANTES dans src/components/motion/index.tsx (lignes 365/721, set-state-in-effect sur Counter et CurtainIntro de la tâche 11) — fichier interdit de modification, non touché ; dev.log : compilations propres, aucune erreur runtime

Stage Summary:
- Les 4 sections appliquent le motif commun « cartes spectaculaires » : Stagger/StaggerItem (spring blur) + Tilt 3D + SpotlightCard (halo curseur) + Beam (bordure or rotative au hover) + PopIn icônes + filigrane numéroté réactif + DrawRule de séparation
- Tarifs et contenus intacts : formatGNF (1,5 M / 20 M / 100 000 GNF), plage hôpital 1–5 000 000 GNF/mois, notes école/hôpital, badge « Bientôt » — aucun prix ni clé i18n modifié
- Toute l'animation passe par les primitives gated lightMode (aucun framer-motion direct nécessaire) : dégradation statique propre en mode léger / mobile
- SSR sûr : aucun Math.random, filigrane déterministe (index de boucle), handlers et cliquabilité des cartes/button conservés à 100 %
---
Task ID: 12-c
Agent: motion-choreographer (Z.ai Code)
Task: Chorégraphie riche des sections Process, Pricing, FAQ, Trial & Contact (interface « très très très animée »)

Work Log:
- ProcessSection.tsx : filet horizontal remplacé par DrawRule (dessin scaleX gauche→droite au scroll) derrière les nœuds ; nœuds en PopIn échelonné (delay i×0.12) avec anneau ping doré (animate-ping bg-gold/40, animation-delay i×0.3s inline) ; numéros d'étape en Reveal variant "scale" ; corps des étapes en Stagger/StaggerItem (step 0.1) ; mobile : border-l statique conservée + mêmes nœuds PopIn/ping + Stagger
- PricingSection.tsx : grilles web/software/saas en Stagger step 0.08 ; chaque carte = Tilt(max 4) > SpotlightCard (halo curseur) > Beam (bordure or au hover) ; carte vedette web-dashboard : Beam always + glow-pulse + md:scale-[1.02] permanent + pastille or PulseGlow décorative (aria-hidden — aucun texte inventé, i18n gelée) ; prix entourés de Reveal variant "scale" delay 0.2 (PriceTag/formatGNF/HOSPITAL_RANGE inchangés) ; hover carte card-lift + hover:-translate-y-1.5 ; CTA GoldButton magnetic ; listes « inclus » et notes en Stagger ; bandeau renouvellement + notes en Reveal
- FaqSection.tsx : accordéon shadcn remplacé par un accordéon custom — useState<number|null> (un seul ouvert), vrai <button> avec aria-expanded/aria-controls, panneau role="region" aria-labelledby + aria-hidden fermé, chevron ChevronDown tournant 180° via motion (gate lightMode → transition CSS), réponse dans CollapseMotion (hauteur auto), question hover text-goldtext + translate-x-1, items en Stagger step 0.07 ; questions/réponses i18n intactes
- TrialSection.tsx : conteneur gold-frame remplacé par Beam always (bordure or rotative permanente) ; ornement Monogram en Float ; titre en WordMask (titre + gold décalé), sous-texte Reveal ; champs du formulaire en Stagger (delay/step 0.06) ; note de garantie en Shimmer (mot-clé or scintillant, robuste toutes langues) ; submit Magnetic + spinner Loader2 animate-spin en état submitting ; succès = PopIn du Check circulaire doré + Reveal texte ; logique submitTrial/toasts/track/trackCta/validations conservées à l'identique
- ContactSection.tsx : filigrane « EINSOF » géant text-outline-faint (via BRAND, jamais hardcodé) en Parallax aria-hidden pointer-events-none derrière la section ; DrawRule pleine largeur sous le titre ; champs du formulaire en Stagger step 0.05 (ids/labels/erreurs conservés) ; consentement + submit en Reveal, bouton Magnetic + spinner, succès PopIn Check or ; panneau latéral : carte horaires/localisation Tilt(max 3) > SpotlightCard avec les 3 moyens de contact en Stagger, hover translate-x-1 + icône group-hover:scale-110 ; WhatsApp/GoldRule/CTA chat en Reveal, CTA Magnetic
- Aucune modification de globals.css, motion/*, kit.tsx, i18n, catalog ; pas de Math.random au rendu ; pas d'emoji ; tous les handlers/états de formulaires préservés

Stage Summary:
- 5 sections réécrites avec la bibliothèque task 11 (primitives gated lightMode ; framer-motion direct uniquement pour le chevron FAQ, gated via useMotionMode)
- Lint : 0 erreur dans les 5 fichiers de la tâche (3 erreurs préexistantes hors périmètre : motion/index.tsx ×2 [fichier gelé, task 11] et Navbar.tsx ×1)
- Tarifs EXACTS §19 inchangés (WEB_OFFERS/SOFTWARE_OFFERS/SAAS_PRODUCTS/WEB_RENEWAL/HOSPITAL_RANGE via lib/catalog + formatGNF) ; badge « populaire » rendu comme pastille décorative PulseGlow sans texte (i18n gelée, aucun nom inventé)
- Dev server : GET / 200, compilation OK

---
Task ID: 12-a
Agent: hero-nav-footer-motion (Z.ai Code)
Task: Chorégraphie riche Hero / StatsSection / Navbar / Footer (interface « très très très animée »)

Work Log:
- Lecture worklog (tâches 1→12-c), bibliothèque src/components/motion/index.tsx (API complète), kit.tsx, globals.css (.spin-slower/.spin-reverse/.glow-pulse/.text-outline-faint/.link-gold/.card-lift/.scroll-indicator-line vérifiées), lib/brand.ts (constante BRAND — jamais hardcodée), translations.ts (hero.*, stats.*, footer.*)
- Hero.tsx : image de fond en Parallax speed 0.15 (wrapper -inset-y-10 anti-révélation de bords) ; contenu en contre-parallaxe Parallax speed -0.08 (profondeur) ; filigrane géant aria-hidden = hero.tGold en text-outline-faint, Parallax speed 0.3, visible lg+, opacity-70 ; ornement : deux anneaux SVG semi-transparents (arcs or en dasharray) en spin-slower + spin-reverse, dans Float y=14 puis PulseGlow (pulse subtil), absolus à droite z-[5] ; entrée orchestrée Stagger delay 0.95 step 0.16 : badge (PulseGlow) → surtitre → titre WordMask (t1 delay 1.15 step 0.09, tGold delay 1.75 step 0.1 — corrige au passage l'ancien delay=400 interprété en secondes) → sous-titre → CTAs ; CTA primaire Magnetic conservé + classe glow-pulse sur le bouton principal uniquement ; indicateur de scroll en Float y=4 ; GoldParticles/Spotlight et tous les handlers (trackCta, scrollToSection, openChat) conservés
- StatsSection.tsx : filigrane géant aria-hidden « 7 · 10 · 5 · 6 » (les 4 chiffres RÉELS du cahier des charges, rien d'inventé) en text-outline-faint + Parallax 0.3 ; DrawRule pleine largeur au-dessus ET en-dessous du bloc ; Stagger step 0.12 + StaggerItem par stat ; carte StatCard = motion.div whileHover scale 1.035 (spring, gated lightMode → div statique) + card-lift (halo or au survol) ; chiffre en PopIn (0.4→1 élastique, delay 0.4+i×0.12) font-serif text-6xl md:text-7xl avec Counter (1800 ms) et group-hover:text-goldlight (transition-colors) ; GoldRule remplacée par DrawRule w-10 mx-auto ; label en Reveal delay échelonné ; valeurs 7/10/5/6 et clés i18n inchangées, aucun suffixe ajouté (label suffit)
- Navbar.tsx : motion.header initial y:-110% → 0 (entrée glissée), animate y:-110%/0% piloté par useScroll + useMotionValueEvent(scrollY,"change") — cache au-delà de 160 px en descente, réapparaît en remontée ou menu ouvert ; glass-panel + ombre dès scrollY > 24 (synchronisation initiale via requestAnimationFrame pour satisfaire react-hooks/set-state-in-effect) ; liens : link-gold appliqué à un span interne (soulignement or animé sous le mot) + micro-lift hover:-translate-y-0.5, pastille active conservée ; monogramme en group-hover:rotate-12 ; CTA navbar enveloppé dans PulseGlow ; menu mobile en AnimatePresence (panneau opacity+y, items en cascade delay 0.1+i×0.05, bloc langues/CTA en queue) ; branche lightMode dédiée : header CSS classique + tiroir statique (zéro framer-motion en mode réduit) ; IntersectionObserver section active, sélecteur de langue (clic extérieur/Échap), verrouillage scroll du tiroir, goTo/navCta inchangés
- Footer.tsx : DrawRule pleine largeur au-dessus du wordmark ; wordmark géant = BRAND en LettersReveal (text-outline, aria-label conservé, lettres aria-hidden) ; les 4 colonnes en Stagger step 0.1 + StaggerItem ; liens footerLinkCls + hover:translate-x-1 hover:text-goldtext (transition-all duration-300) ; NOUVEAU bouton retour en haut (window.scrollTo top smooth) dans Magnetic, icône ArrowUp en group-hover:rotate-12, aria-label = nouvelle clé i18n footer.backTop ajoutée aux 5 langues (fr « Retour en haut », en, es, zh, de — seule chaîne ajoutée, indispensable pour l'a11y) ; monogramme ornemental final en Float y=8 ; newsletter (submitNewsletter), push, bascule motion, admin et dialogues légaux préservés à l'identique ; exports Footer + default Footer inchangés
- Validation : curl / → 200, marqueurs SSR vérifiés (spin-slower/spin-reverse, text-outline-faint ×2, aria-label="EINSOF" via constante, « Retour en haut », « 7 · 10 · 5 · 6 ») ; dev.log compilations propres, aucune erreur runtime ; bun run lint → 0 erreur 0 warning dans mes 4 fichiers + translations.ts (restationnent 2 erreurs PRÉEXISTANTES dans src/components/motion/index.tsx lignes 365/721 — fichier gelé task 11, non touché, mtime antérieur à mes edits)

Stage Summary:
- Chorégraphie livrée : parallaxe multi-couches (fond 0.15 / filigrane 0.3 / contenu −0.08), orchestration Stagger post-rideau (~1 s), PulseGlow badge + CTA navbar, glow-pulse CTA primaire, anneaux or contrarotatifs lévités, navbar directionnelle cache/restore, tiroir mobile AnimatePresence en cascade, stats spectaculaires (PopIn élastique + Counter spring + DrawRule + scale/halo au survol), footer wordmark lettre à lettre + retour en haut magnétique
- Contrats respectés : data-section-id, clés i18n existantes, handlers (openChat, scrollToSection, trackCta…), exports nommés identiques, framer-motion direct uniquement là où nécessaire (header/tiroir Navbar, whileHover StatCard) et TOUJOURS derrière une branche lightMode explicite
- Or ≤ 8 % des surfaces (filets, anneaux semi-transparents, contours pâles), pas de néon, pas d'emoji, SSR sûr (aucun Math.random, filigranes déterministes)
- Une seule chaîne i18n ajoutée : footer.backTop ×5 langues (aria-label a11y du bouton retour en haut) — aucune autre clé ni aucun tarif/contenu modifié
---
Task ID: 12-d
Agent: motion-choreographer (Z.ai Code)
Task: Chorégraphie riche « très très très animée » des 6 sections restantes (About, Projects, Journal, Partners, Testimonials, Documents) via la bibliothèque d'animation de la tâche 11 — sans toucher aux handlers, données API, clés i18n ni aux fichiers interdits

Work Log:
- Lecture du worklog (tâches 1→11), de src/components/motion/index.tsx (API complète), de kit.tsx, de globals.css (tokens bg-surface2/goldlight, classes spin-slower/shimmer-text/beam-wrap/spot-card) et des 6 sections à réécrire
- AboutSection.tsx : texte en Stagger (step 0.09, 6 StaggerItems : label, titre, p1, p2, chiffres, valeurs+CTA) ; mot clé doré about.tGold en Shimmer ; visuel en Parallax (speed 0.2) > Reveal « scale » > Float (2 anneaux or spin-slower/spin-reverse, aria-hidden, hidden sm:block) ; image dans Beam (rounded-2xl) avec border-gold/30 + hover:scale-[1.03] duration-700 ; GoldBadge teamNote conservé ; nouveaux compteurs animés Counter to={7} (stats.years) et to={10} (stats.experts) — uniquement les nombres déjà présents dans le contenu et la section Chiffres existante, libellés issus des clés i18n existantes (aucune clé ajoutée) ; valeurs en Reveal échelonné (delay i×0.08) avec hover -translate-y-1 + titre group-hover:text-goldtext ; dl sémantique conservé ; handlers CTA (scrollToSection("contact") + trackCta("about","cta")) inchangés
- ProjectsSection.tsx : grille en Stagger step 0.08 > StaggerItem (y=36) > Tilt (max 5) > SpotlightCard (380) > Beam > article card-lift « group » ; l'année réelle (seule donnée visuelle disponible — l'API ne renvoie aucune image, rien n'a été inventé) devient un filigrane serif outline [-webkit-text-stroke] text-transparent qui zoome au survol (group-hover:scale-105 duration-700), dégradé or montant (from-gold/15, opacity-0 > group-hover:opacity-100), GoldBadge secteur dans le bandeau ; titre group-hover:text-goldlight ; flèche ArrowUpRight group-hover:-translate-y-1 +translate-x-1 ; dl client/secteur et bouton CTA (trackCta + openForm("quote")) inchangés ; fetch/loading/empty EXACTEMENT conservés (return null si vide — pas de skeleton ajouté pour ne pas altérer la visibilité, règle §20.4)
- JournalSection.tsx : même motif Stagger step 0.08 ; chaque article enveloppé dans Beam (rounded-xl) ; date en capitales espacées (tracking 0.16em) qui glisse (group-hover:translate-x-1) ; titre group-hover:text-goldlight ; flèche readMore group-hover:translate-x-1 ; DrawRule (w-40, mx-auto) en clôture de la liste — pas de CTA « tous les articles » créé car aucune clé i18n n'existe pour ce libellé (règle : ne pas inventer de contenu) ; Dialog de lecture inchangé ; pas d'image dans les cartes (PostRow ne contient aucun champ visuel)
- PartnersSection.tsx : DrawRule pleine largeur au-dessus d'un ruban VelocityRow (baseVelocity 1.5) reprenant les logos/noms réels (grayscale > hover:grayscale-0 + scale-105, séparateurs points or aria-hidden) ; grille de cartes en Stagger step 0.09 > SpotlightCard (400) > article card-lift « group » ; logos grayscale > group-hover:grayscale-0 + scale-[1.04] (bloc typographique de repli inchangé, zoom équivalent) ; description + lien « Visiter le site » (rel noopener, trackCta) et CTA « Devenir partenaire » (trackCta + openForm("contact")) inchangés, ce dernier passé en magnetic
- TestimonialsSection.tsx : Stagger step 0.1 > Tilt léger (max 4) > SpotlightCard (420) > figure ; guillemet décoratif serif géant (text-6xl/7xl text-gold/10) en PopIn ; étoiles (uniquement si rating réel 1–5, aria-label n/5 conservé) en PopIn cascade (delay 0.15 + n×0.07) ; monogramme-auteur = initiale réelle de authorName dans un disque bordé or, group-hover:scale-110 (aucun avatar en base, rien d'inventé) ; GoldBadge secteur et ton deep conservés
- DocumentsSection.tsx : lignes en Reveal variant « left » avec delay i×0.06 (choregraphie latérale échelonnée équivalente Stagger) ; hover ligne : hover:translate-x-2 + border-l-2 border-l-gold/25 > hover:border-l-gold + hover:bg-surface2 + ombre douce (transition-all 300) ; icône group-hover:rotate-3 group-hover:scale-110 ; GoldBadge catégorie avec lueur or au survol (group-hover:shadow or) ; bouton télécharger (attributs, trackCta, cibles) inchangé et enveloppé dans Magnetic ; note documents.emptyNote conservée et révélée en Reveal
- Qualité : lint ciblé sur les 6 fichiers → 0 erreur 0 avertissement ; tsc --noEmit → aucune erreur dans mes fichiers (seules les 4 erreurs préexistantes examples/ et skills/) ; dev.log → compilations OK, GET / 200, /api/projects|posts|testimonials|partners|documents 200, aucune erreur nouvelle ; aucun Math.random au rendu, aucun emoji, aucun bleu/indigo, or ≤ 8 % (filets, anneaux, badges, filigrane outline) ; fichiers interdits (globals.css, motion/*, kit.tsx, translations) NON modifiés ; dev server NON redémarré, pas de build, prisma/ intact

Stage Summary:
- Les 6 sections disposent désormais de la chorégraphie Obsidienne & Or complète : entrées Stagger/Reveal, parallaxe + lévitation (About), cartes 3D à halo et bordure or réactive (Projects/Testimonials/Partners), ruban réactif au scroll (Partners), lueur de téléchargement magnétique (Documents), compteurs animés sur données réelles (About)
- Contraintes de données respectées : aucun champ image n'existe côté API (projects/posts) → les « zooms d'image » demandés sont rendus par le filigrane d'année réelle (projects) et omis (journal, rien d'inventé) ; l'état vide reste « section masquée » partout ; le CTA « tous les articles » n'existe pas faute de clé i18n (DrawRule décorative posée à la place)
- Tous les handlers (trackCta, openForm, scrollToSection, setOpenId, liens externes), exports nommés + default, data-section-id et logique de fetch/loading/empty sont strictement conservés
- Reste à l'attention de l'orchestrateur : 2 erreurs lint préexistantes dans src/components/motion/index.tsx (react-hooks/set-state-in-effect, lignes 365/721 — bibliothèque hors périmètre 12-d, écrite en tâche 11) à corriger dans une tâche dédiée si souhaité

---
Task ID: 13
Agent: orchestrator (Z.ai Code)
Task: Vérification navigateur complète + correction d'un bug critique de visibilité en mode light

Work Log:
- Vérification agent-browser de toutes les sections (desktop 1280px + mobile 390px) : hero, stats, services, process, pricing, faq, about, footer, marquee sectors
- BUG CRITIQUE découvert : sur les appareils faibles (lightMode auto, ex. 2 cœurs), les branches light des primitives retournaient encore motion.* — React réutilisait le nœud DOM et les styles initiaux opacity:0 appliqués à l'hydratation persistaient → contenu définitivement invisible (16 éléments dans services seuls)
- CORRECTION : ajout du composant Plain (élément HTML brut) dans src/components/motion/index.tsx — les branches lightMode de Reveal, Stagger, StaggerItem, PopIn retournent désormais un vrai <div>/<span>, forçant React à remonter un nœud propre
- Fix lint : suppression des setState redondants dans Counter et CurtainIntro (règle react-hooks/set-state-in-effect)
- Vérifications passées : 0 erreur ESLint sur tout le projet, 0 erreur console navigateur, 0 erreur dev.log
- Compteurs animés 7/10/5/6 OK, accordéon FAQ animé OK, timeline process avec ping doré OK, carte vedette pricing en Beam permanent OK, marquee VelocityRow sectors OK, footer + retour en haut magnétique OK
- Audit final : seuls éléments opacity:0 restants = 2 champs honeypot anti-spam (intentionnels)

Stage Summary:
- L'interface est maintenant très fortement animée : rideau d'ouverture, titres mot à mot, stagger spring des blocs, compteurs animés, filets d'or qui se dessinent, halos spotlight suivant le curseur, bordures or rotatives, parallaxe multi-couches, ruban réactif au scroll, navbar directionnelle
- Sécurité d'affichage garantie : le contenu est toujours visible même sans animation (light mode / préférences système / appareil faible)
- animations vérifiables dans le navigateur de test via localStorage eins-reduce-motion=0 (les appareils ≤ 4 cœurs basculent automatiquement en mode léger)

---
Task ID: UI-FIX-1
Agent: orchestrator (Z.ai Code)
Task: Correction des incohérences visuelles signalées par le client (textes illisibles, filigranes, mots manquants)

Work Log:
- Diagnostic racine : WordMask observait chaque mot individuellement avec whileInView alors que le mot était translaté à 115 % dans un masque overflow-hidden — l'IntersectionObserver ne détectait jamais les mots courts, restés invisibles pour toujours (d'où « faille, erreur, chargeons, supplémentaire » sans le reste de la phrase, « secteur » sans « Tous les », « partenaire unique pour » troué)
- Réécriture de WordMask (components/motion/index.tsx) : un seul useInView sur l'enveloppe (jamais transformée ni masquée), animation propagée à chaque mot via animate, masque avec débords px/pb pour italiques, accents et jambages — plus aucun mot ne peut rester coincé
- Suppression des 4 filigranes géants en arrière-plan (text-outline-faint) : hero « à l'excellence. », stats « 7 · 10 · 5 · 6 » (conserve les petits chiffres dorés animés), services « tout votre digital. » (rendait le titre illisible), contact « EINSOF »
- Placeholders e-mail raccourcis dans les 5 langues (le texte long était tronqué dans le champ)
- Vérification Agent Browser complète (1440 px et 390 px, FR) : hero, chiffres, services, engagements, SaaS, secteurs, méthode, tarifs, FAQ, à propos, journal, essai, contact, footer, menu mobile — toutes les phrases sont complètes et lisibles ; aucune erreur console bloquante

Stage Summary:
- Cause racine éliminée (plus aucune révélation de texte ne dépend d'un IO sur un élément masqué)
- Interface épurée : plus de textes fantômes derrière le contenu ; les chiffres clés ne gardent que la version dorée animée
- Commit a164aa2 « fix(ui): textes complets et lisibles — suppression des filigranes, WordMask fiable »

---
Task ID: UI-FIX-2
Agent: orchestrator (Z.ai Code)
Task: « certaines parties de ces textes ne s'affichent pas du tout » — les 8 titres de section restent amputés malgré UI-FIX-1

Work Log:
- Reproduction agent-browser (1440 px, animations forcées) : services affiche « Un partenaire unique pour » SANS « tout votre digital. » ; hero SANS « à l'excellence. »
- Inspection DOM décisive : les mots or sont présents, opacity 1, transform none (l'animation WordMask se termine) — mais aucun glyphe peint. Cause : .gold-text-gradient (background-clip:text, color:transparent) sur l'<em> PARENT ; les descendants transformés + overflow-hidden + will-change:transform créent des couches compositées que le clip texte de l'ancêtre ne capture pas → dégradé vide, texte transparent (bug Chrome connu)
- Pattern identique dans 10 emplacements : tous les tGold de SectionHeading (12 titres), hero, trial
- WordMask v3 (components/motion/index.tsx) : prop `gold` appliquant le dégradé SUR CHAQUE MOT animé (background-clip sur l'élément transformé lui-même = fiable) ; filet de sécurité forceShown via setTimeout 4 s → un texte ne peut plus rester invisible même si IntersectionObserver échoue (iframe, quirk) ; branche lightMode dégradée aussi
- kit.tsx / Hero.tsx / TrialSection.tsx : <em> sans gold-text-gradient + WordMask gold
- Accroche hero « à l'excellence. » (jugée inutile par le client) remplacée par « Votre présence digitale, notre métier. » ; À propos « l'excellence numérique. » → « le numérique guinéen. » — décliné en en/es/zh/de + openGraph (layout.tsx)
- Lint : 0 erreur
- Vérification agent-browser complète : desktop 1440 px (hero, stats=petits chiffres or seuls, services, engagements + citation complète, SaaS, secteurs, méthode, tarifs, FAQ, à propos, journal, essai, contact, footer) + mobile 390 px (hero, services, engagements) — toutes les parties dorées visibles
- Audit DOM final : 65 mots animés h1/h2, 0 bloqué au repos ; API projects/partners/testimonials/documents vides → sections masquées par conception (rendu conditionnel voulu)

Stage Summary:
- Cause racine éradiquée : plus AUCUN background-clip:text au-dessus de contenu transformé ; le dégradé or voyage avec chaque mot
- Double garantie de lisibilité : dégradé par mot (CSS fiable) + force-reveal 4 s (JS) + branches lightMode complètes
- Copy hero/about rafraîchie en 5 langues, alignée OpenGraph
- Commit 3e31ef7 « fix(ui): texte or visible partout — dégradé posé mot par mot, fin des titres amputés »

---
Task ID: MP-1
Agent: orchestrator (Z.ai Code)
Task: Conversion monopage → multi-pages (demande client : chaque section devient une page dédiée)

Work Log:
- Créé src/lib/routes.ts — carte du site (11 pages) + SECTION_ROUTES (section → page/anchor pour le chatbot)
- Créé src/lib/page-content.tsx — type Localized + hooks useLocalized/pickLocalized (contenu par page hors dictionnaire global)
- Créé src/components/site/SiteShell.tsx + src/app/(site)/layout.tsx — coquille partagée : Navbar, Footer, chat, overlays RGPD/PWA/admin, rideau 1×/session, transition de page animée, handler de navigation inter-pages (router.push + scroll différé)
- Nouvelle page d'accueil hub : src/app/(site)/page.tsx + src/components/pages/HomePage.tsx (Hero, Stats, HubGrid, Journal, CTA) — ancien src/app/page.tsx supprimé
- Créé src/components/pages/HubGrid.tsx + src/lib/pages-content/hub.ts (10 cartes, 5 langues) + PageHero.tsx (fil d'Ariane + titre animé) + PageBlocks.tsx (CtaBanner, PageCrossLinks)
- Navbar : navigation par routes (usePathname, 6 liens ≥ lg, 8 ≥ xl, tiroir 10 pages), Footer : liens vers les 10 pages, MobileActionBar : /logiciels#section-trial et /contact
- chat-bus : navigateSmart ; chat-context : outil navigate → navigation inter-pages ; Hero/About : CTA → /contact ; translations.ts : clés nav.* (5 langues) + pages.home
- Lint 0 erreur, tsc src 0 erreur, GET / 200

Stage Summary:
- Squelette multi-pages opérationnel : /, /services, /logiciels, /secteurs, /methode, /tarifs, /realisations, /blog, /a-propos, /faq, /contact à créer par les agents MP-2a..2d
- Motif imposé aux agents : page.tsx (serveur, metadata) + composant client dans src/components/pages/ + contenu 5 langues dans src/lib/pages-content/

---
Task ID: MP-2c
Agent: full-stack-developer
Task: Pages /realisations, /a-propos et /contact (contenu détaillé 5 langues)

Work Log:
- Lecture du worklog (UI-FIX-1, UI-FIX-2, MP-1) : motif imposé page.tsx serveur + composant client + contenu 5 langues ; contraintes WordMask (dégradé or par mot, pas d'opacity:0 custom), pas d'invention de données
- Créé src/lib/pages-content/realisations.ts — REALISATIONS (fr/en/es/zh/de) : hero « Références », 6 types de missions génériques (objectif + 3 livrables typiques, aucun faux client), CTA, liens croisés /services //blog //contact
- Créé src/lib/pages-content/apropos.ts — APROPOS (5 langues) : hero « Sept ans d'expertise au service du numérique guinéen », 4 cartes « pourquoi EINSOF » (interlocuteur unique, deux promesses, équipe terrain multilingue/Conakry, prix clairs en GNF), CTA, liens croisés /realisations //faq //contact
- Créé src/lib/pages-content/contact.ts — CONTACT (5 langues) : hero « 15 — Contact » (chips 24 h/48 h/horaires), 4 cartes « avant d'écrire » pointant vers /tarifs (3 formules), /logiciels (6 SaaS, essai 7 jours), /services (sur mesure dès 20 000 000 GNF — chiffre du catalogue), /faq ; sans CtaBanner (la page est le CTA)
- Créé src/components/pages/RealisationsPage.tsx — PageHero + Section id="work-types" (Stagger, SpotlightCard/Beam/card-lift, puces livrables avec icônes lucide) + <ProjectsSection/> <PartnersSection/> <TestimonialsSection/> + CtaBanner + PageCrossLinks
- Créé src/components/pages/AProposPage.tsx — PageHero + <StatsSection/> <AboutSection/> + Section id="why-us" (4 cartes Stagger) + <DocumentsSection/> + CtaBanner + PageCrossLinks
- Créé src/components/pages/ContactPage.tsx — PageHero + <ContactSection/> + Section id="contact-help" (4 cartes, GoldButton outline) + PageCrossLinks ; navigation interne des cartes via router.push (next/navigation, même routage client que next/link) car GoldButton avec href rend un <a> natif
- Créé les 3 routes serveur avec metadata (title « X — EINSOF » via NEXT_PUBLIC_BRAND_NAME, descriptions dédiées) : src/app/(site)/realisations/page.tsx, src/app/(site)/a-propos/page.tsx, src/app/(site)/contact/page.tsx
- Séparation visuelle des sections surface adjacentes via className="border-b border-line" / "border-t border-line" (sections existantes non modifiées)
- Vérifications : bunx tsc --noEmit → 0 erreur ; bun run lint → 0 erreur ; curl /realisations, /a-propos, /contact → 200 ; dev.log propre (compilation OK, aucune erreur runtime) ; contenu SSR contrôlé (titres, cartes, chiffres catalogue présents dans le HTML servi)

Stage Summary:
- 9 fichiers créés, 0 fichier existant modifié : /realisations, /a-propos et /contact complètes, localisées en 5 langues avec la même structure
- Sections API réutilisées telles quelles (projets, partenaires, témoignages, chiffres, à propos, documents, contact) — elles se masquent si vides
- Aucune donnée inventée : seuls types de missions génériques, faits du catalogue (20 000 000 GNF, 6 SaaS, essai 7 jours, 3 formules web) et délais officiels (24 h/48 h, Lun–Ven 8 h–18 h)
- Animations uniquement via les primitives de components/motion (Reveal/Stagger/WordMask gérées par PageHero, SectionHeading, CtaBanner, PageBlocks) — aucun risque de texte invisible

Rapport final :
- Fichiers créés : src/lib/pages-content/{realisations,apropos,contact}.ts ; src/components/pages/{RealisationsPage,AProposPage,ContactPage}.tsx ; src/app/(site)/{realisations,a-propos,contact}/page.tsx
- Correctifs partagés souhaités : (1) GoldButton avec href rend un <a> natif — navigation plein rechargement (utilisé aussi par CtaBanner/PageBlocks existants) ; envisager next/link dans kit.tsx ; (2) les libellés numérotés « 15 — Contact » coexistent dans mon PageHero et le SectionHeading interne de ContactSection (redondance de titre « Parlons de votre projet. » visible deux fois) — ne pouvant modifier ContactSection, je suis le motif imposé ; un prop `heading=false` sur ContactSection serait un plus ; (3) liens croisés vers /services, /blog, /faq, /tarifs, /logiciels : ces pages relèvent des autres agents MP-2 (routes encore inexistantes au moment de mon passage)
- Points douteux : cartouche « travaille pour nos clients » des projets vides — ProjectsSection/PartnersSection/TestimonialsSection restent masquées tant que l'API est vide (comportement voulu, vérifié : rien d'affiché de faux)

---
Task ID: MP-2a
Agent: full-stack-developer
Task: Pages /services et /methode (contenu détaillé 5 langues)

Work Log:
- Lecture du worklog (UI-FIX-1, UI-FIX-2, MP-1) et des composants partagés (PageHero, PageBlocks, kit, motion, sections existantes) pour respecter le motif imposé
- Créé src/lib/pages-content/services.ts — ServicesPageContent : heroChips, heading du détail, 7 pôles (mission, « inclus » en puces, « pour qui », badge soon, renvoi /logiciels pour le SaaS), CTA (« Un projet en tête ? / Parlons-en. ») et liens croisés (/logiciels, /tarifs, /methode) — 5 langues complètes (fr/en/es/zh/de, mêmes clés)
- Créé src/components/pages/ServicesPage.tsx — PageHero (label/titre/or/sub du dictionnaire global services.*, chips du module localisé) + <ServicesSection/> + <PillarsSection/> + Section id="services-detail" (tone surface, grille lg:grid-cols-2, Stagger) avec une carte riche par pôle : icône (mêmes icônes Lucide que ServicesSection), numéro serif, mission, liste « inclus » (puces Check or), ligne « pour qui », GoldBadge « Bientôt » pulsé sur Stratégie, lien next/link vers /logiciels sur le SaaS + CtaBanner + PageCrossLinks
- Créé src/app/(site)/services/page.tsx — composant serveur, metadata « Services — EINSOF » (BRAND via NEXT_PUBLIC_BRAND_NAME)
- Créé src/lib/pages-content/methode.ts — MethodePageContent : heroChips (« Devis détaillé / Budget figé / Suivi inclus »), heading du détail, 5 étapes (numéro, « Ce que nous faisons », « Ce que vous recevez » en puces, durée indicative — omise pour l'étape 04, non fournie au cahier des charges), 2 garanties (« Sérénité garantie », « Des services qui vont plus loin »), CTA (« Prêt à démarrer ? / La première étape est un simple échange. »), liens croisés (/services, /realisations, /tarifs) — 5 langues complètes
- Créé src/components/pages/MethodPage.tsx — PageHero (dictionnaire global process.*) + <ProcessSection/> + Section id="method-detail" (tone surface, liste verticale séparée par DrawRule, numéros 01–05 en gold-text-gradient sur l'élément lui-même — jamais background-clip sur un parent, conformément à UI-FIX-2, pilule durée avec icône Clock) + Section id="method-guarantees" (2 grandes cartes glass-panel, icônes ShieldCheck/Gem reprenant l'iconographie de PillarsSection) + CtaBanner + PageCrossLinks
- Créé src/app/(site)/methode/page.tsx — composant serveur, metadata « Méthode — EINSOF »
- Aucune animation custom : uniquement les primitives de components/motion (Reveal, Stagger/StaggerItem, PopIn, PulseGlow, Beam, DrawRule ; WordMask via PageHero/SectionHeading) — aucune opacity:0 maison, aucun filigrane, or limité aux numéros/puces/bordures/badges
- Vérifications : bunx tsc --noEmit (hors examples/skills) → 0 erreur ; bun run lint → 0 erreur ; curl /services et /methode → 200 ; dev.log propre (compilation OK, aucune erreur runtime) ; contenu SSR contrôlé (chips, CTA, garanties, « Voir les six logiciels », durées présents dans le HTML servi)

Stage Summary:
- 6 fichiers créés, 0 fichier existant modifié : /services et /methode complètes, localisées en 5 langues avec la même structure de clés
- Sections partagées réutilisées telles quelles (ServicesSection, PillarsSection, ProcessSection) : les pôles et la frise des étapes restent la source de vérité, mes nouveaux blocs n'ajoutent que le détail
- Aucun fait inventé : contenu issu exclusivement du cahier des charges de la tâche et des textes existants (hub, services.*, process.*) ; durée indicative omise à l'étape 04 car non fournie
- Navigation interne 100 % next/link (href) ; animations sûres en mode light (appareils faibles / prefers-reduced-motion)

Rapport final :
- Fichiers créés : src/lib/pages-content/services.ts ; src/lib/pages-content/methode.ts ; src/components/pages/ServicesPage.tsx ; src/components/pages/MethodPage.tsx ; src/app/(site)/services/page.tsx ; src/app/(site)/methode/page.tsx
- Correctifs partagés souhaités : (1) GoldButton avec href rend un <a> natif (déjà signalé par MP-2d) — mes CTA passent par CtaBanner/PageBlocks qui l'utilisent, un next/link dans kit.tsx bénéficierait à toutes les pages ; (2) la classe utilitaire display-3 utilise clamp(1.5rem–2rem), j'ai préféré des titres h3 serif explicites (text-xl/2xl) pour les cartes — une variante display-4 plus petite serait utile pour uniformiser ; (3) Section préfixe les id avec « section- » (id="services-detail" → #section-services-detail) : cohérent avec le reste du site mais à connaître pour les ancres du chatbot (SECTION_ROUTES)
- Points douteux : (1) « Durée indicative » absente à l'étape 04 Livraison (non fournie) — la pilule durée est masquée, champ optionnel prévu pour ça ; (2) le pôle Stratégie affiche sa mission avec une carte légèrement estompée (opacity-85, motif repris de ServicesSection) et sans liste « inclus » (rien de fourni) ; (3) les libellés hero des deux pages proviennent du dictionnaire global (services.*, process.*) tandis que le reste vient des modules pages-content — conformément au motif imposé, mais deux sources de vérité coexistent pour les mêmes textes d'en-tête

---
Task ID: MP-2d
Agent: full-stack-developer
Task: Pages /blog, /blog/[slug], /faq et /secteurs (contenu détaillé 5 langues)

Work Log:
- Lecture du worklog (UI-FIX-1, UI-FIX-2, MP-1), de la bibliothèque motion (WordMask v3, branches lightMode), de kit.tsx/PageHero/PageBlocks, de FaqSection/SectorsSection, de JournalSection (motif fetch /api/posts) et de src/lib/locale-json.ts (signature parseLocaleJson/pickLocale) avant d'écrire la moindre ligne
- Créé src/lib/pages-content/blog.ts (BLOG : hero, listing avec libellés de chargement/état vide, 3 thèmes du journal, CTA, liens croisés), src/lib/pages-content/article.ts (ARTICLE : retour, lecture, lire aussi, introuvable, CTA), src/lib/pages-content/faq.ts (FAQ : hero + 6 Q/R détaillées 3-4 phrases, alignées sur les conditions réelles : délais prudent sans chiffre inventé, formation à la livraison, bugs gratuits + renouvellement 500 000 GNF, évolutivité site→logiciel, langues incluses, devis sous 24 h ouvrées), src/lib/pages-content/secteurs.ts (SECTEURS : 6 cartes « défis/réponse » avec réalité locale (connectivité variable, process papier, multi-sites) + les 14 secteurs officiels traduits en 5 langues — noms alignés sur sectors.items du dictionnaire) — fr détaillé, en/es/zh/de complets, même structure
- Créé src/components/pages/BlogPage.tsx : PageHero (label « 14 — Journal »), Section blog-listing = grille complète des articles de la VRAIE base (fetch /api/posts au montage, même motif que JournalSection) avec la différence clé : chaque carte est un <Link href={/blog/[slug]}> (navigation, pas de Dialog) ; chargement = libellé Shimmer + 3 squelettes animate-pulse (aucun opacity:0 custom) ; état vide élégant (Reveal) « Le premier article arrive bientôt. » + GoldButton vers /contact ; Section blog-topics (tone surface) = 3 cartes SpotlightCard numérotées avec icônes lucide ; CtaBanner + PageCrossLinks
- Créé src/app/(site)/blog/[slug]/page.tsx (SERVEUR, dynamic force-dynamic, getPost via db.blogPost + isPublished, generateMetadata depuis title/excerpt .fr via parseLocaleJson, notFound() sinon) + src/components/pages/ArticlePage.tsx (client) : bandeau fin retour ← Journal (next/link, cible 44 px), badge catégorie (tr journal.categories.*) + date Intl long (zh→zh-CN) + temps de lecture, H1 WordMask, extrait lead-text, corps en paragraphes split("\n\n") en Reveal progressif once (texte finit 100 % visible), DrawRule, « lire aussi » jusqu'à 2 autres articles (cartes Link), CtaBanner « Un projet ? Parlons-en. » ; Shimmer pendant le chargement, message + retour /blog si introuvable côté client (couvre le cas > 12 articles)
- Créé src/components/pages/FaqPage.tsx : PageHero (label « 07 — FAQ »), FaqSection existante réutilisée telle quelle, Section faq-extra (tone surface, border-t) avec accordéon shadcn (type single collapsible) des 6 questions détaillées stylées thème (data-[state=open]:text-goldtext, chevron or), CtaBanner « Écrivez-nous » (secondaire /tarifs), PageCrossLinks (/tarifs, /logiciels, /methode)
- Créé src/components/pages/SecteursPage.tsx : PageHero (label « 04 — Secteurs »), SectorsSection existante réutilisée telle quelle, Section sectors-detail (tone surface) = 6 cartes défis/réponse (Stagger, SpotlightCard, icônes lucide dédiées, puces à point or), Section sectors-all = les 14 secteurs en GoldBadge (Stagger 0.04, flex-wrap centré) + DrawRule, CtaBanner avec sub « Parlez-nous de votre métier » (secondaire /logiciels), PageCrossLinks (/logiciels, /services, /realisations)
- Pages serveur créées avec metadata exportées : (site)/blog/page.tsx, (site)/blog/[slug]/page.tsx, (site)/faq/page.tsx, (site)/secteurs/page.tsx — motif MP-1 respecté (serveur mince + composant client + module pages-content)
- Incidents : serveur dev absent du port 3000 en début de vérification (aucun processus) → relancé en arrière-plan (nohup bun run dev >> dev.log) pour mener les contrôles HTTP ; aucune réécriture de fichier existant, aucune clé translations.ts ajoutée, pas d'emoji, or en touches discrètes (badges, points, filets, bordures pâles)

Stage Summary:
- 4 pages livrées et fonctionnelles : /blog 200, /faq 200, /secteurs 200, /blog/[3 slugs réels] 200, /blog/slug-inexistant 404 (notFound serveur) ; metadata titre/description correctes (ex. « Combien coûte un site web en Guinée ? … — EINSOF »)
- Le journal lit uniquement la vraie base (aucun article fabriqué) et la navigation article est désormais multipage (Link), complémentaire au Dialog de l'accueil ; état vide et squelettes prévus
- tsc --noEmit : 0 erreur sur mes fichiers ; bun run lint : 0 erreur ; dev.log : compilations OK, aucune erreur runtime après mes curls
- Rapport final : fichiers créés = src/lib/pages-content/{blog,article,faq,secteurs}.ts ; src/components/pages/{BlogPage,ArticlePage,FaqPage,SecteursPage}.tsx ; src/app/(site)/blog/page.tsx ; src/app/(site)/blog/[slug]/page.tsx ; src/app/(site)/faq/page.tsx ; src/app/(site)/secteurs/page.tsx. Correctifs partagés souhaités : (1) GoldButton avec href rend un <a> natif — le passer en next/link dans kit.tsx profiterait à tous les CTA des pages (CtaBanner/boutons d'état vide) ; (2) exposer une variante « card heading » serif standardisée (les agents MP-2 recréent chacun leurs titres h3 text-xl) ; (3) le label « 14 — Journal » du PageHero /blog contredit le journal.label « 10 — Journal » du dictionnaire (numérotation héritée de l'ancienne page unique) — harmoniser dans translations.ts serait bienvenu. Points douteux : (1) /api/posts renvoie max 12 articles triés par date : un 13e article serait absent du listing et de la recherche client de /blog/[slug] (couvert par l'état « introuvable » client, mais une API /api/posts/[slug] serait plus robuste) ; (2) les 14 noms de secteurs existent en double source (dictionnaire global + mon module 5 langues pour la page) — la source fait foi pour les ancres/ruban reste SectorsSection.

---
Task ID: MP-2b
Agent: full-stack-developer
Task: Pages /logiciels et /tarifs (contenu détaillé 5 langues, prix catalog)

Work Log:
- Lecture du worklog (UI-FIX-1, UI-FIX-2, MP-1), de kit.tsx, PageHero, PageBlocks, motion, catalog.ts, SaasSection/TrialSection/PricingSection et de pages-content/hub.ts (motif imposé respecté à la lettre)
- Créé src/lib/pages-content/logiciels.ts — Localized<LogicielsContent> en fr/en/es/zh/de : hero (label « 03 — SaaS de gestion », chips essai/démo/support, sub = saas.sub), détail des 6 produits (public, 5 modules clés, « pour qui » détaillé), libellés de bloc (Modules clés / Pour qui ? / Trois forfaits), noms des 3 forfaits hospitaliers, note école « 9 mois payés par an — les 3 mois de vacances sont offerts », CTA « Pas encore sûr ? / Réservez une démo guidée. », liens croisés (/tarifs, /secteurs, /contact)
- Créé src/components/pages/LogicielsPage.tsx ("use client") : PageHero > <SaasSection/> (existante) > Section id="saas-detail" tone="surface" (SectionHeading + grille 2 colonnes lg, Stagger/SpotlightCard/Beam ; chaque carte jointe au catalogue via findSaas(slug) : GoldBadge public, puces Check, encart « pour qui » bordé or, prix TOUJOURS rendus par PriceTag — hospitalier = 3 lignes Essentiel/Avancé/Complet avec les offres hosp-1/hosp-3/hosp-5, école = billableNote via offer.billableMonths=9) > <TrialSection/> (existante, garde id="trial") > CtaBanner (primaire /contact, secondaire /tarifs) > PageCrossLinks
- Créé src/app/(site)/logiciels/page.tsx (composant serveur, metadata « Logiciels SaaS — EINSOF », rend <LogicielsPage/>)
- Créé src/lib/pages-content/tarifs.ts — Localized<TarifsContent> 5 langues : hero (label « 06 — Tarifs », chips GNF / « à partir de » / renouvellement 500 000, sub = pricing.sub), détail « bien lire les prix » (3 cartes web + renouvellement + 2 cartes logiciels reliées à WEB_OFFERS/WEB_RENEWAL/SOFTWARE_OFFERS par id d'offre, libellé « Recommandé », « paiement unique » réutilisé du dictionnaire), mini-FAQ 4 Q/R (devis figé, renouvellement 500 000, paiement par jalons sans paiement en ligne, sur mesure dès 20 000 000), CTA « Un budget à cadrer ? / Demandez un devis détaillé. », liens croisés (/logiciels, /services, /faq)
- Créé src/components/pages/TarifsPage.tsx ("use client") : PageHero > <PricingSection/> (existante, 3 onglets) > Section id="pricing-detail" tone="surface" (a) 3 cartes Sites web [vitrine 1 500 000 / tableau de bord 2 500 000 mis en avant avec GoldBadge « Recommandé » + Beam always / boutique 3 500 000, « paiement unique », footnote du PriceTag retirée car remplacée par la description riche] + encart renouvellement 500 000 GNF/an bordé or ; b) 2 cartes Logiciels [sur mesure dès 20 000 000, mobile sur devis] ; c) « Inclus dans chaque site » via tr("pricing.included.items") — 8 items Check ; d) « Conditions & clauses » via tr("pricing.notes.items") — 4 items, astérisques or) > Section id="pricing-faq" (accordéon shadcn/ui, 4 Q/R, Reveal, max-w-3xl) > CtaBanner (primaire /contact, secondaire /logiciels) > PageCrossLinks
- Créé src/app/(site)/tarifs/page.tsx (composant serveur, metadata « Tarifs — EINSOF »)
- Règle « aucun texte invisible » respectée : uniquement les primitives de components/motion (Reveal, Stagger/StaggerItem, Beam, SpotlightCard, DrawRule via SectionHeading) ; titres = SectionHeading/PageHero (WordMask v3) ; aucune animation custom opacity:0 écrite ; aucun emoji, aucun filigrane
- Aucun fichier existant modifié (translations.ts, kit, sections, catalog, Navbar/Footer intacts) ; navigation interne déléguée aux composants partagés (next/link dans PageCrossLinks/PageHero)
- Vérifications : bunx tsc --noEmit → 0 erreur ; bun run lint → 0 erreur ; GET /logiciels 200, GET /tarifs 200 ; dev.log propre (aucune erreur runtime)
- Audit agent-browser (1440 px & 390 px, FR forcé via eins-lang) : 0 mot h1/h2 bloqué, sections saas/saas-detail/trial et pricing/pricing-detail/pricing-faq toutes présentes, montants exacts dans le DOM (1 000 000 / 3 000 000 / 5 000 000 / 100 000 / 7 000 000 / 500 000 / 1 500 000 / 2 500 000 / 3 500 000 / 20 000 000 GNF), accordéon FAQ s'ouvre (state=open, réponse opacity 1), pas de scroll horizontal mobile ; captures pleines page sauvegardées (/tmp/logiciels-desktop.png, /tmp/tarifs-desktop.png)

Stage Summary:
- /logiciels et /tarifs livrées et conformes au motif MP-1 : page.tsx serveur (metadata) + composant client + contenu localisé 5 langues complet
- Zéro montant inventé : chaque prix provient de PriceTag alimenté par catalog.ts (jonction par slug produit / id d'offre) ; « à partir de » et « sur devis » hérités des clés pricing.* existantes
- Réutilisation maximale du partagé : SaasSection, TrialSection, PricingSection, PageHero, CtaBanner, PageCrossLinks, kit (Section/Container/SectionHeading/PriceTag/GoldBadge), tr("pricing.included.items") et tr("pricing.notes.items") pour inclus/conditions — même texte que l'onglet tarifs en toutes langues
- Le détail hôpital liste les 3 forfaits nommés (Essentiel 1 000 000 / Avancé 3 000 000 / Complet 5 000 000 GNF/mois) et l'école affiche la note 9 mois payés (4 500 000 GNF/an implicite via la clé existante)

Rapport final :
- Fichiers créés (6, aucun existant modifié) : src/app/(site)/logiciels/page.tsx, src/app/(site)/tarifs/page.tsx, src/components/pages/LogicielsPage.tsx, src/components/pages/TarifsPage.tsx, src/lib/pages-content/logiciels.ts, src/lib/pages-content/tarifs.ts
- Correctifs partagés souhaités : aucun bloquant. (1) GoldButton (kit.tsx) rend un <a href> natif — la transition de page animée de SiteShell repose sur son interception globale ; si un jour les CTA doivent passer par router.push explicite, prévoir un GoldLink dans kit.tsx (hors périmètre MP-2b). (2) Les libellés d'offre de catalog.ts (PriceOffer.name, ex. « Forfait Essentiel ») sont en français uniquement — non affichés par PriceTag, donc invisible pour l'utilisateur ; si un autre agent doit afficher offer.name directement, envisager un jour une couche de traduction des noms d'offres. (3) SECTION_ROUTES ne référence pas les nouvelles ancres « saas-detail » et « pricing-detail »/« pricing-faq » (le chatbot peut toujours pointer vers les pages /logiciels et /tarifs, ce qui suffit) — à enrichir si on veut des liens profonds d'ancre.
- Points douteux : (1) blip transient observé pendant un recompile du dev serveur (page /logiciels servie avec le contenu de /tarifs côté navigateur pendant ~10 s) — non reproductible après rechargement, probablement une course dev-server/HMR pendant les builds des autres agents ; à surveiller mais sans lien avec le code livré. (2) La page /logiciels porte le label « 03 — SaaS de gestion » (cohérent avec translations.saas.label) alors que le hub de la page d'accueil la numérote « 02 » (hub.ts) — incohérence préexistante entre hub.ts et le dictionnaire, non corrigée (fichiers interdits de modification), signalée pour décision.

---
Task ID: MP-3
Agent: orchestrator (Z.ai Code)
Task: Intégration multi-pages — correctifs partagés, robustesse d'affichage, vérification Agent Browser complète

Work Log:
- Pages livrées par les agents MP-2a..2d (toutes en 200) : /services, /methode, /logiciels, /tarifs, /realisations, /a-propos, /contact, /blog, /blog/[slug], /faq, /secteurs — contenu détaillé 5 langues, prix catalog exclusivement, navigation Link
- Correctifs d'intégration : GoldButton href → next/link (SPA, fin des rechargements complets) ; prop `heading` ajoutée à 6 sections (Services/Process/Saas/Pricing/Faq/Sectors) + ContactSection pour dédoublonner PageHero/titre de section ; labels journal harmonisés « 10 — Journal » (5 langues) ; clé corrigée pricing.oneTime → common.oneTime (fuite de clé i18n sur /tarifs)
- BUG CRITIQUE corrigé (préexistant) : MotionProvider — device via useSyncExternalStore sur store statique (emptySubscribe) ne se réappliquait jamais après hydratation → le mode léger auto ne s'activait pas sur appareils ≤ 4 cœurs (2 cœurs ici) → contenu invisible (screenshots noirs). Remplacé par useState + rAF post-montage
- Page transition motion.main supprimée (risque de page entière à opacity 0 si rAF gelés) — les sections animent leur propre entrée ; CurtainIntro 1×/session conservé
- Preuve par worktree (commit 3e31ef7) : erreurs d'hydratation Radix useId + warning Lenis PRÉEXISTANTS, non régressions
- Vérifications Agent Browser (1440 px et 390 px, FR et EN) : 11 routes + article de blog = 200 ; navigation navbar/tiroir/footer ; FAQ accordéon (aria-expanded, réponse visible) ; onglets tarifs ; navigation inter-pages du chatbot (event → /tarifs#section-pricing) ; 0 débordement horizontal mobile ; footer collant au bas des pages courts et poussé sur les longs ; h1 uniques (dédoublonnés) ; 24 clés t() des pages validées contre le dictionnaire fr ; lint 0 erreur, tsc 0 erreur

Stage Summary:
- Site entièrement multipage : 11 pages dédiées détaillées + hub d'accueil, 5 langues complètes
- Garantie de visibilité renforcée : plus aucun fondu global ; le mode léger auto fonctionne vraiment (filet de sécurité UI-FIX-1 opérationnel)
- Commits : feat(site) backbone MP-1 + feat(site) pages MP-2/MP-3

---
Task ID: 7-a
Agent: general-purpose
Task: Traduction EN de service-details et saas-details

Work Log:
- Lecture du worklog (tâches 1→8-9-10, MP-1→MP-3), des types.ts des deux modules, des fr.ts sources (520 + 458 lignes), de index.ts (registre Record<Lang, …> déjà écrit) et de page-content.tsx (Localized<T> = Record<Lang, T>) avant d'écrire
- CORRECTIF BLOQUANT partagé : types.ts des DEUX modules déclarait `LocalizedServiceDetails = Localized<ServiceDetailsContent>` (= Record<Lang, …>) alors que fr.ts et index.ts utilisent le contenu d'UNE langue par fichier (fr.ts = contenu brut ; index.ts = Record<Lang, LocalizedServiceDetails>) → fr.ts ne compilait pas (TS2353 sur chaque slug). Alias corrigé en `LocalizedServiceDetails = ServiceDetailsContent` (resp. `SaasDetailsContent`) + commentaire explicatif ; import `Localized` devenu inutile retiré. Interfaces ServiceDetail/SaasDetail, slugs et champs : INTACTS. Les agents es/zh/de qui suivent le même gabarit (export : LocalizedServiceDetails) compilent sans rien toucher d'autre
- Créé src/lib/pages-content/service-details/en.ts — SERVICE_DETAILS_EN : 7 pôles (web/software/saas/community/acquisition/training/strategy), structure et ordre de clés identiques au fr ; ton premium, phrases courtes, scission title/gold conservée partout (ex. « Un site qui travaille / pour vous, jour et nuit. » → « A website that works / for you, day and night. ») ; noms imposés : Websites, Software & applications, Business SaaS, Community management, Client acquisition, Training, Business strategy
- Créé src/lib/pages-content/saas-details/en.ts — SAAS_DETAILS_EN : 6 produits, vidéo "soonNote" traduite (videoUrl reste null), FAQ 3 Q/R par produit ; noms imposés : Factura Pro (marque), Accounting management, Hospital management, School management, Real-estate management, Pharmacy management ; labels hero « Business SaaS — Invoicing/Accounting/Healthcare/Education/Real estate/Pharmacy »
- Règles respectées : slugs, chemins /images/..., priceRef (web/software/saas/null) et videoUrl null inchangés ; montants GNF au format officiel identique au fr (« 1 500 000 GNF », « 100 000 GNF / month », « 7 000 000 GNF / year », « 1 – 5 000 000 GNF » — séparateurs espace conservés, AUCUN format anglo-saxon) ; aucun prix ni fonctionnalité inventés (fidèle au fr, vérifié champ par champ) ; guillemets « dépannage » → “getting by” en typographie EN
- Vérifications : script bun d'égalité structurelle fr↔en (clés, types, longueurs de tableaux, slug/image/priceRef/videoUrl préservés, mapping des name, montants GNF identiques de part et d'autre, heuristique anti-français résiduel) → ALL CHECKS PASSED ; bunx tsc --noEmit → 0 erreur dans mes fichiers (les TS2353 de fr.ts sont résolus par le correctif types.ts ; restent 4 erreurs préexistantes examples//skills/ + les modules es/de encore absents, livrés par les agents parallèles) ; bun run lint → 0 erreur

Stage Summary:
- 2 fichiers créés : src/lib/pages-content/service-details/en.ts (7 pôles) et src/lib/pages-content/saas-details/en.ts (6 SaaS) — anglais premium, mêmes slugs/clés/structure que le fr, prêts pour le branchement index.ts (déjà câblé : `en: SERVICE_DETAILS_EN` / `en: SAAS_DETAILS_EN`)
- 1 correctif partagé : alias de type `LocalizedServiceDetails`/`LocalizedSaasDetails` = contenu d'UNE langue (au lieu de Record<Lang, …>) — fr.ts compile de nouveau ; les traductions es/zh/de doivent suivre le même gabarit (objet plat, clés = slugs)
- Montants : format GNF officiel préservé à l'identique du fr (espaces, « / month » et « / year » remplacent uniquement l'unité) — la bande tarifaire reste alimentée par priceRef + catalogue, rien n'est réinventé

---
Task ID: 7-c
Agent: general-purpose
Task: Traduction ZH de service-details et saas-details

Work Log:
- Lecture du worklog, des types (service-details/types.ts, saas-details/types.ts) et des sources françaises (fr.ts ×2) avant d'écrire
- Créé src/lib/pages-content/service-details/zh.ts — SERVICE_DETAILS_ZH : mêmes clés/slug/images/priceRef que fr (7 pôles), noms imposés (网站建设, 软件与应用, 业务管理SaaS, 社群运营, 客户获取, 培训服务, 企业战略), scissions title/gold adaptées au chinois (title + fin emphatique dorée), ponctuation pleine largeur （，。：——「」）
- Créé src/lib/pages-content/saas-details/zh.ts — SAAS_DETAILS_ZH : 6 produits, videoUrl:null inchangé, noms imposés (Factura Pro inchangé, 会计管理, 医院管理, 学校管理, 物业管理, 药店管理), FAQ 3 Q/R par produit
- Montants GNF strictement conservés : « / mois »→« / 月 », « / an »→« / 年 », « par an »→« / 年 », « dès X GNF »→« X GNF 起 », école « 每年支付9个月 » ; aucun prix ni fonctionnalité inventés
- Vérification bun : arbres de clés identiques au fr (427 feuilles service-details, 348 saas-details), slugs/images/videoUrl/priceRef identiques, montants GNF bijectif fr↔zh (0 perdu, 0 inventé), aucun reste de français, seuls tokens latins = GNF/SEO/SaaS/Factura Pro/100% + chemins/slugs intacts
- bunx tsc --noEmit : 0 erreur dans mes 2 fichiers (au 1er passage, types.ts définissait encore LocalizedServiceDetails = Localized<ServiceDetailsContent> ce qui faisait échouer fr.ts ET zh.ts ; l'alias a été corrigé en parallèle vers ServiceDetailsContent — mes fichiers sont conformes à cette forme). Erreurs restantes du projet : 4 préexistantes (examples/, skills/) + ./es et ./de manquants côté saas-details (agents parallèles 7-a/7-b/7-d)

Stage Summary:
- 2 fichiers créés : src/lib/pages-content/service-details/zh.ts (SERVICE_DETAILS_ZH) et src/lib/pages-content/saas-details/zh.ts (SAAS_DETAILS_ZH) — chinois simplifié premium (vous de politesse 您), ton court et percutant « Obsidienne & Or », prêts pour l'index Record<Lang, …> (fallback fr intact)
- Zéro écart de structure vs fr : mêmes slugs, mêmes images, videoUrl null, priceRef inchangés, tous les montants GNF exacts au format d'origine (1 500 000 GNF, 100 000 GNF / 月, 1 – 5 000 000 GNF / 月, 7 000 000 GNF / 年…)
- Fichiers compilants (bunx tsc : aucune erreur sur zh.ts ×2) ; attention orchestrateur : saas-details/index.ts attend encore ./es et ./de (en cours chez les agents parallèles)
---
Task ID: 7-d
Agent: general-purpose
Task: Traduction DE de service-details et saas-details

Work Log:
- Lecture worklog.md, types.ts + fr.ts des deux modules, types.ts saas-details, dictionnaire i18n existant (section `de` de translations.ts) pour aligner la terminologie (Leistungen, Demo buchen, Kostenloser 7-Tage-Test, Angebot anfordern, / Monat, / Jahr, „Auf Angebot", etc.)
- Création src/lib/pages-content/service-details/de.ts : SERVICE_DETAILS_DE (7 pôles : web, software, saas, community, acquisition, training, strategy) — structure et clés strictement identiques à fr.ts
- Création src/lib/pages-content/saas-details/de.ts : SAAS_DETAILS_DE (6 produits : factura-pro, gestion-comptable, gestion-hospitaliere, gestion-ecole, gestion-immobiliere, gestion-pharmacie) — structure identique à fr.ts
- Noms imposés respectés : Websites, Software & Anwendungen, Verwaltungs-SaaS, Community-Management, Kundengewinnung, Schulungen, Unternehmensstrategie ; Factura Pro (marque inchangée), Rechnungswesen, Klinikverwaltung, Schulverwaltung, Immobilienverwaltung, Apothekenverwaltung
- Montants GNF inchangés et formats respectés : «/ mois»→«/ Monat», «/ an»→«/ Jahr», «par mois/par an»→«pro Monat/pro Jahr», «Dès»→«Ab», «Sur devis»→«Auf Angebot» ; slugs, images, videoUrl (null) et priceRef intacts
- Scissions title/gold conservées et adaptées au rythme allemand (ex. «Eine Website, die arbeitet / für Sie — Tag und Nacht.») ; ton premium, phrases courtes, Sie-Form implicite
- Note type : fr.ts annotait les fichiers langue avec LocalizedServiceDetails (= Record<Lang, …>) alors que chaque fichier ne contient qu'UNE langue → TS2353 préexistant sur fr.ts. J'ai d'abord annoté avec ServiceDetailsContent/SaasDetailsContent ; un agent parallèle a ensuite converti types.ts en alias (LocalizedServiceDetails = ServiceDetailsContent) ; j'ai aligné mes deux fichiers sur LocalizedServiceDetails/LocalizedSaasDetails (identique désormais), comment à jour
- Vérifs : comparaison programmatique des formes fr/de (bun) → structure identique, slugs/images/videoUrl/priceRef identiques, 12 + 23 montants GNF identiques un à un ; tsc --noEmit → 0 erreur dans src/ (restent 4 erreurs préexistantes hors site : examples/websocket ×2, skills/image-edit, skills/stock-analysis)

Stage Summary:
- Modules service-details et saas-details désormais complets en 5 langues : de.ts ajouté des deux côtés, conforme au contrat de structure du fr (mêmes slugs/clés/types)
- Terminologie DE alignée sur le dictionnaire existant (translations.ts section de) : aucune invention de prix ni de fonctionnalité, libellés CTA cohérents avec le site (Demo buchen, Angebot anfordern, Preise ansehen, Kontakt aufnehmen)
- tsc : 0 erreur liée aux fichiers livrés ; fichiers de.ts prêts pour la consommation par index.ts (imports ./de déjà en place)
---
Task ID: 7-b
Agent: general-purpose
Task: Traduction ES de service-details et saas-details

Work Log:
- Lectures préalables : worklog.md (contexte tâches 1→7), types.ts + fr.ts des deux modules, index.ts, page-content.tsx (Localized), conventions des autres modules pages-content
- Constat au départ : index.ts importait ./es inexistant (les 5 langues) ; en parallèle 7-c/7-d/7-e ont créé en/zh/de et le typage LocalizedServiceDetails a été corrigé dans types.ts (= ServiceDetailsContent par langue, agrégation Record<Lang,…> dans index.ts) — mes fichiers suivent ce contrat final
- Création src/lib/pages-content/service-details/es.ts : SERVICE_DETAILS_ES, 7 pôles (web, software, saas, community, acquisition, training, strategy), structure 1:1 avec fr.ts (hero/overview/included/process/audience/cta, priceRef inchangés)
- Création src/lib/pages-content/saas-details/es.ts : SAAS_DETAILS_ES, 6 produits (factura-pro, gestion-comptable, gestion-hospitaliere, gestion-ecole, gestion-immobiliere, gestion-pharmacie), videoUrl: null conservé, structure 1:1 (hero/video/overview/features/audience/cta/faq)
- Noms imposés respectés : Sitios web, Software y aplicaciones, SaaS de gestión, Community management, Adquisición de clientes, Formaciones, Estrategia empresarial ; Factura Pro (marque), Gestión contable/hospitalaria/escolar/inmobiliaria/de farmacia
- Règles montants : tous les montants GNF repris à l'identique en format français (1 500 000 GNF, 20 000 000 GNF, 7 000 000 GNF…) ; unités traduites « / mois »→« / mes », « / an »→« / año » sans toucher aux chiffres ; aucune fonctionnalité ni prix inventés
- Ton : espagnol neutre professionnel (usted), phrases courtes premium, scission title + gold conservée sur tous les blocs (rendu italique doré), équivalents idiomatiques choisis (« a la primera », « al pie de la letra », « sin noches en vela », « al último comprimido ») ; guillemets « » conservés
- Vérifications automatisées (bun) : arbres de clés identiques fr↔es (service-details 427 feuilles/423 chaînes ; saas-details 348 feuilles/342 chaînes, 0 clé manquante, 0 extra) ; slugs, images, videoUrl, priceRef identiques ; tous les montants GNF identiques fr↔es ; grep anti-restes-français → rien
- bunx tsc --noEmit -p tsconfig.json → 0 erreur dans src/ (seules subsistent les 4 erreurs préexistantes examples/ + skills/, hors périmètre)

Stage Summary:
- es.ts créé dans les 2 modules et câblé par index.ts existant (SERVICE_DETAILS.es / SAAS_DETAILS.es) : le site EINSOF dispose désormais de pages services + SaaS complètes en espagnol
- Contraintes respectées : mêmes slugs/chemins/priceRef/videoUrl null, montants GNF intacts, aucun tarif ni feature inventé, TypeScript strict OK
- Note pour l'orchestrateur : néant côté es — le typage par langue (LocalizedServiceDetails = ServiceDetailsContent dans types.ts) est désormais homogène et compile ; prochaine étape possible : relecture native ES par le client

---
Task ID: 8 (orchestrateur)
Agent: Z.ai Code (principal)
Task: Corrections UI demandées par le client — suppression grille « Explorer le site », carrousels défilants Services & Logiciels, pages de détail dédiées (services + SaaS), images de fond dans tous les bandeaux, meilleure mise en scène

Work Log:
- Accueil : suppression de HubGrid (« Explorer le site — Chaque sujet mérite sa page ») et de JournalSection (le blog vit désormais dans le menu « Blog » + page /blog) ; HomePage = Hero + Stats + CTA final ; fichiers HubGrid.tsx / JournalSection.tsx / pages-content/hub.ts supprimés
- PageHero : nouveau prop `image` (next/image fill + double voile dégradé sombre, lisibilité garantie) et prop `parent` (fil d'Ariane Accueil / Services / …)
- Nouveau composant ScrollCarousel : carrousel défilant infini (useAnimationFrame, boucle modulo sur largeur mesurée par ResizeObserver, pause au survol/focus/touch, fondus de bords, fallback « animations réduites » = rail scrollable snap)
- ServicesSection réécrite : carrousel des 7 pôles, chaque carte = Link vers /services/[slug] (web, software, saas, community, acquisition, training, strategy) avec tarifs §19 exacts et indication « Découvrir le pôle »
- SaasSection réécrite : carrousel des 6 logiciels, visuels produits générés (images), chaque carte = Link vers /logiciels/[slug]
- 23 images générées via z-ai-web-dev-sdk (scripts/gen-images.mjs) : 10 bandeaux de pages (1536×640), 7 visuels de pôles + 6 visuels SaaS (1344×768), style « Obsidienne & Or », aucun texte dans les images
- Nouveau module de contenu src/lib/pages-content/service-details/ (types + fr + en/es/zh/de via 4 sous-agents parallèles) : vue d'ensemble + points-clés, inclus (8), méthode (4 étapes), pour qui (3), bande tarifaire (références catalogue uniquement), CTA
- Nouveau module src/lib/pages-content/saas-details/ (idem 5 langues) : présentation, vidéo (videoUrl null → affiche élégante « Vidéo bientôt disponible », iframe YouTube/Vimeo ou MP4 déjà implémentés pour plus tard), 10 caractéristiques, pour qui + 3 cas, tarif catalogue, CTA démo + essai, mini-FAQ, autres logiciels
- Composants ServiceDetailPage + SaasDetailPage ; routes statiques /services/[slug] et /logiciels/[slug] (generateStaticParams + generateMetadata, notFound si slug inconnu)
- ServicesPage : PageHero imagé + carrousel + promesses + CTA + liens croisés ; la section « Chaque pôle en détail » a été retirée (le détail vit sur chaque page de pôle) — idem « Détail des produits » retirée de LogicielsPage (détail sur chaque page produit)
- Images de fond ajoutées aux 10 PageHero (tarifs, faq, a-propos, contact, blog, réalisations, secteurs, méthode + services + logiciels)
- Traductions : nav.blog « Journal »→« Blog » (5 langues), clés services.discover/carouselHint, services.detail.factsLabel/otherServices, saas.discover/carouselHint/videoSoonBadge, pricing.popularLabel ; label bandeau blog « 10 — Journal »→« 10 — Blog » (5 langues)
- FIX multi-pages openForm : depuis une page sans formulaire, la demande (démo/devis/essai) est mémorisée en sessionStorage puis /contact est ouvert ; ContactSection consomme la demande au montage et préremplit sujet + message (types demo/quote/trial)
- FIX Radix Select : sujet prérempli ne s'affichait pas (SelectValue sans item monté) → texte affiché manuellement dans SelectTrigger, Select non contrôlé ; correction d'un crash client (ref + children sur SelectValue) détecté au test navigateur
- Vérifications : tsc 0 erreur (src), lint 0 erreur, 15 routes en 200, Agent Browser (desktop 1440 + mobile 390) : accueil allégé vérifié, carrousels actifs (7 + 6 cartes cliquables), pages de détail complètes, flux démo/essai/devis → /contact préremplis, FAQ accordéon OK, console 0 erreur, footer naturel sur pages longues

Stage Summary:
- Le site est entièrement multipage : 7 pages de pôles + 6 pages SaaS dédiées, toutes uniques, détaillées et en 5 langues ; carrousels défilants sur /services et /logiciels ; accueil recentré (plus de grille de cartes, plus de section journal)
- Visuels cohérents « Obsidienne & Or » partout (23 images), aucune régression d'accessibilité/réduced-motion
- Reste côté client : URLs des vidéos à intégrer (champ videoUrl par produit), contenu FAQ à restructurer avec la ressource que le client fournira

---
Task ID: 13
Agent: Z.ai Code (principal)
Task: Retour client itération 2 — (1) remplacer les carrousels « trop lents » par des coverflows dynamiques à carte centrale en emphase ; (2) corriger les incohérences light/dark.

Work Log:
- Audit : ScrollCarousel (marquee continu) identifié comme cause du manque de punch ; grep des couleurs codées en dur (#0D0D0D, #0A0A0A, #111111, #f5f2ea) → 9 fichiers touchés
- Créé `src/components/site/CoverflowCarousel.tsx` : coverflow 3D (x/z/rotateY/scale/opacity/brightness via useTransform sur une MotionValue partagée), ressort stiffness 420, drag 1:1 + flick + élastique, autoplay 5 s (pauses survol/focus/drag/onglet), flèches + pastilles + compteur animé + clavier, repli rail reduced-motion avec liens
- Intégré dans ServicesSection (7 pôles) et SaasSection (6 SaaS) ; supprimé ScrollCarousel.tsx ; hints réécrits en 5 langues
- Thème : nouveau token `--deep` + `bg-deep` (kit.tsx Section, PageBlocks CtaBanner, PageHero, ArticlePage ×2, SaasDetailPage) ; voiles PageHero/SaasDetail tokenisés (from-bg) avec opacité d'image adaptative dark:opacity-55 ; PillarsSection/TestimonialsSection text-[#f5f2ea]→ink, bg-[#111111]→bg-surface ; préchargeur bg-bg ; themeColor adaptatif
- Fix au passage : cartes du repli reduced-motion non cliquables (lien manquant) + suivi de position du rail pour les pastilles
- Vérification Agent Browser : coverflow desktop+mobile sombre/clair, clic latéral=centrage, clic central=navigation (/services/web, /logiciels/gestion-hospitaliere), drag 480px=2 cartes, autoplay+pause+rebobinage 6→0, flèches+clavier ; balayage 7 pages en clair et sombre ; lint 0 erreur ; commits conventionnels (feat + docs)

Stage Summary:
- Carrousels Services/SaaS = coverflow punchy à emphase centrale, interaction riche (drag/flick/autoplay/clavier), navigation conservée vers les pages de détail
- Thème clair désormais cohérent de bout en bout (bandes profondes ivoire, voiles adaptés) ; sombre inchangé visuellement
- En attente client : URLs vidéos produits, ressource FAQ ; blog à approfondir ensuite

---
Task ID: 14
Agent: orchestrator (Z.ai Code)
Task: itération 15 — rotation auto carrousels (8 s, boucle), menus déroulants Services/Logiciels, réalisations client (8 sites réels + aperçu animé), bande logos d'accueil, FAQ catégorisée (questions propriété), adoucissement des deux thèmes, animations supplémentaires.

Work Log:
- Carrousel coverflow : autoplay passé à 8 s (boucle infinie), barre de progression sur la pastille active (key=cycle, pause data-autopause), hints i18n mis à jour (5 langues).
- Navbar : NavDropdown desktop (survol intention + clic, Échap, clic extérieur, animation CSS dropdown-in, cascade items) pour Services (7 pôles) et Logiciels (6 produits) ; tiroir mobile : chevrons dépliants avec CollapseMotion + liens de sous-listes (inert quand replié) ; fermeture via reset pendant le rendu (pattern React, plus d'useEffect setState).
- Réalisations : works.ts (8 sites réels fournis par le client, titres/méta du web, secteurs, 5 langues) ; WorksShowcase avec fenêtre « navigateur » (chrome + domaine) et aperçu animé au survol (capture pleine page qui défile — container query 100cqh, keyframes work-scroll) ; captis/ecometus/interseas/emrod/referencemedia/fmk224/topguinee/samoumedia.
- Médias : 8 captures pleine page via agent-browser (1280→1100 px, JPEG q82), 6 logos téléchargés (captis.svg, ecometus.png, referencemedia.png, fmk224.png, topguinee.png, samoumedia.jpg) ; 2 sites sans logo → texte serif.
- Accueil : ClientLogosBand (marquee CSS -50 %, pause survol, logos grayscale → couleur ; dark : monochrome blanc brightness-0/invert, couleur au survol) placé entre Hero et Stats.
- FAQ : faq.ts réécrit — 6 thèmes × 20 questions × 5 langues ; 4 questions « propriété » du client insérées mot pour mot (fr) ; +4 questions factuelles (frais cachés, suivi projet, mobile, renouvellement) ; FaqPage avec chips d'ancres sticky + accordéons par thème.
- Thèmes : clair « parchemin chaud » (#f1ebdd bg, surface #faf6ec, plus de blanc cru) ; sombre « obsidienne veloutée » (#151517, surfaces #1d1d20/#26262a, lignes #34343a) ; theme-color/manifest alignés ; ombres/vitres adaptées.
- Animations : PageHero parallaxe (y 0→70 px + scale 1.04→1.12, désactivée en mode réduit) ; pas de fondu sur <main> (leçon archivée dans SiteShell respectée).
- i18n : nav.allServices/allLogiciels/submenu, works.*, clients.* ×5 langues ; carouselHint ×2 ×5.
- Vérification agent-browser : autoplay 01→03 visible, dropdowns desktop OK (dark+light), tiroir mobile OK, aperçu défilant OK, FAQ accordéons OK, thèmes OK ; lint vert ; dev.log sans erreur.

Stage Summary:
- Conformité client : rotation auto 7–10 s en boucle ✓, bandes déroulantes Services/Logiciels dans le menu (desktop + mobile) ✓, page Réalisations avec les 8 sites et aperçu animé au survol ✓, bande logos sur l'accueil ✓, FAQ catégorisée avec les 4 questions propriété ✓, thèmes moins criards (clair ivoire chaud, sombre obsidienne adoucie) ✓, animations renforcées ✓.
- En attente client : blog « section article » approfondi (contenus à venir), logos manquants interseas/emrod si fournis, resources FAQ/insight supplémentaires.
---
Task ID: 15
Agent: Z.ai Code (principal)
Task: Retour client itération 3 — (1) aperçus Réalisations « site vide » corrigés, (2) Réalisations en carrousel auto (3 s), (3) chatbot branché sur OpenRouter (clé client) nourri en temps réel par le contenu du site, (4) voix conversationnelle professionnelle, (5) contrôle total du site par le chatbot.

Work Log:
- Diagnostic du bug « aperçu vide » : captures pleine page prises avant déclenchement du lazy-loading → sections entières blanches (confirmé visuellement sur captis.jpg).
- Nouveau pipeline de capture Playwright direct (scripts/capture-works.mjs) : viewport 1100 px, networkidle tolérant, défilement lent par paliers 350 px/420 ms (déclenche IntersectionObserver/reveals), re-passages tant que la hauteur du document croît, attente des images (naturalWidth), purge des styles reveal inline restants (opacity:0 → 1, hors position:fixed), fermeture/masquage des popups (modales plein écran >55 % du viewport, boutons flottants d'angle, bannières WhatsApp/cookies), retour haut puis screenshot fullPage. Les modales retardées (~15 s) sont couvertes par le second passage DISMISS juste avant capture.
- 8 sites re-capturés et vérifiés un à un (Captis, Ecometus, Inter Seas — popup contact fermée, EMROD — modale fermée, Referencemedia, FMK224, Topguinee — page complète enfin chargée, Samou Média) ; conversion PNG→JPEG q82 (sharp) vers public/images/works/ ; shotH réel ajouté à works.ts (rapport d'aspect next/image).
- Réalisations → CoverflowCarousel (même mise en scène que Services/Logiciels) avec autoplayMs={3000} ; buffer d'interaction du carrousel rendu proportionnel au tempo (min(3600, tempo×0,55)) pour ne pas bloquer les 3 s ; textes works.* (sub + hint) mis à jour en 5 langues pour annoncer la rotation automatique.
- Chatbot OpenRouter : clé client ajoutée à .env (OPENROUTER_API_KEY, OPENROUTER_MODEL=openai/gpt-4o-mini par défaut) ; nouveau src/lib/chatbot/openrouter.ts (SSE streaming réel, en-têtes d'attribution, gestion « : OPENROUTER PROCESSING ») ; message/route.ts réécrit — les tokens du modèle partent vers le navigateur au fil de l'eau, repli transparent z-ai si OpenRouter échoue sans token émis (même flux SSE), parsing/exécution des actions en fin de flux, persistance inchangée.
- RAG « le chatbot se nourrit du site » : nouveau src/lib/chatbot/site-index.ts — index de documents construit depuis les modules officiels (7 pôles service-details, 6 SaaS saas-details + mini-FAQ, 8 réalisations works.ts, FAQ catégorisée, tarifs catalogue, méthode, à propos, blog) ; retrieval par mots-clés (normalisation accents, stop-words fr/en, bonus titre ×3, bonus couverture) → top-k injecté dans le prompt système (CONTEXTE DU SITE avec chemin de page) ; ancien knowledge.ts supprimé (contradiction « ne jamais citer de client » obsolète face aux 8 réalisations publiées).
- Contrôle total du site : nouveau src/lib/chatbot/site-routes.ts (carte complète : pages statiques + /services/[slug] ×7 + /logiciels/[slug] ×6, libellés FR) ; action navigate désormais {path:"…"} validée côté serveur contre cette carte ; chat-bus.navigateToPath + SiteShell.onNavigatePath (router.push, scroll top si même page) ; chat-context envoie currentPath (page réellement vue) et gère l'action path ; prompt enrichi (liste des chemins + exemple EXACT du marqueur [[action:...]]).
- Parseur d'actions tolérant aux dérives du modèle (observé : « navigate {"path":…} » en texte libre) : format canonique [[action:…]], objet JSON nu {"tool":…}, et nom d'outil suivi d'un JSON nu — tests unitaires bun OK (aucun faux positif sur prose normale).
- Voix professionnelle : nouveau src/lib/voice.ts — sélection systématique de la meilleure voix du navigateur (préférence Natural/Neural/Online/Google/Premium/Enhanced, bannissement eSpeak/Pico/Compact, score langue exacte > racine), cache + voiceschanged, débit posé 0,98, découpage par phrases (prosodie stable, anti-coupure) ; OmnisOverlay réécrit pour l'utiliser (états speaking/idle pilotés par callbacks).
- Vérifications : curl SSE en direct (prix exacts 1 500 000 / 1-3-5 M / 7 M GNF cités depuis le RAG, action navigate /realisations émise) ; Playwright E2E — carrousel 8 cartes rotation auto 02→03→05 constatée, hover work-scroll actif, chatbot question pharmacie → réponse exacte + navigation temps réel vers /logiciels/gestion-pharmacie (URL constatée), Omnis ouvert sans erreur, mobile 390 px OK, footer naturel OK, 0 erreur console persistante ; lint 0 erreur ; tsc 0 erreur src.

Stage Summary:
- Les 8 aperçus de la page Réalisations montrent désormais chaque site COMPLET (tous composants chargés) et défilent en carrousel coverflow avec rotation automatique toutes les 3 secondes — même mise en scène que Services/Logiciels.
- Le chatbot tourne sur OpenRouter (clé client, streaming réel token par token, zéro réponse pré-écrite), se nourrit automatiquement du contenu réel des pages (RAG site-index) et peut emmener le visiteur sur N'IMPORTE QUELLE page du site en temps réel (contrôle total validé E2E : /realisations, /logiciels/gestion-pharmacie).
- Repli z-ai maintenu : le chatbot ne tombe jamais en panne même si OpenRouter est indisponible.
- Voix Omnis : sélection de la meilleure voix neuronale du navigateur + débit posé + découpage par phrases (headless sans voix → repli gracieux ; à l'écoute sur postes réels Edge/Chrome/Safari).
- En attente client : contenus blog (thématiques annoncées), URLs vidéos produits, logos manquants interseas/emrod.

---
Task ID: 16
Agent: Z.ai Code (principal)
Task: Retour client itération 4 — (1) chatbot « très lent » diagnostiqué et corrigé de bout en bout, (2) mode Omnis réécrit : panneau flottant (site toujours visible) avec boucle conversationnelle temps réel et navigation visible en direct.

Work Log:
- Diagnostic latence (3 causes racines, prouvées par mesures) :
  1. `openai/gpt-4o-mini` (modèle par défaut) répond HTTP 403 « This model is not available in your region » → CHAQUE message basculait sur le repli z-ai NON streamé + streaming simulé mot à mot (22 ms/mot) → lenteur systématique. Bench réel de ~20 modèles disponibles (scripts/bench-chat.ts) : OpenAI/Google/Anthropic/Mistral bloqués région ; retenus `deepseek/deepseek-v4-flash` et `~z-ai/glm-flash-latest`.
  2. Header `X-Title: "EINSOF — Assistant commercial"` : le tiret cadratin (—, U+2014) fait REJETER le header par le fetch de Bun (« Cannot convert argument to a ByteString… value of 8212 » — constaté dans dev.log) → l'appel OpenRouter échouait AVANT la requête même quand le modèle était bon. Correctif : X-Title ASCII (« EINSOF Assistant commercial ») + garde-fou documenté.
  3. Les modèles « flash » retenus sont des modèles à RAISONNEMENT : des tokens delta.reasoning étaient streamés avant tout texte visible (TTFT réel = fin du thinking ; à max_tokens 60 la réponse pouvait être VIDE). Correctif : `reasoning: { enabled: false }` dans le corps OpenRouter → TTFT divisé par ~3-5.
- Latence — autres optimisations : prompt système compressé 13,5k → 8,4k caractères (règles tassées, faits inchangés), RAG top-k 6→4 + corps de documents tronqués à 600 caractères, historique tronqué à 600 caractères/message, sauvegarde du message utilisateur rendue NON bloquante (part en parallèle du LLM), session pré-créée dès l'ouverture du chat/Omnis (plus de aller-retour sur le 1er message).
- Résilience LLM : `openrouter.ts` réécrit — chaîne de modèles (OPENROUTER_MODEL peut lister plusieurs IDs) avec watchdog « premier token » 7 s (AbortController), saut automatique des modèles en échec/vides, jamais de redémarrage si des tokens sont déjà partis ; flux vide = modèle suivant ; repli z-ai inchangé en dernier ressort. .env : `OPENROUTER_MODEL=~z-ai/glm-flash-latest,deepseek/deepseek-v4-flash`.
- Affichage propre : les marqueurs d'action ([[action:…]] et dérives {"tool":…}) ne sont plus jamais streamés au navigateur (buffer d'émission « sûr » côté serveur) — le texte affiché reste propre pendant tout le streaming, l'action partant toujours via l'événement SSE dédié.
- Mode Omnis réécrit (OmnisOverlay) : plein écran noir supprimé — nouveau PANNEAU FLOTTANT bas-droite (z-[82], même gabarit que la fenêtre chat, glass-panel) : le site reste ENTIÈREMENT visible et interactif derrière. Boucle conversationnelle mains libres (par défaut) : écoute → envoi → streaming → lecture voix → réécoute auto (garde anti-boucle : pause après 2 silences, reprise au tap du micro) ; transcript en direct (interim + réponse qui se streame) ; bandeau « Ouverture de {page}… » via onNavigatePath quand le robot navigue sur le site en temps réel ; bouton « écrire à la place » → bascule vers le chat texte ; Échap pour quitter. Nouvelles clés i18n chat.omnis.autoListen/handsFree/navigating ×5 langues.
- Vérifications : bench SSE direct — TTFT 0,82-2,2 s (réponses complètes, tarifs exacts 1 500 000/500 000/7 000 000 GNF depuis le RAG, actions navigate correctes) ; chaîne testée avec 2 modèles morts → récupération TTFT 940 ms ; E2E navigateur — question « Amène-moi sur la page tarifs » → réponse propre (aucun marqueur) + URL /tarifs en direct ; dock Omnis vérifié desktop + mobile 390 px (correctif z-index vs bannière PWA), sombre + clair ; conversation salutation sans RAG → 0,8 s ; dev.log sans erreur après correctifs ; lint 0 erreur ; tsc 0 erreur.

Stage Summary:
- Latence perçue ramenée de « plusieurs secondes à chaque fois » (403 région + repli non streamé + thinking caché) à ~0,8-2 s TTFT en streaming réel, avec trois ceintures de sécurité : chaîne de modèles + watchdog 7 s + repli z-ai.
- Mode Omnis : le site reste visible en permanence — le visiteur pose une question à la voix, l'assistant répond à voix haute ET déplace la page en direct sous le panneau (flash « Ouverture de {page}… ») ; mode mains libres pour une vraie conversation continue.
- Scripts/bench-chat.ts conservé : re-mesurer la latence des modèles OpenRouter à tout moment.

---
Task ID: 17
Agent: Z.ai Code (principal)
Task: (1) Erreur d'hydratation Radix sur /tarifs (IDs radix-_R_… divergents) — diagnostiquée et corrigée à la racine ; (2) latence chatbot ENCORE lente pour le client — cause réelle trouvée (clé OpenRouter absente du .env) et corrigée ; (3) mode Omnis refondu en capsule haute « site visible » avec navigation temps réel ; (4) langue de réponse imposée (fr/en/es/zh/de).

Work Log:
- HYDRATION : reproduction instrumentée (MutationObserver + probes useEffect) sur /tarifs — constat : ~1 s après le chargement, TOUTES les sous-arbres enveloppées dans Reveal/Stagger étaient DÉMONTÉES/REMONTEES et les IDs Radix régénérés en format client (radix-_r_…). Cause : le basculement post-montage de lightMode (détection appareil faible/prefers-reduced-motion dans MotionProvider) changeait le TYPE de fiber — Reveal/Stagger/StaggerItem/PopIn rendaient un <div> natif (Plain) en mode light contre motion.div en mode complet ; idem Parallax/Float/DrawRule/ScrollProgress/VelocityRow/CollapseMotion. Un changement de type = remontade React = régénération des useId = divergence d'hydratation quand le basculement chevauche celle-ci (appareil lent). Correctif : TOUS ces composants rendent désormais LA MÊME RÉFÉRENCE motion.* dans les deux modes (mode light = motion.* sans props d'animation) — plus aucun remontade possible, vérifié observer (0 suppression DOM, IDs stables radix-_R_2iinebmmitplb_ conservés), 0 erreur console sur /, /tarifs, /services, /saas, /faq, /contact.
- LATENCE CHAT : le .env du sandbox ne contenait AUCUNE clé OPENROUTER_API_KEY (perdue depuis l'itération précédente) → isOpenRouterConfigured()=false → chaque message passait par le repli z-ai NON streamé + streaming simulé 22 ms/mot. Correctif : clé réécrite dans .env + serveur relancé. Bench curl des modèles disponibles aujourd'hui (TTFB streaming, reasoning off) : meta-llama/llama-3.3-70b-instruct 636 ms ✓ contenu direct ; mistralai/mistral-small-24b-instruct-2501 777 ms ✓ ; deepseek/deepseek-v4-flash 1608 ms (modèle à raisonnement, robuste) ; qwen-72b 3,6 s ; deepseek-chat-v3 3,8 s. Chaîne mise à jour : llama-3.3-70b → mistral-small-24b → deepseek-v4-flash ; watchdog premier token 7 s→5 s ; repli z-ai accéléré (3 mots/8 ms au lieu de 1 mot/22 ms).
- BUG d'affichage au passage : les deltas du modèle peuvent COUPER le marqueur [[action:… en deux (« …[[ac » + « tion:… ») — le fragment partait vers le navigateur. Correctif : rétention des 12 derniers caractères pendant le flux (HOLD), rincage en fin de flux ; lastSafeCut remplace sentLen pour la détection de flux vide. Vérifié : 0 fuite de marqueur sur plusieurs messages.
- LANGUE : constaté en test E2E — question EN → réponse FR (prompt système rédigé en français, l'historique FR renforce la dérive). Correctif double : directive finale « LANGUE DE RÉPONSE OBLIGATOIRE » en fin de prompt système + reminder system injecté JUSTE AVANT la question (languageReminder(), poids maximal même avec historique mêlé). Vérifié EN/ES/ZH : réponses dans la bonne langue, tarifs exacts du RAG.
- OMNIS v2 « interface visible » : à la demande du client (« je ne vois plus l'interface »), la carte bas-droite est remplacée par une CAPSULE fixe HAUT-CENTRE (sous la navbar, w=min(94vw,660px)) : radar + état (écoute/réflexion/réponse) + transcript interim en italique + micro + mains libres + clavier + fermer. Champ texte INTÉGRÉ (poser une question au clavier sans quitter Omnis). Toast navigation temps réel sous la capsule (« Ouverture de {page}… », radar rotatif, 3,2 s) — la page change SOUS la capsule, visible par le visiteur. Carte « Réponse en direct » repliable bas-droite (max-h-210, scroll) pour la dernière réponse. i18n ×5 langues (placeholder/send/transcript). Animation omnis-spin ajoutée à globals.css.
- Vérifications E2E navigateur : ouverture Omnis → capsule top-center, site 100 % visible (screenshot) ; question « Show me your pricing » → navigation / en temps réel vers /tarifs (URL + Tabs présents) ; « Take me to the blog » → toast « Opening Blog… » capturé à t=2,5 s puis /blog ; LIVE REPLY streame la réponse EN ; footer collé au bas (gap 0) ; 11 routes toutes 200 ; dev.log sans erreur ; lint 0 erreur.

Stage Summary:
- Hydratation : la CLASSE entière de bugs « radix-_R_… mismatch » est éliminée (plus aucun composant animé ne change de type de fiber) — plus robuste que supprimer l'avertissement.
- Latence : la vraie cause était la CLÉ ABSENTE du .env ; rétablie + chaîne de modèles re-mesurée (llama-3.3-70b 0,6 s) → TTFB 0,6-2,8 s en streaming réel, réponses complètes en 1,4-6,5 s, repli z-ai accéléré en ceinture de sécurité.
- Omnis : capsule haute « site visible » + navigation temps réel + question clavier/voix — conforme à la demande (« lui poser des questions, lui va naviguer directement sur l'interface et réagir en temps réel »).
- À surveiller : la clé OpenRouter doit rester dans .env (elle avait disparu du sandbox) ; OPENROUTER_MODEL optionnel pour surcharger la chaîne.

---
Task ID: 18
Agent: Z.ai Code (principal)
Task: Suite continuation — (1) erreur d'hydratation /tarifs (radix-_R_…) : reproduction, cause racine côté environnement client et durcissement ; (2) re-vérification latence chatbot ; (3) re-vérification Omnis « site visible » + navigation temps réel ; (4) garde-fous prix anti-hallucination.

Work Log:
- HYDRATATION — diagnostic : ni le code ni le SSR ne divergent (curl SSR ids = DOM hydraté, identiques : radix-_R_2iinebmmitplb_…). Matrice Playwright (scripts/hydration-check.mjs) : desktop / mobile-390 / reduced-motion / mobile-reduced × 2 passes + clics Tabs & Accordion → 8/8 OK, 0 erreur d'hydratation. La divergence constatée chez le client (arbre client avec un fork de MOINS près de la racine) correspond à un HTML/JS de compiles DIFFÉRENTES : causes d'environnement identifiées et corrigées :
  1. sw.js : caches.put("/", copy) pour TOUTES les navigations — en cas d'échec réseau passager (redémarrage du serveur de dev, hoquet passerelle), le SW répondait à /tarifs avec le HTML périmé d'une AUTRE page (l'accueil d'une compile antérieure) → hydratation systématiquement divergente. Correctif : cache SO URL PROPRE, uniquement réponses 200 text/html, repli hors ligne seulement si l'URL demandée a été visitée, version bump einsof-v2 (purge auto des anciens caches à l'activate).
  2. RegisterSW.tsx : SW DÉSACTIVÉ en développement (le SW en dev = HTML précaché périmé pendant que le JS neuf s'exécute) + purge au montage des enregistrements résiduels et des caches einsof-* (les sessions précédentes du client sont nettoyées à la prochaine visite).
  3. next.config.ts : allowedDevOrigins ["*.space-z.ai", "preview-chat-*.space-z.ai"] — l'aperçu (iframe depuis la passerelle) frappait /_next/* en cross-origin (warning Next 16 / risque de blocage d'assets).
- LATENCE CHAT — re-vérifiée en direct (bench SSE /api/chat/message, contrat réel) : « tarifs site vitrine » premier token 1,23 s / total 5,3 s, réponse exacte (1 500 000 GNF) + action navigate /tarifs ; « Bonjour » 1,6 s / 1,8 s ; EN 0,62-1,95 s. Chaîne llama-3.3-70b → mistral-small → deepseek-flash opérationnelle.
- ANTI-HALLUCINATION PRIX (nouveau garde-fou) : constaté en bench EN — le modèle citait 5 000 000 GNF (montant INVENTÉ) pour le site vitrine. Correctif : bloc « PRIX OFFICIELS — SEULS MONTANTS AUTORISÉS » généré DEPUIS le catalogue (§19) et injecté DANS le prompt système (indépendant du RAG) : web 1,5/2,5/3,5 M GNF, renouvellement 500 000/an, logiciel dès 20 M, SaaS détaillés. Re-test EN+FR : 1 500 000 GNF cité des deux langues.
- OMNIS — re-vérifié E2E navigateur : capsule top-centre, site 100 % visible derrière (screenshot desktop + mobile 390 px) ; question clavier « Amène-moi sur la page réalisations » depuis le champ intégré → URL /realisations en direct, page visible SOUS la capsule, état « One moment… », 0 marqueur d'action affiché. Chat texte : question EN → réponse EN + navigation /tarifs en direct + prix exact.
- QA finale : lint 0 erreur ; tsc 0 erreur dans src/ ; footer collé au bas (docH == footerBottom, aucun flottement) ; balayage console multi-routes : 0 erreur persistante ; dev.log propre.

Stage Summary:
- L'erreur d'hydratation radix-_R_… est doublement traitée : (a) code déjà immunisé (itération 17, même référence motion.* dans les deux modes), (b) causes d'environnement ELIMINÉES — le service worker ne peut plus servir un HTML d'une autre page/compile, il est désactivé en dev avec purge des résidus, et l'origine de l'aperçu est autorisée pour les assets de dev. 8/8 passes de la matrice d'hydratation OK.
- Chatbot : premier token 0,6-2 s en streaming réel ; les prix cités ne peuvent plus dériver — liste officielle injectée dans le prompt (1 500 000 GNF vitrine vérifié EN+FR).
- Omnis : capsule « site visible » validée desktop + mobile, navigation temps réel depuis le champ intégré (réalisations atteinte en direct).
- scripts/hydration-check.mjs conservé : re-jouer la matrice d'hydratation à tout moment (CHROME_PATH=~/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome node scripts/hydration-check.mjs).

---
Task ID: 19
Agent: Z.ai Code (principal)
Task: Mode vocal (Omnis) « ne fonctionne pas du tout » — reconstruction complète de bout en bout : écoute fiable sur TOUS les navigateurs, réponse garantie, navigation vocale fluide.

Work Log:
- CAUSE RACINE identifiée : la reconnaissance reposait à 100 % sur webkitSpeechRecognition (Web Speech API) — absente de Firefox (bouton micro inerte), bloquée dans les iframes d'aperçu, intermittente sur Safari, dépendante des serveurs Google ; en échec, AUCUN feedback visible → « je parle, il ne répond pas ».
- Pipeline d'ÉCOUTE universel (nouveau src/lib/voice-recorder.ts) : getUserMedia (echoCancellation/noiseSuppression/autoGain) → MediaRecorder (webm/opus, ogg/opus ou mp4/AAC selon navigateur) → décodage local → WAV PCM 16 bits 16 kHz mono (OfflineAudioContext + encodeur WAV maison) → base64. Analyseur temps réel : niveau sonore (barres animées — le visiteur VOIT que le micro entend) + VAD (arrêt auto après 1,7 s de silence, grâce 350 ms, plafond dur 15 s, garde anti-souffle 650 ms / RMS 0,004).
- Double voie de transcription : (1) Web Speech si disponible (interim live + précision Google, échec silencieux toléré) ; (2) sinon/au défaut → POST /api/voice/transcribe (nouveau) → skill ASR z-ai serveur — fonctionne sur TOUS les navigateurs. Mesures curl : ASR 300-600 ms ; E2E navigateur (faux micro diffusant un vrai WAV français) : transcribe 336 ms.
- Tolérance phonétique (clé de la compréhension) : le texte ASR français est approximatif (« Bonjier mantras muy vas tarifs silvu plan ») — nouveau drapeau voice:true (chat-context send → API → prompt) injectant une directive système « MESSAGE VOCAL : interprète l'INTENTION la plus probable… » ; validé E2E : transcription déformée → réponse correcte avec tarifs exacts + navigation.
- Réponse LLM lente résolue DEUX fois : (a) OPENROUTER_API_KEY avait ENCORE disparu du .env (sandbox) → bascule automatique sur z-ai ; (b) le repli z-ai est désormais STREAMÉ RÉELLEMENT (stream:true du SDK, parseur SSE chat.completion.chunk + watchdog premier token 12 s) au lieu d'une complétion complète + simulation : TTFT 12,6 s → 475 ms (chaud). streamResponse réécrite avec émetteur « sûr » partagé (marqueurs [[action:…]] jamais streamés, y compris dans le repli — bug latent corrigé) et fin de flux mutualisée (actions serveur + persistance + done).
- Lecture voix à double voie (src/lib/voice.ts) : speakWithFallback — voix neuronale du navigateur d'abord (watchdog 1,2 s), repli automatique sur POST /api/voice/speak (nouveau, skill TTS z-ai, WAV 24 kHz, chunking par phrases ≤ 900 car., file séquentielle, annulation propre cancelSpeech) si aucune voix navigateur. Aller-retour TTS→ASR vérifié (audio français intelligible). speakProfessional : callback onFail + garde étendue à 1,2 s.
- OmnisOverlay v3 réécrit : états explicites (recording/transcribing/thinking/speaking/denied/unsupported), barres de niveau directes (DOM, 60 fps), chrono d'écoute, transcription affichée (« ce que j'ai entendu »), file d'attente vocale pendant un streaming (la question part dès la fin du tour en cours), notes d'erreur translucides auto-effacées (no_speech/asr_error/mic_error), micro refusé → message détaillé (cadenas/nouvel onglet) + champ clavier ouvert automatiquement, boucle mains libres avec pause après 2 silences ; refs d'indirection supprimées (cycle react-hooks/immutability) → relistenTick par compteur d'état.
- i18n : clés chat.omnis stop/transcribing/noSpeech/asrError/micError ajoutées + micDenied/unsupported réécrites ×5 langues (fr/en/es/zh/de).
- Vérifications E2E (agent-browser, faux micro = vrai audio français) : T0 → VAD → ASR → LLM → navigation temps réel /tarifs constatée 2 FOIS (réponses avec 1 500 000 / 2 500 000 / 3 500 000 GNF + renouvellement 500 000 GNF/an) ; état « Je vous réponds » (TTS) ; cas micro absent → note micError + clavier ouvert ; mobile 390 px resserré (boutons h-9/h-10) ; chat texte sans régression (prix exacts) ; lint 0 erreur ; tsc 0 erreur (src) ; dev.log : transcribe 336 ms, message 634 ms, speak 2,5 s, 0 erreur.
- Nettoyage : WAV de test supprimé de public/.

Stage Summary:
- Le mode vocal fonctionne de bout en bout sur TOUS les navigateurs modernes : écoute universelle (MediaRecorder + ASR serveur 336 ms) avec retour visuel du niveau sonore, compréhension robuste (tolérance phonétique), réponse streamée (TTFT 0,5 s en repli z-ai), lecture voix à double voie (navigateur → repli serveur), navigation temps réel sous la capsule validée 2× (/tarifs).
- Trois ceintures de sécurité à chaque étage : Web Speech→ASR serveur ; voix navigateur→TTS serveur ; OpenRouter→z-ai streamé réel.
- IMPORTANT (client) : la clé OPENROUTER_API_KEY a de nouveau disparu du .env du sandbox — le site tourne impecébablement sur le repli z-ai streamé (TTFT ~0,5-6 s) ; remettre la clé dans .env réactivera OpenRouter automatiquement (aucun code à changer).
- En attente client : contenus blog, logos interseas/emrod.

---
Task ID: 20
Agent: Z.ai Code (principal)
Task: Reprise de la session interrompue (ajout du 7e SaaS « Gestion de formation ») — complétion des 4 langues, corrections TS, et correction d'un bug majeur de contenu invisible (mode léger).

Work Log:
- Diagnostic : la session précédente avait été interrompue en pleine extension du catalogue (7e SaaS « gestion-formation », sur devis) — fr complet, en/es/zh/de incomplets, 3 erreurs TS composants.
- Corrections composants : LogicielsPage (Section id="workflows" requis), ServiceDetailPage (import useLocalized manquant), TarifsPage (Reveal importé de @/components/motion au lieu de kit).
- translations.ts ×4 langues : saas.items.formation (Centres de formation), pricing.tabs étendus à 6 onglets (community/acquisition/training), titres « Six → Sept/Seven/Siete/七款/Sieben », labels « SaaS & workflows », sous-titres mentionnant les workflows sur mesure.
- saas-details/{en,es,zh,de}.ts : entrée « gestion-formation » complète (hero, vidéo, présentation, 10 caractéristiques, pour qui + 3 cas, prix sur devis, CTA, FAQ ×3) — montants JAMAIS écrits (renvoi catalogue).
- logiciels.ts ×4 langues : produit gestion-formation (5 modules + pour qui), section workflows (title/gold/desc/ctaLabel), chips et sous-titres alignés sur fr.
- tarifs.ts ×4 langues : traduction INTÉGRALE du TarifsContent (hero, 6 groupes — web 3 cartes + renouvellements + addon paiement + options + inclus + conditions, logiciels 3 cartes, SaaS + workflowsTitle/Desc, community 3 forfaits, acquisition 4 cartes, formations + 5 sujets, stratégie, FAQ ×6, CTA, liens croisés).
- service-details/{en,es,zh,de}.ts : priceRef null → "community"/"acquisition"/"training" (fr seul à jour avant) — les pages de détail affichent désormais les vraies cartes tarifaires dans TOUTES les langues (avant : repli générique « Sur devis »).
- PricingSection.PriceCard : note de bas d'offre rendue EN DOUBLE (PriceTag + PriceCard) — doublon supprimé (corrigé sur toutes les pages tarifs + bandes de détail).
- Chatbot — prix inventés (« 7 000 000 GNF » pour la gestion de formation, qui est SUR DEVIS) : (a) nouvelle table ALIASES multilingues dans site-index.ts (training→formation, software→logiciel, schulung→formation, farmacia→pharmacie… ×60 entrées en/es/de) — la recherche contextuelle retrouve désormais les pages FR depuis une question EN/ES/DE ; (b) règle absolue ajoutée au prompt : offres sans AUCUN montant (gestion de formation, workflows, options customisées) = « sur devis » uniquement, jamais de chiffre. Vérifié : EN/FR/ES répondent correctement « sur devis », la pharmacie cite toujours 7 000 000 GNF/an exact.
- BUG MAJEUR corrigé — contenu invisible sur appareils faibles (hardwareConcurrency ≤ 4) : le mode léger s'activait APRÈS montage (rAF post-hydratation) et framer-motion laissait les styles inline de `initial` (opacity:0, transform) sur tous les éléments pas encore révélés → sections entières (bande tarifaire, workflows, FAQ) invisibles POUR TOUJOURS. Confirmé : 2 cœurs sur la machine sandbox = le mode léger était actif dans l'aperçu. Fix : bascule de mode = remontade propre via key="fm"/"lm" sur Reveal, Stagger, StaggerItem, PopIn (+ DrawRule style transform:none) — les éléments repartent d'un DOM propre. Vérifié par balayage Playwright de 16 pages × défilement complet : 0 élément bloqué à opacity:0 (hors honeypots et points décoratifs).
- Qualité : tsc 0 erreur, lint 0 erreur, 15+ routes 200, vérification navigateur (sombre + clair, desktop 1280 + mobile 390), dev.log sans erreur runtime.

Stage Summary:
- Le 7e SaaS « Gestion de formation » est complet sur les 5 langues partout : page hub (7e carte du carrousel), page détail /logiciels/gestion-formation, onglet SaaS des tarifs (carte « sur devis » + bande workflows), carrousel, chatbot, image produit dédiée.
- Sécurité tarifaire renforcée : le chatbot ne peut plus inventer de montant pour les offres sur devis (double ceinture : liste officielle + interdiction explicite + contexte de page pertinent via alias multilingues).
- Bug « contenu invisible en mode léger » éradiqué (remontade propre à la bascule) — impact réel : téléphones ≤ 4 cœurs ET l'aperçu sandbox lui-même (2 cœurs) ; la page /tarifs et toutes les sections animées redeviennent visibles.
- En attente client : contenus blog, logos interseas/emrod, URLs vidéos produits, ressource FAQ.

---
Task ID: 21
Agent: Z.ai Code (principal)
Task: Reprise « continue » — traitement des éléments en attente client réalisables sans leurs apports : (1) logos interseas/emrod (fichiers corrompus détectés), (2) contenus blog (3 articles fr/en uniquement + 1 article PÉRIMÉ sur les prix), (3) QA complète.

Work Log:
- DIAGNOSTIC des « logos interseas/emrod en attente » : public/logos/interseas.png et emrod.png étaient en réalité des DOCUMENTS HTML (téléchargements ratés d'une session précédente — le fetch avait enregistré la page au lieu de l'image). Fichiers supprimés ; extraction des vrais logos sur les sites clients tentée (interseaslogistic.online = bundle JS haché sans URL d'assets exploitable, emroddf.com injoignable) → abandon au profit de logotypes SVG typographiques propres (règle anti-invention : aucun slogan inventé — « LOGISTIQUE » fait partie du nom réel, « MOBILIER SUR MESURE » reprend le descriptif vérifié du site).
- Création public/logos/interseas.svg (wordmark INTER|SEAS bicolore navy/teal + vagues) et emrod.svg (monogramme carré « menuiserie » + EMROD serif, sous-titre mobilier sur mesure) — branchés dans works.ts (logo: null → svg). Bandeau clients vérifié : rendu net dans les deux thèmes.
- BUG affiché au passage : captis.svg portait un disque blanc opaque → en sombre le filtre dark:brightness-0+invert le transformait en BLOB blanc illisible. Disque supprimé (fond transparent).
- BALAYAGE des 8 logos : 3 fichiers à fond OPAQUE (fmk224.png noir, samoumedia.jpg noir, topguinee.png blanc à 82,5 %) devenaient des rectangles blancs pleins en mode sombre. Nouveau script scripts/fix-logos.ts : détourage par flood-fill BFS connecté AU BORD uniquement (l'intérieur du logo préservé : blancs/noirs internes intacts) + feather 1 px. Résultats : fmk224 52 % transparent, samoumedia 91 %, topguinee 83 % ; samoumedia.jpg → samoumedia.png (works.ts mis à jour). Bandeau vérifié visuellement : sombre = silhouettes blanches propres ×8, clair = logos réels sans boîtes.
- BLOG — découverte CRITIQUE : l'article « Combien coûte un site web en Guinée » (publié) datait d'avant la refonte tarifaire et annonçait 2 500 000 GNF le site à tableau de bord + une offre « boutique » à 3 500 000 — le catalogue actuel (itération 20) dit tableau de bord 3 500 000, customisé sur devis, paiement +1 000 000, renouvellements 500 000/700 000. Le chatbot (catalogue) CONTRASAIT avec le blog. Article RÉÉCRIT en 5 langues sur les faits du catalogue (scripts/seed-blog.ts).
- BLOG — complétion 5 langues : title/excerpt/body es+zh+de pour « Nos deux engagements » et « Factura Pro » (les seuls fr/en avant).
- BLOG — 3 nouveaux articles × 5 langues, 100 % adossés au catalogue : « Un site en plusieurs langues » (agence, 16/10), « Site vitrine ou site à tableau de bord » (web, 21/09), « Sept logiciels de gestion, un même partenaire » (saas, 14/09) — montants exacts uniquement (1,5/3,5 M, +1 M paiement, 100 k Factura, 1-5 M hospitalière, 500 k école/immobilière, 7 M pharmacie, 20 M logiciel interne, 9 mois facturés école).
- Vérifications : /api/posts → 6 articles × {fr,en,es,zh,de} ; pages /blog (6 cartes) + /blog/[slug] rendues en EN et ZH (titres, dates localisées, temps de lecture) ; chatbot re-testé en direct : « site vitrine 1 500 000 / tableau de bord 3 500 000 » — blog et assistant enfin ALIGNÉS ; 18 routes 200 (7 services, 8 logiciels incl. gestion-formation, 3 articles) ; realisations : 8 logos, 0 cassé ; lint 0 erreur ; dev.log propre.

Stage Summary:
- Les deux « en attente client » traitables sont clos : logos interseas/emrod remplacés par des logotypes SVG propres (à substituer par les vrais fichiers quand le client les fournira — un simple remplacement de public/logos/*.svg suffit), et le Journal compte désormais 6 articles complets en 5 langues.
- L'article tarifs périmé (2,5 M GNF) était une bombe à contradiction avec le chatbot — corrigé à la racine ; la règle « un seul jeu de prix » (catalogue) est maintenant respectée partout.
- Détourage flood-fill réutilisable (scripts/fix-logos.ts) : tout futur logo raster à fond opaque pourra être traité en une commande.
- Toujours en attente client : URLs vidéos produits, ressource FAQ, vrais fichiers logos interseas/emrod si différents des logotypes.

---
Task ID: 22
Agent: Z.ai Code (principal)
Task: Correction « trop de texte, pas assez d'icônes » + SEO approfondi (demande client explicite).

Work Log:
- DIAGNOSTIC client : « il y a beaucoup trop de texte, il faut des icônes professionnelles et luxueuses » ; les prix doivent être EN HAUT des cartes en TRÈS GRAND ; détails dépliables derrière « En savoir plus » ; 2 visuels de référence fournis (figurines or : bouclier ✓ et diamant dans des cercles concentriques).
- NOUVELLE BIBLIOTHÈQUE src/components/site/icons.tsx :
  - GoldIcon : réplique exacte des figurines de référence — icône Lucide au trait fin (1.1) dorée avec halo, centrée dans 3 anneaux concentriques or dégressifs + point or pulsant optionnel ; 4 tailles (sm/md/lg/xl).
  - featureIconFor(text) : table de ~100 groupes de mots-clés (fr/en/es/de, accents ignorés) → icône Lucide thématique (domaine→Globe, e-mail→Mail, chatbot→Bot, SEO→Search, boutique→ShoppingBag, paiement→CreditCard, facture→Receipt, hôpital→Stethoscope, école→School, pharmacie→Pill, formation→GraduationCap, leads→Target, appel→PhoneCall…) avec repli ShieldCheck.
  - IconFeature : point de liste « icône d'abord » (double anneau or + texte), prop as=li|div (fix HTML valide), version compact pour cartes.
  - LearnMore : aperçu + bouton or « En savoir plus » (CollapseMotion height auto, chevron rotatif, aria-expanded, collapsible=false si rien à déplier).
- PRICECARD refondue (demande explicite) : 1) LE PRIX tout en haut en TRÈS grand (PriceTag size="xl" : 2rem→2.75rem, or, halo) ; 2) titre en GRANDS caractères (serif 2xl) à côté d'une figurine GoldIcon md ; 3) 4 caractéristiques visibles avec icônes thématiques, le reste derrière « En savoir plus » ; 4) CTA devis. S'applique à /tarifs + bandes tarifaires de TOUS les /services/[slug].
- PriceTag : nouvelle prop size (md/lg/xl) — lg sur les blocs secondaires (renouvellements, addon, SaaS rows), xl sur les héros de cartes.
- PricingSection : grilles options/inclus/sujets-formations converties en ul>li avec IconFeature (icônes) ; lignes SaaS : figurine dédiée par produit (SAAS_ICONS : Receipt/Calculator/Stethoscope/School/Building2/Pill/GraduationCap) + prix lg ; bandes renouvellement (RefreshCw) et paiement (CreditCard) avec figurines + prix lg et largeur contrainte (footnote wraps) ; conditions (notes) : 2 clauses visibles, reste derrière « En savoir plus ».
- ServiceDetailPage : section « inclus » → icônes thématiques ; cartes « pour qui » → GoldIcon md auto-sélectionnée par mots-clés. SaasDetailPage : caractéristiques → icônes ; cas « pour qui » → GoldIcon ; prix bande tarifaire passé en xl.
- i18n : common.showLess ajouté ×5 langues (fr « Réduire », en « Show less », es « Mostrar menos », zh « 收起 », de « Weniger anzeigen ») + footer.expertisesT + footer.seoLinksT ×5. Régression introduite puis corrigée : le 1er remplacement avait écrasé footer.legalT dans 4 langues — restauré (Légal/Legal/Legal/法律) et vérifié tsc.
- FIX HTML : <li> ne peut pas s'imbriquer via des div — IconFeature as="div" dans les grilles Stagger (ul>li>div) ; MotionTag étendu (ul/ol) dans motion/index.tsx. 0 erreur d'hydratation après correction.
- SEO PROFOND (2e chantier) :
  - src/lib/seo.ts : SITE_URL (NEXT_PUBLIC_SITE_URL, repli https://www.einsof.gn — TODO-HUMAN domaine final), GEO (Conakry/Guinée/GN), BASE_KEYWORDS (~60 requêtes : création de site web en Guinée, création de site web professionnel, agence de création de site web, création de logiciel(s), création d'application, application mobile, SaaS, formations, génération de leads/prospects, community management + longue traîne produit ×7 SaaS), PAGE_KEYWORDS par page, buildMetadata (canonical + OG 1200×630 + Twitter), helpers JSON-LD (organization+LocalBusiness avec catalogue de prix GNF officiels, WebSite, Service+offres, SoftwareApplication+Offer, FAQPage, Article, BreadcrumbList).
  - app/sitemap.ts (dynamique : 11 pages statiques + 7 services + 7 SaaS + articles DB, fallback sans DB) + app/robots.ts (Sitemap + Host) — public/robots.txt supprimé.
  - layout.tsx : metadataBase, title template, description avec prix officiels, ~60 keywords, OG/Twitter images, robots max-image-preview/max-snippet, JSON-LD global Organization+WebSite sur toutes les pages.
  - Metadata par route : / (création de site web en Guinée…), /services (agence de création de site web professionnel), /logiciels (création de logiciels), /tarifs (prix création site web Guinée + JSON-LD FAQPage), /faq (JSON-LD FAQPage ×18 questions), /realisations, /methode, /secteurs (longue traîne hôtel/école/clinique/ONG), /a-propos, /blog, /contact (devis).
  - Dynamiques : /services/[slug] → SEO_BY_SLUG ×7 pôles (web : « création de site web en Guinée — vitrine dès 1 500 000 GNF »…, software : « création de logiciel sur mesure — dès 20 000 000 GNF »…) + JSON-LD Service (montants GNF exacts par pôle) + BreadcrumbList ; /logiciels/[slug] → SEO_BY_SLUG ×7 produits + JSON-LD SoftwareApplication (prix GNF) + BreadcrumbList ; /blog/[slug] → Article JSON-LD + metadata article.
  - Footer : nouveau maillage interne « Nos expertises en Guinée » (14 liens localisés : 7 pôles + 7 SaaS, noms traduits selon la langue) + « Recherches populaires » (12 ancres mots-clés FR : Création de site web en Guinée, Génération de leads et prospects, Tarifs officiels en GNF…).
- QA complète : tsc 0 erreur (src), lint 0 erreur, 23 routes × 200, sitemap.xml + robots.txt valides, JSON-LD vérifié par curl (Organization, WebSite, Service, SoftwareApplication, FAQPage, BreadcrumbList présents), balayage navigateur agent-browser (desktop 1440 + mobile 390) : cartes tarif avec prix en haut en grand ✓, bascule « En savoir plus »↔« Réduire » avec aria-expanded ✓, icônes thématiques dans toutes les listes ✓, onglet SaaS avec figurines + gros prix ✓, footer SEO ✓, 0 erreur console/0 erreur page après fix li>li, dev.log propre.

Stage Summary:
- La plainte centrale du client est traitée à la racine : le site passe de longues listes de texte à des énumérations avec figurines or thématiques (réplique exacte des visuels fournis), prix EN HAUT en très grand sur TOUTES les cartes tarif (sites web, logiciels, SaaS, community, acquisition, formations, bandes de détail), et détails dépliables « En savoir plus » — visible d'office : prix + titre + 4 points, le reste au clic.
- SEO : le site couvre désormais TOUTES les requêtes citées par le client (sites web, logiciels, applications, SaaS, formations, leads/prospects, community management) — titres/descriptions/keywords par page, données structurées riches avec prix GNF officiels (éligibles extraits enrichis), sitemap dynamique, robots, maillage interne à ancres mots-clés dans le pied de page de chaque page.
- TODO-HUMAN (client) : renseigner NEXT_PUBLIC_SITE_URL avec le domaine final — canoniques, sitemap et JSON-LD se mettront à jour automatiquement.

---
Task ID: 3-b
Agent: Z.ai Code (agent 3-b)
Task: Page /zones — SEO local Guinée

Work Log:
- Lecture du worklog (tâches 1, 2, 3-a…) et des patterns existants : src/lib/seo.ts (ZONES, ZONES_META, PAGE_KEYWORDS.zones, buildMetadata, webPageJsonLd, breadcrumbJsonLd, faqJsonLd, GEO), SecteursPage/AProposPage (PageHero, Section, Container, SectionHeading, GoldButton, Reveal, Stagger, SpotlightCard, Beam, CtaBanner, PageCrossLinks), kit.tsx, PageHero.tsx, PageBlocks.tsx, route /faq (metadata + JsonLd), Footer.tsx (NAV_ROUTES + SEO_LINKS), signatures openForm/trackCta.
- Créé src/lib/pages-content/zones.ts : type ZonesContent (hero, intro, capitale, regions, diaspora, faq, cta, crossLinks) + export ZONES_PAGE en FR uniquement (cast Localized — fallback fr prévu par useLocalized pour les autres langues). Contenu SEO : 2 paragraphes intro (création de site web partout en Guinée, agence digitale Conakry et régions, suivi à distance, visioconférence, WhatsApp), 8 cartes régions avec villes réelles issues de ZONES (Boké→Boké/Kamsar/Fria ; Conakry→Conakry/Kaloum/Dixinn/Ratoma/Matam ; Faranah→Faranah ; Kankan→Kankan/Siguiri/Kouroussa ; Kindia→Kindia/Coyah/Dubréka ; Labé→Labé/Pita/Dalaba/Télimélé ; Mamou→Mamou/Dabola ; Nzérékoré→Nzérékoré/Guéckédou/Macenta/Kissidougou/Beyla) + « comment nous travaillons » par région, bloc diaspora (diaspora guinéenne, Afrique francophone : Sénégal, Côte d'Ivoire, Mali, Sierra Leone, Liberia), FAQ 4 questions longue traîne locales, CTA, crossLinks vers /services, /secteurs, /tarifs, /faq.
- Créé src/components/pages/ZonesPage.tsx (client) : PageHero (image header-services.png, chips hero), intro avec badges des 4 régions naturelles (ZONES.naturelles), section Conakry (chips des quartiers via SEO ZONES.quartiers + GoldButton outline openForm("quote")/trackCta), grille des 8 régions (cartes SpotlightCard/Beam, icône MapPin, carte Conakry bordure or, liste des villes + bloc « comment nous travaillons »), bloc diaspora (icône Globe, chips SEO ZONES.diaspora, GoldButton openForm("quote")/trackCta), FAQ en accordéon shadcn (border-line, trigger text-ink→goldtext, chevron or), CtaBanner + PageCrossLinks. Animations Reveal/Stagger, style Obsidienne & Or (border-gold/30, bg-surface, text-goldtext, label-caps).
- Créé src/app/(site)/zones/page.tsx (serveur) : buildMetadata(path /zones, ZONES_META.title/description, PAGE_KEYWORDS.zones) + JsonLd [webPageJsonLd(/zones), breadcrumbJsonLd(Accueil→Zones), faqJsonLd(ZONES_PAGE.fr.faq.items)] + <ZonesPage/>.
- Lien interne : Footer.tsx NAV_ROUTES — ajouté { id: "zones", path: "/zones" } juste après Secteurs ; translations.ts — clé nav.zones ajoutée ×5 langues (fr « Zones », en « Zones », es « Zonas », zh « 服务地区 », de « Regionen ») car le footer rend t(`nav.${id}`).
- FIX préexistant : src/app/llms.txt/route.ts référençait ZONES.city (inexistant → erreur tsc bloquante) — corrigé en GEO.city + import GEO (réparation 1 ligne, aucun fichier écrasé).
- QA : bun run lint 0 erreur ; tsc --noEmit 0 erreur dans src (restent des erreurs préexistantes hors src dans examples/ et skills/ — non touchées) ; curl /zones → 200, title « Agence digitale partout en Guinée — Conakry, Kankan, Nzérékoré, Boké… — EINSOF », 3 scripts JSON-LD (WebPage/BreadcrumbList/FAQPage), contenu régions/villes/diaspora présent, lien footer href="/zones" présent ; dev.log « GET /zones 200 ».

Stage Summary:
- Page /zones livrée : couvre toute requête géographique (8 régions, ~20 villes réelles, 10 quartiers de Conakry, 4 régions naturelles, diaspora) avec metadata + JSON-LD WebPage/BreadcrumbList/FAQPage dédiés.
- Contenu FR centralisé dans src/lib/pages-content/zones.ts (type ZonesContent strict, zéro any) ; fallback fr automatique pour en/es/zh/de via useLocalized — à traduire plus tard si souhaité.
- Deux CTA devis pré-remplis (« Projet web — Conakry », « Projet diaspora — suivi à distance ») passent par openForm("quote") + trackCta("zones", …).
- Lien « Zones » ajouté dans la navigation du footer (après Secteurs), clé i18n nav.zones ajoutée ×5 langues sans toucher au reste.
- Bonus : erreur de type préexistante dans /app/llms.txt/route.ts corrigée (ZONES.city → GEO.city) — tsc repasse proprement sur src.

---
Task ID: 3-c
Agent: Z.ai Code (agent 3-c, seed blog SEO)
Task: 6 articles blog SEO longue traîne (seed)

Work Log:
- Lecture des contrats : worklog.md (tâches 21-22, règle « un seul jeu de prix »), scripts/seed-blog.ts (format exact : interface SeedPost, JSON 5 langues, repli fr, paragraphes séparés par \n\n, log created/updated), src/lib/catalog.ts (itération 20 — toutes les montants autorisés), prisma/schema.prisma (BlogPost : slug unique, title/excerpt/body en String JSON, category clé libre, readingMin, isPublished, publishedAt).
- Inventaire base : 6 articles publiés existants (site-web-multilingue-pourquoi, combien-coute-un-site-web-en-guinee, nos-deux-engagements-envers-chaque-client, factura-pro-la-facturation-simplifiee, site-vitrine-ou-tableau-de-bord, logiciel-de-gestion-bien-choisir) — aucun des 6 slugs cibles n'existait ; le slug « site-vitrine-ou-tableau-de-bord » (2026) est DIFFÉRENT de « site-vitrine-ou-ecommerce-guinee » (nouveau).
- Créé scripts/seed-blog-seo.ts : même mécanique que seed-blog.ts (J() JSON.stringify, interface SeedPost, vérification existing → update ou create) + helpers P() (paragraphes → \n\n) ; en fin de run, comptage du total d'articles publiés + liste chronologique des slugs (exigence de vérification). Aucun fichier de src/ modifié ; TypeScript strict, 0 any.
- Rédaction des 6 articles × 5 langues (fr version longue 8-9 paragraphes, en/es/zh/de traductions fidèles), mots-clés cibles dans titre + 2 premiers paragraphes, chiffres STRICTEMENT issus du catalogue (mobile dès 20 M ; interne dès 20 M ; SaaS vendu dès 50 M ; Factura Pro 100 k ; comptable dès 1 M ; hospitalière 1/3/5 M ; école 500 k/9 mois ; immobilière 500 k ; pharmacie 7 M/an ; essai 7 jours ; community 1,5/3/5 M avec pub incluse 10/50/100 $ ; leads dès 2 M/mois ; appels délégués dès 4,5 M/mois ; landing dès 1 M ; campagne dès 1 M/mois budget média client ; formation dès 20 M sur devis ; vitrine 1,5 M + renouv. 500 k ; tableau de bord 3,5 M + renouv. 700 k ; customisé sur devis ; paiement intégré +1 M — exemple 1,5 M + 1 M = 2,5 M explicité). CTA finales vers /contact + /tarifs ou /logiciels (chemins littéraux entre parenthèses, rendus tels quels par ArticlePage).
- publishedAt étalées nov.-déc. 2025 (05/11, 12/11, 19/11, 26/11, 03/12, 10/12, 09:00 UTC) — conformément à la consigne, ANTIÉRIEURES aux articles existants datés 2026 (observation consignée : si un tri chronologique desc est appliqué sur /blog, les nouveaux apparaissent en fin de liste).
- Exécution 1 : 6 created. Exécution 2 (idempotence) : 0 created, 6 updated — aucun doublon. Vérification intégrité (script temporaire supprimé après usage) : 5 langues × 6 articles, FR 8-9 paragraphes (382-456 mots), categories exactes [logiciels ×2, marketing ×2, formations, web], isPublished true.
- QA : bun run lint 0 erreur ; /blog + 6 nouvelles pages /blog/[slug] toutes 200 ; dev.log sans erreur.

Stage Summary:
- 6 slugs créés (créés puis mis à jour sans doublon au 2e passage) : creer-application-mobile-guinee, pourquoi-logiciel-gestion-guinee, community-management-guinee-guide, trouver-clients-b2b-guinee, former-equipes-digital-guinee, site-vitrine-ou-ecommerce-guinee.
- Journal : 12 articles publiés au total (6 anciens + 6 nouveaux), tous en 5 langues, tous adossés aux prix officiels du catalogue.
- Décisions : upsert par slug (relançable) ; categories libres nouvelles (logiciels/marketing/formations) — les badges publics afficheront la clé brute tant que journal.categories.* n'est pas étendue dans translations.ts (interdit ici : src/ verrouillé) ; article « e-commerce » construit sur vitrine/tableau de bord + option paiement intégré +1 000 000 GNF, sans jamais reprendre l'ancienne grille périmée (2,5 M/3,5 M boutique) corrigée en tâche 21 ; dates nov.-déc. 2025 conformes à la consigne mais antérieures aux articles 2026 (à retenir pour l'ordre d'affichage /blog).

---
Task ID: 3-a
Agent: Z.ai Code (agent 3-a, landing pages secteurs)
Task: Pages /secteurs/[slug] — 14 landing pages SEO longue traîne

Work Log:
- Étude des patterns : seo.ts (SECTOR_SEO 14 secteurs, buildMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd, PAGE_KEYWORDS.secteurs), pages-content/secteurs.ts (défis/réponses recyclés), ServiceDetailPage.tsx + services/[slug]/page.tsx (routes metadata + JSON-LD), kit.tsx / PageHero / PageBlocks / motion / accordion (TarifsPage), chat-bus (openForm), analytics (trackCta), catalog.ts (prix officiels).
- Créé src/lib/pages-content/secteur-details.ts : type SecteurDetail (slug, heroTitle, heroGold, heroSub, intro ×2 paragraphes SEO « en Guinée / à Conakry », offers ×4 {icon Lucide string, title, desc} — site web / logiciel-SaaS / community management / leads, terrain ×3-4 réalités, faq ×3 questions longue traîne, crossLinks ×3), export SECTEUR_DETAILS avec les 14 slugs exacts de SECTOR_SEO + export SECTOR_INDEX (slug, name, icon, tagline) pour le maillage. Contenu rédactionnel FR professionnel recyclant les défis de secteurs.ts.
- Règle tarifs respectée : seuls les montants autorisés apparaissent (vitrine dès 1 500 000 GNF, tableau de bord 3 500 000 GNF, Factura Pro 100 000 GNF/mois, sur mesure dès 20 000 000 GNF, app mobile dès 20 000 000 GNF, community management dès 1 500 000 GNF/mois, essai gratuit 7 jours) — audit grep des mentions GNF effectué, tout le reste = « sur devis ».
- Créé src/components/pages/SecteurDetailPage.tsx (client) : PageHero (image header-secteurs.png, parent /secteurs), Section intro riche + GoldButton openForm("quote", {subject}) + trackCta, Section 4 offres (grille 2/4 cols, map string→LucideIcon avec fallback Sparkles), Section « réalités du terrain » (tone deep, liste numérotée or), Section FAQ (accordion shadcn), CtaBanner + PageCrossLinks, Reveal/Stagger/SpotlightCard/GoldIcon partout, style Obsidienne & Or.
- Créé src/app/(site)/secteurs/[slug]/page.tsx : generateStaticParams (14 slugs), generateMetadata (notFound si slug inconnu, buildMetadata avec metaTitle/metaDescription/keywords du secteur + PAGE_KEYWORDS.secteurs), route serveur avec JsonLd [serviceJsonLd, breadcrumbJsonLd, faqJsonLd] + <SecteurDetailPage slug>.
- Modifié src/components/pages/SecteursPage.tsx : nouvelle Section « Toutes les pages par métier » AVANT le CtaBanner — grille responsive 2/3/4 colonnes de 14 liens internes vers /secteurs/[slug], chaque carte = icône Lucide + nom du secteur (anchor text) + micro-descriptif, Reveal/Stagger/Beam, style existant conservé.
- QA : bun run lint 0 erreur ; tsc --noEmit propre sur src/ (erreurs préexistantes uniquement dans examples/ et skills/) ; les 14 routes + /secteurs testées en HTTP (toutes 200, slug inconnu → 404) ; metadata fr vérifiée (canonical, OG, keywords fusionnés) ; JSON-LD FAQPage (3 Q/R), BreadcrumbList (3 niveaux), Service présents ; maillage : 14 href /secteurs/[slug] détectés sur /secteurs ; dev.log sans erreur.

Stage Summary:
- 3 fichiers créés : src/lib/pages-content/secteur-details.ts (14 secteurs + SECTOR_INDEX), src/components/pages/SecteurDetailPage.tsx, src/app/(site)/secteurs/[slug]/page.tsx ; 1 fichier modifié : src/components/pages/SecteursPage.tsx (section maillage ajoutée, rien d'autre touché).
- 14 landing pages longue traîne générées statiquement, metadata ciblée par métier + JSON-LD Service/Breadcrumb/FAQ, contenu FR 100 % recyclé des défis sectoriels, tarifs strictement limités au catalogue officiel.
- Décisions : icônes des offres référencées par chaîne dans le contenu puis résolues via map Record<string, LucideIcon> (fallback Sparkles) ; SECTOR_INDEX exporté depuis secteur-details.ts pour alimenter le maillage de /secteurs sans dupliquer les libellés ; sitemap.ts déjà branché sur SECTOR_SEO (aucune modif requise) ; crossLinks limitées aux 5 chemins autorisés (/services/web, /logiciels, /tarifs, /secteurs, /contact).
---
Task ID: SEO-ULTRA
Agent: orchestrator (Z.ai Code)
Task: SEO monstrueux — couverture exhaustive courte + longue traîne (tous domaines d'activité EINSOF)

Work Log:
- Réécriture de src/lib/seo.ts : ~330 mots-clés (marque, sites web, logiciels, apps, SaaS ×7, community management, leads, formations, stratégie, villes guinéennes ×22, 4 régions naturelles, diaspora, anglais) ; PAGE_KEYWORDS enrichis par page ; nouveau SECTOR_SEO (14 métiers avec metaTitle/metaDescription/keywords) ; ZONES + ZONES_META ; GEO_COORDS Conakry
- Nouveaux builders JSON-LD : organizationJsonLd enrichi (GeoCoordinates, ContactPoint, paymentAccepted, knowsAbout ×24, areaServed 8 régions, alternateName, renouvellements+option paiement), itemListJsonLd, courseJsonLd, howToJsonLd, webPageJsonLd (AboutPage/ContactPage/CollectionPage), articleJsonLd +dateModified, ORG_ID partagé
- buildMetadata : alternates.languages (fr/en/x-default), verification via GOOGLE_SITE_VERIFICATION/BING_SITE_VERIFICATION (env), og geo tags
- layout.tsx : keywords globaux + villes, robots googleBot enrichi, geo.placename/og:region
- robots.ts : disallow /api/ + /admin, AI crawlers explicitement bienvenus (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended)
- sitemap.ts : +14 /secteurs/*, + /zones → 52 URLs
- Nouvelle route /llms.txt (SEO IA : description complète du site, pages, tarifs officiels, citation prête pour assistants IA)
- [3-a, sous-agent] 14 pages /secteurs/[slug] : contenu fr riche (intro SEO, 4 offres iconées, réalités terrain, FAQ longue traîne), JSON-LD Service+FAQPage+Breadcrumb, grille de 14 liens sur /secteurs
- [3-b, sous-agent] page /zones : Conakry (10 quartiers), 8 régions avec villes réelles, diaspora, FAQ locale, JSON-LD WebPage+FAQ+Breadcrumb, lien footer « Zones » + traductions nav ×5
- [3-c, sous-agent] scripts/seed-blog-seo.ts : 6 articles longue traîne en 5 langues (application mobile, logiciel de gestion, community management, leads B2B, formations, vitrine vs e-commerce) — upsert idempotent, 12 articles au total
- Injection JSON-LD sur /methode (HowTo 5 étapes), /services + /logiciels + /secteurs (ItemList + CollectionPage), /a-propos (AboutPage), /contact (ContactPage), /realisations (CollectionPage)
- Fix titles dupliqués (« — EINSOF — EINSOF ») sur / et /realisations

Stage Summary:
- 52 URLs indexables (12 statiques + 7 services + 7 SaaS + 14 secteurs + 12 blog), toutes avec metadata unique, canonique, OG, Twitter, keywords ciblés
- JSON-LD couvre : Organization+LocalBusiness (géolocalisé, prix officiels ×20 offres), WebSite, Service ×7, SoftwareApplication ×7, Service ×14 secteurs, FAQPage ×3 sources, HowTo, ItemList ×3, Course prêt, Article ×12
- SEO IA intégré : llms.txt + robots AI-crawlers + savoir-faire knowsAbout
- Vérifié navigateur : home, secteur hôtel (FAQ accordéon OK, prix officiels), /zones, hub secteurs (14 liens internes), article blog — zéro erreur console
- Lint : 0 erreur. TODO-HUMAN restant : NEXT_PUBLIC_SITE_URL + GOOGLE_SITE_VERIFICATION à l'achat du domaine
---
Task ID: DASH-2
Agent: Z.ai Code (agent DASH-2)
Task: Réglages Site & Contact + Mot du gérant

Work Log:
- État des lieux : schema.prisma (SiteSettings singleton ✓ déjà poussé), ContactSection.tsx (les infos « hardcodées » = 3 lignes i18n du panneau latéral : responseT/hoursT/address + bloc WhatsApp « activation en cours » — aucun téléphone/e-mail/réseau n'existe aujourd'hui), AProposPage.tsx (106 l.), Footer.tsx (AUCUN contact hardcodé → non touché), admin-auth.ts (isAdmin), PartnersPanel.tsx (pattern panels), kit.tsx, i18n (t() à chemin libre + Dict dérivé de fr → clés requises ×5).
- Créé src/lib/site-settings-defaults.ts : types SiteSettingsData/SocialItem + DEFAULT_MANAGER_MESSAGE (texte officiel 2 paragraphes) + DEFAULT_SITE_SETTINGS (listes vides, managerName « Le Gérant », managerRole « Fondateur & Gérant — EINSOF ») + SOCIAL_PLATFORMS (8 choix) — module isomorphe SANS db, importable par le client.
- Créé src/lib/site-settings.ts : getSiteSettings() serveur — parse JSON try/catch (chaînes vides, objets sociaux incomplets et JSON corrompus filtrés), managerMessageJson {"fr":…} ou texte brut, repli DEFAULT_SITE_SETTINGS si table vide/erreur ; réexporte types + défauts (point d'entrée serveur unique).
- Créé GET public /api/site-settings (force-dynamic) : {ok, data} toujours complet (défauts si table vide ET si exception).
- Créé /api/admin/settings : GET (isAdmin → data parsée + raw : JSON bruts + updatedAt ; repli défauts) ; PUT (isAdmin, zod v4 : phones ×6 min 3 car., emails ×6 format, socials ×10 url https, managerPhotoUrl/Alt nullable, managerMessageFr 1-2000, name/role) → normalisation (trim, e-mails lowercase, clean null) puis upsert singleton ; 400 flattenError / 401 / 500.
- Créé src/components/admin/SettingsPanel.tsx ({onUnauthorized}, exporté pour AdminOverlay — AdminOverlay NON touché) : listes dynamiques téléphones/e-mails (ajout/suppression, icônes Phone/Mail, max 6), réseaux sociaux (Select plateforme ×8, libellé auto-rempli, URL https ×10), mot du gérant (upload file → POST /api/admin/upload avec extraction d'URL tolérante + erreur propre si 404/échec, URL manuelle, aperçu img, alt, nom/rôle avec placeholders « par défaut », textarea 2000 car. avec compteur + conseil « 2 paragraphes séparés par une ligne vide »), Enregistrer (PUT) + toast sonner + états busy/uploading/notice/error, style border-line bg-surface + GoldButton conforme aux autres panels.
- ContactSection.tsx EDIT : fetch /api/site-settings au montage (échec silencieux) ; si phones/emails renseignés → lignes cliquables tel:/mailto: avec icônes Phone/Mail REMPLACENT la ligne générique « réponse sous 24 h » (horaires + adresse conservées) ; si socials → rangée d'icônes lucide par plateforme (Facebook/Instagram/Linkedin/Twitter/TikTok→Music2/Youtube/WhatsApp→MessageCircle/Autre→Globe), target _blank rel noopener, h-11 tactile ; bloc WhatsApp relié au social « whatsapp » si présent sinon « activation en cours » ; formulaire POST /api/contact intact ; fallback i18n identique quand aucune donnée.
- Créé src/components/site/ManagerMessageSection.tsx + inséré dans AProposPage APRÈS « Pourquoi EINSOF » / AVANT les documents (l'engagement personnel vient sceller l'argumentaire) : photo arrondie bordure or + halo (si managerPhotoUrl) sinon monogramme « E » doré sur surface2, nom serif + rôle label-caps or, guillemet « » décoratif serif géant, message en paragraphes (split \n\n, 1er en avant), filet or + signature « — {nom} » ; état initial = DEFAULT_SITE_SETTINGS → bloc TOUJOURS affiché (SSR inclus), réglages réels après fetch.
- translations.ts : +contact.followT et +manager{label,title,gold} ×5 langues (fr « Le mot du gérant / Une conviction simple, / tenue depuis sept ans »).
- Constat runtime : db.siteSettings et db.softwareLink étaient undefined (client Prisma non régénéré après le dernier db:push) → PUT 500 ; corrigé par `bunx prisma generate` (AUCUN changement de schéma, pas de db:push) — dev.log reconfirme ensuite requêtes SiteSettings OK.
- QA : lint 0 erreur/0 warning (tsc : seule erreur restante = src/app/api/admin/projects/route.ts, fichier d'un AUTRE agent, non touché) ; curl : GET public 200 avec texte officiel, admin GET 200/401, PUT 200 (e-mails normalisés), PUT invalide 400 (7 phones + http non https), PUT sans cookie 401, / /a-propos /contact 200, SSR /a-propos contient les 2 paragraphes + « Le Gérant » ×2 + rôle ; données de test RESET vers les défauts après vérification (site public propre) ; dev.log sans erreur sur mes routes.

Stage Summary:
- Nouveaux fichiers : src/lib/site-settings-defaults.ts (types + DEFAULT_MANAGER_MESSAGE + SOCIAL_PLATFORMS, isomorphe), src/lib/site-settings.ts (getSiteSettings serveur), src/app/api/site-settings/route.ts (GET public force-dynamic), src/app/api/admin/settings/route.ts (GET raw+data / PUT zod isAdmin upsert), src/components/admin/SettingsPanel.tsx (panel « Site & Contact », prêt à câbler : <SettingsPanel onUnauthorized={…} />), src/components/site/ManagerMessageSection.tsx.
- Fichiers modifiés : ContactSection.tsx (téléphones/e-mails cliquables + rangée réseaux sociaux + WhatsApp réel, fallback i18n inchangé, formulaire intact), AProposPage.tsx (section Mot du gérant insérée), translations.ts (+2 groupes de clés ×5).
- Décisions : module defaults séparé pour importer DEFAULT_MANAGER_MESSAGE côté client sans embarquer Prisma ; les coordonnées réelles remplacent la ligne « réponse sous 24 h » (horaires/adresse i18n conservés — pas de champ adresse dans le modèle) ; TikTok sans icône lucide → Music2 ; Footer non touché (aucun contact hardcodé) ; prisma generate exécuté (client régénéré, schéma et base inchangés).
- État : APIs testées E2E (200/400/401), site public affiche le texte officiel par défaut et replacera instantanément toute config de l'équipe ; lint propre ; zéro conflit avec AdminOverlay/schema/upload/projects (non touchés).
---
Task ID: DASH-3
Agent: Z.ai Code (agent DASH-3)
Task: Journal — SEO par article + espaces publicitaires

Work Log:
- Lecture worklog + état des lieux : prisma/schema.prisma (BlogPost : metaTitle/metaDescription/keywords/adsJson déjà en base — aucun db:push refait), api/admin/posts (322 l., enveloppe {ok, data|error}), PostsPanel (631 l.), blog/[slug]/page.tsx (articleJsonLd + buildMetadata), ArticlePage (253 l., fetch client /api/posts), seo.ts (buildMetadata, articleJsonLd, PAGE_KEYWORDS.blog).
- Créé src/lib/post-ads.ts : PostAd / PostAdInput, parseAds (try/catch, filtre entrées non-objet, champs optionnels nettoyés, position sûre ≥ 0, isActive vrai par défaut), stringifyAds (max 10, id garanti, champs vides omis), parseKeywordsCsv (CSV → string[], 40 max).
- Étendu src/app/api/admin/posts/route.ts : POST/PUT acceptent metaTitle (200), metaDescription (400), keywords (600, CSV), ads (max 10 ; adSchema : id?, title?, text?, imageUrl? https|/, link? https uniquement, ctaLabel?, position int 0-999 défaut 0, isActive défaut true ; transformations Zod : chaîne vide → null = retour au repli automatique) ; GET liste + détail renvoient metaTitle/metaDescription/keywords + ads parsés ; seoColumns() factorise l'écriture (create via spread, update via Object.assign) ; contrat historique PATCH/DELETE inchangé.
- Étendu src/components/admin/PostsPanel.tsx (sans casser l'existant) : PostDetail + 4 champs ; FormState + metaTitle/metaDescription/keywords/ads ; section « Référencement (SEO) » — titre SEO compteur n/60 (conseil Google, couleurs mute→or→destructif), meta description n/160, keywords placeholder « creation site web guinée, logiciel de gestion… », astuce repli automatique si vide ; section « Espaces publicitaires » — liste max-h-96 scrollable, carte par espace (badge Megaphone + n° + statut, Switch Actif, suppression), éditeur : étiquette, CTA, texte, image URL (pas d'upload /api/admin/upload → saisie URL manuelle), lien https, position « après le paragraphe n° (0 = fin) », bouton « Ajouter un espace » désactivé à 10 ; validations miroir de l'API côté client ; payload POST/PUT inclut tout ; toast.success sonner + notice ; erreur 400 enrichie (contraintes ads).
- Étendu src/app/(site)/blog/[slug]/page.tsx : generateMetadata — metaTitle ?? title, metaDescription ?? excerpt, keywords = parseKeywordsCsv + PAGE_KEYWORDS.blog, type "article" ; getPost renvoie updatedAt ISO ; JSON-LD articleJsonLd + dateModified + keywords ; <ArticlePage ads={parseAds(post.adsJson)} />.
- Étendu src/components/pages/ArticlePage.tsx : props ads?: PostAd[] ; AdBlock interne — <aside aria-label="Contenu partenaire"> bordure gold/40 fond surface, image next/image unoptimized aspect-video max-h-72 (pattern PartnersSection), GoldBadge « ESPACE PARTENAIRE » (ou ad.title), texte, CTA <a target="_blank" rel="sponsored noopener"> styles outline GoldButton (GoldButton ne gère pas target) — non cliquable sans lien ; insertion : map position→bloc, position N = après le N-ième paragraphe, 0 ou au-delà = fin, rendu entre les <p> via React.Fragment (design article intact).
- seo.ts : articleJsonLd accepte keywords?: string[] (join ", " si présent) — signature rétrocompatible.
- Incident infrastructure : dev server MORT en cours de vérification (connexion refusée, processus disparu) — relancé détaché via `bun run dev` en arrière-plan ; au passage, ce redémarrage a chargé le client Prisma à jour (l'ancien, stale, ne connaissait pas metaTitle/adsJson et provoquait aussi le 500 préexistant de /api/software-links — désormais 200).
- Vérification : scripts/verify-post-ads.ts (temporaire, PrismaClient) — setup sur site-vitrine-ou-ecommerce-guinee (metaTitle + metaDescription + keywords + 2 ads : 1 après ¶1 avec lien https, 1 en fin avec image) ; curl 200 → <title> personnalisé, meta description personnalisée, keywords CSV en tête + PAGE_KEYWORDS.blog, données ads dans le payload ; rendu DOM réel (agent-browser) : 2 blocs <aside>, séquence ¶1 → [PUB+cta] → ¶2…¶8 → [PUB+img], href https://www.einsof.gn/logiciels avec rel sponsored noopener, screenshot /tmp/adblock-proof.png ; cleanup → metaTitle null / adsJson "[]" / title et pubs retombés sur l'état initial ; script supprimé.
- QA final : bun run lint 0 erreur (exit 0) ; tsc 0 erreur sur tous les fichiers DASH-3 (reste 1 erreur préexistante hors périmètre dans src/app/api/admin/projects/route.ts — fichier interdit, agent DASH-1) ; dev.log : GET /blog/... 200, aucune erreur sur mes routes.

Stage Summary:
- SEO par article opérationnel de bout en bout : dashboard (compteurs 60/160 + keywords CSV) → API (Zod strict, vide = null = repli automatique sur title/excerpt) → page publique (metadata + keywords fusionnés PAGE_KEYWORDS.blog + JSON-LD Article enrichi dateModified/keywords).
- Espaces publicitaires opérationnels : jusqu'à 10 blocs « partenaire » par article, position N après le N-ième paragraphe (0 = fin), Switch actif/inactif, image 16/9 optionnelle, CTA https rel sponsored — rendu défensif (parseAds ne lève jamais).
- Fichiers : créés src/lib/post-ads.ts ; modifiés src/app/api/admin/posts/route.ts, src/components/admin/PostsPanel.tsx, src/app/(site)/blog/[slug]/page.tsx, src/components/pages/ArticlePage.tsx, src/lib/seo.ts (1 signature).
- Décisions : linkUrl https uniquement (sécurité contenu mixte) ; imageUrl https ou chemin interne ; CTA pub en <a> natif stylé outline (GoldButton ne supporte pas target/_blank) ; ads passées en props serveur (pas de changement du contrat public /api/posts).
- Preuve rendu : DOM réel « ¶1 → [PUB+cta] → …¶ → [PUB+img] », meta tags personnalisés vérifiés par curl, cleanup base effectué (état initial restauré).
- Attention orchestrateur : dev server relancé par mes soins (il était mort) ; client Prisma régénéré à 02:01 par un tiers — tout processus lancé avant ne voit pas les nouvelles colonnes (à redémarrer si d'autres agents ajoutent des champs).

---
Task ID: DASH-4
Agent: Z.ai Code (DASH-4)
Task: Logiciels — liens démo + vidéos YouTube

Work Log:
- src/lib/youtube.ts (nouveau) : parseYouTubeId (watch?v=, youtu.be/, shorts/, embed/, live/, www|m., ID 11 car. strict), youTubeEmbedUrl (youtube-nocookie + rel=0), youTubeThumbUrl (hqdefault).
- API admin /api/admin/software-links (nouveau) : GET (les 7 slugs de SAAS_SLUGS, null par défaut) + PUT upsert { slug ∈ catalogue, demoUrl https, videoUrl YouTube validée par parseYouTubeId } ; zod, isAdmin(), 401/400/500 — pattern des routes admin existantes.
- API publique /api/software-links (nouveau, force-dynamic) : { ok, data: Record<slug, {demoUrl, videoUrl}> } pour les 7 slugs.
- SoftwareLinksPanel.tsx (nouveau, exporté pour AdminOverlay, contrat identique aux autres panels { onUnauthorized }) : une carte par produit (vignette + nom + slug), champ « Lien de la démo » (placeholder https://demo.einsof.gn/…, aide « nouvel onglet »), champ « Vidéo YouTube » avec validation LIVE (parseYouTubeId) → aperçu miniature (youTubeThumbUrl, background-image donc aucun remotePattern next/image) ou erreur douce ; Enregistrer par produit (PUT) + toast sonner + busy ; style border-line bg-surface + GoldButton.
- SaasDetailPage.tsx (édité) : fetch client unique /api/software-links ; vidéo DB prioritaire → iframe youtube-nocookie 16:9 (border-gold/30, loading lazy, title accessible « Vidéo de présentation — {nom} ») dans la section vidéo existante (badge « bientôt » masqué quand une vidéo est réglée) ; bouton « Ouvrir le logiciel » (GoldButton ExternalLink, <a target=_blank rel="noopener noreferrer">, trackCta) dans le hero (nouvelle prop action optionnelle de PageHero) ET dans le CTA existant — CTA « Réserver une démo » intact ; sans liens → rendu inchangé (aucune section vide, repli statique d.videoUrl conservé).
- kit.tsx : GoldButton gagne external? (href externe → <a> natif nouvel onglet au lieu de next/link) — rétrocompatible. PageHero : prop action? (ReactNode) sous les chips. SaasSection : badges « Vidéo » (PlayCircle) / « Démo » (ExternalLink) en absolu sur le visuel des cartes concernées (zéro impact sur la géométrie du coverflow), même fetch unique.
- i18n : clés saas.openSoftware / saas.badgeVideo / saas.badgeDemo ajoutées ×5 langues (fr/en/es/zh/de). catalog.ts : type SoftwareLinksRecord exporté.
- INCIDENT ENVIRONNEMENT : le serveur de dev (démarré 00:14) avait un client Prisma ANTIÉRIEUR au modèle SoftwareLink (schéma + prisma generate à 01:45, node_modules non surveillé par Next) → « softwareLink is undefined » à l'exécution. Correctif double : (a) garde de fraîcheur dans src/lib/db.ts (instance en cache sans la propriété softwareLink → déconnectée et recréée depuis le client régénéré, sans redémarrage) ; (b) redémarrage propre du serveur avec le pipeline officiel (kill de l'arbre next, relance `bun run dev` → tee dev.log) car le bundler conservait l'ancien module @prisma/client.
- Vérifications : seed test sur factura-pro (watch?v=dQw4w9WgXcQ + demoUrl https://example.com/demo-factura, scripts/test-software-links.ts) → API publique OK (7 slugs) ; PUT youtu.be OK ; 400 pour vidéo non-YouTube, demoUrl http:, slug hors catalogue ; 401 sans session ; admin GET=7 slugs. Rendu navigateur (agent-browser) : iframe https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0 + title « Vidéo de présentation — Factura Pro » + loading lazy + bordure gold, 2 boutons « Open the software » (hero + CTA, target=_blank, rel noopener noreferrer), badges Video/Demo sur la carte factura-pro de /logiciels (7 cartes, coverflow intact). Nettoyage (null) → API à null + page revenue à l'affiche « bientôt » (pas d'iframe, pas de bouton). tsc : 0 erreur src/ ; lint OK ; dev.log propre (200, requêtes SoftwareLink correctes).

Stage Summary:
- Fichiers créés : src/lib/youtube.ts, src/app/api/admin/software-links/route.ts, src/app/api/software-links/route.ts, src/components/admin/SoftwareLinksPanel.tsx, scripts/test-software-links.ts (outil de test seed/clean conservé).
- Fichiers modifiés : src/components/pages/SaasDetailPage.tsx (vidéo DB + bouton démo hero/CTA), src/components/admin — NON touché (interdit) ; kit.tsx (GoldButton external), PageHero (action?), SaasSection (badges), catalog.ts (type), i18n/translations.ts (3 clés ×5 langues), src/lib/db.ts (garde anti client Prisma périmé).
- Décisions : vidéo DB prioritaire sur le champ statique d.videoUrl (repli conservé) ; aperçu miniature en background-image (pas de remotePatterns next/image à ouvrir) ; badges en position absolue sur le visuel pour ne pas déplacer le coverflow ; fetch public unique par page/section, échec silencieux → rendu inchangé.
- État : feature complète et testée E2E (API + rendu navigateur + nettoyage) ; le panel Logiciels est prêt à être câblé dans AdminOverlay par l'orchestrateur (<SoftwareLinksPanel onUnauthorized={…} />, export nommé + default).

---
Task ID: DASH-1
Agent: Z.ai Code (agent DASH-1)
Task: Réalisations — CRUD complet dashboard + images + front DB

Work Log:
- État des lieux : prisma/schema.prisma (Project avec imageUrl ✓ déjà migré), ancien /api/admin/projects (GET/POST/PATCH/DELETE minimal), ProjectsPanel interne d'AdminOverlay (lignes 324-550, non touché — câblage réservé à l'orchestrateur), works.ts (8 travaux, 5 langues), consommateurs identifiés : WorksShowcase (coverflow /realisations), ClientLogosBand (bandeau logos, hors périmètre), chatbot site-index ; API publique /api/projects existante (sans imageUrl) consommée par ProjectsSection.
- Créé scripts/seed-projects.ts : import direct de WORKS (zéro duplication de données), upsert par slug, title 5 langues (nom de marque), summary = desc 5 langues, client = marque, sector = fr, imageUrl = capture existante /images/works/*.jpg, linkUrl vérifié, isPublished: true, sortOrder 1-8, year 2025 (année de vérification des liens — works.ts ne porte pas d'année, ajustable par réalisation depuis le dashboard). Exécution ×2 : 8 created puis 0 created/8 updated (idempotent), total : 8 projets, 8 publiés.
- Réécrit src/app/api/admin/projects/route.ts : GET complet (publiés + brouillons, tri sortOrder asc puis createdAt desc, renvoie tous les champs y compris imageUrl/description) ; POST (zod : title min 2, summary min 4, year 2015-2100, slug optionnel sinon auto slugify depuis le titre avec unicité garantie base-2, base-3…, imageUrl/linkUrl/description optionnels, 201) ; PATCH tous champs par id avec merge de locale : title/summary/description acceptés en texte brut et fusionnés dans le JSON existant (fr mis à jour, en/es/zh/de PRÉSERVÉS — vérifié sur captis), slug avec unicité (id exclu), 404 si P2025 ; DELETE ?id= (404 si absent). Tout derrière isAdmin() (401 vérifié), zod partout, 0 any.
- Créé src/app/api/admin/upload/route.ts (runtime nodejs, partagé) : POST FormData { file }, allowlist MIME jpeg/png/webp/avif/gif + max 6 Mo + détection des octets magiques (anti-usurpation, "image/jpg" normalisé), écrit public/uploads/<slug>-<timestamp>.<ext> via fs.mkdir recursive + writeFile, retourne { ok, data: { url: "/uploads/…" } } (201). Testé : succès 201 + fichier servi 200, fake PNG → 415 bad_type, sans cookie → 401.
- Créé src/components/admin/ProjectsPanel.tsx (nouveau fichier, export ProjectsPanel({ onUnauthorized }) + default) : bouton « Nouvelle réalisation » (formulaire complet : titre, année, ordre pré-rempli max+1, client, secteur, résumé, description, lien, image, switch publication) ; liste éditable avec vignette, Badge Publiée/Brouillon, switch publication (mise à jour optimiste), flèches ↑/↓ (échange des sortOrder via 2 PATCH, gère les ordres égaux), Pencil → éditeur dépliable TOUS CHAMPS (+ slug), Trash2 (confirm) ; champ image partagé : aperçu miniature (next/image unoptimized), bouton Remplacer / Retirer, input file caché → POST /api/admin/upload → remplit imageUrl, taille vérifiée aussi côté client ; skeletons, busy par action, notices, erreurs réseau, 401 → onUnauthorized partout ; style border-line/bg-surface/GoldButton/label-caps, icônes Pencil/Trash2/ImagePlus/ArrowUp/ArrowDown/Loader2/Plus. AdminOverlay.tsx et prisma/schema.prisma NON touchés.
- API publique /api/projects : + imageUrl dans le JSON (take 24), tri inchangé — curl → 8 items ordonnés captis→samoumedia.
- Front : WorksShowcase refondu — vue unifiée WorkView (statique ou DB), fetch /api/projects au montage ; DB ≥1 → projets DB (titre localisé via pickLocale, summary, domaine déduit du lien, image = imageUrl ?? capture statique du même slug ?? monogramme or + année, lien optionnel géré : <a> sinon <div>, footer « Visiter » sinon année) ; sinon repli works.ts statique ; pendant le chargement les travaux statiques s'affichent déjà (fluidité, jamais de section vide), design coverflow inchangé. ProjectsSection (déjà branchée DB) : bandeau visuel affiche désormais la capture réelle (imageUrl) quand elle existe, filigrane année conservé sinon.
- QA : bun run lint 0 erreur ; tsc --noEmit propre sur src/ (seules restent les erreurs préexistantes examples/ et skills/) ; seed 8/8 ; curl /api/projects → 8, /realisations → 200, / → 200 ; E2E admin via curl (login → cookie) : POST création (slug auto « projet-test-kaloum », doublon → « -2 » auto), PATCH 10 champs + merge fr/en conservé, swap sortOrder vérifié puis revert, DELETE ×2, upload 201/415/401 ; balayage navigateur agent-browser desktop 1440 + mobile 390 sur /realisations : coverflow + grille portefeuille OK, 0 erreur console, 0 erreur page (dev.log vérifié, aucune erreur).

Stage Summary:
- La table Project est peuplée des 8 réalisations réelles (upsert relançable scripts/seed-projects.ts) : title/summary en 5 langues, captures existantes, liens vérifiés, ordre 1-8, toutes publiées — la section publique ne dépend plus du seul works.ts.
- CRUD complet livré : GET/POST/PATCH/DELETE sur /api/admin/projects (slug auto + unicité, merge multi-langues qui ne perd jamais en/es/zh/de lors d'une édition fr) et /api/admin/upload partagé (6 Mo, sniff octets magiques, public/uploads).
- src/components/admin/ProjectsPanel.tsx prêt à câbler : <ProjectsPanel onUnauthorized={…} /> — création, édition dépliable de tous les champs, upload d'image avec aperçu, publier/dépublier, réordonnancement ↑/↓, suppression.
- Front public branché DB : /api/projects renvoie imageUrl ; WorksShowcase rend les projets DB (fallback statique garanti) ; ProjectsSection montre les captures réelles — même design Obsidienne & Or, aucune section vide possible.
- Note : ClientLogosBand (bandeau de logos de l'accueil) reste statique — hors périmètre DASH-1 ; à brancher plus tard si souhaité.
- Lint 0 erreur, seed 8/8, curls OK, dev.log propre.
---
Task ID: DASH-0 (orchestrateur)
Agent: Z.ai Code
Task: Tableau de bord étendu — contact éditable, inbox, réalisations CRUD, blog SEO+pubs, logiciels démo/vidéo, mot du gérant

Work Log:
- Schema Prisma étendu + db push : SiteSettings (singleton : phonesJson/emailsJson/socialsJson/manager*), SoftwareLink (slug, demoUrl, videoUrl), Project.imageUrl, BlogPost.metaTitle/metaDescription/keywords/adsJson
- [DASH-1] Réalisations : seed des 8 works existants en base (scripts/seed-projects.ts), API admin/projects réécrite (CRUD complet, slug auto unique, merge multi-langues), /api/admin/upload (6 Mo, magic bytes), ProjectsPanel.tsx dédié (édition totale + upload image + ordre ↑↓ + publier), WorksShowcase/ProjectsSection branchés DB avec fallback statique
- [DASH-2] Site & Contact : site-settings-defaults.ts + getSiteSettings(), /api/site-settings (public), /api/admin/settings (GET/PUT zod), SettingsPanel.tsx (téléphones, e-mails, réseaux sociaux ×8 plateformes, upload photo gérant, message éditable), ContactSection branché (fallback), ManagerMessageSection sur /a-propos (monogramme or en attendant la photo), translations ×5
- [DASH-3] Journal : post-ads.ts (parse/stringify défensif), API posts +metaTitle/metaDescription/keywords/ads, PostsPanel (SEO compteurs 60/160 + éditeur d'espaces publicitaires position par paragraphe), generateMetadata blog utilise le SEO dédié, ArticlePage rend les pubs (AdBlock or, rel=sponsored), preuve DOM de rendu pub
- [DASH-4] Logiciels : youtube.ts (parse watch/youtu.be/shorts/embed), /api/admin/software-links (PUT upsert validé), /api/software-links (public), SoftwareLinksPanel.tsx (7 produits, validation live + miniature), SaasDetailPage : iframe youtube-nocookie 16:9 + bouton « Ouvrir le logiciel », SaasSection badges Démo/Vidéo
- Orchestrateur : ancien ProjectsPanel interne d'AdminOverlay supprimé (230 lignes), 3 panels importés, onglets « Site & Contact » + « Logiciels » ajoutés, ProjectAdminRow orphelin retiré
- Données de test créées puis nettoyées (message test vérifié dans la boîte de réception puis lead supprimé, liens Factura Pro remis à null, message gérant officiel restauré)

Stage Summary:
- Espace équipe final : Flux (leads + messages + essais), Site & Contact, Logiciels, Journal (SEO+pubs), Réalisations (CRUD+images), Démos, Partenaires, Témoignages, Documents, E-mails, Push
- Vérifié navigateur E2E : login → onglets ; PUT settings → /contact affiche tél/email/FB ; PUT software-links → /logiciels/factura-pro affiche iframe YouTube + bouton démo ; POST /api/contact → message visible dans Flux ; /a-propos affiche le mot du gérant officiel (2 paragraphes) avec placeholder photo élégant
- La photo du gérant : upload prêt dans Site & Contact (image ou URL) — monogramme « E » doré tant que non fournie
- Lint 0 erreur, pages 200, dev.log propre. Mot de passe admin sandbox : ADMIN_PASSWORD (défaut eins-admin-2026) — basculer Auth.js+TOTP en production (H-03)
