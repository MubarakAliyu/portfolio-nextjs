// AboutHero: "DESIGNER. / ENGINEER. / TEACHER." sliding up line by line, a
// smaller draggable pinned portrait with the Sokoto local time, and a scroll cue.
import { Fragment } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import RevealText from "@/components/ui/RevealText";
import LiveClock from "@/components/ui/LiveClock";
import PinnedPortrait from "@/components/home/PinnedPortrait";
import styles from "@/styles/AboutHero.module.css";

const WORDS = ["Designer", "Engineer", "Teacher"];

export default function AboutHero() {
  const lines = WORDS.map((word) => (
    <Fragment key={word}>
      {word}
      <span className="accent">.</span>
    </Fragment>
  ));

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div>
          <motion.p className={styles.eyebrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
            (About)
          </motion.p>
          <RevealText as="h1" lines={lines} className={styles.title} play each={0.12} delay={0.15} />
        </div>

        <div className={styles.portrait}>
          <PinnedPortrait play delay={0.6} preload={false} sizes="240px" />
          <p className={styles.caption}>
            Sokoto, Nigeria · <LiveClock as="span" className={styles.clock} />
          </p>
        </div>
      </div>

      <motion.div
        className={styles.cue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 1.2 }}
        aria-hidden="true"
      >
        <span className={styles.cueLine} />
        Scroll
      </motion.div>
    </section>
  );
}
