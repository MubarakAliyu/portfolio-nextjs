// Intro: the row under the hero name. A divider draws in, the intro paragraph
// reveals word by word (with the highlight in red), and the two buttons fade up.
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";
import SplitWords from "@/components/ui/SplitWords";
import Button from "@/components/ui/Button";
import styles from "@/styles/Intro.module.css";

export default function Intro({ play }) {
  const segments = [
    { text: site.intro.before },
    { text: site.intro.highlight, className: "accent" },
    { text: site.intro.after },
  ];

  return (
    <div className={styles.intro}>
      <motion.span
        className={styles.rule}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: play ? 1 : 0 }}
        transition={{ duration: 1.2, ease, delay: 0.5 }}
        aria-hidden="true"
      />
      <SplitWords className={styles.lead} segments={segments} play={play} delay={0.6} each={0.018} />
      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 24 }}
        animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease, delay: 1.1 }}
      >
        <Button variant="solid" href={site.cv} download="Aliyu-Mubarak-CV.pdf" arrow>
          Download CV
        </Button>
        <Button variant="outline" href="/about">
          About me
        </Button>
      </motion.div>
    </div>
  );
}
