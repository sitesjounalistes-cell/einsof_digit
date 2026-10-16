/**
 * Détourage des logos clients à fond opaque (fmk224 noir, samoumedia noir,
 * topguinee blanc) : suppression du fond CONNECTÉ AU BORD uniquement
 * (flood fill BFS) — l'intérieur du logo (blancs/noirs internes) est préservé.
 * Usage : bun scripts/fix-logos.ts
 */
import sharp from "sharp";
import { cpSync, mkdirSync } from "fs";

const DIR = "public/logos";
mkdirSync("/tmp/logos-backup", { recursive: true });

async function removeEdgeBg(
  file: string,
  mode: "black" | "white",
  threshold: number,
  out: string
) {
  const src = `${DIR}/${file}`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels; // ch = 4
  const idx = (x: number, y: number) => (y * w + x) * ch;

  const isBg = (x: number, y: number) => {
    const i = idx(x, y);
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (mode === "black") return Math.max(r, g, b) < threshold;
    return Math.min(r, g, b) > 255 - threshold;
  };

  const visited = new Uint8Array(w * h);
  const stack: number[] = [];
  for (let x = 0; x < w; x++) stack.push(x, 0, x, h - 1);
  for (let y = 0; y < h; y++) stack.push(0, y, w - 1, y);

  while (stack.length) {
    const y = stack.pop()!;
    const x = stack.pop()!;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (visited[p]) continue;
    if (!isBg(x, y)) continue;
    visited[p] = 1;
    data[idx(x, y) + 3] = 0;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  // Feather 1 px : les pixels opaques adjacents au transparent gardent un
  // alpha progressif si leur couleur frôle le fond (anti-aliasing doux).
  const out2 = Buffer.from(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      if (out2[i + 3] === 0) continue;
      let touchBg = false;
      if (x > 0 && data[idx(x - 1, y) + 3] === 0) touchBg = true;
      if (!touchBg && x < w - 1 && data[idx(x + 1, y) + 3] === 0) touchBg = true;
      if (!touchBg && y > 0 && data[idx(x, y - 1) + 3] === 0) touchBg = true;
      if (!touchBg && y < h - 1 && data[idx(x, y + 1) + 3] === 0) touchBg = true;
      if (!touchBg) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const bgness = mode === "black" ? Math.max(r, g, b) / threshold : (255 - Math.min(r, g, b)) / threshold;
      if (bgness < 1) out2[i + 3] = Math.round(255 * Math.max(0.15, bgness));
    }
  }

  await sharp(out2, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(`${DIR}/${out}`);
  console.log(`ok  ${file} -> ${out} (${mode}, t=${threshold})`);
}

cpSync(`${DIR}/fmk224.png`, "/tmp/logos-backup/fmk224.png");
cpSync(`${DIR}/samoumedia.jpg`, "/tmp/logos-backup/samoumedia.jpg");
cpSync(`${DIR}/topguinee.png`, "/tmp/logos-backup/topguinee.png");

await removeEdgeBg("fmk224.png", "black", 42, "fmk224.png");
await removeEdgeBg("samoumedia.jpg", "black", 42, "samoumedia.png");
await removeEdgeBg("topguinee.png", "white", 42, "topguinee.png");
console.log("done");
