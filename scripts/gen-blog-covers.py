"""Génération des 12 couvertures d'articles SEO — style Obsidienne & Or.
1200x630 (OG idéal), dégradé obsidienne, filets et lettrage or, titre serif ivoire.
Sortie : public/images/blog/<slug>.jpg (quality 85, ~100-150 Ko).
"""
from PIL import Image, ImageDraw, ImageFont
import random, io, os

W, H = 1200, 630
GOLD = (212, 175, 55)
GOLD_SOFT = (212, 175, 55, 90)
IVORY = (250, 248, 243)
MUTE = (200, 196, 186)
F = "C:/Windows/Fonts/"

F_LABEL = ImageFont.truetype(F + "arialbd.ttf", 26)
F_TITLE = ImageFont.truetype(F + "georgiab.ttf", 58)
F_CAT = ImageFont.truetype(F + "arialbd.ttf", 22)
F_FOOT = ImageFont.truetype(F + "arial.ttf", 22)

CATS_FR = {
    "agence": "AGENCE", "web": "SITES WEB", "saas": "LOGICIELS SAAS",
    "logiciels": "LOGICIELS", "marketing": "MARKETING", "formations": "FORMATIONS",
}

ARTICLES = [
    ("top-agences-creation-site-web-guinee-2026", "agence", "Top 7 des agences de création de site web en Guinée"),
    ("combien-coute-logiciel-sur-mesure-guinee", "logiciels", "Combien coûte un logiciel sur mesure en Guinée ?"),
    ("vendre-en-ligne-guinee-guide-complet", "web", "Vendre en ligne en Guinée : le guide complet"),
    ("logiciel-gestion-scolaire-guinee", "saas", "Logiciel de gestion scolaire en Guinée"),
    ("logiciel-pharmacie-guinee", "saas", "Logiciel pour pharmacie en Guinée"),
    ("logiciel-gestion-hospitaliere-guinee", "saas", "Logiciel de gestion hospitalière en Guinée"),
    ("logiciel-immobilier-guinee", "saas", "Logiciel immobilier en Guinée"),
    ("comptabilite-facturation-pme-guinee", "saas", "Comptabilité et facturation pour PME"),
    ("apparaitre-premier-google-guinee", "marketing", "Apparaître en premier sur Google en Guinée"),
    ("site-web-whatsapp-guinee", "marketing", "Site web + WhatsApp : le duo gagnant"),
    ("digitaliser-entreprise-guinee-guide", "agence", "Digitaliser son entreprise en Guinée"),
    ("nom-domaine-hebergement-guinee-guide", "web", "Nom de domaine et hébergement web en Guinée"),
]

def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines[:4]

def make(slug, cat, title, seed):
    random.seed(seed)
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img, "RGBA")
    # dégradé obsidienne
    for y in range(H):
        t = y / H
        r = int(10 + 14 * t); g = int(10 + 14 * t); b = int(12 + 16 * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    # particules or éparses
    for _ in range(26):
        x, y = random.randint(40, W - 40), random.randint(40, H - 40)
        s = random.choice([1, 1, 2])
        d.ellipse([x, y, x + s, y + s], fill=GOLD_SOFT)
    # cadre filet or
    m = 26
    d.rectangle([m, m, W - m, H - m], outline=(212, 175, 55, 160), width=1)
    d.rectangle([m + 6, m + 6, W - m - 6, H - m - 6], outline=(212, 175, 55, 70), width=1)
    # bandeau supérieur
    label = "EINSOF DIGIT — JOURNAL"
    lw = d.textlength(label, font=F_LABEL)
    d.text(((W - lw) / 2, 62), label, font=F_LABEL, fill=GOLD)
    d.line([(W/2 - lw/2 - 40, 100), (W/2 + lw/2 + 40, 100)], fill=(212, 175, 55, 120), width=1)
    # titre centré
    lines = wrap(d, title, F_TITLE, W - 240)
    th = len(lines) * 72
    y0 = (H - th) / 2 - 10
    for i, l in enumerate(lines):
        lw = d.textlength(l, font=F_TITLE)
        d.text(((W - lw) / 2, y0 + i * 72), l, font=F_TITLE, fill=IVORY)
    # filet + catégorie + bas de page
    cy = y0 + th + 26
    d.line([(W/2 - 60, cy), (W/2 + 60, cy)], fill=GOLD, width=2)
    cat_label = CATS_FR.get(cat, cat.upper())
    cw = d.textlength(cat_label, font=F_CAT)
    d.text(((W - cw) / 2, cy + 14), cat_label, font=F_CAT, fill=MUTE)
    foot = "www.einsofdigit.com"
    fw = d.textlength(foot, font=F_FOOT)
    d.text(((W - fw) / 2, H - 78), foot, font=F_FOOT, fill=(160, 156, 146))
    out = os.path.join("public", "images", "blog", slug + ".jpg")
    img.save(out, "JPEG", quality=85, optimize=True)
    kb = os.path.getsize(out) // 1024
    print(f"OK {out} ({kb} Ko, {len(lines)} lignes)")

os.makedirs(os.path.join("public", "images", "blog"), exist_ok=True)
for i, (slug, cat, title) in enumerate(ARTICLES, 1):
    make(slug, cat, title, seed=i * 7 + 3)
print("12 couvertures générées")
