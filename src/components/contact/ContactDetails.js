// ContactDetails: email, location, local time and response time, then the
// social links as rows whose background sweeps in and whose ↗ turns on hover.
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";
import LiveClock from "@/components/ui/LiveClock";
import styles from "@/styles/ContactDetails.module.css";

const reveal = (i) => ({
  initial: { scaleX: 0 },
  whileInView: { scaleX: 1 },
  viewport: { once: true },
  transition: { duration: 1, ease, delay: i * 0.06 },
});

export default function ContactDetails() {
  const details = [
    { label: "Email", value: <a href={`mailto:${site.email}`}>{site.email}</a> },
    { label: "Location", value: "Sokoto, Nigeria (13.06° N, 5.24° E)" },
    { label: "Local time", value: <LiveClock as="span" className={styles.clock} /> },
    { label: "Response time", value: "Usually within 24 hours" },
  ];

  return (
    <div className={styles.details}>
      <dl>
        {details.map((d, i) => (
          <div key={d.label} className={styles.row}>
            <motion.span className={styles.rule} aria-hidden="true" {...reveal(i)} />
            <dt>{d.label}</dt>
            <dd>{d.value}</dd>
          </div>
        ))}
      </dl>

      <ul className={styles.socials} aria-label="Elsewhere">
        {site.socials.map((s, i) => (
          <li key={s.label} className={styles.socialRow}>
            <motion.span className={styles.rule} aria-hidden="true" {...reveal(i + details.length)} />
            <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.social}>
              <span className={styles.name}>{s.label}</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
