// ChapterNav: the case study's sticky chapter list (a left rail on desktop, a
// pill strip under the header on phones). It follows the section you're
// reading with an IntersectionObserver, and clicking a chapter scrolls there.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { getLenis } from "@/hooks/useLenis";
import styles from "@/styles/ChapterNav.module.css";

export default function ChapterNav({ chapters }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const sections = chapters.map(({ id }) => document.getElementById(id)).filter(Boolean);
    // Whenever a section crosses the reading line, pick the last chapter that
    // has started above it (so jumps and in-between sections still resolve).
    const pick = () => {
      const line = window.innerHeight * 0.4;
      const current = sections.filter((el) => el.getBoundingClientRect().top <= line).pop();
      setActive(current?.id ?? sections[0]?.id);
    };
    // Watch every section on the page (not just chapters), so passing through
    // the showcase or palette also updates the rail.
    const observer = new IntersectionObserver(pick, { rootMargin: "-40% 0px -59% 0px" });
    document.querySelectorAll("#main section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -120 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav className={styles.nav} aria-label="Chapters">
      <ol className={styles.list}>
        {chapters.map((chapter, i) => {
          const isActive = chapter.id === active;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                onClick={go(chapter.id)}
                className={clsx(styles.link, isActive && styles.active)}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && <motion.span layoutId="chapter-marker" className={styles.marker} transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.label}>{chapter.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
