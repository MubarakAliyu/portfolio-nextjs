// Outcome: the result in a sentence, plus count-up metrics when there are real ones.
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";
import CountUp from "@/components/ui/CountUp";
import styles from "@/styles/Outcome.module.css";

export default function Outcome({ outcome }) {
  return (
    <section id="outcome" className={styles.section}>
      <p className={styles.eyebrow}>(Outcome)</p>
      <motion.p className={styles.text} variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
        {outcome.text}
      </motion.p>
      {outcome.metrics?.length > 0 && (
        <dl className={styles.metrics}>
          {outcome.metrics.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>
                {typeof m.value === "number" ? <CountUp value={m.value} /> : m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
