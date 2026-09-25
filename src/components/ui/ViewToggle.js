// ViewToggle: Columns / List / Grid pill group. The dark highlight slides
// between options with a shared layoutId.
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "@/styles/ViewToggle.module.css";

export const VIEWS = ["columns", "list", "grid"];

export default function ViewToggle({ value, onChange, options = VIEWS, id = "work-view", className }) {
  return (
    <div className={clsx(styles.group, className)} role="tablist" aria-label="Choose a layout">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            className={clsx(styles.option, active && styles.active)}
            onClick={() => onChange(option)}
            data-sound="pop"
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className={styles.pill}
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className={styles.text}>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
