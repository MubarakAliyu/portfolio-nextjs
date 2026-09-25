// Experience: the timeline as ServicesList-style rows: years · role ·
// organisation · one line. Hover turns a row red, draws the underline and
// grows the cursor into the big disc. Education follows in the same rhythm.
import { motion } from "framer-motion";
import { education, experience } from "@/data/experience";
import { ease } from "@/lib/motion";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "@/styles/Experience.module.css";

const row = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

function Timeline({ title, items }) {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <motion.ol
        className={styles.list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {items.map((item) => (
          <motion.li key={item.org} className={styles.row} variants={row} data-cursor="big" data-sound-hover="hover">
            <span className={styles.years}>{item.years}</span>
            <span className={styles.main}>
              <span className={styles.role}>{item.role}</span>
              <span className={styles.org}>{item.org}</span>
            </span>
            <span className={styles.line}>{item.line}</span>
            <span className={styles.underline} aria-hidden="true" />
          </motion.li>
        ))}
      </motion.ol>
    </>
  );
}

export default function Experience() {
  return (
    <section className={`container ${styles.section}`}>
      <Timeline title="Experience" items={experience} />
      <div className={styles.education}>
        <Timeline title="Education" items={education} />
      </div>
    </section>
  );
}
