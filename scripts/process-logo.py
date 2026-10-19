# -*- coding: utf-8 -*-
"""Détourage du logo client (img3 : infini doré + EINSOF DIGIT sur fond noir).

Produit :
  public/logos/einsof-digit-or.png      lockup complet, fond transparent
  public/logos/einsof-symbole-or.png    symbole infini seul, transparent
  src/app/icon.png                      favicon Next 256×256 (fond sombre)
  src/app/apple-icon.png                180×180
  public/icons/icon-192.png | icon-512.png | icon-maskable-512.png  (PWA)
  public/favicon.ico                    16/32/48 multi-taille
"""
import os
from PIL import Image, ImageDraw

SRC = os.path.join(os.path.dirname(__file__), "..", "_brand", "img3.png")
ROOT = os.path.join(os.path.dirname(__file__), "..")
DEEP = (10, 10, 10)

img = Image.open(SRC).convert("RGBA")
px = img.load()
W, H = img.size
print("source:", img.size)

# ── 1. Alpha par rampe de luminance : noir -> transparent, or -> opaque ──
T0, T1 = 16.0, 100.0
for y in range(H):
    for x in range(W):
        r, g, b, _ = px[x, y]
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        a = (lum - T0) / (T1 - T0)
        if a <= 0:
            px[x, y] = (0, 0, 0, 0)
        elif a < 1:
            px[x, y] = (r, g, b, int(a * 255))
        # else: garder tel quel (alpha 255)

bbox = img.getbbox()
lockup = img.crop(bbox)
print("lockup crop:", lockup.size)

# ── 2. Séparation symbole / texte : trous verticaux de contenu ──
alpha_ch = lockup.split()[3]
col_sum = [alpha_ch.crop((x, 0, x + 1, lockup.height)).getbbox() is not None for x in range(lockup.width)]
# lisser : colonne "vide" si moins de 1% de pixels non nuls
hist = alpha_ch.resize((lockup.width, 1)).getdata()[0] if False else None
import statistics
col_density = []
a_px = alpha_ch.load()
for x in range(lockup.width):
    n = 0
    for y in range(0, lockup.height, 4):
        if a_px[x, y] > 40:
            n += 1
    col_density.append(n)
maxd = max(col_density) or 1
# trou = zone contiguë de >6% de largeur quasi vide, après le 1er contenu
first = next(i for i, d in enumerate(col_density) if d > maxd * 0.10)
gaps, run = [], []
for i in range(first + 4, lockup.width - 4):
    if col_density[i] <= maxd * 0.02:
        run.append(i)
    else:
        if run:
            gaps.append((run[0], run[-1]))
        run = []
if run:
    gaps.append((run[0], run[-1]))
real = [g for g in gaps if g[1] - g[0] > lockup.width * 0.04]
print("gaps:", real[:6])
assert real, "aucun separateur trouve"
split = (real[0][0] + real[0][1]) // 2

symbol = lockup.crop((0, 0, split, lockup.height))
sb = symbol.getbbox()
symbol = symbol.crop(sb)
print("symbol:", symbol.size)

# ── 3. Export lockup (hauteur max 260px, qualité nette) ──
target_h = 260
if lockup.height > target_h:
    r = target_h / lockup.height
    lockup_out = lockup.resize((round(lockup.width * r), target_h), Image.LANCZOS)
else:
    lockup_out = lockup
os.makedirs(os.path.join(ROOT, "public", "logos"), exist_ok=True)
lockup_out.save(os.path.join(ROOT, "public", "logos", "einsof-digit-or.png"), optimize=True)
print("lockup out:", lockup_out.size)

# ── 4. Export symbole seul (hauteur 320px) ──
target_h = 320
r = target_h / symbol.height
sym_out = symbol.resize((round(symbol.width * r), target_h), Image.LANCZOS)
sym_out.save(os.path.join(ROOT, "public", "logos", "einsof-symbole-or.png"), optimize=True)
print("symbol out:", sym_out.size)

# ── 5. Icônes : symbole doré sur carré sombre arrondi ──
def icon(size, radius_ratio=0.22, scale=0.58, full_bleed=False, out=None):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg = Image.new("RGBA", (size, size), DEEP + (255,))
    if full_bleed:
        canvas = bg
    else:
        mask = Image.new("L", (size, size), 0)
        d = ImageDraw.Draw(mask)
        r = int(size * radius_ratio)
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
        canvas.paste(bg, (0, 0), mask)
    sh = int(size * scale)
    sw = round(symbol.width * sh / symbol.height)
    s = symbol.resize((sw, sh), Image.LANCZOS)
    # léger halo doré pour la lisibilité en petit
    canvas.alpha_composite(s, ((size - sw) // 2, (size - sh) // 2))
    if out:
        canvas.save(out, optimize=True)
    return canvas

icon(256, out=os.path.join(ROOT, "src", "app", "icon.png"))
icon(180, out=os.path.join(ROOT, "src", "app", "apple-icon.png"))
icon(192, out=os.path.join(ROOT, "public", "icons", "icon-192.png"))
icon(512, out=os.path.join(ROOT, "public", "icons", "icon-512.png"))
icon(512, full_bleed=True, scale=0.5, out=os.path.join(ROOT, "public", "icons", "icon-maskable-512.png"))

# ── 6. favicon.ico multi-tailles ──
ico = icon(48, radius_ratio=0.2, scale=0.62)
ico.save(
    os.path.join(ROOT, "public", "favicon.ico"),
    sizes=[(16, 16), (32, 32), (48, 48)],
)
print("OK — tous les fichiers generes")
