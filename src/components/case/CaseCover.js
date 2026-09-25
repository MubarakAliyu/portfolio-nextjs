// CaseCover: the full-bleed cover. It wipes in on load, then drifts at 0.85×
// scroll speed while easing from scale 1.15 to 1 inside its frame.
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import { blurProps } from "@/lib/media";
import useReducedMotion from "@/hooks/useReducedMotion";
import styles from "@/styles/CaseCover.module.css";

export default function CaseCover({ project }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7.5%", "7.5%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const cover = project.media.cover;
  const locked = project.status === "confidential";

  return (
    <motion.figure
      ref={ref}
      className={clsx(styles.frame, locked && styles.locked)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 1.3, ease, delay: 0.35 }}
    >
      <motion.div className={styles.inner} style={reduced ? undefined : { y, scale }}>
        <Image
          src={cover.src}
          alt={locked ? `${project.title} (confidential)` : `${project.title} cover`}
          fill
          preload
          sizes="100vw"
          className={styles.img}
          style={{ backgroundColor: project.accent }}
          {...blurProps(cover)}
        />
      </motion.div>
    </motion.figure>
  );
}
