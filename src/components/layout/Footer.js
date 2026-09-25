// Footer: optional FooterCTA, then a hairline and the bottom bar with the
// copyright on the left and social links (underline draws on hover) on the right.
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { lineDraw, viewport } from "@/lib/motion";
import FooterCTA from "@/components/home/FooterCTA";
import ScrambleText from "@/components/ui/ScrambleText";
import styles from "@/styles/Footer.module.css";

const YEAR = new Date().getFullYear();

export default function Footer({ cta = true }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {cta && <FooterCTA />}

        <div className={styles.bar}>
          <motion.span
            className={styles.rule}
            variants={lineDraw}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            aria-hidden="true"
          />
          <p className={styles.copy}>
            © {YEAR} {site.name}
          </p>
          <ul className={styles.socials} aria-label="Elsewhere">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a className={styles.link} href={social.href} target="_blank" rel="noopener noreferrer">
                  <ScrambleText text={social.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
