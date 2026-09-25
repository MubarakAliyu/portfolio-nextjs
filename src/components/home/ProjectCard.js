// ProjectCard: one project in the Work views. Cards (columns/grid) wipe in
// with a clip-path, zoom their image on hover and turn the cursor into an
// "OPEN CASE STUDY" disc. The list variant is a full-width row with an arrow.
// A shared layoutId lets a card morph into its new spot when the view changes;
// cards fade in and out when a filter changes. Hovering tints the page towards
// the project's colour. Confidential projects show a blurred, locked cover.
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ease } from "@/lib/motion";
import { blurProps } from "@/lib/media";
import { clearBleed, setBleed } from "@/lib/bleed";
import StatusBadge, { LockIcon } from "@/components/ui/StatusBadge";
import styles from "@/styles/ProjectCard.module.css";

const morph = { type: "spring", stiffness: 260, damping: 32 };
const presence = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};

function Reveal({ reveal, delay, children }) {
  if (!reveal) return <div className={styles.clip}>{children}</div>;
  return (
    <motion.div
      className={styles.clip}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease, delay }}
    >
      <motion.div
        className={styles.zoom}
        initial={{ scale: 1.28, filter: "blur(14px) brightness(0.66)" }}
        whileInView={{ scale: 1, filter: "blur(0px) brightness(1)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// `ref` is forwarded so AnimatePresence (popLayout) can measure exiting cards.
export default function ProjectCard({ project, index = 0, variant = "column", reveal = true, onHover, sizes, ref }) {
  const href = `/projects/${project.slug}`;
  const number = String(index + 1).padStart(2, "0");
  const locked = project.status === "confidential";
  const cursor = { "data-cursor": "label", "data-cursor-label": locked ? "On request" : "Open case study" };
  const hover = {
    onMouseEnter: () => {
      setBleed(project.accent);
      onHover?.(project.slug);
    },
    onMouseLeave: () => {
      clearBleed();
      onHover?.(null);
    },
  };

  if (variant === "list") {
    return (
      <motion.article ref={ref} layoutId={`card-${project.slug}`} transition={morph} className={styles.row} {...presence} {...hover}>
        <Link href={href} scroll={false} className={styles.rowLink} {...cursor}>
          <span className={styles.num}>{number}</span>
          <motion.h3 layout="position" className={styles.rowTitle}>
            {project.title}
          </motion.h3>
          <span className={styles.rowTags}>{project.tags.join(" · ")}</span>
          <StatusBadge status={project.status} variant="inline" className={styles.rowStatus} />
          <span className={styles.rowYear}>{project.year}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={ref}
      layoutId={`card-${project.slug}`}
      transition={morph}
      className={clsx(styles.card, styles[variant], locked && styles.locked)}
      style={{ order: index }}
      {...presence}
      {...hover}
    >
      <Link href={href} scroll={false} className={styles.link} {...cursor}>
        <motion.div layout transition={morph} className={styles.thumb}>
          <Reveal reveal={reveal} delay={(index % 3) * 0.12}>
            <Image
              src={project.media.cover.src}
              alt={locked ? `${project.title} (confidential)` : `${project.title}: ${project.summary}`}
              fill
              sizes={sizes}
              className={styles.img}
              style={{ backgroundColor: project.accent }}
              {...blurProps(project.media.cover)}
            />
          </Reveal>
          <StatusBadge status={project.status} />
          {locked && (
            <span className={styles.lock} aria-hidden="true">
              <LockIcon size={22} />
            </span>
          )}
        </motion.div>
        <motion.div layout="position" transition={morph} className={styles.meta}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.info}>
            <span className={styles.tags}>
              {project.tags.slice(0, 3).map((tag) => (
                <em key={tag}>{tag}</em>
              ))}
            </span>
            <span className={styles.year}>{project.year}</span>
          </p>
        </motion.div>
      </Link>
    </motion.article>
  );
}
