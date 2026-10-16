import { chromium } from "playwright-core";
const EXEC = "/home/z/.agent-browser/browsers/chrome-155.0.8059.39/chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: EXEC, headless: true, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => {
  try { localStorage.setItem("eins-consent", JSON.stringify({ analytics: true, chatStorage: true })); } catch {}
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 100)));
await page.goto("http://localhost:3000/realisations", { waitUntil: "domcontentloaded", timeout: 60000 });
await sleep(3500);
await page.locator("#section-works").scrollIntoViewIfNeeded().catch(() => {});
await sleep(1200);
await page.screenshot({ path: "/tmp/shots/works-mobile.png" });
// footer sticky check : bas de page
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await sleep(900);
const footer = await page.evaluate(() => {
  const f = document.querySelector("footer");
  if (!f) return "no-footer";
  const r = f.getBoundingClientRect();
  return { bottom: Math.round(r.bottom), vh: innerHeight, ok: r.bottom <= innerHeight + 2 };
});
console.log(JSON.stringify({ footer, errors }));
await browser.close();
