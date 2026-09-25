// SiteShowcase: the live site in a browser frame (plus a phone frame beside it
// on desktop). Hover and the full-page screenshots scroll themselves top to
// bottom; on touch you scroll them with a finger. Clicking opens the live site.
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { blurProps } from "@/lib/media";
import useReducedMotion from "@/hooks/useReducedMotion";
import styles from "@/styles/SiteShowcase.module.css";

function Frame({ href, children, className, style }) {
  const props = { className, style, "data-cursor": "label", "data-cursor-label": "Visit site" };
  return href ? (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" aria-label="Visit the live site (opens in a new tab)" {...props}>
      {children}
    </motion.a>
  ) : (
    <motion.div {...props}>{children}</motion.div>
  );
}

export default function SiteShowcase({ project }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { desktop, mobile } = project.media.screens;
  const live = project.links?.live;
  const domain = live ? new URL(live).hostname.replace(/^www\./, "") : project.title;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const browserY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [140, -120]);

  return (
    <section ref={ref} className={styles.section} aria-label="Live site">
      <p className={styles.eyebrow}>(Live site)</p>
      <div className={styles.stage}>
        <Frame href={live} className={styles.browser} style={reduced ? undefined : { y: browserY }}>
          <div className={styles.bar} aria-hidden="true">
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.url}>{domain}</span>
            <svg className={styles.reload} viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5V5h-2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.screen}>
            <Image
              src={desktop.src}
              alt={`${project.title} website, full page on desktop`}
              width={desktop.width}
              height={desktop.height}
              sizes="(max-width: 1023px) 100vw, 62vw"
              className={styles.shot}
              {...blurProps(desktop)}
            />
          </div>
        </Frame>

        {mobile && (
          <Frame href={live} className={styles.phone} style={reduced ? undefined : { y: phoneY }}>
            <span className={styles.notch} aria-hidden="true" />
            <div className={styles.phoneScreen}>
              <Image
                src={mobile.src}
                alt={`${project.title} website on a phone`}
                width={mobile.width}
                height={mobile.height}
                sizes="280px"
                className={styles.shot}
                {...blurProps(mobile)}
              />
            </div>
          </Frame>
        )}
      </div>
      {live && <p className={styles.hint}>Hover to scroll · Click to visit {domain} ↗</p>}
    </section>
  );
}
