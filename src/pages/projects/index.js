// /projects: all work.
// Server-side rendered on every request (checkpoint requirement):
// getServerSideProps reads ?view=columns|list|grid and ?tag=… from the URL,
// filters the projects on the server and sends the result as props. After
// that, changing the view or tag updates the URL with a shallow replace, so
// the state lives in the URL without reloading the page.
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionTitle from "@/components/ui/SectionTitle";
import ViewToggle, { VIEWS } from "@/components/ui/ViewToggle";
import FilterPills from "@/components/ui/FilterPills";
import CountUp from "@/components/ui/CountUp";
import Button from "@/components/ui/Button";
import ProjectViews from "@/components/home/ProjectViews";
import { FILTERS, allProjectsWithMedia } from "@/data/projects";
import { fadeUp, lineDraw, viewport } from "@/lib/motion";
import styles from "@/styles/Projects.module.css";

const byTag = (projects, tag) => (tag === "All" ? projects : projects.filter((p) => p.filters.includes(tag)));

export async function getServerSideProps({ query }) {
  const view = VIEWS.includes(query.view) ? query.view : "columns";
  const activeTag = FILTERS.find((f) => f.toLowerCase() === String(query.tag ?? "").toLowerCase()) ?? "All";
  const allProjects = allProjectsWithMedia();
  return {
    props: {
      projects: byTag(allProjects, activeTag), // filtered on the server
      allProjects, // lets the pills filter instantly on the client
      tags: FILTERS,
      activeTag,
      view,
    },
  };
}

export default function Projects({ projects, allProjects, tags, activeTag, view: initialView }) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [tag, setTag] = useState(activeTag);
  const [switched, setSwitched] = useState(false);
  const shown = tag === activeTag ? projects : byTag(allProjects, tag);

  const update = (next) => {
    const query = {};
    if (next.view !== "columns") query.view = next.view;
    if (next.tag !== "All") query.tag = next.tag.toLowerCase();
    router.replace({ pathname: "/projects", query }, undefined, { shallow: true, scroll: false });
  };
  const changeView = (next) => {
    setView(next);
    setSwitched(true);
    update({ view: next, tag });
  };
  const changeTag = (next) => {
    setTag(next);
    setSwitched(true);
    update({ view, tag: next });
  };

  return (
    <Layout title="Work" description="Products, brands and systems designed and built by Aliyu Mubarak, from Sokoto for the world.">
      <section className={`container ${styles.page}`}>
        <div className={styles.head}>
          <div>
            <div className={styles.titleRow}>
              <SectionTitle as="h1" size="hero" className={styles.title}>
                All work
              </SectionTitle>
              <sup className={styles.count} aria-label={`${shown.length} projects`}>
                (<CountUp value={shown.length} pad={2} />)
              </sup>
            </div>
            <motion.p className={styles.intro} variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
              Products, brands and systems I&apos;ve designed and built, from Sokoto for the world.
            </motion.p>
          </div>
          <ViewToggle value={view} onChange={changeView} id="projects-view" />
        </div>

        <FilterPills options={tags} value={tag} onChange={changeTag} id="projects-filter" className={styles.filters} />
        <motion.span
          className={styles.rule}
          variants={lineDraw}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          aria-hidden="true"
        />

        {shown.length ? (
          <ProjectViews projects={shown} view={view} reveal={!switched} />
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              Nothing here yet<span className="accent">.</span>
            </p>
            <Button variant="outline" onClick={() => changeTag("All")}>
              Show all
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
}
