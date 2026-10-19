# Sources logo client (originaux)

5 visuels fournis par le client le 19/10/2026 — symbole **infini doré
se dissolvant en oiseaux/étoiles** + barre verticale + « EINSOF DIGIT ».

| Fichier | Description | Usage |
|---|---|---|
| `img1.jpg` | noir sur blanc (petit, 408×612) | — |
| `img2.png` | noir/or sur fond blanc | — |
| **`img3.png`** | **tout doré sur fond noir, une ligne** | **SÉLECTIONNÉ** |
| `img4.png` | doré sur noir, texte sur 2 lignes | — |
| `img5.png` | or + texte blanc sur noir | — |

`img3` a été retenue : intégralité en doré → lisible sur thèmes sombre
ET clair une fois détourée. Le détourage (fond noir → transparent) et
toutes les déclinaisons sont produits par `scripts/process-logo.py` :

- `public/logos/einsof-digit-or.png` — lockup complet (navbar, footer, JSON-LD)
- `public/logos/einsof-symbole-or.png` — symbole seul (composant `Monogram`)
- `src/app/icon.png` + `apple-icon.png` — favicon Next (auto)
- `public/favicon.ico` — repli 16/32/48
- `public/icons/icon-{192,512,maskable-512}.png` — PWA / manifest
