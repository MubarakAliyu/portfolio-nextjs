// ContactHero: "SAY HELLO." reveals letter by letter, then each letter shies
// away from the cursor (pushed up to 14px and tilted up to 6°, springing back).
// Under it: an availability pill and a line that changes with Sokoto's time.
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import useIsTouch from "@/hooks/useIsTouch";
import useReducedMotion from "@/hooks/useReducedMotion";
import useSokotoTime from "@/hooks/useSokotoTime";
import styles from "@/styles/ContactHero.module.css";

const WORDS = ["Say", "hello"];
const RADIUS = 180;
const PUSH = 14;
const TILT = 6;
const spring = { stiffness: 200, damping: 14 };

function Letter({ char, delay, register }) {
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const rotate = useSpring(0, spring);
  const mask = useRef(null);

  useEffect(() => register({ mask, x, y, rotate }), [register, x, y, rotate]);

  return (
    <span ref={mask} className={styles.mask}>
      <motion.span
        className={styles.letter}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, ease, delay }}
      >
        <motion.span className={styles.push} style={{ x, y, rotate }}>
          {char}
        </motion.span>
      </motion.span>
    </span>
  );
}

export default function ContactHero() {
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const time = useSokotoTime();
  const letters = useRef(new Set());
  const [revealed, setRevealed] = useState(false);

  const register = useCallback((entry) => {
    letters.current.add(entry);
    return () => letters.current.delete(entry);
  }, []);

  // After the reveal, let letters move outside their masks.
  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 1400);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (isTouch || reduced) return undefined;
    let pointer = null;
    let frame = 0;
    const update = () => {
      frame = 0;
      letters.current.forEach(({ mask, x, y, rotate }) => {
        if (!mask.current || !pointer) return;
        const r = mask.current.getBoundingClientRect();
        const dx = r.left + r.width / 2 - pointer[0];
        const dy = r.top + r.height / 2 - pointer[1];
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.max(0, 1 - dist / RADIUS);
        x.set((dx / dist) * PUSH * force);
        y.set((dy / dist) * PUSH * force);
        rotate.set(Math.sign(dx) * TILT * force);
      });
    };
    const onMove = (e) => {
      pointer = [e.clientX, e.clientY];
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      pointer = [-9999, -9999];
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [isTouch, reduced]);

  const awake = time && time.hours >= 8 && time.hours < 18;
  const status = time
    ? awake
      ? `It's ${time.label} in Sokoto. I'm probably at my desk.`
      : `It's ${time.label} in Sokoto. I'm probably asleep, but I'll reply first thing.`
    : " ";

  const words = WORDS.map((word, w) => {
    const before = WORDS.slice(0, w).join("").length;
    return [...word].map((char, i) => ({ char, delay: 0.15 + (before + i) * 0.04 }));
  });

  return (
    <section className={`container ${styles.hero}`}>
      <p className={styles.eyebrow}>(Contact)</p>
      <h1 className={clsx(styles.title, revealed && styles.revealed)} aria-label="Say hello.">
        {words.map((letters, w) => (
          <span key={w} className={styles.word} aria-hidden="true">
            {letters.map((l, i) => (
              <Letter key={i} char={l.char} delay={l.delay} register={register} />
            ))}
            {w === words.length - 1 && <span className="accent">.</span>}
          </span>
        ))}
      </h1>

      <motion.div
        className={styles.meta}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.8 }}
      >
        {/* TODO: Mubarak to keep this availability line up to date */}
        <span className={styles.pill}>
          <i className={styles.dot} aria-hidden="true" />
          Available for new projects: Q4 2026
        </span>
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
      </motion.div>
    </section>
  );
}
