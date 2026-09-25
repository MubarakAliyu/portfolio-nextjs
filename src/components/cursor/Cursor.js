// Cursor: the dot that follows the mouse with a spring lag and grows into
// labelled discs ("OPEN CASE STUDY", "DRAG", "WRITE TO ME") or a big red disc.
// It blends with mix-blend-mode: difference, like the reference site, so it
// reads red on dark, teal on cream and inverts images. Not rendered on touch.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";
import useIsTouch from "@/hooks/useIsTouch";
import { useCursorApi, useCursorState } from "./CursorContext";
import styles from "@/styles/Cursor.module.css";

const SIZE = 84;
const SCALE = { default: 10 / SIZE, link: 40 / SIZE, label: 1, big: 1, hidden: 0 };
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], label, input, textarea, select';
const follow = { stiffness: 500, damping: 40, mass: 0.4 };
const grow = { type: "spring", stiffness: 300, damping: 25 };

function readTarget(el) {
  const tagged = el?.closest?.("[data-cursor]");
  if (tagged) return { variant: tagged.dataset.cursor || "label", label: tagged.dataset.cursorLabel || "" };
  if (el?.closest?.(INTERACTIVE)) return { variant: "link" };
  return { variant: "default" };
}

export default function Cursor() {
  const isTouch = useIsTouch();
  return isTouch ? null : <Dot />;
}

function Dot() {
  const router = useRouter();
  const cursor = useCursorState();
  const { setCursor } = useCursorApi();
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const last = useRef({ x: -100, y: -100 });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, follow);
  const sy = useSpring(y, follow);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const evaluateAtPointer = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setCursor(readTarget(document.elementFromPoint(last.current.x, last.current.y)))
      );
    };
    const onMove = (e) => {
      last.current = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => setCursor(readTarget(e.target));
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    root.classList.add("has-cursor");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", evaluateAtPointer, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    root.addEventListener("mouseleave", onLeave);

    // Reset on navigation so a label never sticks, then re-read once the new page is in.
    let settle = 0;
    const onRouteStart = () => setCursor();
    const onRouteDone = () => {
      clearTimeout(settle);
      settle = setTimeout(evaluateAtPointer, 700);
    };
    router.events.on("routeChangeStart", onRouteStart);
    router.events.on("routeChangeComplete", onRouteDone);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      root.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", evaluateAtPointer);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseleave", onLeave);
      router.events.off("routeChangeStart", onRouteStart);
      router.events.off("routeChangeComplete", onRouteDone);
    };
  }, [router.events, setCursor, x, y]);

  const variant = visible ? cursor.variant : "hidden";
  const scale = (SCALE[variant] ?? SCALE.default) * (pressed ? 0.85 : 1);
  const labelOn = variant === "label" && Boolean(cursor.label);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className={clsx(styles.dot, variant === "link" && styles.soft)}
        style={{ x: sx, y: sy }}
        initial={{ scale: 0 }}
        animate={{ scale }}
        transition={grow}
      />
      <motion.div aria-hidden="true" className={styles.label} style={{ x: sx, y: sy }}>
        <motion.span
          initial={false}
          animate={{ opacity: labelOn ? 1 : 0, scale: labelOn ? 1 : 0.7 }}
          transition={{ duration: 0.25 }}
        >
          {cursor.lastLabel}
        </motion.span>
      </motion.div>
    </>
  );
}
