// CaseGallery: project images in an editorial rhythm (full width, 2-up, one
// offset right, 2-up, …). Each wipes in as it enters and opens the hanging
// lightbox on click. With more than 8 images, a pinned strip in the middle
// scrolls sideways as you scroll down (a plain swipeable row on phones).
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import { blurProps } from "@/lib/media";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import useMediaQuery from "@/hooks/useMediaQuery";
import useReducedMotion from "@/hooks/useReducedMotion";
import useViewport from "@/hooks/useViewport";
import styles from "@/styles/CaseGallery.module.css";

const PATTERN = ["full", "two", "offset", "two"];
const GAP = 24;

function toRows(entries) {
  const rows = [];
  for (let i = 0, p = 0; i < entries.length; p++) {
    const kind = PATTERN[p % PATTERN.length];
    const slice = entries.slice(i, i + (kind === "two" ? 2 : 1));
    rows.push({ kind: kind === "two" && slice.length === 1 ? "full" : kind, slice });
    i += slice.length;
  }
  return rows;
}

// Starts loading well before the image scrolls into view (native lazy loading
// only fires a few hundred pixels out, which on a slow connection is too late).
function useNearViewport(ref, enabled) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || near) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: "1200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled, near]);
  return near;
}

// The skeleton (aspect-ratio box + shimmer) sits on the button itself, so it is
// visible while the image loads *and* while the reveal is still clipped — the
// slot is never empty page background. Only the image wipes in.
function Figure({ entry, onOpen, sizes, style, className, eager = false, cap = true }) {
  const { item, index } = entry;
  const ref = useRef(null);
  const near = useNearViewport(ref, !eager);
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles.figure, !loaded && styles.loading, className)}
      style={{ "--ar": `${item.width} / ${item.height}`, ...(cap ? { maxWidth: item.width } : null), ...style }}
      onClick={() => onOpen(index)}
      aria-label={`Open ${item.alt} in the viewer`}
      data-cursor="label"
      data-cursor-label="View"
    >
      <motion.span
        className={styles.reveal}
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.1, ease }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes={sizes}
          loading={eager || near ? "eager" : "lazy"}
          // A cached image can finish before hydration attaches onLoad, so the
          // ref catches the already-complete case and clears the skeleton too.
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) setLoaded(true);
          }}
          onLoad={() => setLoaded(true)}
          className={styles.img}
          {...blurProps(item)}
        />
      </motion.span>
    </button>
  );
}

// The container is ~78vw of the viewport: a full row fills it, a 2-up row is
// (78vw - 24px) / 2 ≈ 38vw, and the offset row is 64% of it ≈ 50vw. Asking for
// the row's real width stops the browser fetching a variant that has to be
// upscaled (or a 1920/3840 one it never needs).
const ROW_SIZES = {
  full: "(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 78vw",
  two: "(max-width: 767px) 100vw, 38vw",
  offset: "(max-width: 767px) 100vw, 50vw",
};

function Editorial({ entries, onOpen }) {
  return toRows(entries).map((row, r) => (
    <div key={r} className={clsx(styles.row, styles[row.kind])}>
      {row.slice.map((entry) => (
        <Figure key={entry.item.src} entry={entry} onOpen={onOpen} sizes={ROW_SIZES[row.kind]} eager={entry.index < 2} />
      ))}
    </div>
  ));
}

function PinnedStrip({ entries, onOpen }) {
  const ref = useRef(null);
  const stage = useRef(null);
  const [columnWidth, setColumnWidth] = useState(1000);
  const { height: vh } = useViewport();
  const isPhone = useMediaQuery("(max-width: 767px)");
  const reduced = useReducedMotion();
  const still = isPhone || reduced;

  const h = Math.round(vh * 0.62);
  // Never lay a strip item out wider than its source, or it renders upscaled.
  const widths = entries.map(({ item }) => Math.min(item.width, Math.round((h * item.width) / item.height)));
  const trackWidth = widths.reduce((a, b) => a + b, 0) + GAP * (entries.length - 1);
  const distance = Math.max(0, trackWidth - columnWidth);

  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setColumnWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (still) {
    return (
      <div ref={ref}>
        <div className={styles.swipe} ref={stage}>
          {entries.map((entry, i) => (
            <Figure key={entry.item.src} entry={entry} onOpen={onOpen} sizes="80vw" className={styles.swipeItem} eager={i < 2} cap={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.pinned} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div ref={stage} className={styles.stage}>
        <motion.div className={styles.track} style={{ x, gap: GAP }}>
          {entries.map((entry, i) => (
            <Figure
              key={entry.item.src}
              entry={entry}
              onOpen={onOpen}
              sizes={`${widths[i]}px`}
              className={styles.stripItem}
              style={{ width: widths[i], height: h }}
              eager={i < 2}
              cap={false}
            />
          ))}
        </motion.div>
        <p className={styles.stripHint}>Keep scrolling →</p>
      </div>
    </div>
  );
}

export default function CaseGallery({ project }) {
  const openLightbox = useLightbox();
  const items = project.media.gallery.map((img, i) => ({
    ...img,
    alt: `${project.title}, image ${i + 1}`,
    caption: `${project.title} · ${String(i + 1).padStart(2, "0")} / ${String(project.media.gallery.length).padStart(2, "0")}`,
  }));
  const entries = items.map((item, index) => ({ item, index }));
  const open = (index) => openLightbox({ items, index });

  const pinned = entries.length > 8;
  const head = pinned ? entries.slice(0, 4) : entries;
  const strip = pinned ? entries.slice(4, 10) : [];
  const tail = pinned ? entries.slice(10) : [];

  return (
    <section id="gallery" className={styles.section}>
      <p className={styles.eyebrow}>
        (Gallery) <span>{String(items.length).padStart(2, "0")} images</span>
      </p>
      <Editorial entries={head} onOpen={open} />
      {strip.length > 0 && <PinnedStrip entries={strip} onOpen={open} />}
      {tail.length > 0 && <Editorial entries={tail} onOpen={open} />}
    </section>
  );
}
