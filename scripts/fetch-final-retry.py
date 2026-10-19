"""Retry final : 1 couverture blog + 6 bandeaux restants (timeouts réseau)."""
import io, json, os, sys, time, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
Image.MAX_IMAGE_PIXELS = 200_000_000

API = "https://api.openverse.org/v1/images/"
UA = {"User-Agent": "Mozilla/5.0 (einsof-digit-site-builder)"}

def ov(query, aspect="wide", licenses="cc0,pdm,by,by-sa"):
    qs = urllib.parse.urlencode({
        "q": query, "size": "large", "aspect_ratio": aspect,
        "license": licenses, "license_type": "commercial",
        "page_size": "16", "format": "json",
    })
    req = urllib.request.Request(f"{API}?{qs}", headers=UA)
    with urllib.request.urlopen(req, timeout=35) as r:
        return json.load(r).get("results", [])

def pick(results, min_w=900):
    ok = [r for r in results
          if (r.get("width") or 0) >= min_w and (r.get("height") or 0)
          and (r.get("filetype") or "").lower() in ("jpg", "jpeg", "png")]
    land = [r for r in ok if r["width"] >= r["height"]]
    pool = land if land else ok
    pool.sort(key=lambda r: -(r["width"] * r["height"]))
    return pool[0] if pool else None

def download(url, timeout=50):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def fit(img, w, h):
    sw, sh = img.size
    scale = max(w / sw, h / sh)
    img = img.resize((int(sw * scale + .5), int(sh * scale + .5)), Image.LANCZOS)
    x, y = (img.size[0] - w) // 2, (img.size[1] - h) // 2
    return img.crop((x, y, x + w, y + h))

def grade_header(img):
    img = img.convert("RGB")
    img = ImageEnhance.Brightness(img).enhance(0.75)
    img = ImageEnhance.Color(img).enhance(1.1)
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for y in range(img.size[1]):
        a = int(26 * (y / img.size[1]))
        d.line([(0, y), (img.size[0], y)], fill=(212, 165, 55, a))
    img = Image.alpha_composite(img.convert("RGBA"), overlay)
    vg = Image.new("RGBA", img.size, (0, 0, 0, 0))
    vd = ImageDraw.Draw(vg)
    w, h = img.size
    for i in range(3):
        m = i * 60
        vd.rectangle([m, m, w - m, h - m], outline=(5, 5, 6, 34 - i * 10), width=60)
    img = Image.alpha_composite(img, vg.filter(ImageFilter.GaussianBlur(50)))
    return img.convert("RGB")

def grade_blog(img):
    img = ImageEnhance.Color(img).enhance(1.06)
    return ImageEnhance.Contrast(img).enhance(1.04)

JOBS = [
    # (chemin, requetes alternates, kind)
    ("public/images/blog/apparaitre-premier-google-guinee.jpg",
     ["laptop google search", "searching internet laptop", "hand typing laptop search"], "blog"),
    ("public/images/headers/header-secteur-commerce-distribution.jpg",
     ["supermarket aisle", "grocery store shelves", "shop interior products"], "header"),
    ("public/images/headers/header-secteur-hotellerie-tourisme.jpg",
     ["hotel lobby interior", "hotel reception", "luxury hotel room"], "header"),
    ("public/images/headers/header-secteur-btp-construction.jpg",
     ["construction cranes", "building construction site", "construction workers"], "header"),
    ("public/images/headers/header-secteur-transport-logistique.jpg",
     ["truck highway", "container port cargo", "logistics warehouse"], "header"),
    ("public/images/headers/header-secteur-mines-energie.jpg",
     ["industrial plant night", "power plant energy", "heavy machinery industry"], "header"),
    ("public/images/headers/header-secteur-recrutement.jpg",
     ["job interview", "office handshake", "business meeting two people"], "header"),
]

credits = []
for path, queries, kind in JOBS:
    if os.path.exists(path) and os.path.getsize(path) > (40_000 if kind == "header" else 70_000):
        print(f"= {os.path.basename(path)} déjà fait"); continue
    done = False
    for q in queries:
        if done: break
        for attempt in range(3):
            try:
                results = ov(q)
                cand = pick(results)
                if not cand: break
                img = Image.open(io.BytesIO(download(cand["url"]))); img.load()
                if kind == "header":
                    out = grade_header(fit(img, 1600, 900))
                else:
                    out = grade_blog(fit(img, 1344, 768))
                out.save(path, "JPEG", quality=84, optimize=True)
                lic = cand.get("license", "?")
                print(f"+ {os.path.basename(path)} ({os.path.getsize(path)//1024} Ko) [{lic}] «{q}»")
                credits.append(f'{path} | {lic} | {cand.get("creator") or "?"} | {cand.get("foreign_landing_url", "")}')
                done = True
                break
            except Exception as e:
                print(f"  ! {os.path.basename(path)} essai {attempt+1}: {str(e)[:60]}")
                time.sleep(3)
        time.sleep(1.5)
    if not done: print(f"ECHEC {os.path.basename(path)}")

if credits:
    with io.open("docs/IMAGE-CREDITS.md", "a", encoding="utf-8", newline="\n") as f:
        for c in credits: f.write("- " + c + "\n")
print(f"FINAL RETRY TERMINE — {len(credits)} recuperees")
