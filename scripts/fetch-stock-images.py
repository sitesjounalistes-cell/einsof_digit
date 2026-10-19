"""Récupération de photos professionnelles libres (Openverse, usage commercial)
pour les 24 couvertures de blog et 16 bandeaux — retour client 17/10 :
de VRAIES images illustratives, photoréalistes.

Post-traitement PIL :
  - blog (1344x768) : léger étalonnage chaud (cohérence éditoriale)
  - headers (1600x900) : étalonnage « Obsidienne & Or » (assombrissement +
    teinte or + vignette) pour rester lisible sous le texte du PageHero
Préférence licences CC0/PDM (aucune attribution requise) ; les éventuelles
CC-BY utilisées sont consignées dans docs/IMAGE-CREDITS.md.
Usage : py -3.11 scripts/fetch-stock-images.py [--only blog|headers]
"""
import io, json, os, sys, time, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

OUT_BLOG = "public/images/blog"
OUT_HEAD = "public/images/headers"
API = "https://api.openverse.org/v1/images/"
UA = {"User-Agent": "Mozilla/5.0 (einsof-digit-site-builder)"}

def ov(query, aspect="wide", licenses="cc0,pdm"):
    qs = urllib.parse.urlencode({
        "q": query, "size": "large", "aspect_ratio": aspect,
        "license": licenses, "license_type": "commercial",
        "page_size": "12", "format": "json",
    })
    req = urllib.request.Request(f"{API}?{qs}", headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r).get("results", [])

def pick(results, min_w=1200):
    ok = [r for r in results
          if (r.get("width") or 0) >= min_w and (r.get("height") or 0)
          and r["width"] >= r["height"]
          and (r.get("filetype") or "").lower() in ("jpg", "jpeg", "png")]
    ok.sort(key=lambda r: -(r["width"] * r["height"]))
    return ok[0] if ok else None

def download(url, timeout=40):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def grade_blog(img):
    img = ImageEnhance.Color(img).enhance(1.06)
    return ImageEnhance.Contrast(img).enhance(1.04)

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

def fit(img, w, h):
    sw, sh = img.size
    scale = max(w / sw, h / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    x, y = (nw - w) // 2, (nh - h) // 2
    return img.crop((x, y, x + w, y + h))

BLOG = [
    ("top-agences-creation-site-web-guinee-2026", "web developer team office"),
    ("combien-coute-un-site-web-en-guinee", "website design laptop desk"),
    ("vendre-en-ligne-guinee-guide-complet", "online shopping smartphone payment"),
    ("logiciel-gestion-scolaire-guinee", "school classroom students"),
    ("logiciel-pharmacie-guinee", "pharmacy shelves medicines"),
    ("logiciel-gestion-hospitaliere-guinee", "hospital corridor modern"),
    ("logiciel-immobilier-guinee", "modern apartment interior"),
    ("comptabilite-facturation-pme-guinee", "accountant desk calculator"),
    ("apparaitre-premier-google-guinee", "search engine laptop screen"),
    ("site-web-whatsapp-guinee", "smartphone chat messaging hands"),
    ("digitaliser-entreprise-guinee-guide", "small business owner tablet"),
    ("nom-domaine-hebergement-guinee-guide", "server room data center"),
    ("nos-deux-engagements-envers-chaque-client", "business handshake meeting"),
    ("factura-pro-la-facturation-simplifiee", "invoice receipt paperwork desk"),
    ("site-web-multilingue-pourquoi", "world globe languages book"),
    ("site-vitrine-ou-tableau-de-bord", "analytics dashboard screen"),
    ("logiciel-de-gestion-bien-choisir", "office multiple monitors work"),
    ("creer-application-mobile-guinee", "mobile app smartphone design"),
    ("pourquoi-logiciel-gestion-guinee", "business charts growth screen"),
    ("community-management-guinee-guide", "social media smartphone light"),
    ("trouver-clients-b2b-guinee", "sales team meeting table"),
    ("former-equipes-digital-guinee", "training workshop presentation room"),
    ("site-vitrine-ou-ecommerce-guinee", "product photography studio boutique"),
]

HEADERS = [
    ("header-podcast", "podcast microphone studio"),
    ("header-zones", "city skyline night lights"),
    ("header-secteur-sante-pharmacie", "modern hospital building"),
    ("header-secteur-education-formation", "university campus students walking"),
    ("header-secteur-immobilier", "residential buildings skyline dusk"),
    ("header-secteur-commerce-distribution", "retail store shelves shopping"),
    ("header-secteur-hotellerie-tourisme", "hotel lobby luxury chandelier"),
    ("header-secteur-banque-microfinance", "bank building facade modern"),
    ("header-secteur-btp-construction", "construction site cranes"),
    ("header-secteur-ong-institutions", "community hands together"),
    ("header-secteur-transport-logistique", "cargo trucks highway logistics"),
    ("header-secteur-agriculture-agro", "farmer field agriculture sunset"),
    ("header-secteur-mines-energie", "industrial machinery night"),
    ("header-secteur-medias", "television camera studio"),
    ("header-secteur-telecoms-evenementiel", "concert stage lights crowd"),
    ("header-secteur-recrutement", "job interview office desk"),
]

def fetch_one(name, query, kind):
    for lic in ("cc0,pdm", "cc0,pdm,by,by-sa"):
        try:
            results = ov(query, aspect="wide", licenses=lic)
        except Exception as e:
            print(f"  ! recherche {name}: {e}"); time.sleep(3); continue
        cand = pick(results)
        attempts = 0
        while cand and attempts < 2:
            try:
                data = download(cand["url"])
                img = Image.open(io.BytesIO(data)); img.load()
                if kind == "blog":
                    out = grade_blog(fit(img, 1344, 768))
                    path = os.path.join(OUT_BLOG, name + ".jpg")
                else:
                    out = grade_header(fit(img, 1600, 900))
                    path = os.path.join(OUT_HEAD, name + ".jpg")
                out.save(path, "JPEG", quality=84, optimize=True)
                lic_str = cand.get("license", "?")
                print(f"  + {name}.jpg ({os.path.getsize(path)//1024} Ko) [{lic_str}]")
                if lic_str in ("cc0", "pdm"):
                    return f"{path} | {lic_str}"
                return f'{path} | {lic_str} | {cand.get("creator") or "?"} | {cand.get("foreign_landing_url", "")}'
            except Exception as e:
                print(f"  ! dl {name}: {e}"); attempts += 1; time.sleep(2)
                nxt = pick(ov(query, aspect="wide", licenses=lic) or [])
                cand = nxt
    print(f"  ECHEC {name}")
    return None

def main():
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else "all"
    os.makedirs(OUT_BLOG, exist_ok=True); os.makedirs(OUT_HEAD, exist_ok=True)
    credits = []
    if only in ("all", "blog"):
        print("=== Couvertures blog (photos) ===")
        for name, q in BLOG:
            line = fetch_one(name, q, "blog")
            if line: credits.append(line)
            time.sleep(1.2)
    if only in ("all", "headers"):
        print("=== Bandeaux (photos, étalonnage Obsidienne & Or) ===")
        for name, q in HEADERS:
            line = fetch_one(name, q, "header")
            if line: credits.append(line)
            time.sleep(1.2)
    with io.open("docs/IMAGE-CREDITS.md", "w", encoding="utf-8", newline="\n") as f:
        f.write("# Crédits images (photos libres — usage commercial)\n\n")
        f.write("Licences CC0/PDM : aucune attribution requise. "
                "Licences CC-BY/CC-BY-SA (le cas échéant) : créditer l'auteur + lien.\n\n")
        for c in credits: f.write("- " + c + "\n")
    print(f"TERMINE — {len(credits)} images posées")

if __name__ == "__main__":
    main()
