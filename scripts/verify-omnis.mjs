import { chromium } from "playwright-core";
const EXEC = "/home/z/.agent-browser/browsers/chrome-155.0.8059.39/chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: EXEC, headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => {
  try { localStorage.setItem("eins-consent", JSON.stringify({ analytics: true, chatStorage: true })); } catch {}
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await sleep(3000);
await page.locator(".fixed.bottom-5.right-5 button").first().click();
await sleep(800);
// bouton micro = 3e bouton du header du chat (titre « Omnis mode »/« Mode Omnis »)
const omnisBtn = page.locator('[role="dialog"] button[title*="Omnis"], [role="dialog"] button[aria-label*="Omnis"]');
await omnisBtn.first().click();
await sleep(1600);
const omnisVisible = await page.locator('[aria-label*="Omnis"][role="dialog"], [role="dialog"][aria-label*="Omnis"]').count();
const label = await page.locator('[role="dialog"] >> text=/listening|écoute/i').count();
await page.screenshot({ path: "/tmp/shots/verif-omnis.png" });
console.log(JSON.stringify({ omnisVisible, label, errors }));
await browser.close();
