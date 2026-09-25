// CountUp: a number that counts up from 0 the first time it scrolls into view.
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import useReducedMotion from "@/hooks/useReducedMotion";

export default function CountUp({ value, pad = 0, duration = 1.4, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => String(Math.round(v)).padStart(pad, "0"));

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      count.set(value);
      return undefined;
    }
    const controls = animate(count, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, value, duration, reduced, count]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
