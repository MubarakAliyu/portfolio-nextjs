// PageTransition: the old page fades up and out, the new one fades up in,
// and a thin red bar sweeps across the top while the route loads.
// Pages are keyed by path (not query) so shallow URL updates don't remount them.
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { scrollToTop } from "@/hooks/useLenis";
import { useSound } from "@/lib/sound/SoundProvider";
import { clearBleed } from "@/lib/bleed";
import styles from "@/styles/PageTransition.module.css";

export default function PageTransition({ children }) {
  const router = useRouter();
  const { play } = useSound();
  const [loading, setLoading] = useState(false);
  const routeKey = router.asPath.split(/[?#]/)[0];

  useEffect(() => {
    const start = (url, { shallow }) => {
      if (shallow) return;
      clearBleed();
      setLoading(true);
      play("whoosh");
    };
    const stop = () => setLoading(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", stop);
    router.events.on("routeChangeError", stop);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", stop);
      router.events.off("routeChangeError", stop);
    };
  }, [router.events, play]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.span
            key="bar"
            className={styles.bar}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 0.8, transition: { duration: 1.2, ease } }}
            exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.5, ease } }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTop}>
        <motion.div
          key={routeKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
