// Button: pill link/button with a fill that wipes up on hover and a gentle
// magnetic pull toward the cursor (desktop only).
//   variant="solid"   -> red pill, wipes to a darker red, arrow slides in
//   variant="outline" -> hairline pill, fills with the text colour and inverts
//   arrow              -> a → slides in on hover;  arrow="ne" -> an ↗ that flies out/in
import Link from "next/link";
import { motion, useSpring } from "framer-motion";
import clsx from "clsx";
import useIsTouch from "@/hooks/useIsTouch";
import styles from "@/styles/Button.module.css";

const MotionLink = motion.create(Link);
const PULL = 8;

export default function Button({
  href,
  variant = "outline",
  arrow = false,
  external = false,
  download,
  className,
  children,
  ...rest
}) {
  const isTouch = useIsTouch();
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });

  const onMouseMove = (e) => {
    if (isTouch) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(dx * PULL);
    y.set(dy * PULL);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const props = {
    className: clsx(styles.button, styles[variant], className),
    style: { x, y },
    onMouseMove,
    onMouseLeave,
    ...rest,
  };

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow === "ne" ? (
        // ↗ flies out to the top-right and a fresh one flies in on hover.
        <span className={styles.ne} aria-hidden="true">
          <i>↗</i>
          <i>↗</i>
        </span>
      ) : (
        arrow && (
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        )
      )}
    </>
  );

  if (!href) {
    return (
      <motion.button type="button" {...props}>
        {content}
      </motion.button>
    );
  }

  if (external || download) {
    return (
      <motion.a
        href={href}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} scroll={false} {...props}>
      {content}
    </MotionLink>
  );
}
