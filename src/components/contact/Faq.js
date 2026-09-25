// Faq: three quick questions. Opening one fades its answer up (no height
// animation), turns the + into an × and plays a soft pop.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "@/styles/Faq.module.css";

// TODO: Mubarak to review these draft answers.
const ITEMS = [
  {
    q: "Do you take on international clients?",
    a: "Yes. I work with teams across Nigeria and abroad, remotely and asynchronously, with regular calls across time zones.",
  },
  {
    q: "What does a typical project look like?",
    a: "A short discovery call, then research and flows, identity and interface design, and, if needed, building it. Most projects run from a few weeks to a few months.",
  },
  {
    q: "Can you speak at my event or school?",
    a: "I'd love to. I talk about product design, building with code, and teaching tech. Send the date, audience and topic and I'll get back to you.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <section className={`container ${styles.section}`}>
      <SectionTitle>Questions</SectionTitle>
      <ul className={styles.list}>
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className={clsx(styles.item, isOpen && styles.open)}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                data-sound="pop"
              >
                {item.q}
                <span className={styles.icon} aria-hidden="true">
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    id={`faq-${i}`}
                    className={styles.answer}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.5, ease }}
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
