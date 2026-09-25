// WorkSection: "Work." title with the Columns / List / Grid toggle, a divider
// that draws in, the project views and a "View all work" link to /projects.
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { lineDraw, viewport } from "@/lib/motion";
import SectionTitle from "@/components/ui/SectionTitle";
import ViewToggle from "@/components/ui/ViewToggle";
import ProjectViews from "./ProjectViews";
import styles from "@/styles/WorkSection.module.css";

export default function WorkSection({ projects, title = "Work", showAllLink = true }) {
  const [view, setView] = useState("columns");
  const [switched, setSwitched] = useState(false);

  const changeView = (next) => {
    setView(next);
    setSwitched(true); // after the first switch, cards morph instead of re-wiping
  };

  return (
    <section className={styles.section} id="work">
      <div className="container">
        <div className={styles.head}>
          <SectionTitle>{title}</SectionTitle>
          <ViewToggle value={view} onChange={changeView} />
        </div>
        <motion.span
          className={styles.rule}
          variants={lineDraw}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          aria-hidden="true"
        />

        <ProjectViews projects={projects} view={view} reveal={!switched} />

        {showAllLink && (
          <div className={styles.more}>
            <Link href="/projects" scroll={false} className={styles.all}>
              View all work <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
