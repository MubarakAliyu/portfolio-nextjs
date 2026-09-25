// Contact page: the repelling "SAY HELLO.", the copyable email line, details
// and socials beside the contact form, and a short FAQ. ?subject=… (from a
// "Request access" button) pre-fills the form.
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import ContactHero from "@/components/contact/ContactHero";
import BigEmail from "@/components/contact/BigEmail";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";
import Faq from "@/components/contact/Faq";
import styles from "@/styles/Contact.module.css";

export default function Contact() {
  const router = useRouter();
  // The query is only known after hydration; re-keying the form lets it start
  // fresh with the subject filled in.
  const subject = router.isReady && typeof router.query.subject === "string" ? router.query.subject.slice(0, 80) : "";

  return (
    <Layout title="Contact" description="Get in touch with Aliyu Mubarak for product design, web builds, branding, teaching and talks." footerCta={false}>
      <ContactHero />
      <BigEmail />
      <section className={`container ${styles.columns}`}>
        <ContactDetails />
        <ContactForm key={subject} subject={subject} />
      </section>
      <Faq />
    </Layout>
  );
}
