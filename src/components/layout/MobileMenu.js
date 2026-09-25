// MobileMenu: full-screen overlay for phones. Huge SkyBoxed links stagger in,
// with the clock and theme toggle at the bottom. Escape or a route change closes it.
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { nav, site } from "@/data/site";
import { ease } from "@/lib/motion";
import { getLenis } from "@/hooks/useLenis";
import LiveClock from "@/components/ui/LiveClock";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SoundToggle from "@/components/ui/SoundToggle";
import styles from "@/styles/MobileMenu.module.css";

const panel = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.6, ease, staggerChildren: 0.07, delayChildren: 0.15 } },
  exit: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.5, ease } },
};

const item = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease } },
};

export default function MobileMenu({ open, onClose, active }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.documentElement.classList.add("is-loading");
    getLenis()?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("is-loading");
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <nav className={styles.links} aria-label="Mobile">
            {nav.map((link, i) => (
              <span key={link.href} className={styles.mask}>
                <motion.span variants={item} className={styles.row}>
                  <Link
                    href={link.href}
                    scroll={false}
                    className={clsx(styles.link, link.href === active && styles.active)}
                    aria-current={link.href === active ? "page" : undefined}
                    onClick={onClose}
                  >
                    <em>0{i + 1}</em>
                    <span>
                      {link.label}
                      <span className="accent">.</span>
                    </span>
                  </Link>
                </motion.span>
              </span>
            ))}
          </nav>

          <div className={styles.footer}>
            <div>
              <LiveClock />
              <a className={styles.email} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <div className={styles.toggles}>
              <SoundToggle />
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
