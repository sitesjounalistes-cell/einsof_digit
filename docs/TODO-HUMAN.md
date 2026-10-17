# Tâches humaines (section 30 du cahier des charges) — état au terme du développement

> L'agent continue avec des valeurs fictives/simulées tant que ces tâches ne sont pas réalisées.

| N° | Tâche | Responsable | Bloquante avant | État |
|----|-------|-------------|-----------------|------|
| H-01 | Fournir le nom définitif de l'entreprise, le logo (SVG), la charte | Client | Production | ⏳ Nom provisoire **EINSOF** (variable `NEXT_PUBLIC_BRAND_NAME`), monogramme provisoire en place |
| H-02 | Acheter le nom de domaine, accès DNS | Client | Mise en ligne | ⏳ |
| H-03 | Créer les comptes : Vercel, Neon, Cloudflare (R2/Turnstile), Resend, Upstash, Sentry ; fournir les clés | Client | Production | ⏳ Adaptateurs simulés en sandbox |
| H-04 | Choisir le fournisseur IA (LLM + embeddings 1024) | Client | Production | 🟡 **OpenRouter** en moteur principal (chaîne llama-3.3-70b → mistral-small → deepseek, clé `OPENROUTER_API_KEY`) + repli z-ai. ⚠ **La clé d'origine a fuité dans git : la révoquer sur openrouter.ai/keys et en générer une nouvelle** (audit S-02) ; embeddings reportés (cf. DECISIONS) |
| H-05 | Générer les clés VAPID de production + définir `CRON_SECRET` | Client/technique | Notifications push en production | 🟡 Push opérationnel en sandbox (clés auto-générées et persistées, abonnement consenti, envoi de test dans l'admin, SW prêt) ; générer `bun scripts/push-keys.ts` pour la production |
| H-06 | Fournir le numéro WhatsApp, e-mails commerciaux, adresse, horaires, réseaux sociaux | Client | Phase contact | ⏳ Affichage « à venir » sur le site ; `NEXT_PUBLIC_WHATSAPP_NUMBER` prêt |
| H-07 | Valider les textes définitifs, fiches SaaS détaillées, catalogue formations, tarifs community management / acquisition / mobile | Client | Contenus | ⏳ Tarifs exacts de la section 19 appliqués ; mentions « sur devis » en place |
| H-08 | Fournir photos/vidéos, présentation PDF, partenaires, témoignages (accords écrits), réalisations, fichiers des documents | Client | Sections confiance | 🟡 Sections masquées tant que rien n'est fourni (§20.4) — **infrastructure prête** : CRUD complet dans l'Espace équipe pour Réalisations, Partenaires, Témoignages et Documents ; les sections apparaissent dès la première donnée publiée |
| H-09 | Faire relire les traductions es / zh / de (et relire en) | Client | Mise en ligne | 🟡 fr + en + es + zh + de complets à 100 % (350+ clés, typées `Dict`) ; relecture humaine native toujours recommandée — repli fr actif pour toute clé manquante |
| H-10 | Faire valider les pages légales par un juriste (loi guinéenne 2016 + RGPD) | Client | Mise en ligne | ⏳ Textes provisoires affichés dans les modales du pied de page |
| H-11 | Valider les 100 questions du chatbot + profils visiteurs ; tests clients réels | Client | Recette | ⏳ Le chatbot est contraint à la base de connaissances (aucun tarif inventé) |
| H-12 | Tester sur vrais Android/iPhone (PWA, notifications, 4G) | Client | Recette | ⏳ PWA installable en local ; push à venir |
| H-13 | Décider paiement en ligne, langues locales (susu/pular/malinké), prix en devises | Client | Version 2 | ⏳ Hors v1 conformément à la section 18 |
| H-14 | Valider le déploiement production + bascule domaine | Client | Mise en ligne | ⏳ |
| H-15 | Contrat de maintenance / supervision | Client | Post-lancement | ⏳ |
| — | Auth admin production : Auth.js + argon2 + TOTP obligatoire (remplace le mot de passe simple de la sandbox) | Technique | Production | ⏳ Voir docs/DECISIONS.md |
| — | Migration PostgreSQL (Neon) + Drizzle/pgvector + vectorisation de la base de connaissances | Technique | Production | ⏳ Schéma §24 déjà reflété en Prisma |
| — | Rédaction du jeu de 100 questions (tests/chatbot/questions.json) et seuil ≥ 90 % | Technique + client | Phase 5 recette | ✅ **Écrit** (100 questions : tarifs web/saas, logiciels, politique, essais/démos, contact, hors-sujet, injection — `bun run test:chatbot`) ; reste à l'exécuter en recette avec la nouvelle clé OpenRouter |
