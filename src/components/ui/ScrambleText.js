// ScrambleText: on hover (or when `active` turns true) the letters cycle
// through random glyphs and resolve left to right. It writes straight to the
// DOM in requestAnimationFrame, so there's no React re-render per frame.
// Screen readers always get the real text.
import { useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import useReducedMotion from "@/hooks/useReducedMotion";
import styles from "@/styles/ScrambleText.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=?";
const KEEP = /[\s@.·,:/-]/; // leave spaces and punctuation in place

export default function ScrambleText({ text, duration = 300, active, className, hover = true }) {
  const out = useRef(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();

  const run = useCallback(() => {
    if (reduced || !out.current) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        next += i < settled || KEEP.test(char) ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      out.current.textContent = next;
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else out.current.textContent = text;
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration, reduced]);

  useEffect(() => {
    if (active) run();
  }, [active, run]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <span className={clsx(styles.wrap, className)} onMouseEnter={hover ? run : undefined}>
      <span className="sr-only">{text}</span>
      <span ref={out} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
