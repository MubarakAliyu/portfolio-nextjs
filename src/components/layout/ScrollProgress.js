// ScrollProgress: a 2px red bar across the top that fills as you scroll the
// page. It stays hidden while you're still on the home page's hero.
import { useRouter } from "next/router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import styles from "@/styles/ScrollProgress.module.css";

export default function ScrollProgress() {
  const { pathname } = useRouter();
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const heroOpacity = useTransform(scrollY, (y) => (y > (typeof window === "undefined" ? 900 : window.innerHeight * 0.8) ? 1 : 0));

  return (
    <motion.div
      className={styles.bar}
      style={{ scaleX, opacity: pathname === "/" ? heroOpacity : 1 }}
      aria-hidden="true"
    />
  );
}
