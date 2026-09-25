// Layout: the per-page wrapper (SEO tags, <main>, footer). The Header, cursor
// and preloader live in _app.js so they persist across page transitions.
import clsx from "clsx";
import SEO from "./SEO";
import Footer from "./Footer";
import styles from "@/styles/Layout.module.css";

export default function Layout({ title, description, footerCta = true, className, children }) {
  return (
    <>
      <SEO title={title} description={description} />
      <main id="main" className={clsx(styles.main, className)}>
        {children}
      </main>
      <Footer cta={footerCta} />
    </>
  );
}
