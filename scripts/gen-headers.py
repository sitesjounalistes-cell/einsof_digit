"""Bandeaux de pages supplémentaires — style Obsidienne & Or, SANS texte
(le PageHero dessine déjà son titre par-dessus, avec voiles sombres).

Sorties (1600x900 JPEG q82) :
  - headers/header-podcast.jpg
  - headers/header-zones.jpg
  - headers/header-secteur-<slug>.jpg  (x14, motif geometrique varie par secteur)
"""
from PIL import Image, ImageDraw, ImageFilter
import random, math, os

W, H = 1600, 900
GOLD = (212, 175, 55)
OUT = os.path.join("public", "images", "headers")

SECTORS = [
    "sante-pharmacie", "education-formation", "immobilier", "commerce-distribution",
    "hotellerie-tourisme", "banque-microfinance", "btp-construction", "ong-institutions",
    "transport-logistique", "agriculture-agro", "mines-energie", "medias",
    "telecoms-evenementiel", "recrutement",
]

def base(seed):
    random.seed(seed)
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(9 + 13 * t), int(9 + 13 * t), int(11 + 15 * t)))
    # halo radial dore (droite)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = random.randint(int(W * 0.62), int(W * 0.86)), random.randint(int(H * 0.3), int(H * 0.7))
    for r in range(0, 620, 6):
        a = max(0, int(20 * (1 - r / 620)))
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(212, 175, 55, a))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img.convert("RGBA"), glow)
    return img, cx, cy

def motif_arcs(d, cx, cy, seed):
    """Arcs concentriques dores, ouvertures variees."""
    for i in range(6):
        r = 90 + i * 78
        a0 = seed % 360 + i * 24
        a1 = a0 + random.randint(90, 220)
        d.arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=(212, 175, 55, 150 - i * 16), width=2)

def motif_hex(d, cx, cy, seed):
    """Hexagones imbriques."""
    for k in range(5):
        r = 80 + k * 82
        pts = [(cx + r * math.cos(math.radians(60 * i + seed % 60)),
                cy + r * math.sin(math.radians(60 * i + seed % 60))) for i in range(6)]
        d.polygon(pts, outline=(212, 175, 55, 140 - k * 18))

def motif_grid(d, cx, cy, seed):
    """Grille de points + diagonales fines."""
    step = 46
    for gx in range(cx - 340, cx + 340, step):
        for gy in range(cy - 240, cy + 240, step):
            fade = max(0, 110 - int(math.hypot(gx - cx, gy - cy) / 4))
            if fade > 12:
                d.ellipse([gx, gy, gx + 2, gy + 2], fill=(212, 175, 55, fade))
    for i in range(4):
        x = cx - 300 + i * 170
        d.line([(x, cy - 220), (x + 130, cy + 220)], fill=(212, 175, 55, 40), width=1)

def motif_waves(d, cx, cy, seed):
    """Ondes horizontales."""
    for j in range(7):
        y0 = cy - 210 + j * 70
        pts = [(x, y0 + int(34 * math.sin(math.radians(x / 9 + j * 37 + seed)))) for x in range(cx - 360, cx + 361, 8)]
        d.line(pts, fill=(212, 175, 55, 120 - j * 12), width=2)

def motif_triangles(d, cx, cy, seed):
    """Triangles dore en filigrane."""
    for k in range(6):
        r = 100 + k * 74
        ang = seed % 120
        pts = [(cx + r * math.cos(math.radians(ang + 120 * i)),
                cy + r * math.sin(math.radians(ang + 120 * i))) for i in range(3)]
        d.polygon(pts, outline=(212, 175, 55, 130 - k * 16))

MOTIFS = [motif_arcs, motif_hex, motif_grid, motif_waves, motif_triangles]

def finish(img, seed, name):
    d = ImageDraw.Draw(img, "RGBA")
    # particules dorees
    for _ in range(46):
        x, y = random.randint(30, W - 30), random.randint(30, H - 30)
        s = random.choice([1, 1, 2, 2])
        d.ellipse([x, y, x + s, y + s], fill=(212, 175, 55, random.randint(60, 130)))
    # filets dore horizontaux discrets
    for i in range(2):
        y = random.randint(80, H - 80)
        d.line([(0, y), (W, y)], fill=(212, 175, 55, 22), width=1)
    # vignette
    vg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vg)
    vd.rectangle([0, 0, W, H], fill=(0, 0, 0, 0))
    for i in range(4):
        m = 0 + i * 40
        vd.rectangle([m, m, W - m, H - m], outline=(6, 6, 7, 30 - i * 6), width=40)
    img = Image.alpha_composite(img, vg.filter(ImageFilter.GaussianBlur(30)))
    out = os.path.join(OUT, name)
    img.convert("RGB").save(out, "JPEG", quality=82, optimize=True)
    print(f"OK {out} ({os.path.getsize(out)//1024} Ko)")

os.makedirs(OUT, exist_ok=True)

# Podcast : ondes concentriques (micro)
img, cx, cy = base(101)
d = ImageDraw.Draw(img, "RGBA")
for i in range(8):
    r = 60 + i * 66
    d.arc([cx - r, cy - r, cx + r, cy + r], 200, 340, fill=(212, 175, 55, 150 - i * 14), width=3)
d.line([(cx, cy + 240), (cx, cy - 200)], fill=(212, 175, 55, 60), width=2)
finish(img, 7, "header-podcast.jpg")

# Zones : constellation de points (villes de Guinée) reliee par filets
img, cx, cy = base(202)
d = ImageDraw.Draw(img, "RGBA")
random.seed(202)
pts = [(random.randint(360, W - 90), random.randint(90, H - 90)) for _ in range(16)]
for i in range(len(pts) - 1):
    x1, y1 = pts[i]; x2, y2 = pts[i + 1]
    d.line([(x1, y1), (x2, y2)], fill=(212, 175, 55, 34), width=1)
for (x, y) in pts:
    d.ellipse([x - 5, y - 5, x + 5, y + 5], fill=(212, 175, 55, 120))
    d.ellipse([x - 12, y - 12, x + 12, y + 12], outline=(212, 175, 55, 50), width=1)
finish(img, 9, "header-zones.jpg")

# 14 secteurs : motif varie par secteur (memes familles, grain different)
for i, slug in enumerate(SECTORS):
    img, cx, cy = base(300 + i * 13)
    d = ImageDraw.Draw(img, "RGBA")
    MOTIFS[i % len(MOTIFS)](d, cx, cy, 300 + i * 13)
    finish(img, 300 + i * 13, f"header-secteur-{slug}.jpg")

print("16 bandeaux generes")
