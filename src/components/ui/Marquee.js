// Marquee: an endless strip of services. It drifts left on its own, speeds up
// with scroll velocity and flips direction when you scroll back up.
// Hovering eases it to a stop; reduced-motion visitors get a still strip.
import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import clsx from "clsx";
import useReducedMotion from "@/hooks/useReducedMotion";
import styles from "@/styles/Marquee.module.css";

// `seconds` is the time for one full copy of the list to pass (~120px/s here).
export default function Marquee({ items, seconds = 60, className }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const hover = useSpring(1, { stiffness: 120, damping: 20 });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  // One copy of the list is 50% of the track, so this is 50% per `seconds`.
  const baseVelocity = -50 / seconds;

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy * hover.get());
  });

  const copy = (hidden) =>
    items.map((item) => (
      <span key={`${item}-${hidden}`} className={styles.item} aria-hidden={hidden || undefined}>
        {item}
        <i className={styles.dot} />
      </span>
    ));

  return (
    <div
      className={clsx(styles.marquee, className)}
      onMouseEnter={() => hover.set(0)}
      onMouseLeave={() => hover.set(1)}
    >
      <motion.div className={styles.track} style={{ x }}>
        {copy(false)}
        {copy(true)}
      </motion.div>
    </div>
  );
}
