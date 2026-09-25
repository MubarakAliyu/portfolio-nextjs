// SplitWords: splits a paragraph into words; each word slides up from its own
// mask with a small stagger. `segments` lets part of the text take a class,
// e.g. [{ text: "Hello " }, { text: "world", className: "accent" }, { text: "." }].
// Pieces with no space between them (like "world" and ".") stay in one mask
// so punctuation never wraps onto its own line.
import { motion } from "framer-motion";
import { maskUp, stagger } from "@/lib/motion";
import { revealTrigger } from "./RevealText";
import styles from "@/styles/SplitWords.module.css";

function toWords(segments) {
  const words = []; // each word is a list of { text, className } parts; null = space
  let joinNext = false;
  segments.forEach(({ text, className }) => {
    text.split(/(\s+)/).forEach((chunk) => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        words.push(null);
        joinNext = false;
        return;
      }
      const last = words[words.length - 1];
      if (joinNext && last) last.push({ text: chunk, className });
      else words.push([{ text: chunk, className }]);
      joinNext = true;
    });
  });
  return words;
}

export default function SplitWords({ as = "p", text, segments, className, play, delay = 0, each = 0.04, amount }) {
  const Tag = motion[as];
  const words = toWords(segments ?? [{ text }]);

  return (
    <Tag className={className} variants={stagger(each, delay)} {...revealTrigger(play, amount)}>
      {words.map((parts, i) =>
        parts === null ? (
          " "
        ) : (
          <span key={i} className={styles.mask}>
            <motion.span className={styles.word} variants={maskUp}>
              {parts.map((part, j) => (
                <span key={j} className={part.className}>
                  {part.text}
                </span>
              ))}
            </motion.span>
          </span>
        )
      )}
    </Tag>
  );
}
