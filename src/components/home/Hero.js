// Hero: the huge "ALIYU / MUBARAK®" name (each letter slides up from its mask
// once the preloader is done; hovering a letter nudges it up in red), the
// draggable pinned portrait on the right, faint grid lines behind, and the
// intro row underneath.
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";
import { useIntro } from "@/lib/intro";
import GridLines from "@/components/layout/GridLines";
import PinnedPortrait from "./PinnedPortrait";
import Intro from "./Intro";
import styles from "@/styles/Hero.module.css";

const LETTER_STAGGER = 0.035;

function Letters({ word, offset, play }) {
  return [...word].map((char, i) => (
    <span key={i} className={styles.mask}>
      <motion.span
        className={styles.letter}
        initial={{ y: "110%" }}
        animate={{ y: play ? "0%" : "110%" }}
        transition={{ duration: 0.9, ease, delay: (offset + i) * LETTER_STAGGER }}
      >
        <span className={styles.nudge}>{char}</span>
      </motion.span>
    </span>
  ));
}

export default function Hero() {
  const { done } = useIntro();
  const first = site.firstName;
  const last = site.lastName;
  const lettersTime = (first.length + last.length) * LETTER_STAGGER + 0.9;

  return (
    <section className={styles.hero}>
      <GridLines />
      <div className={`container ${styles.inner}`}>
        <div className={styles.mark}>
          <h1 className={styles.name}>
            <span className="sr-only">{site.name}</span>
            <span className={styles.line} aria-hidden="true">
              <Letters word={first} offset={0} play={done} />
            </span>
            <span className={styles.line} aria-hidden="true">
              <Letters word={last} offset={first.length} play={done} />
              <motion.sup
                className={styles.reg}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.6, ease, delay: lettersTime - 0.3 }}
              >
                ®
              </motion.sup>
            </span>
          </h1>

          <div className={styles.portrait}>
            <PinnedPortrait play={done} delay={lettersTime - 0.5} />
          </div>
        </div>

        <Intro play={done} />
      </div>
    </section>
  );
}
