// Toolkit: a cloud of tool pills that pop in one after another. Each pill
// leans toward the cursor and fills with the text colour on hover.
import { motion, useSpring } from "framer-motion";
import { toolkit } from "@/data/about";
import { ease } from "@/lib/motion";
import useIsTouch from "@/hooks/useIsTouch";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "@/styles/Toolkit.module.css";

function Pill({ label, index, magnetic }) {
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.li
      className={styles.pill}
      style={{ x, y }}
      data-sound-hover="hover"
      variants={{
        hidden: { opacity: 0, scale: 0.6 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 320, damping: 20, delay: index * 0.04 } },
      }}
      onMouseMove={(e) => {
        if (!magnetic) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {label}
    </motion.li>
  );
}

export default function Toolkit() {
  const isTouch = useIsTouch();
  return (
    <section className={`container ${styles.section}`}>
      <SectionTitle>Toolkit</SectionTitle>
      <motion.ul
        className={styles.cloud}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ease }}
      >
        {toolkit.map((tool, i) => (
          <Pill key={tool} label={tool} index={i} magnetic={!isTouch} />
        ))}
      </motion.ul>
    </section>
  );
}
