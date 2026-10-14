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
