/**
 * Matrice de vérification d'hydratation pour /tarifs (fix radix-_R_…).
 * Profils : desktop, mobile, reduced-motion, CPU lent — 2 passages chacun.
 * Échec si une erreur « hydrated » / « hydration » apparaît dans la console.
 */
import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const profiles = [
  { name: "desktop", vp: { width: 1440, height: 900 } },
  { name: "mobile-390", vp: { width: 390, height: 844 }, ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", touch: true },
  { name: "reduced-motion", vp: { width: 1440, height: 900 }, reducedMotion: "reduce" },
  { name: "mobile-reduced", vp: { width: 390, height: 844 }, reducedMotion: "reduce", touch: true },
];

const exe = process.env.CHROME_PATH;
const browser = await chromium.launch({
  executablePath: exe || undefined,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failures = 0;

for (const p of profiles) {
  for (let pass = 1; pass <= 2; pass++) {
    const ctx = await browser.newContext({
      viewport: p.vp,
      userAgent: p.ua,
      hasTouch: p.touch,
      reducedMotion: p.reducedMotion,
      locale: "fr-FR",
    });
    const errors = [];
    const page = await ctx.newPage();
    page.on("console", (m) => {
      const t = m.text();
      if (m.type() === "error" || /hydrat/i.test(t)) errors.push(t.slice(0, 300));
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 200)}`));
    try {
      await page.goto(`${BASE}/tarifs`, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(4000);
      /* Tabs : cliquer un onglet, rouvrir l'accordéon — vérif interactive */
      const tab = page.locator('[role="tab"]').nth(1);
      if (await tab.count()) {
        await tab.click().catch(() => {});
        await page.waitForTimeout(600);
        await page.locator('[role="tab"]').first().click().catch(() => {});
      }
      const acc = page.locator('[data-slot="accordion-trigger"]').first();
      if (await acc.count()) {
        await acc.click().catch(() => {});
        await page.waitForTimeout(600);
      }
      /* Vérifier que l'id DOM correspond toujours au format stable */
      const id = await page.evaluate(() => document.querySelector('[id$="-content-web"]')?.id ?? "none");
      const hydrationErrors = errors.filter((e) => /hydrat|did not match|MinifiedReact/i.test(e));
      const other = errors.filter((e) => !/hydrat|did not match/i.test(e));
      const status = hydrationErrors.length === 0 ? "OK " : "FAIL";
      if (hydrationErrors.length) failures++;
      console.log(`[${status}] ${p.name} pass${pass} — content-web id=${id} — hydrErrors=${hydrationErrors.length} — other=${other.length}`);
      for (const e of other.slice(0, 3)) console.log(`   · ${e}`);
      for (const e of hydrationErrors.slice(0, 2)) console.log(`   ✗ ${e}`);
    } catch (e) {
      failures++;
      console.log(`[FAIL] ${p.name} pass${pass} — exception: ${String(e).slice(0, 200)}`);
    }
    await ctx.close();
  }
}

await browser.close();
console.log(failures === 0 ? "\nALL HYDRATION CHECKS PASSED" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
