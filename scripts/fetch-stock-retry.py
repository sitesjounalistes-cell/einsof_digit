"""Retry des couvertures échouées : requêtes alternatives + critères élargis
(portrait accepté — recadrage centré 16:9), licences élargies (cc0,pdm,by,by-sa)."""
import io, json, os, sys, time, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
Image.MAX_IMAGE_PIXELS = 200_000_000

API = "https://api.openverse.org/v1/images/"
UA = {"User-Agent": "Mozilla/5.0 (einsof-digit-site-builder)"}
OUT_BLOG = "public/images/blog"

RETRY = [
    ("vendre-en-ligne-guinee-guide-complet", ["online shopping delivery boxes", "online shopping cart", "e-commerce packages"]),
    ("apparaitre-premier-google-guinee", ["laptop screen search", "search engine results screen", "typing keyboard search"]),
    ("site-web-whatsapp-guinee", ["texting smartphone hands", "smartphone messaging hand", "mobile phone chat"]),
    ("factura-pro-la-facturation-simplifiee", ["receipt paper rolls", "paperwork office documents", "invoice paper stack"]),
    ("site-web-multilingue-pourquoi", ["world globe", "globe atlas", "language dictionary books"]),
    ("site-vitrine-ou-tableau-de-bord", ["data charts screen", "analytics graphs monitor", "computer statistics screen"]),
    ("logiciel-de-gestion-bien-choisir", ["multiple monitors desk", "dual monitor workstation", "computer workstation office"]),
    ("pourquoi-logiciel-gestion-guinee", ["stock market chart screen", "financial growth chart", "business graph meeting"]),
    ("community-management-guinee-guide", ["social media phone", "smartphone apps hand", "phone screen social network"]),
    ("trouver-clients-b2b-guinee", ["business meeting people", "office meeting discussion", "professional team talking"]),
    ("former-equipes-digital-guinee", ["seminar audience", "conference presentation stage", "workshop training people"]),
    ("site-vitrine-ou-ecommerce-guinee", ["shopping bags street", "boutique shop products", "small shop store owner"]),
    ("combien-coute-logiciel-sur-mesure-guinee", ["programming code screen", "software developer coding", "code editor monitor"]),
]

def ov(query, aspect="wide", licenses="cc0,pdm,by,by-sa"):
    qs = urllib.parse.urlencode({
        "q": query, "size": "large", "aspect_ratio": aspect,
        "license": licenses, "license_type": "commercial",
        "page_size": "16", "format": "json",
    })
    req = urllib.request.Request(f"{API}?{qs}", headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r).get("results", [])

def pick(results, min_w=900):
    ok = [r for r in results
          if (r.get("width") or 0) >= min_w and (r.get("height") or 0)
          and (r.get("filetype") or "").lower() in ("jpg", "jpeg", "png")]
    # préférence paysage, sinon portrait large assez pour un crop 16:9
    land = [r for r in ok if r["width"] >= r["height"]]
    pool = land if land else ok
    pool.sort(key=lambda r: -(r["width"] * r["height"]))
    return pool[0] if pool else None

def download(url, timeout=45):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def fit(img, w, h):
    sw, sh = img.size
    scale = max(w / sw, h / sh)
    img = img.resize((int(sw * scale + .5), int(sh * scale + .5)), Image.LANCZOS)
    x, y = (img.size[0] - w) // 2, (img.size[1] - h) // 2
    return img.crop((x, y, x + w, y + h))

def grade(img):
    img = ImageEnhance.Color(img).enhance(1.06)
    return ImageEnhance.Contrast(img).enhance(1.04)

credits = []
for name, queries in RETRY:
    # déjà remplacée par une photo ? (> 70 Ko) → on n'y touche pas
    path_check = os.path.join(OUT_BLOG, name + ".jpg")
    if os.path.exists(path_check) and os.path.getsize(path_check) > 70_000:
        print(f"  = {name}.jpg déjà en photo, ignoré")
        continue
    done = False
    for q in queries:
        for aspect in ("wide", None):
            if done: break
            try:
                results = ov(q, aspect=aspect or "wide")
                if aspect is None:
                    # 2e passe : sans filtre d'aspect via paramètre standard
                    results = ov(q, aspect="wide") + ov(q, aspect="tall")
            except Exception as e:
                print(f"  ! recherche {name}/{q}: {e}"); time.sleep(3); continue
            cand = pick(results)
            if not cand: continue
            try:
                img = Image.open(io.BytesIO(download(cand["url"]))); img.load()
                out = grade(fit(img, 1344, 768))
                path = os.path.join(OUT_BLOG, name + ".jpg")
                out.save(path, "JPEG", quality=84, optimize=True)
                lic = cand.get("license", "?")
                print(f"  + {name}.jpg ({os.path.getsize(path)//1024} Ko) [{lic}] «{q}»")
                credits.append(f'{path} | {lic} | {cand.get("creator") or "?"} | {cand.get("foreign_landing_url", "")}')
                done = True
            except Exception as e:
                print(f"  ! dl {name}: {e}"); time.sleep(2)
        if done: break
    if not done: print(f"  ECHEC definitif {name}")
    time.sleep(1.2)

# ajouter aux crédits existants
if credits:
    with io.open("docs/IMAGE-CREDITS.md", "a", encoding="utf-8", newline="\n") as f:
        for c in credits: f.write("- " + c + "\n")
print(f"RETRY TERMINE — {len(credits)} recuperees")
