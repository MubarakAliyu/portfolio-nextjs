// NowCards: what Mubarak is building, teaching, learning and listening to right
// now, as four cards with pulsing dots that lift on hover.
import { motion } from "framer-motion";
import { now } from "@/data/about";
import { ease } from "@/lib/motion";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "@/styles/NowCards.module.css";

export default function NowCards() {
  return (
    <section className={`container ${styles.section}`}>
      <SectionTitle>Now</SectionTitle>
      <ul className={styles.grid}>
        {now.items.map((item, i) => (
          <motion.li
            key={item.label}
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease, delay: i * 0.08 }}
          >
            <span className={styles.label}>
              <i className={styles.dot} aria-hidden="true" />
              {item.label}
            </span>
            <p className={styles.text}>{item.text}</p>
            <span className={styles.updated}>Updated {now.updated}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
