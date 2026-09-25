// About page: the story, the scrolly life chapters, numbers, experience, the
// polaroid pile, inspirations, what's happening now and the toolkit.
import Layout from "@/components/layout/Layout";
import AboutHero from "@/components/about/AboutHero";
import Story from "@/components/about/Story";
import Chapters from "@/components/about/Chapters";
import Stats from "@/components/about/Stats";
import Experience from "@/components/about/Experience";
import PolaroidPile from "@/components/about/PolaroidPile";
import Inspirations from "@/components/about/Inspirations";
import NowCards from "@/components/about/NowCards";
import Toolkit from "@/components/about/Toolkit";
import Marquee from "@/components/ui/Marquee";
import { services } from "@/data/services";

export default function About() {
  return (
    <Layout
      title="About"
      description="Aliyu Mubarak: product designer, software engineer and Software Engineering lecturer in Sokoto, Nigeria, and founder of Starnova Labs."
    >
      <AboutHero />
      <Story />
      <Chapters />
      <Stats />
      <Experience />
      <PolaroidPile />
      <Inspirations />
      <NowCards />
      <Toolkit />
      <Marquee items={services} />
    </Layout>
  );
}
