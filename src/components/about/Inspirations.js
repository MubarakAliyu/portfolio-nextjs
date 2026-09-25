// Inspirations: a rotating quote (every 6s, paused on hover) above a list of
// people, books, places and ideas. Hovering a row turns it red, draws the
// underline and floats a photo beside the cursor that tilts as you move.
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useSpring, useTransform, useVelocity } from "framer-motion";
import { inspirations, quotes } from "@/data/about";
import { blurProps, photo } from "@/lib/media";
import useIsTouch from "@/hooks/useIsTouch";
import SectionTitle from "@/components/ui/SectionTitle";
import SplitWords from "@/components/ui/SplitWords";
import styles from "@/styles/Inspirations.module.css";

const GROUPS = ["People", "Books", "Places", "Ideas"];

function QuoteRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const quote = quotes[index];
  return (
    <figure className={styles.quote} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.div key={index} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
          <SplitWords as="blockquote" text={`“${quote.text}”`} className={styles.quoteText} play each={0.03} />
          <motion.figcaption initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            — {quote.by}
          </motion.figcaption>
        </motion.div>
      </AnimatePresence>
    </figure>
  );
}

function FloatingPhoto({ item }) {
  const x = useSpring(0, { stiffness: 200, damping: 24 });
  const y = useSpring(0, { stiffness: 200, damping: 24 });
  const rotate = useSpring(useTransform(useVelocity(x), (v) => Math.max(-12, Math.min(12, v / 80))), { stiffness: 200, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className={styles.float}
      style={{ x, y, rotate }}
      initial={false}
      animate={{ opacity: item ? 1 : 0, scale: item ? 1 : 0.85 }}
      transition={{ duration: 0.35 }}
      aria-hidden="true"
    >
      <AnimatePresence initial={false}>
        {item && (
          <motion.div key={item.src} className={styles.floatImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Image src={item.src} alt="" fill sizes="260px" {...blurProps(item)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Inspirations() {
  const isTouch = useIsTouch();
  const [hovered, setHovered] = useState(null);

  return (
    <section className={`container ${styles.section}`}>
      <SectionTitle>Inspirations</SectionTitle>
      <QuoteRotator />

      <div className={styles.groups} onMouseLeave={() => setHovered(null)}>
        {GROUPS.map((group) => {
          const items = inspirations.filter((i) => i.category === group);
          if (!items.length) return null;
          return (
            <div key={group} className={styles.group}>
              <h3 className={styles.groupTitle}>{group}</h3>
              <ul>
                {items.map((item) => (
                  <li
                    key={item.name}
                    className={styles.row}
                    onMouseEnter={() => setHovered(photo(item.image))}
                    data-sound-hover="hover"
                  >
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.note}>{item.note}</span>
                    <span className={styles.tag}>{item.category}</span>
                    <span className={styles.underline} aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {!isTouch && <FloatingPhoto item={hovered} />}
    </section>
  );
}
