// RevealText: each line sits in an overflow:hidden mask and slides up into view.
// Pass `play` to control it (e.g. after the preloader); otherwise it plays
// when scrolled into view.
import { motion } from "framer-motion";
import clsx from "clsx";
import { maskUp, stagger, viewport } from "@/lib/motion";
import styles from "@/styles/RevealText.module.css";

export function revealTrigger(play, amount = viewport.amount) {
  return play === undefined
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount } }
    : { initial: "hidden", animate: play ? "show" : "hidden" };
}

export default function RevealText({
  as = "div",
  lines,
  className,
  lineClassName,
  play,
  delay = 0,
  each = 0.09,
  amount,
}) {
  const Tag = motion[as];

  return (
    <Tag className={className} variants={stagger(each, delay)} {...revealTrigger(play, amount)}>
      {lines.map((line, i) => (
        <span key={i} className={clsx(styles.line, lineClassName)}>
          <motion.span className={styles.inner} variants={maskUp}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
