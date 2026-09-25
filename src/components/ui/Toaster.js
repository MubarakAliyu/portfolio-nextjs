// Toaster: renders toasts from lib/toast.js in a portal. Pointer toasts float
// up from where you clicked; the rest slide up at the bottom centre.
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { getServerToasts, getToasts, subscribeToasts } from "@/lib/toast";
import styles from "@/styles/Toaster.module.css";

const subscribeMounted = () => () => {};

export default function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  if (!mounted) return null;

  return createPortal(
    <div className={styles.layer} aria-live="polite" role="status">
      <AnimatePresence>
        {toasts.map((t) =>
          t.x != null ? (
            <motion.span
              key={t.id}
              className={styles.pointer}
              style={{ left: t.x, top: t.y }}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], y: -48, scale: 1 }}
              transition={{ duration: 1.4, ease, times: [0, 0.15, 0.7, 1] }}
            >
              {t.message}
            </motion.span>
          ) : (
            <motion.span
              key={t.id}
              className={styles.bottom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease }}
            >
              {t.message}
            </motion.span>
          )
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
