// capture-sites.mjs: screenshots every project that has `links.live` in
// src/data/projects.js and saves them into public/images/projects/<slug>/:
//   screens/desktop.jpg  full page at 1440px wide (height capped at 7000px)
//   screens/mobile.jpg   full page at 390px wide (iPhone user agent)
//   gallery/00-live.jpg  a 1440x900 first-screen crop, only if the gallery is empty
// Usage: npm run capture            (every project with a live link)
//        npm run capture -- zariya  (just the slugs you name)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECTS_DIR = join(ROOT, "public", "images", "projects");
const MAX_HEIGHT = 7000;
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

// Read slugs + live links straight from the data file (it imports JSON, so we
// don't load it as a module here).
function liveProjects() {
  const source = readFileSync(join(ROOT, "src", "data", "projects.js"), "utf8");
  return source
    .split(/\bslug:\s*"/)
    .slice(1)
    .map((chunk) => ({ slug: chunk.slice(0, chunk.indexOf('"')), live: chunk.match(/\blinks:\s*\{[^}]*\blive:\s*"([^"]+)"/)?.[1] }))
    .filter((p) => p.live);
}

async function launch() {
  for (const channel of ["msedge", "chrome", undefined]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // try the next browser
    }
  }
  throw new Error("No browser found. Install Edge or Chrome, or run `npx playwright install chromium`.");
}

async function settle(page) {
  // Scroll through once so lazy images and scroll-triggered reveals load.
  // Some sites redirect right after loading, so retry if the page navigates away.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.waitForLoadState("load");
      await page.evaluate(async () => {
        const step = Math.max(400, window.innerHeight * 0.8);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 150));
        }
        window.scrollTo(0, 0);
      });
      break;
    } catch (error) {
      if (!/context was destroyed|navigat/i.test(error.message)) throw error;
      await page.waitForTimeout(1500);
    }
  }
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
}

async function shoot(browser, url, context) {
  const ctx = await browser.newContext(context);
  const page = await ctx.newPage();
  try {
    // goto throws on network errors (so we never save the browser's error page).
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    await settle(page);
    const full = await page.screenshot({ fullPage: true, type: "png" });
    const top = await page.screenshot({ type: "png" });
    return { full, top, width: context.viewport.width * (context.deviceScaleFactor ?? 1) };
  } finally {
    await ctx.close();
  }
}

// Crops to the viewport width (some pages overflow sideways) and caps the height.
async function saveCapped({ full, width: viewportWidth }, file) {
  const { width, height } = await sharp(full).metadata();
  await sharp(full)
    .extract({ left: 0, top: 0, width: Math.min(width, viewportWidth), height: Math.min(height, MAX_HEIGHT) })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(file);
}

const only = process.argv.slice(2);
const targets = liveProjects().filter((p) => !only.length || only.includes(p.slug));
if (!targets.length) {
  console.log(`capture: no projects with a live link${only.length ? ` matching ${only.join(", ")}` : ""}.`);
  process.exit(0);
}

const browser = await launch();
for (const { slug, live } of targets) {
  const dir = join(PROJECTS_DIR, slug);
  mkdirSync(join(dir, "screens"), { recursive: true });
  mkdirSync(join(dir, "gallery"), { recursive: true });
  try {
    console.log(`capture: ${slug} (${live})`);
    const desktop = await shoot(browser, live, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await saveCapped(desktop, join(dir, "screens", "desktop.jpg"));

    const mobile = await shoot(browser, live, {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: IPHONE_UA,
    });
    await saveCapped(mobile, join(dir, "screens", "mobile.jpg"));

    const galleryHasImages = existsSync(join(dir, "gallery")) && readdirSync(join(dir, "gallery")).some((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
    if (!galleryHasImages) await sharp(desktop.top).jpeg({ quality: 82, mozjpeg: true }).toFile(join(dir, "gallery", "00-live.jpg"));
    console.log(`capture: ${slug} done`);
  } catch (error) {
    console.log(`capture: ${slug} failed (${error.message.split("\n")[0]}); skipping`);
  }
}
await browser.close();

// Refresh sizes + blur previews so the new screenshots show up.
execFileSync(process.execPath, [join(ROOT, "scripts", "build-media.mjs")], { stdio: "inherit" });
