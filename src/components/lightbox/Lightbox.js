// Lightbox: the hanging lightbox. The image drops in on a thread from the top
// of the screen and swings like a pendulum before settling over a blurred page.
// Drag it sideways to swing it; fling it (or press ←/→, the arrows or a
// thumbnail) and it swings off, the thread retracts and the next image drops in.
// Esc, the × or a click on the backdrop pulls it back up. Rendered in a portal.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import { blurProps } from "@/lib/media";
import { getLenis } from "@/hooks/useLenis";
import useIsTouch from "@/hooks/useIsTouch";
import useMediaQuery from "@/hooks/useMediaQuery";
import useReducedMotion from "@/hooks/useReducedMotion";
import useViewport from "@/hooks/useViewport";
import { useSound } from "@/lib/sound/SoundProvider";
import styles from "@/styles/Lightbox.module.css";

const DROP = { type: "spring", stiffness: 140, damping: 11 };
const PENDULUM = { type: "spring", stiffness: 60, damping: 5, mass: 1.2 };
const OUT = [0.5, 0, 0.75, 0];
const PIN = 26; // thread-to-frame overlap for the clip
const MAT = 12;
const FLING = 600; // px/s

let opens = 0; // alternates the first swing direction per open
const pad = (n) => String(n).padStart(2, "0");

function measure(item, vw, vh, isPhone) {
  const thread = Math.round(vh * Math.min(0.14, Math.max(0.08, 0.08 + (vh - 600) / 5000)));
  const reserved = isPhone ? 120 : 190; // caption, arrows and filmstrip
  const maxH = Math.min(vh * 0.72, vh - thread - PIN - reserved) - MAT * 2;
  const maxW = vw * 0.78 - MAT * 2;
  const scale = Math.min(maxW / item.width, maxH / item.height);
  return { thread, w: Math.round(item.width * scale), h: Math.round(item.height * scale) };
}

function Clip() {
  return (
    <svg className={styles.clip} viewBox="0 0 24 56" width="18" height="42" aria-hidden="true">
      <path
        d="M8 40V10a4 4 0 0 1 8 0v34a6 6 0 0 1-12 0V14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CircleButton({ label, onClick, children, className, ref }) {
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      className={clsx(styles.circle, className)}
      style={{ x, y }}
      onClick={onClick}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.button>
  );
}

export default function Lightbox({ items, startIndex = 0, onClose }) {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const isPhone = useMediaQuery("(max-width: 767px)");
  const { width: vw, height: vh } = useViewport();
  const { play } = useSound();

  const [index, setIndex] = useState(startIndex);
  const [shown, setShown] = useState(false); // chrome fades in after the first drop
  const [closing, setClosing] = useState(false);
  const [roll, setRoll] = useState(1); // counter roll direction
  const busy = useRef(true);
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const downAt = useRef([0, 0]);
  const openedAt = useRef(0);

  const [startY] = useState(() => -1.1 * window.innerHeight);
  const y = useMotionValue(startY);
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  const fade = useMotionValue(reduced ? 0 : 1);
  const scale = useMotionValue(reduced ? 0.96 : 1);
  const frameRotate = useSpring(0, { stiffness: 200, damping: 20 });
  const tilt = useSpring(0, { stiffness: 120, damping: 14 });

  const item = items[index];
  const many = items.length > 1;
  const { thread, w, h } = measure(item, vw, vh, isPhone);
  const length = thread + PIN + (h + MAT * 2) / 2; // pivot to frame centre

  // ---------- motion ----------
  const dropIn = useCallback(async () => {
    busy.current = true;
    if (reduced) {
      y.set(0);
      rotate.set(0);
      x.set(0);
      await Promise.all([animate(fade, 1, { duration: 0.35 }), animate(scale, 1, { duration: 0.35, ease })]);
      setShown(true);
      busy.current = false;
      return;
    }
    x.set(0);
    fade.set(1);
    y.set(-1.1 * window.innerHeight);
    rotate.set(opens++ % 2 ? -9 : 9);
    play("whoosh");
    animate(rotate, 0, PENDULUM);
    let landed = false;
    await animate(y, 0, {
      ...DROP,
      onUpdate: (v) => {
        if (!landed && v > -6) {
          landed = true;
          play("drop");
          setShown(true);
          busy.current = false;
        }
      },
    });
    busy.current = false;
  }, [reduced, fade, scale, x, y, rotate, play]);

  const change = useCallback(
    async (next, xDir) => {
      const target = (next + items.length) % items.length;
      if (busy.current || target === index) return;
      busy.current = true;
      setRoll(xDir < 0 ? 1 : -1);
      if (reduced) {
        await Promise.all([animate(fade, 0, { duration: 0.2 }), animate(scale, 0.96, { duration: 0.2 })]);
        setIndex(target);
        dropIn();
        return;
      }
      play("whoosh");
      await Promise.all([
        animate(rotate, -xDir * 35, { duration: 0.45, ease: OUT }),
        animate(x, xDir * 0.6 * window.innerWidth, { duration: 0.45, ease: OUT }),
      ]);
      await Promise.all([
        animate(y, -1.1 * window.innerHeight, { duration: 0.35, ease: OUT }),
        animate(fade, 0, { duration: 0.35 }),
      ]);
      setIndex(target);
      dropIn();
    },
    [index, items.length, reduced, fade, scale, rotate, x, y, dropIn, play]
  );

  const next = useCallback(() => change(index + 1, -1), [change, index]);
  const prev = useCallback(() => change(index - 1, 1), [change, index]);

  const close = useCallback(async () => {
    if (closing) return;
    setClosing(true);
    busy.current = true;
    document.getElementById("main")?.classList.remove("receded");
    document.documentElement.classList.remove("lightbox-open");
    if (reduced) await animate(fade, 0, { duration: 0.25 });
    else await animate(y, -1.1 * window.innerHeight, { duration: 0.5, ease: [0.6, 0, 0.8, 0.2] });
    onClose();
  }, [closing, reduced, fade, y, onClose]);

  // Swing sound follows how fast the pendulum moves.
  useMotionValueEvent(rotate, "change", () => {
    const speed = Math.abs(rotate.getVelocity());
    if (speed > 25) play("swing", { speed: Math.min(1, speed / 220) });
  });

  // ---------- open / close side effects ----------
  useEffect(() => {
    const main = document.getElementById("main");
    const root = document.documentElement;
    if (main) {
      main.style.transformOrigin = `50% ${window.scrollY - main.offsetTop + window.innerHeight / 2}px`;
      main.classList.add("receded");
    }
    openedAt.current = performance.now();
    root.classList.add("is-locked", "lightbox-open");
    getLenis()?.stop();
    closeButton.current?.focus({ preventScroll: true });
    const id = requestAnimationFrame(() => dropIn());
    return () => {
      cancelAnimationFrame(id);
      main?.classList.remove("receded");
      root.classList.remove("is-locked", "lightbox-open");
      getLenis()?.start();
    };
    // Runs once per open; dropIn is stable for the first image.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" && many) next();
      else if (e.key === "ArrowLeft" && many) prev();
      else if (e.key === "Tab") {
        // Keep focus inside the dialog.
        const focusables = [...dialog.current.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onMove = (e) => {
      if (!isTouch && !reduced) tilt.set((e.clientX / window.innerWidth - 0.5) * 8);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", onMove);
    };
  }, [close, next, prev, many, isTouch, reduced, tilt]);

  // ---------- drag = pendulum ----------
  // We keep our own recent samples: some touch devices report zero pan velocity.
  const samples = useRef([]);
  const onPanStart = () => {
    samples.current = [];
    if (!busy.current && !reduced) rotate.stop();
  };
  const onPan = (_, info) => {
    samples.current.push([performance.now(), info.offset.x]);
    if (samples.current.length > 8) samples.current.shift();
    if (busy.current || reduced) return;
    const angle = (-Math.atan2(info.offset.x, length) * 180) / Math.PI;
    rotate.set(angle);
    frameRotate.set(-angle * 0.15);
  };
  const onPanEnd = (_, info) => {
    frameRotate.set(0);
    if (busy.current) return;
    const recent = samples.current.filter(([t]) => performance.now() - t < 120);
    const [t0, x0] = recent[0] ?? [0, 0];
    const [t1, x1] = recent[recent.length - 1] ?? [0, 0];
    const own = t1 > t0 ? ((x1 - x0) / (t1 - t0)) * 1000 : 0;
    const vx = Math.abs(info.velocity.x) > Math.abs(own) ? info.velocity.x : own;
    const far = Math.abs(info.offset.x) > window.innerWidth * 0.35; // a long, slow swipe counts too
    if (many && (Math.abs(vx) > FLING || far)) {
      const dirX = Math.sign(vx) || Math.sign(info.offset.x);
      if (dirX < 0) change(index + 1, -1);
      else change(index - 1, 1);
    } else if (!reduced) {
      animate(rotate, 0, PENDULUM);
    }
  };

  return createPortal(
    <div ref={dialog} className={styles.overlay} role="dialog" aria-modal="true" aria-label="Image viewer">
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.5, ease }}
        // Swiping anywhere swings the image (handy on phones); only a real tap closes.
        onPointerDown={(e) => {
          downAt.current = [e.clientX, e.clientY];
        }}
        onClick={(e) => {
          // Ignore the second click of a double-click that opened the lightbox.
          if (performance.now() - openedAt.current < 400) return;
          const [dx, dy] = [e.clientX - downAt.current[0], e.clientY - downAt.current[1]];
          if (Math.hypot(dx, dy) < 8) close();
        }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        data-cursor="label"
        data-cursor-label="Close"
        data-sound="none"
      >
        {!reduced && <span className={styles.grain} aria-hidden="true" />}
      </motion.div>

      <motion.div className={styles.rig} style={{ y, x, rotate }}>
        <motion.div
          className={styles.sway}
          animate={reduced || !shown ? { rotate: 0 } : { rotate: [-0.4, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <span className={styles.thread} style={{ height: thread + 6 }} aria-hidden="true" />
          <span className={styles.pin} style={{ top: thread - 4 }} aria-hidden="true">
            <Clip />
          </span>
          <motion.div
            className={styles.frame}
            style={{
              top: thread + PIN - 14,
              width: w + MAT * 2,
              height: h + MAT * 2,
              rotate: frameRotate,
              rotateY: tilt,
              transformPerspective: 1200,
              opacity: fade,
              scale,
            }}
            onPanStart={onPanStart}
            onPan={onPan}
            onPanEnd={onPanEnd}
            data-cursor="label"
            data-cursor-label="Drag"
          >
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt ?? ""}
              width={item.width}
              height={item.height}
              sizes={`${Math.ceil(w)}px`}
              draggable={false}
              className={styles.image}
              style={{ width: w, height: h }}
              {...blurProps(item)}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.chrome}
        initial={{ opacity: 0 }}
        animate={{ opacity: shown && !closing ? 1 : 0 }}
        transition={{ duration: 0.4, delay: shown && !closing ? 0.3 : 0 }}
      >
        <p className={styles.counter} aria-live="polite">
          <span className={styles.rollMask}>
            <AnimatePresence initial={false} mode="popLayout" custom={roll}>
              <motion.span
                key={index}
                custom={roll}
                className={styles.roll}
                variants={{
                  enter: (d) => ({ y: `${d * 100}%` }),
                  center: { y: "0%" },
                  exit: (d) => ({ y: `${-d * 100}%` }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
              >
                {pad(index + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className={styles.total}> / {pad(items.length)}</span>
        </p>

        <CircleButton ref={closeButton} label="Close" onClick={close} className={styles.close}>
          <span className={styles.x} aria-hidden="true">
            ×
          </span>
        </CircleButton>

        <div className={styles.bottom}>
          {many && (
            <CircleButton label="Previous image" onClick={prev}>
              ←
            </CircleButton>
          )}
          <p className={styles.caption}>{item.caption || item.alt}</p>
          {many && (
            <CircleButton label="Next image" onClick={next}>
              →
            </CircleButton>
          )}
        </div>

        {many && !isPhone && (
          <div className={styles.strip} role="group" aria-label="All images">
            {items.map((thumb, i) => (
              <button
                key={thumb.src}
                type="button"
                className={styles.thumb}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => change(i, i > index ? -1 : 1)}
              >
                <Image src={thumb.src} alt="" width={48} height={48} sizes="48px" className={styles.thumbImg} />
                {i === index && <motion.span layoutId="lightbox-thumb" className={styles.thumbActive} />}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
