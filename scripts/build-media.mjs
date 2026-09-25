// build-media.mjs: scans public/images/projects/<slug>/ (cover, gallery/, screens/)
// and public/images/life/, then writes the sizes and tiny blur previews that
// next/image needs to src/data/media.generated.json and life.generated.json.
// Runs automatically before `npm run dev` and `npm run build`.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const PROJECTS = join(PUBLIC, "images", "projects");
const LIFE = join(PUBLIC, "images", "life");
const CACHE_FILE = join(ROOT, "node_modules", ".cache", "build-media.json");
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const images = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => IMAGE.test(f)).sort(byName) : []);
const find = (dir, base) => images(dir).find((f) => f.slice(0, -extname(f).length).toLowerCase() === base);

async function describe(file) {
  const src = "/" + relative(PUBLIC, file).split(sep).join("/");
  const { size, mtimeMs } = statSync(file);
  const key = `${src}:${size}:${mtimeMs}`;
  if (cache[src]?.key === key) return cache[src].value;

  // sharp reads sizes from phone JPEGs with huge EXIF blocks that trip up lighter parsers.
  const dims = await sharp(file).metadata();
  const rotated = dims.orientation >= 5; // EXIF 5–8 means the photo is stored sideways
  const blur = await sharp(file).rotate().resize(16).webp({ quality: 50 }).toBuffer();
  const value = {
    src,
    width: rotated ? dims.height : dims.width,
    height: rotated ? dims.width : dims.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  cache[src] = { key, value };
  return value;
}

async function project(slug) {
  const dir = join(PROJECTS, slug);
  const entry = {};
  const cover = find(dir, "cover");
  if (cover) entry.cover = await describe(join(dir, cover));

  const gallery = [];
  for (const f of images(join(dir, "gallery"))) gallery.push(await describe(join(dir, "gallery", f)));
  if (gallery.length) entry.gallery = gallery;

  const screens = {};
  for (const name of ["desktop", "mobile"]) {
    const f = find(join(dir, "screens"), name);
    if (f) screens[name] = await describe(join(dir, "screens", f));
  }
  if (Object.keys(screens).length) entry.screens = screens;
  return entry;
}

const media = {};
for (const slug of readdirSync(PROJECTS).sort(byName)) {
  if (!statSync(join(PROJECTS, slug)).isDirectory()) continue;
  const entry = await project(slug);
  if (Object.keys(entry).length) media[slug] = entry;
}

const life = {};
for (const f of images(LIFE)) {
  const item = await describe(join(LIFE, f));
  life[item.src] = item;
}

writeFileSync(join(ROOT, "src", "data", "media.generated.json"), JSON.stringify(media, null, 2) + "\n");
writeFileSync(join(ROOT, "src", "data", "life.generated.json"), JSON.stringify(life, null, 2) + "\n");
mkdirSync(dirname(CACHE_FILE), { recursive: true });
writeFileSync(CACHE_FILE, JSON.stringify(cache));

const count = Object.values(media).reduce((n, m) => n + (m.cover ? 1 : 0) + (m.gallery?.length ?? 0) + Object.keys(m.screens ?? {}).length, 0);
console.log(`build-media: ${count} project images across ${Object.keys(media).length} projects, ${Object.keys(life).length} life photos`);
