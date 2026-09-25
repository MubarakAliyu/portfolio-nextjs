// PinnedPortrait: the halftone portrait in its grey mat with a paperclip.
// Drops in with a spring, sways gently while idle, tilts in 3D toward the
// mouse (desktop), and can be dragged anywhere before it springs back with a wobble.
import { motion, useSpring } from "framer-motion";
import Image from "next/image";
import useIsTouch from "@/hooks/useIsTouch";
import useReducedMotion from "@/hooks/useReducedMotion";
import { useSound } from "@/lib/sound/SoundProvider";
import styles from "@/styles/PinnedPortrait.module.css";

const TILT = 6;
const wobble = { type: "spring", stiffness: 220, damping: 12 };

export default function PinnedPortrait({ play = true, delay = 0, sizes = "(max-width: 767px) 70vw, 320px", preload = true }) {
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const { play: playSound } = useSound();
  const rotateX = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15 });

  const onMouseMove = (e) => {
    if (isTouch || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * TILT * 2);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * TILT * 2);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={styles.drop}
      initial={{ y: -120, rotate: -12, opacity: 0 }}
      animate={play ? { y: 0, rotate: 0, opacity: 1 } : { y: -120, rotate: -12, opacity: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 13, delay: play ? delay : 0, opacity: { duration: 0.3, delay } }}
    >
      <motion.div
        className={styles.drag}
        drag
        dragElastic={0.35}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 220, bounceDamping: 12 }}
        whileDrag={{ scale: 1.05, rotate: 4 }}
        transition={wobble}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onDragStart={onMouseLeave}
        onDragEnd={() => playSound("drop")}
        data-cursor="label"
        data-cursor-label="Drag"
      >
        <motion.div
          className={styles.sway}
          animate={reduced ? { rotate: -2 } : { rotate: [-2, -0.5, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div className={styles.card} style={{ rotateX, rotateY }}>
            <Image
              src="/images/portrait.png"
              alt="Halftone portrait of Aliyu Mubarak, clipped to a grey mat with a paperclip"
              width={1165}
              height={1350}
              sizes={sizes}
              preload={preload}
              draggable={false}
              className={styles.img}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
