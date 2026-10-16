/**
 * Capture des 8 sites réalisés par EINSOF — version Playwright directe.
 * Technique « tout est chargé » :
 *  1. viewport 1100×900, navigation, networkidle (tolérant)
 *  2. fermeture des popups (modales, WhatsApp, cookies)
 *  3. défilement lent par paliers (les reveals/lazy-loads se déclenchent)
 *  4. re-passage tant que la hauteur du document grandit
 *  5. attente des images (naturalWidth > 0, timeout tolérant)
 *  6. purge des styles reveal inline restants (opacity:0 → 1, hors fixed)
 *  7. retour en haut, nouvelle fermeture des popups, capture fullPage
 */
import { chromium } from "playwright-core";

const SITES = [
  ["captis", "https://www.captisguinee.com/"],
  ["ecometus", "https://www.ecometusguinee.online/"],
  ["interseas", "https://www.interseaslogistic.online/"],
  ["emrod", "https://www.emroddf.com/"],
  ["referencemedia", "https://www.referencemedia.online/"],
  ["fmk224", "https://www.fmk224.online/"],
  ["topguinee", "https://www.topguinee.online/"],
  ["samoumedia", "https://www.samoumedia.com/"],
];

const ONLY = process.argv.slice(2); // slugs optionnels en argument
const EXEC = "/home/z/.agent-browser/browsers/chrome-155.0.8059.39/chrome";
const OUT = "/tmp/shots";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SCROLL_ALL = async (page) => {
  const getH = () =>
    page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  let total = await getH();
  for (let pass = 0; pass < 3; pass++) {
    const before = total;
    for (let y = 0; y <= total; y += 350) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(420);
    }
    await sleep(2000);
    total = await getH();
    if (total <= before * 1.06) break;
  }
  return total;
};

const WAIT_IMAGES = (page) =>
  page
    .evaluate(
      () =>
        Promise.race([
          Promise.all(
            [...document.images]
              .filter((im) => !im.complete)
              .map((im) =>
                Promise.race([
                  new Promise((r) => {
                    im.addEventListener("load", r, { once: true });
                    im.addEventListener("error", r, { once: true });
                  }),
                  sleep(8000),
                ])
              )
          ),
          sleep(15000),
        ])
    )
    .catch(() => {});

const DISMISS = (page) =>
  page
    .evaluate(() => {
      const CLICKS = [
        '[role="dialog"] [aria-label*="lose" i]',
        '[class*="modal"] [class*="close" i]',
        '[class*="popup"] [class*="close" i]',
        '[aria-label="Close"]',
        '[aria-label="Fermer"]',
      ];
      for (const sel of CLICKS) {
        for (const b of document.querySelectorAll(sel)) {
          try {
            b.click();
          } catch {}
        }
      }
      const HIDE = [
        '[role="dialog"]',
        '[class*="modal" i]',
        '[class*="popup" i]',
        '[class*="lightbox" i]',
        '[class*="whatsapp" i]',
        '[id*="whatsapp" i]',
        '[class*="cookie-banner" i]',
        '[class*="consent" i]',
        '[id*="cookie"]',
        '[class*="floating-btn" i]',
        '[class*="scroll-top" i]',
        '[class*="back-to-top" i]',
        '[class*="newsletter-popup" i]',
      ].join(",");
      let n = 0;
      for (const el of document.querySelectorAll(HIDE)) {
        try {
          el.style.setProperty("display", "none", "important");
          n++;
        } catch {}
      }
      /* Règles génériques sur les éléments position:fixed :
         1. overlay couvrant > 55 % du viewport (modale) → masqué
         2. petit bouton flottant d'angle (chat, WhatsApp, retour haut) → masqué */
      const vw = innerWidth, vh = innerHeight;
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.position !== "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        const covers = r.width > vw * 0.55 && r.height > vh * 0.55;
        const corner = r.width < 160 && r.height < 160 && (cs.zIndex === "auto" || Number(cs.zIndex) >= 20);
        if (covers || corner) {
          try {
            el.style.setProperty("display", "none", "important");
            n++;
          } catch {}
        }
      }
      return n;
    })
    .catch(() => -1);

const PURGE = (page) =>
  page
    .evaluate(() => {
      let n = 0;
      for (const el of document.querySelectorAll("*")) {
        const st = el.getAttribute("style") || "";
        if (!/opacity\s*:\s*0(?!\.)/.test(st)) continue;
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.position === "sticky") continue;
        el.style.opacity = "1";
        if (/translate/.test(st)) el.style.transform = "none";
        n++;
      }
      return n;
    })
    .catch(() => -1);

const run = async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("cookieconsent", "dismissed");
      localStorage.setItem("cookiesAccepted", "true");
    } catch {}
  });
  const targets = ONLY.length ? SITES.filter(([s]) => ONLY.includes(s)) : SITES;
  for (const [slug, url] of targets) {
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
      await DISMISS(page);
      const h = await SCROLL_ALL(page);
      await WAIT_IMAGES(page);
      await sleep(1200);
      const purged = await PURGE(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(400);
      await DISMISS(page);
      await sleep(500);
      await page.screenshot({ path: `${OUT}/${slug}.png`, fullPage: true, type: "png" });
      console.log(`✓ ${slug} height=${h} purged=${purged}`);
    } catch (e) {
      console.log(`✗ ${slug}: ${e.message?.slice(0, 140)}`);
    } finally {
      await page.close().catch(() => {});
    }
  }
  await browser.close();
};

run();
