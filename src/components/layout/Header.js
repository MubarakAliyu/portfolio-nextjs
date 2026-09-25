// Header: fixed three-column bar. Name + role on the left, a pill nav in the
// middle (the pill slides between items on hover and on route change), and the
// live Sokoto clock + theme toggle on the right. It blurs once you scroll past
// 80px, hides while scrolling down and returns when scrolling up. Below 768px
// the nav collapses into a Menu button that opens MobileMenu.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { nav, site } from "@/data/site";
import LiveClock from "@/components/ui/LiveClock";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SoundToggle from "@/components/ui/SoundToggle";
import ScrambleText from "@/components/ui/ScrambleText";
import MobileMenu from "./MobileMenu";
import styles from "@/styles/Header.module.css";

const pillSpring = { type: "spring", stiffness: 380, damping: 32 };

export default function Header() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const active = nav.find((item) => item.match(router.pathname))?.href ?? null;
  const pillAt = hovered ?? active;

  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    lastY.current = y;
    setStuck(y > 80);
    setHidden(goingDown && y > 240);
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    router.events.on("routeChangeStart", closeMenu);
    return () => router.events.off("routeChangeStart", closeMenu);
  }, [router.events, closeMenu]);

  return (
    <>
      <motion.header
        className={clsx(styles.header, (stuck || menuOpen) && styles.stuck, menuOpen && styles.open)}
        animate={{ y: hidden && !menuOpen ? "-104%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={clsx("container", styles.inner)}>
          <Link href="/" scroll={false} className={styles.brand}>
            <b>{site.name}</b>
            <span>{site.role}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary" onMouseLeave={() => setHovered(null)}>
            {nav.map((item) => {
              const isActive = item.href === active;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={false}
                  className={clsx(styles.link, (isActive || item.href === hovered) && styles.lit)}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  onBlur={() => setHovered(null)}
                >
                  {pillAt === item.href && <motion.span layoutId="nav-pill" className={styles.pill} transition={pillSpring} />}
                  <span className={styles.label}>
                    <ScrambleText text={item.label} active={item.href === hovered} hover={false} />
                  </span>
                  {isActive && <motion.span layoutId="nav-underline" className={styles.underline} transition={pillSpring} />}
                </Link>
              );
            })}
          </nav>

          <div className={styles.right}>
            <LiveClock className={styles.clock} />
            <SoundToggle className={styles.toggle} />
            <ThemeToggle className={styles.toggle} />
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
    </>
  );
}
