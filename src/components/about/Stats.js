// Stats: four numbers that count up in SkyBoxed, with drawn dividers between them.
import { motion } from "framer-motion";
import { stats } from "@/data/about";
import { ease } from "@/lib/motion";
import CountUp from "@/components/ui/CountUp";
import styles from "@/styles/Stats.module.css";

export default function Stats() {
  return (
    <section className={`container ${styles.section}`} aria-label="In numbers">
      <ul className={styles.list}>
        {stats.map((stat, i) => (
          <li key={stat.label} className={styles.item}>
            <motion.span
              className={styles.rule}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease, delay: i * 0.1 }}
              aria-hidden="true"
            />
            <span className={styles.value}>
              <CountUp value={stat.value} />
              {stat.suffix}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
