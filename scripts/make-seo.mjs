// make-seo.mjs: writes public/robots.txt, public/sitemap.xml (every page and
// project slug) and public/og.png (1200×630: dark background, "ALIYU MUBARAK"
// in SkyBoxed with a red ®). The image is rendered in headless Edge/Chrome so
// it uses the real font, then compressed with sharp.
// Usage: npm run seo   (re-run after adding projects or changing site.url)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const siteUrl = (read("src/data/site.js").match(/\burl:\s*"([^"]+)"/)?.[1] ?? "https://example.com").replace(/\/$/, "");
const slugs = [...read("src/data/projects.js").matchAll(/\bslug:\s*"([^"]+)"/g)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);

// robots.txt
writeFileSync(join(PUBLIC, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

// sitemap.xml
const pages = ["", "/projects", "/about", "/contact", ...slugs.map((s) => `/projects/${s}`)];
const urls = pages
  .map((p) => `  <url>\n    <loc>${siteUrl}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p === "" ? "1.0" : p.startsWith("/projects/") ? "0.7" : "0.8"}</priority>\n  </url>`)
  .join("\n");
writeFileSync(
  join(PUBLIC, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

// og.png
const font = readFileSync(join(ROOT, "src/fonts/SkyBoxed-Display.woff2")).toString("base64");
const html = `<!doctype html><html><head><style>
@font-face { font-family: SkyBoxed; src: url(data:font/woff2;base64,${font}) format("woff2"); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0B0B0C; color: #F1EEE8; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; position: relative; overflow: hidden; }
.grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(12, 1fr); }
.grid i { border-right: 1px solid rgba(241,238,232,.06); }
.wrap { position: absolute; left: 72px; right: 72px; bottom: 64px; }
h1 { font-family: SkyBoxed; font-weight: 400; font-size: 150px; line-height: .92; letter-spacing: .01em; }
sup { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-weight: 700; font-size: 30px; color: #D73E2D; vertical-align: super; margin-left: 6px; }
p { margin-top: 28px; padding-top: 22px; border-top: 1px solid rgba(241,238,232,.13); font-size: 26px; color: #9C978D; display: flex; justify-content: space-between; }
.top { position: absolute; left: 72px; right: 72px; top: 48px; display: flex; justify-content: space-between; font-size: 20px; color: #9C978D; }
.sq { display: inline-block; width: 18px; height: 18px; background: #D73E2D; }
</style></head><body>
<div class="grid">${"<i></i>".repeat(12)}</div>
<div class="top"><span>Product Designer &amp; Engineer</span><span class="sq"></span></div>
<div class="wrap"><h1>ALIYU<br/>MUBARAK<sup>®</sup></h1><p><span>Sokoto, Nigeria</span><span>Portfolio</span></p></div>
</body></html>`;

let browser;
for (const channel of ["msedge", "chrome", undefined]) {
  try {
    browser = await chromium.launch({ channel, headless: true });
    break;
  } catch {
    // try the next browser
  }
}
if (!browser) throw new Error("No browser found for rendering og.png");
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();
await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(join(PUBLIC, "og.png"));

console.log(`make-seo: robots.txt, sitemap.xml (${pages.length} urls) and og.png written for ${siteUrl}`);
