// ProcessList: numbered steps 01 → 0N. Hovering (or focusing) a row turns its
// number red and fades its text up; on touch devices every step stays open.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import useIsTouch from "@/hooks/useIsTouch";
import styles from "@/styles/ProcessList.module.css";

export default function ProcessList({ steps }) {
  const isTouch = useIsTouch();
  const [open, setOpen] = useState(0);

  return (
    <section id="process" className={styles.section}>
      <p className={styles.eyebrow}>(Process)</p>
      <ol className={styles.list}>
        {steps.map((step, i) => {
          const shown = isTouch || open === i;
          return (
            <li
              key={step.title}
              className={clsx(styles.row, shown && styles.open)}
              tabIndex={0}
              data-cursor="big"
              data-sound-hover="hover"
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.title}>{step.title}</h3>
                <AnimatePresence initial={false}>
                  {shown && (
                    <motion.p
                      key="text"
                      className={styles.text}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.5, ease }}
                    >
                      {step.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
