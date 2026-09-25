// GridLines: the faint 12-column vertical lines drawn behind a hero
// (4 columns on phones). Place it inside a position:relative section.
import clsx from "clsx";
import styles from "@/styles/GridLines.module.css";

export default function GridLines({ className }) {
  return (
    <div className={clsx(styles.grid, className)} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
