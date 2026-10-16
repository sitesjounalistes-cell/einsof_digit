/**
 * Vérification E2E du site EINSOF (Playwright direct).
 * 1. /realisations : carrousel coverflow + rotation auto (3 s) + aperçu animé
 * 2. Chatbot : réponse en streaming + navigation temps réel
 */
import { chromium } from "playwright-core";

const EXEC = "/home/z/.agent-browser/browsers/chrome-155.0.8059.39/chrome";
const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // consentement RGPD pré-décidé : le bandeau ne gêne pas les clics
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("eins-consent", JSON.stringify({ analytics: true, chatStorage: true }));
    } catch {}
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 120)}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 120)}`);
  });

  /* ── 1. Réalisations ── */
  await page.goto(`${BASE}/realisations`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4500);

  const carousel = page.locator('[aria-roledescription="carrousel"]');
  const cardCount = await carousel.locator("article").count();
  const counter1 = await page.locator("text=/\\/ 0\\d/").first().textContent().catch(() => null);

  // Capture initiale (carte 1)
  await page.screenshot({ path: "/tmp/shots/verif-works-1.png" });

  // Attendre ~3,5 s → rotation automatique vers la carte 2
  await page.mouse.move(10, 10); // curseur hors du carrousel
  await page.waitForTimeout(3800);
  const counter2 = await page.locator("text=/\\/ 0\\d/").first().textContent().catch(() => null);
  await page.screenshot({ path: "/tmp/shots/verif-works-2.png" });

  // Aperçu animé au survol : hover la fenêtre navigateur de la carte active
  const win = carousel.locator("article .work-window").nth(1);
  await win.hover().catch(() => {});
  await page.waitForTimeout(1200);
  const anim = await win.evaluate((el) => {
    const img = el.querySelector("img");
    return img ? getComputedStyle(img).animationName + " / " + getComputedStyle(img).transform.slice(0, 40) : "no-img";
  }).catch(() => "eval-fail");
  await page.screenshot({ path: "/tmp/shots/verif-works-hover.png" });

  console.log(JSON.stringify({
    works: { cardCount, counter1, counter2, rotated: counter1 !== counter2, hoverAnim: anim },
  }));

  /* ── 2. Chatbot ── */
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  // Ouvrir le chat (bouton flottant en bas à droite)
  await page.locator('button[aria-label*="onseil"], button[aria-label*="hat"]').last().click().catch(async () => {
    await page.locator(".fixed.bottom-5.right-5 button").first().click();
  });
  await page.waitForTimeout(800);
  const input = page.locator('input[placeholder*="essage"], input[aria-label]').last();
  await input.fill("Vous avez des exemples de sites réalisés ?");
  await input.press("Enter");
  // attendre la réponse
  await page.waitForTimeout(9000);
  const chatText = await page.locator('[role="dialog"] p, [role="dialog"] span').allTextContents().catch(() => []);
  const chatJoined = chatText.join(" ").slice(0, 400);
  await page.screenshot({ path: "/tmp/shots/verif-chat.png" });
  // L'URL a-t-elle changé (navigation temps réel) ?
  await page.waitForTimeout(3000);
  const url = page.url();
  console.log(JSON.stringify({ chat: { reply: chatJoined, urlAfter: url } }));

  console.log("ERRORS:", JSON.stringify(errors.slice(0, 6)));
  await browser.close();
};

run();
