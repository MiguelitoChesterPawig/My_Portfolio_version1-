/* Used with the headless-browser runner: loads cv.html and saves an A4 PDF.
   The photo is shrunk to print resolution first so the PDF stays small. */
import { readFileSync } from "node:fs";

export default async function run(page) {
  await page.waitForFunction(() => document.fonts.status === "loaded");
  const photo = "data:image/png;base64," + readFileSync(new URL("../../public/images/profile.png", import.meta.url)).toString("base64");
  await page.evaluate(async (photo) => {
    const img = document.querySelector(".photo");
    img.src = photo;
    await img.decode();
    const c = document.createElement("canvas");
    const s = 600;
    // crop to a square around the face (same framing as object-position: center 22%)
    const sw = Math.min(img.naturalWidth, img.naturalHeight), sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sw) * 0.22;
    c.width = c.height = s;
    c.getContext("2d").drawImage(img, sx, sy, sw, sw, 0, 0, s, s);
    img.src = c.toDataURL("image/jpeg", 0.9);
    await img.decode();
  }, photo);
  const fonts = await page.evaluate(() => document.fonts.check('12pt "Computer Modern Serif"'));
  await page.pdf({ path: process.env.CV_OUT, format: "A4", printBackground: true, preferCSSPageSize: true });
  return { fontLoaded: fonts, pages: await page.evaluate(() => Math.ceil(document.body.scrollHeight / (297 * 96 / 25.4 - (34 * 96 / 25.4)))) };
}
