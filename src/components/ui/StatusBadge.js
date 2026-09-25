// StatusBadge: "Live" (pulsing green dot), "In progress" (amber), "On request"
// (lock) and so on. `overlay` sits on top of an image; `inline` sits in text.
import clsx from "clsx";
import { STATUS } from "@/data/projects";
import styles from "@/styles/StatusBadge.module.css";

export function LockIcon({ size = 11 }) {
  return (
    <svg viewBox="0 0 12 14" width={size} height={(size * 14) / 12} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="1.5" y="6" width="9" height="7" rx="1.2" />
      <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

export default function StatusBadge({ status, variant = "overlay", className }) {
  if (!STATUS[status]) return null;
  return (
    <span className={clsx(styles.badge, styles[variant], styles[status], className)}>
      {status === "confidential" ? <LockIcon /> : <i className={styles.dot} aria-hidden="true" />}
      {STATUS[status]}
    </span>
  );
}
