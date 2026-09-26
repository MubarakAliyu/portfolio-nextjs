// ProjectViews: the three Work layouts, shared by the home page and /projects.
//   columns -> 3 columns, the middle one sits lower, each drifts at its own
//              parallax speed (1 column, no offset/parallax on phones)
//   list    -> full-width rows + a preview image that follows the cursor
//   grid    -> 2 columns of landscape cards
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring, useTransform } from "framer-motion";
import clsx from "clsx";
import useMediaQuery from "@/hooks/useMediaQuery";
import useIsTouch from "@/hooks/useIsTouch";
import useReducedMotion from "@/hooks/useReducedMotion";
import { blurProps } from "@/lib/media";
import ProjectCard from "./ProjectCard";
import styles from "@/styles/ProjectViews.module.css";

// One `sizes` for every card view so switching views reuses the same file.
// Measured: a card is ~416px wide at 1440 and ~350px at 390, not the half
// viewport the old value claimed — which made the browser fetch a variant
// roughly twice the size it needed.
const CARD_SIZES = "(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 30vw";

function toColumns(projects, count = 3) {
  const cols = Array.from({ length: count }, () => []);
  projects.forEach((project, i) => cols[i % count].push({ project, index: i }));
  return cols;
}

function ListPreview({ projects, activeSlug }) {
  const x = useSpring(0, { stiffness: 220, damping: 26 });
  const y = useSpring(0, { stiffness: 220, damping: 26 });
  const active = projects.find((p) => p.slug === activeSlug);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className={styles.preview}
      style={{ x, y }}
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.85 }}
      transition={{ duration: 0.35 }}
      aria-hidden="true"
    >
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key={active.slug}
            className={styles.previewImg}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Image
              src={active.media.cover.src}
              alt=""
              fill
              sizes="280px"
              style={{ backgroundColor: active.accent }}
              {...blurProps(active.media.cover)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectViews({ projects, view = "columns", reveal = true, className }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(null);
  const isPhone = useMediaQuery("(max-width: 767px)");
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const still = isPhone || reduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Outer columns rise ~40px faster than the page; the middle one lags ~60px.
  const outerY = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const middleY = useTransform(scrollYProgress, [0, 1], [-20, 80]);

  return (
    <LayoutGroup id="project-views">
      {/* initial={false}: cards are visible on first paint; only filter changes animate them in/out. */}
      <div ref={ref} className={clsx(styles.views, styles[view], className)}>
        {view === "columns" &&
          toColumns(projects).map((col, c) => (
            <motion.div key={`col-${c}`} className={styles.col} style={still ? undefined : { y: c === 1 ? middleY : outerY }}>
              <AnimatePresence initial={false} mode="popLayout">
                {col.map(({ project, index }) => (
                  <ProjectCard key={project.slug} project={project} index={index} reveal={reveal} sizes={CARD_SIZES} />
                ))}
              </AnimatePresence>
            </motion.div>
          ))}

        {view === "grid" && (
          <AnimatePresence initial={false} mode="popLayout">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} variant="grid" reveal={reveal} sizes={CARD_SIZES} />
            ))}
          </AnimatePresence>
        )}

        {view === "list" && (
          <div className={styles.rows} onMouseLeave={() => setHovered(null)}>
            <AnimatePresence initial={false} mode="popLayout">
              {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} variant="list" onHover={setHovered} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {view === "list" && !isTouch && <ListPreview projects={projects} activeSlug={hovered} />}
    </LayoutGroup>
  );
}
