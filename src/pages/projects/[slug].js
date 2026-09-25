// /projects/[slug]: one case study.
// Server-side rendered on every request (checkpoint requirement):
// getServerSideProps looks the slug up in src/data/projects.js, merges in its
// images, finds the previous/next projects, and returns a 404 for unknown slugs.
// Sections only render when the project has data for them; confidential
// projects show the overview and roles, with an access card instead of a gallery.
import Layout from "@/components/layout/Layout";
import CaseHero from "@/components/case/CaseHero";
import CaseCover from "@/components/case/CaseCover";
import ChapterNav from "@/components/case/ChapterNav";
import Overview from "@/components/case/Overview";
import PullQuote from "@/components/case/PullQuote";
import ProcessList from "@/components/case/ProcessList";
import SiteShowcase from "@/components/case/SiteShowcase";
import BrandPalette from "@/components/case/BrandPalette";
import Outcome from "@/components/case/Outcome";
import CaseGallery from "@/components/case/CaseGallery";
import NdaMosaic from "@/components/case/NdaMosaic";
import NextProject from "@/components/case/NextProject";
import { getProjectMedia, projects, withMedia } from "@/data/projects";
import { plainText } from "@/lib/richText";
import styles from "@/styles/CaseStudy.module.css";

const teaser = (p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  year: p.year,
  status: p.status,
  cover: getProjectMedia(p.slug).cover,
});

export async function getServerSideProps({ params }) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) return { notFound: true };
  const at = (i) => projects[(i + projects.length) % projects.length];
  return {
    props: {
      project: withMedia(projects[index]),
      number: index + 1,
      next: teaser(at(index + 1)),
      prev: teaser(at(index - 1)),
    },
  };
}

export default function CaseStudy({ project, number, next }) {
  const locked = project.status === "confidential";
  const { gallery, screens } = project.media;
  const show = {
    challenge: !locked && Boolean(project.challenge),
    process: !locked && project.process?.length > 0,
    solution: !locked && Boolean(project.solution),
    showcase: !locked && Boolean(screens.desktop),
    palette: !locked && (project.palette?.length > 0 || project.typefaces?.length > 0),
    outcome: !locked && Boolean(project.outcome?.text),
    gallery: !locked && gallery.length > 0,
  };
  const chapters = [
    { id: "overview", label: "Overview" },
    show.challenge && { id: "challenge", label: "Challenge" },
    show.process && { id: "process", label: "Process" },
    show.solution && { id: "solution", label: "Solution" },
    show.outcome && { id: "outcome", label: "Outcome" },
    show.gallery && { id: "gallery", label: "Gallery" },
    locked && { id: "access", label: "Access" },
  ].filter(Boolean);

  return (
    <Layout title={project.title} description={plainText(project.summary)} footerCta={false}>
      <CaseHero project={project} number={number} />
      <CaseCover project={project} />

      <div className={`container ${styles.body}`}>
        <ChapterNav chapters={chapters} />
        <div className={styles.content}>
          <Overview project={project} />
          {show.challenge && <PullQuote id="challenge" label="Challenge" text={project.challenge} />}
          {show.process && <ProcessList steps={project.process} />}
          {show.solution && <PullQuote id="solution" label="Solution" text={project.solution} />}
          {show.showcase && <SiteShowcase project={project} />}
          {show.palette && <BrandPalette palette={project.palette} typefaces={project.typefaces} />}
          {show.outcome && <Outcome outcome={project.outcome} />}
          {show.gallery && <CaseGallery project={project} />}
          {locked && <NdaMosaic project={project} />}
        </div>
      </div>

      <NextProject next={next} />
    </Layout>
  );
}
