// ServicesList: "One practice, / eleven tools." on a sticky left column,
// the services as rows on the right. Rows fade in with a stagger and their
// dividers draw in; on hover a row turns red, shifts right, a red underline
// draws along its bottom and the cursor grows into the big red disc.
import Link from "next/link";
import { motion } from "framer-motion";
import { services, servicesIntro } from "@/data/services";
import { ease, fadeUp, viewport } from "@/lib/motion";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "@/styles/ServicesList.module.css";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const row = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const line = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease } },
};

export default function ServicesList() {
  return (
    <section className={styles.section} id="services">
      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <div className={styles.sticky}>
            <SectionTitle lines={["One practice,", "eleven tools"]} />
            <motion.p className={styles.copy} variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
              {servicesIntro}
            </motion.p>
          </div>
        </div>

        <motion.ul
          className={styles.list}
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.li className={styles.topRule} variants={line} aria-hidden="true" />
          {services.map((service) => (
            <motion.li key={service} className={styles.item} variants={row}>
              <Link href="/about" scroll={false} className={styles.row} data-cursor="big">
                <span className={styles.text}>{service}</span>
              </Link>
              <motion.span className={styles.rule} variants={line} aria-hidden="true" />
              <span className={styles.underline} aria-hidden="true" />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
