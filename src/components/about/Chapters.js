// Chapters: the scrolly life story. The section pins while vertical scroll
// slides a row of full-screen chapters sideways. Each chapter has a huge
// outlined year drifting at half speed, a title, a short line, and photos
// moving at their own speeds (click one to open the lightbox). On phones and
// with reduced motion the chapters simply stack.
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import clsx from "clsx";
import { chapters } from "@/data/about";
import { ease } from "@/lib/motion";
import { blurProps, photo, seeded } from "@/lib/media";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import useMediaQuery from "@/hooks/useMediaQuery";
import useReducedMotion from "@/hooks/useReducedMotion";
import styles from "@/styles/Chapters.module.css";

// Photo heights (vh), positions within the panel and parallax speeds.
const SHOTS = [
  { h: 34, left: 50, top: 10, drift: 18 },
  { h: 46, left: 66, top: 34, drift: -16 },
  { h: 26, left: 44, top: 60, drift: 10 },
];

const pad = (n) => String(n).padStart(2, "0");

function Photo({ item, shot, index, local, onOpen, stacked }) {
  const drift = useTransform(local, (v) => `${v * shot.drift}vw`);
  const rotate = seeded(index * 7 + 3) * 8 - 4;
  const width = (shot.h * item.width) / item.height;
  return (
    <motion.button
      type="button"
      className={styles.photo}
      style={
        stacked
          ? { rotate }
          : { left: `${shot.left}%`, top: `${shot.top}%`, height: `${shot.h}vh`, width: `${width}vh`, rotate, x: drift }
      }
      onClick={onOpen}
      aria-label={`Open photo: ${item.alt}`}
      data-cursor="label"
      data-cursor-label="View"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease, delay: (index % 3) * 0.12 }}
    >
      <Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 45vw, 30vw" className={styles.img} {...blurProps(item)} />
    </motion.button>
  );
}

function Panel({ chapter, index, pos, photos, firstPhoto, onOpen, stacked }) {
  const local = useTransform(pos, (v) => v - index);
  const yearX = useTransform(local, (v) => `${v * 50}vw`); // the year moves at half speed

  return (
    <article className={clsx(styles.panel, stacked && styles.stackedPanel)}>
      <motion.span className={styles.year} style={stacked ? undefined : { x: yearX }} aria-hidden="true">
        {chapter.year}
      </motion.span>
      <div className={styles.copy}>
        <p className={styles.num}>
          {pad(index + 1)} / {pad(chapters.length)}
        </p>
        <h3 className={styles.title}>
          {chapter.title}
          <span className="accent">.</span>
        </h3>
        <p className={styles.text}>{chapter.text}</p>
      </div>
      <div className={styles.photos}>
        {photos.map((item, k) => (
          <Photo
            key={item.src}
            item={item}
            shot={SHOTS[k % SHOTS.length]}
            index={index * 3 + k}
            local={local}
            stacked={stacked}
            onOpen={() => onOpen(firstPhoto + k)}
          />
        ))}
      </div>
    </article>
  );
}

export default function Chapters() {
  const ref = useRef(null);
  const openLightbox = useLightbox();
  const isPhone = useMediaQuery("(max-width: 767px)");
  const reduced = useReducedMotion();
  const stacked = isPhone || reduced;
  const n = chapters.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35 });
  const pos = useTransform(smooth, (v) => v * (n - 1));
  const x = useTransform(pos, (v) => `${-v * 100}vw`);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(pos, "change", (v) => setCurrent(Math.min(n - 1, Math.max(0, Math.round(v)))));

  const all = chapters.flatMap((c) =>
    c.photos.map((src, k) => photo(src, { alt: `${c.title}, photo ${k + 1}`, caption: `${c.title} · ${c.year}` }))
  );
  const open = (index) => openLightbox({ items: all, index });
  const firsts = chapters.map((_, i) => chapters.slice(0, i).reduce((sum, c) => sum + c.photos.length, 0));
  const panels = chapters.map((chapter, i) => (
    <Panel
      key={chapter.title}
      chapter={chapter}
      index={i}
      pos={pos}
      photos={all.slice(firsts[i], firsts[i] + chapter.photos.length)}
      firstPhoto={firsts[i]}
      onOpen={open}
      stacked={stacked}
    />
  ));

  if (stacked) {
    return (
      <section ref={ref} className={styles.stacked} aria-label="Chapters">
        <h2 className={styles.heading}>
          Chapters<span className="accent">.</span>
        </h2>
        {panels}
      </section>
    );
  }

  return (
    <section ref={ref} className={styles.pinned} style={{ height: `${n * 100}vh` }} aria-label="Chapters">
      <div className={styles.stage}>
        <motion.div className={styles.track} style={{ x, width: `${n * 100}vw` }}>
          {panels}
        </motion.div>

        <div className={styles.rail}>
          <span className={styles.count}>
            {pad(current + 1)} / {pad(n)}
          </span>
          <div className={styles.bar}>
            <motion.span style={{ scaleX: smooth }} />
          </div>
          <ol className={styles.ticks}>
            {chapters.map((c, i) => (
              <li key={c.title} className={clsx(i === current && styles.tickActive)}>
                {c.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
