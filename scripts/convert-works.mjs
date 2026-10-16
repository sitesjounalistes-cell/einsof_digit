// PNG → JPEG qualité 82, largeur 1100 (déjà la largeur de capture) → public/images/works/
import sharp from "sharp";
import { readdir } from "node:fs/promises";
const shots = "/tmp/shots";
const dest = "public/images/works";
const files = await readdir(shots);
for (const f of files.filter((f) => f.endsWith(".png"))) {
  const slug = f.replace(".png", "");
  await sharp(`${shots}/${f}`).jpeg({ quality: 82, progressive: true }).toFile(`${dest}/${slug}.jpg`);
  console.log(`✓ ${slug}.jpg`);
}
