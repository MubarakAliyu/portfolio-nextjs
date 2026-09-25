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

function Figure({ entry, onOpen, sizes, style, className }) {
  const { item, index } = entry;
  return (
    <motion.button
      type="button"
      className={clsx(styles.figure, className)}
      style={style}
      onClick={() => onOpen(index)}
      aria-label={`Open ${item.alt} in the viewer`}
      data-cursor="label"
      data-cursor-label="View"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease }}
    >
      <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes={sizes} className={styles.img} {...blurProps(item)} />
    </motion.button>
  );
}

function Editorial({ entries, onOpen }) {
  return toRows(entries).map((row, r) => (
    <div key={r} className={clsx(styles.row, styles[row.kind])}>
      {row.slice.map((entry) => (
        <Figure
          key={entry.item.src}
          entry={entry}
          onOpen={onOpen}
          sizes={row.kind === "full" ? "(max-width: 1023px) 100vw, 75vw" : "(max-width: 767px) 100vw, 40vw"}
        />
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
  const widths = entries.map(({ item }) => Math.round((h * item.width) / item.height));
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
          {entries.map((entry) => (
            <Figure key={entry.item.src} entry={entry} onOpen={onOpen} sizes="80vw" className={styles.swipeItem} />
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
