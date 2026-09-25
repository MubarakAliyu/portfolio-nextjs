// FilterPills: a row of tag pills. The active pill's fill slides between
// options (shared layoutId) and each click plays a soft "pop".
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "@/styles/FilterPills.module.css";

export default function FilterPills({ options, value, onChange, id = "filters", label = "Filter projects", className }) {
  return (
    <div className={clsx(styles.row, className)} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            className={clsx(styles.pill, active && styles.active)}
            onClick={() => onChange(option)}
            data-sound="pop"
          >
            {active && (
              <motion.span layoutId={`${id}-fill`} className={styles.fill} transition={{ type: "spring", stiffness: 400, damping: 34 }} />
            )}
            <span className={styles.text}>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
