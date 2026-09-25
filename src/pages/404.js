// 404: a giant "404." that drifts with the mouse. Click it and the letters
// fall to the bottom of the screen, bounce, and climb back after two seconds.
// A small tilted portrait you can drag, and a way back home.
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import PinnedPortrait from "@/components/home/PinnedPortrait";
import useIsTouch from "@/hooks/useIsTouch";
import useReducedMotion from "@/hooks/useReducedMotion";
import { useSound } from "@/lib/sound/SoundProvider";
import styles from "@/styles/NotFound.module.css";

const CHARS = ["4", "0", "4", "."];

function FallingLetter({ char, index, fall, accent }) {
  const ref = useRef(null);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const { play } = useSound();

  useEffect(() => {
    if (!fall || !ref.current) return undefined;
    const floor = window.innerHeight - ref.current.getBoundingClientRect().bottom - 24;
    const delay = index * 0.08;
    const spin = (index % 2 ? 1 : -1) * (12 + index * 7);
    const drop = animate(y, [0, floor, floor - 70, floor, floor - 18, floor], {
      duration: 1.1,
      delay,
      times: [0, 0.42, 0.6, 0.76, 0.88, 1],
      ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
    });
    const tilt = animate(rotate, spin, { duration: 1.1, delay, ease: "easeOut" });
    const tock = setTimeout(() => play("drop"), (delay + 0.46) * 1000);
    const back = setTimeout(() => {
      animate(y, 0, { type: "spring", stiffness: 120, damping: 14 });
      animate(rotate, 0, { type: "spring", stiffness: 120, damping: 14 });
    }, 2000 + delay * 1000 + 1100);
    return () => {
      drop.stop();
      tilt.stop();
      clearTimeout(tock);
      clearTimeout(back);
    };
  }, [fall, index, y, rotate, play]);

  return (
    <motion.span ref={ref} className={accent ? `${styles.char} accent` : styles.char} style={{ y, rotate }}>
      {char}
    </motion.span>
  );
}

export default function NotFound() {
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const [falls, setFalls] = useState(0);
  const x = useSpring(0, { stiffness: 80, damping: 18 });
  const y = useSpring(0, { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (isTouch || reduced) return undefined;
    const move = (e) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 40);
      y.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [isTouch, reduced, x, y]);

  return (
    <Layout title="Not found" description="This page wandered off." footerCta={false}>
      <section className={`container ${styles.page}`}>
        <div className={styles.stage}>
          <motion.h1 className={styles.title} style={{ x, y }}>
            <button
              type="button"
              className={styles.drop}
              onClick={() => !reduced && setFalls((n) => n + 1)}
              aria-label="404: page not found. Click to knock the letters over."
              data-cursor="big"
              data-sound="none"
            >
              {CHARS.map((char, i) => (
                <FallingLetter key={`${i}-${falls}`} char={char} index={i} fall={falls > 0} accent={char === "."} />
              ))}
            </button>
          </motion.h1>

          <div className={styles.portrait}>
            <PinnedPortrait play delay={0.3} preload={false} sizes="200px" />
          </div>
        </div>

        <p className={styles.line}>This page wandered off.</p>
        <Button variant="solid" href="/" arrow className={styles.home}>
          Back home
        </Button>
      </section>
    </Layout>
  );
}
