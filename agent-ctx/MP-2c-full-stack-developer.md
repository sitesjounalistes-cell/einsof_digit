# Task MP-2c — full-stack-developer

## Livraison
Pages `/realisations`, `/a-propos` et `/contact` du site multi-pages EINSOF (Next.js 16 App Router, thème « Obsidienne & Or », i18n 5 langues).

## Fichiers créés (9) — aucun fichier existant modifié
| Fichier | Rôle |
|---|---|
| `src/app/(site)/realisations/page.tsx` | Route serveur + metadata |
| `src/app/(site)/a-propos/page.tsx` | Route serveur + metadata |
| `src/app/(site)/contact/page.tsx` | Route serveur + metadata |
| `src/components/pages/RealisationsPage.tsx` | Client — hero, types de missions, sections API, CTA, liens |
| `src/components/pages/AProposPage.tsx` | Client — hero, stats, à propos, pourquoi EINSOF, documents, CTA |
| `src/components/pages/ContactPage.tsx` | Client — hero, ContactSection, cartes d'aide, liens |
| `src/lib/pages-content/realisations.ts` | Contenu 5 langues (fr très détaillé) |
| `src/lib/pages-content/apropos.ts` | Contenu 5 langues |
| `src/lib/pages-content/contact.ts` | Contenu 5 langues |

## Décisions clés
- **Motif MP-1 respecté** : page serveur (`metadata` via `NEXT_PUBLIC_BRAND_NAME || "EINSOF"`) → composant client → `useLocalized(CONTENU)`.
- **Zéro invention** : la page réalisations décrit 6 TYPES de missions génériques (objectif + livrables) ; projets/partenaires/témoignages viennent des API existantes (se masquent si vides). Chiffres repris uniquement de `catalog.ts` (sur mesure dès 20 000 000 GNF, 6 SaaS, essai 7 jours, 3 formules web) et de `translations.ts` (24 h/48 h, Lun–Ven 8 h–18 h, 7 ans, ~10 experts, Conakry).
- **Texte toujours visible** : aucune animation custom ; titres animés uniquement via PageHero/SectionHeading (WordMask v3 par mot, dégradé or fiable — cf. UI-FIX-2) ; cartes en Stagger/SpotlightCard/Beam/card-lift.
- **Navigation interne** : liens croisés → composants partagés (next/link) ; boutons des cartes /contact → `router.push` (next/navigation) car `GoldButton href` rend un `<a>` natif.
- **Rythme visuel** : séparateurs `border-line` sur mes propres sections quand deux sections `surface` se suivent (work-types→projects, why-us→documents, contact-help après ContactSection).

## Vérifications (passées)
- `bunx tsc --noEmit` (hors examples/skills) → 0 erreur
- `bun run lint` → 0 erreur
- `curl` /realisations, /a-propos, /contact → 200 · dev.log sans erreur runtime
- Contrôle SSR : titres, cartes, chiffres et libellés présents dans le HTML servi (y compris mots WordMask en spans)

## Correctifs partagés souhaités (fichiers existants, hors périmètre)
1. `kit.tsx` — `GoldButton` avec `href` rend `<a>` natif (rechargement complet) : passer à `next/link`.
2. `ContactSection` — heading interne duplique le PageHero (« 15 — Contact » / « Parlons de votre projet. ») : un prop `heading={false}` permettrait d'éviter la redondance (impossible sans modification interdite).
3. Liens croisés vers `/services`, `/blog`, `/faq`, `/tarifs`, `/logiciels` : pages portées par les autres agents MP-2 — 404 tant qu'elles ne sont pas créées.

## Points douteux
- Redondance PageHero/ContactSection assumée (motif imposé par le cahier des charges MP-2c).
- Sections API vides actuellement → pages affichent uniquement contenu statique + sections masquées (comportement voulu, vérifié).
