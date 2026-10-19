"""Couvertures pour les 12 articles historiques (mêmes design que les 12 SEO)
+ mise à jour coverImageUrl en base Neon.
"""
from PIL import Image, ImageDraw, ImageFont
import random, os, subprocess, json

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

CATS = {"agence": "AGENCE", "web": "SITES WEB", "saas": "LOGICIELS SAAS",
        "logiciels": "LOGICIELS", "marketing": "MARKETING", "formations": "FORMATIONS"}

ARTICLES = [
    ("combien-coute-un-site-web-en-guinee", "web", "Combien coûte un site web en Guinée ?"),
    ("nos-deux-engagements-envers-chaque-client", "agence", "Nos deux engagements envers chaque client"),
    ("factura-pro-la-facturation-simplifiee", "saas", "Factura Pro : la facturation sans friction"),
    ("site-web-multilingue-pourquoi", "agence", "Un site en plusieurs langues"),
    ("site-vitrine-ou-tableau-de-bord", "web", "Site vitrine ou tableau de bord ?"),
    ("logiciel-de-gestion-bien-choisir", "saas", "Sept logiciels, un même partenaire"),
    ("creer-application-mobile-guinee", "logiciels", "Créer une application mobile en Guinée"),
    ("pourquoi-logiciel-gestion-guinee", "logiciels", "Pourquoi un logiciel de gestion ?"),
    ("community-management-guinee-guide", "marketing", "Community management en Guinée"),
    ("trouver-clients-b2b-guinee", "marketing", "Trouver des clients B2B en Guinée"),
    ("former-equipes-digital-guinee", "formations", "Former ses équipes au digital"),
    ("site-vitrine-ou-ecommerce-guinee", "web", "Site vitrine ou boutique en ligne ?"),
]

def wrap(d, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= max_w: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines[:4]

for idx, (slug, cat, title) in enumerate(ARTICLES, 1):
    random.seed(idx * 31 + 5)
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(10 + 14 * t), int(10 + 14 * t), int(12 + 16 * t)))
    for _ in range(26):
        x, y = random.randint(40, W - 40), random.randint(40, H - 40)
        s = random.choice([1, 1, 2])
        d.ellipse([x, y, x + s, y + s], fill=GOLD_SOFT)
    m = 26
    d.rectangle([m, m, W - m, H - m], outline=(212, 175, 55, 160), width=1)
    d.rectangle([m + 6, m + 6, W - m - 6, H - m - 6], outline=(212, 175, 55, 70), width=1)
    label = "EINSOF DIGIT — JOURNAL"
    lw = d.textlength(label, font=F_LABEL)
    d.text(((W - lw) / 2, 62), label, font=F_LABEL, fill=GOLD)
    d.line([(W/2 - lw/2 - 40, 100), (W/2 + lw/2 + 40, 100)], fill=(212, 175, 55, 120), width=1)
    lines = wrap(d, title, F_TITLE, W - 240)
    th = len(lines) * 72
    y0 = (H - th) / 2 - 10
    for i, l in enumerate(lines):
        lw2 = d.textlength(l, font=F_TITLE)
        d.text(((W - lw2) / 2, y0 + i * 72), l, font=F_TITLE, fill=IVORY)
    cy = y0 + th + 26
    d.line([(W/2 - 60, cy), (W/2 + 60, cy)], fill=GOLD, width=2)
    cl = CATS.get(cat, cat.upper())
    cw = d.textlength(cl, font=F_CAT)
    d.text(((W - cw) / 2, cy + 14), cl, font=F_CAT, fill=MUTE)
    foot = "www.einsofdigit.com"
    fw = d.textlength(foot, font=F_FOOT)
    d.text(((W - fw) / 2, H - 78), foot, font=F_FOOT, fill=(160, 156, 146))
    out = os.path.join("public", "images", "blog", slug + ".jpg")
    img.save(out, "JPEG", quality=85, optimize=True)
    print("OK", out, f"({os.path.getsize(out)//1024} Ko)")

print("12 couvertures historiques generees")
