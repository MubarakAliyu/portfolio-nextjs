// Home page: hero, services marquee, selected work, services list and footer CTA.
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/ui/Marquee";
import WorkSection from "@/components/home/WorkSection";
import ServicesList from "@/components/home/ServicesList";
import { FEATURED, getProject, withMedia } from "@/data/projects";
import { services } from "@/data/services";

const featured = FEATURED.map(getProject).filter(Boolean).map(withMedia);

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Marquee items={services} />
      <WorkSection projects={featured} />
      <ServicesList />
    </Layout>
  );
}
