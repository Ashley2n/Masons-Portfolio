// Renders the three reel thumbnails: node docs/thumbnails/render.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const reels = [
  { file: "dance-reel", img: "../feedback-images/image-5.png", pos: "50% 35%", title: "Dance Reel" },
  { file: "acting-reel", img: "../feedback-images/image-7.png", pos: "50% 36%", title: "Acting Reel" },
  { file: "vocal-reel", img: "../feedback-images/image-10.png", pos: "50% 22%", title: "Vocal Reel" },
];
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const r of reels) {
  const url = pathToFileURL(path.join(dir, "template.html")).href +
    `?img=${encodeURIComponent(r.img)}&pos=${encodeURIComponent(r.pos)}&title=${encodeURIComponent(r.title)}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dir, `${r.file}.png`) });
  console.log("wrote", r.file + ".png");
}
await browser.close();
