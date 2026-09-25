// CaseHero: "← All work", the project number, the giant per-letter title with
// a red period, a 4-column meta row (Year · Category · Role · Status) and the
// link buttons (Visit live site ↗ / View prototype ↗ / GitHub ↗).
import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import styles from "@/styles/CaseHero.module.css";

const LETTER = 0.03;

function Title({ text }) {
  // Letter delays run across the whole title, word after word.
  const words = text.split(" ");
  const starts = words.map((_, w) => words.slice(0, w).join("").length);
  return (
    <h1 className={styles.title}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            {w > 0 && " "}
            <span className={styles.word}>
              {[...word].map((char, c) => (
                <span key={c} className={styles.mask}>
                  <motion.span
                    className={styles.letter}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, ease, delay: 0.15 + (starts[w] + c) * LETTER }}
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {w === words.length - 1 && <span className="accent">.</span>}
            </span>
          </Fragment>
        ))}
      </span>
    </h1>
  );
}

export default function CaseHero({ project, number }) {
  const role = project.roles.split("|")[0].trim();
  const meta = [
    { label: "Year", value: project.year },
    { label: "Category", value: project.category },
    { label: "Role", value: role },
    { label: "Status", value: <StatusBadge status={project.status} variant="inline" className={styles.status} /> },
  ];
  const { live, prototype, github } = project.links ?? {};
  const locked = project.status === "confidential";

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.top}>
          <Link href="/projects" scroll={false} className={styles.back}>
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>{" "}
            All work
          </Link>
          <span className={styles.number}>({String(number).padStart(2, "0")})</span>
        </div>

        <Title text={project.title} />

        <dl className={styles.meta}>
          {meta.map((item, i) => (
            <div key={item.label} className={styles.cell}>
              <motion.span
                className={styles.rule}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease, delay: 0.4 + i * 0.08 }}
                aria-hidden="true"
              />
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        {!locked && (live || prototype || github) && (
          <motion.div
            className={styles.links}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.7 }}
          >
            {live && (
              <Button variant="solid" href={live} external arrow="ne" data-cursor="label" data-cursor-label="Visit site">
                Visit live site
              </Button>
            )}
            {prototype && (
              <Button variant="outline" href={prototype} external arrow="ne">
                View prototype
              </Button>
            )}
            {github && (
              <Button variant="outline" href={github} external arrow="ne">
                GitHub
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
