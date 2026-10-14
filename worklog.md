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
