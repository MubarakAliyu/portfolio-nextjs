// ScrollWords: scroll-linked reading. Every word starts at 15% opacity and
// lights up as you scroll through the block, like reading along.
// `paragraphs` is a list of segment lists: [[{ text, className? }, …], …].
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import useReducedMotion from "@/hooks/useReducedMotion";
import styles from "@/styles/ScrollWords.module.css";

function Word({ progress, range, className, children }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span className={className} style={{ opacity }}>
      {children}
    </motion.span>
  );
}

// Splits every paragraph into words and numbers them across the whole block.
function split(paragraphs) {
  let order = 0;
  const blocks = paragraphs.map((segments) => {
    const words = [];
    segments.forEach(({ text, className }) =>
      text.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        const space = /^\s+$/.test(chunk);
        words.push({ text: chunk, className, space, order: space ? -1 : order++ });
      })
    );
    return words;
  });
  return { blocks, total: order };
}

export default function ScrollWords({ paragraphs, className, paragraphClassName, offset = ["start 0.8", "end 0.45"] }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const { blocks, total } = split(paragraphs);

  return (
    <div ref={ref} className={clsx(styles.block, className)}>
      {blocks.map((words, p) => (
        <p key={p} className={paragraphClassName}>
          {words.map((word, k) => {
            if (word.space) return " ";
            const start = word.order / total;
            return reduced ? (
              <span key={k} className={word.className}>
                {word.text}
              </span>
            ) : (
              <Word key={k} progress={scrollYProgress} range={[start, start + 1 / total]} className={word.className}>
                {word.text}
              </Word>
            );
          })}
        </p>
      ))}
    </div>
  );
}
