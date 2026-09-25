// Preloader: a 000% -> 100% counter in SkyBoxed with a progress line. At 100%
// it asks "Enter with sound" or "Enter in silence"; that click is the gesture
// that lets audio start. Then the panel slides up and the hero starts its reveal.
// It plays once per browser session; the inline script in _document.js hides
// it before paint after that (and for reduced-motion visitors).
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { INTRO_KEY, useIntro } from "@/lib/intro";
import { useSound } from "@/lib/sound/SoundProvider";
import { getLenis } from "@/hooks/useLenis";
import { REDUCED_MOTION_QUERY } from "@/hooks/useReducedMotion";
import Button from "@/components/ui/Button";
import { site } from "@/data/site";
import styles from "@/styles/Preloader.module.css";

function alreadyPlayed() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1" || window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

export default function Preloader() {
  const { finish } = useIntro();
  const { setEnabled, play } = useSound();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // count -> choose -> exit -> done
  const firstChoice = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const release = () => {
      root.classList.remove("is-loading");
      getLenis()?.start();
    };

    if (alreadyPlayed()) {
      const id = requestAnimationFrame(() => {
        setPhase("done");
        finish();
      });
      return () => cancelAnimationFrame(id);
    }

    root.classList.add("is-loading");
    getLenis()?.stop();
    let decade = 0;
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setCount(Math.round(v));
        if (Math.floor(v / 10) > decade) {
          decade = Math.floor(v / 10);
          play("tick");
        }
      },
      onComplete: () => setPhase("choose"),
    });

    return () => {
      controls.stop();
      release();
    };
  }, [finish, play]);

  useEffect(() => {
    if (phase === "choose") firstChoice.current?.focus();
  }, [phase]);

  const enter = (withSound) => {
    setEnabled(withSound);
    if (withSound) play("whoosh");
    setPhase("exit");
  };

  const onExitDone = () => {
    if (phase !== "exit") return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Without storage the preloader simply plays again next visit.
    }
    document.documentElement.classList.remove("is-loading");
    getLenis()?.start();
    setPhase("done");
    finish();
  };

  if (phase === "done") return null;

  return (
    <motion.div
      data-preloader
      className={styles.preloader}
      initial={false}
      animate={{ y: phase === "exit" ? "-100%" : "0%" }}
      transition={{ duration: 0.9, ease, delay: 0.15 }}
      onAnimationComplete={onExitDone}
      role={phase === "choose" ? "dialog" : undefined}
      aria-label={phase === "choose" ? "Enter the site" : undefined}
      aria-hidden={phase === "choose" ? undefined : "true"}
    >
      <div className={styles.top}>
        <span>{site.name}</span>
        <span>{site.location}</span>
      </div>

      <AnimatePresence>
        {phase === "choose" && (
          <motion.div
            className={styles.choices}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className={styles.buttons}>
              <Button variant="solid" onClick={() => enter(true)} ref={firstChoice} data-sound="none">
                Enter with sound
              </Button>
              <Button variant="outline" onClick={() => enter(false)} data-sound="none">
                Enter in silence
              </Button>
            </div>
            <p className={styles.caption}>Best with headphones</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.bottom}>
        <p className={styles.count}>
          {String(count).padStart(3, "0")}
          <span className={styles.pct}>%</span>
        </p>
        <div className={styles.bar}>
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </div>
    </motion.div>
  );
}
