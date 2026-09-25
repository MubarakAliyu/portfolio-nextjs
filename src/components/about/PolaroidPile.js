// PolaroidPile: "Life lately" as a pile of polaroids. Drag and throw them
// around (they tilt with the throw and land with a soft tock), tap one to open
// it in the lightbox, Shuffle to scatter them again or Tidy up to line them
// up. On phones it's a deck: swipe the top card to send it to the back.
// The stage only mounts once it's close to the viewport.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import clsx from "clsx";
import { polaroids } from "@/data/about";
import { blurProps, photo, seeded } from "@/lib/media";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import { useSound } from "@/lib/sound/SoundProvider";
import useMediaQuery from "@/hooks/useMediaQuery";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "@/styles/PolaroidPile.module.css";

const CARD_W = 200;
const CARD_H = 304; // photo (4:5) + mat + caption strip
const GAP = 24;

function layoutFor(mode, { w, h }, count) {
  if (mode.kind === "tidy") {
    const cols = Math.max(1, Math.floor((w + GAP) / (CARD_W + GAP)));
    const rows = Math.ceil(count / cols);
    const offsetX = (w - (cols * CARD_W + (cols - 1) * GAP)) / 2;
    const offsetY = Math.max(0, (h - (rows * CARD_H + (rows - 1) * GAP)) / 2);
    return Array.from({ length: count }, (_, i) => ({
      x: offsetX + (i % cols) * (CARD_W + GAP),
      y: offsetY + Math.floor(i / cols) * (CARD_H + GAP),
      r: 0,
    }));
  }
  const s = mode.seed * 97;
  return Array.from({ length: count }, (_, i) => ({
    x: seeded(s + i * 3 + 1) * Math.max(0, w - CARD_W),
    y: seeded(s + i * 3 + 2) * Math.max(0, h - CARD_H),
    r: seeded(s + i * 3 + 3) * 20 - 10,
  }));
}

function Polaroid({ item, index, target, stage, onFront, onOpen }) {
  const { play } = useSound();
  const x = useMotionValue(target.x);
  const y = useMotionValue(target.y);
  const base = useMotionValue(target.r);
  const tilt = useTransform(useVelocity(x), (v) => Math.max(-15, Math.min(15, v / 60)));
  const rotate = useSpring(useTransform([base, tilt], ([b, t]) => b + t), { stiffness: 260, damping: 24 });
  const [z, setZ] = useState(index);
  const dragged = useRef(false);

  // Glide to a new spot whenever the layout changes (shuffle / tidy / resize).
  useEffect(() => {
    const spring = { type: "spring", stiffness: 110, damping: 16, delay: index * 0.035 };
    const runs = [animate(x, target.x, spring), animate(y, target.y, spring), animate(base, target.r, spring)];
    return () => runs.forEach((run) => run.stop());
  }, [target.x, target.y, target.r, index, x, y, base]);

  return (
    <motion.button
      type="button"
      className={styles.polaroid}
      style={{ x, y, rotate, zIndex: z }}
      drag
      dragConstraints={stage}
      dragElastic={0.2}
      dragMomentum
      onPointerDown={() => {
        dragged.current = false;
      }}
      onDragStart={() => {
        dragged.current = true;
        setZ(onFront());
      }}
      onDragEnd={() => play("drop")}
      onClick={() => {
        if (!dragged.current) onOpen();
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      aria-label={`${item.caption}. Drag to move, or open the photo`}
      data-cursor="label"
      data-cursor-label="Drag"
      data-sound="none"
    >
      {seeded(index + 11) > 0.55 && <span className={styles.tape} aria-hidden="true" />}
      <span className={styles.frame}>
        <Image src={item.src} alt={item.alt} fill sizes="200px" className={styles.img} draggable={false} {...blurProps(item)} />
      </span>
      <span className={styles.caption}>{item.caption}</span>
    </motion.button>
  );
}

function Pile({ items, onOpen }) {
  const stage = useRef(null);
  const zTop = useRef(items.length);
  const { play } = useSound();
  const [size, setSize] = useState({ w: 1200, h: 700 });
  const [mode, setMode] = useState({ kind: "scatter", seed: 1 });
  const layout = layoutFor(mode, size, items.length);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.pill}
          onClick={() => {
            setMode((m) => ({ kind: "scatter", seed: (m.seed ?? 1) + 1 }));
            play("shuffle");
          }}
          data-sound="none"
          data-sound-hover="hover"
        >
          Shuffle
        </button>
        <button type="button" className={styles.pill} onClick={() => setMode((m) => ({ kind: "tidy", seed: m.seed }))} data-sound="pop">
          Tidy up
        </button>
      </div>
      <div ref={stage} className={styles.stage}>
        {items.map((item, i) => (
          <Polaroid
            key={item.src + i}
            item={item}
            index={i}
            target={layout[i]}
            stage={stage}
            onFront={() => ++zTop.current}
            onOpen={() => onOpen(i)}
          />
        ))}
      </div>
    </>
  );
}

function DeckCard({ item, depth, isTop, onThrow, onOpen }) {
  const { play } = useSound();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const dragged = useRef(false);

  const onDragEnd = async (_, info) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) {
      const dir = Math.sign(info.offset.x || info.velocity.x) || 1;
      play("drop");
      await animate(x, dir * 480, { duration: 0.25 });
      onThrow();
      x.set(0);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  return (
    <motion.button
      type="button"
      className={clsx(styles.polaroid, styles.deckCard)}
      style={{ x, rotate: isTop ? rotate : seeded(depth + 5) * 8 - 4, zIndex: 10 - depth }}
      animate={{ scale: 1 - depth * 0.04, y: depth * 12 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      drag={isTop ? "x" : false}
      onPointerDown={() => {
        dragged.current = false;
      }}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={onDragEnd}
      onClick={() => isTop && !dragged.current && onOpen()}
      tabIndex={isTop ? 0 : -1}
      aria-label={isTop ? `${item.caption}. Swipe for the next photo, or tap to open` : undefined}
      aria-hidden={isTop ? undefined : "true"}
      data-sound="none"
    >
      <span className={styles.frame}>
        <Image src={item.src} alt={item.alt} fill sizes="70vw" className={styles.img} draggable={false} {...blurProps(item)} />
      </span>
      <span className={styles.caption}>{item.caption}</span>
    </motion.button>
  );
}

function Deck({ items, onOpen }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const visible = order.slice(0, 4);

  return (
    <div className={styles.deck}>
      {[...visible].reverse().map((idx) => {
        const depth = visible.indexOf(idx);
        return (
          <DeckCard
            key={idx}
            item={items[idx]}
            depth={depth}
            isTop={depth === 0}
            onThrow={() => setOrder((o) => [...o.slice(1), o[0]])}
            onOpen={() => onOpen(idx)}
          />
        );
      })}
    </div>
  );
}

export default function PolaroidPile() {
  const wrap = useRef(null);
  const near = useInView(wrap, { once: true, margin: "400px 0px" });
  const isPhone = useMediaQuery("(max-width: 767px)");
  const openLightbox = useLightbox();
  const items = polaroids.map((p) => photo(p.src, { alt: p.caption, caption: p.caption }));
  const open = (index) => openLightbox({ items, index });

  return (
    <section ref={wrap} className={`container ${styles.section}`}>
      <div className={styles.head}>
        <SectionTitle>Life lately</SectionTitle>
        <p className={styles.note}>
          {isPhone ? "Swipe through them. Tap one to take a closer look." : "Drag them around. Tap one to take a closer look."}
        </p>
      </div>
      {!near ? <div className={styles.placeholder} /> : isPhone ? <Deck items={items} onOpen={open} /> : <Pile items={items} onOpen={open} />}
    </section>
  );
}
