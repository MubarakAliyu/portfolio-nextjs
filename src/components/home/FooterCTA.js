// FooterCTA: the giant "LET'S BUILD / SOMETHING / THAT MATTERS" email link.
// On hover the heading turns red, the red square fades, and the cursor
// becomes a "WRITE TO ME" disc. Each line slides up from its mask on scroll.
import { Fragment } from "react";
import { site } from "@/data/site";
import RevealText from "@/components/ui/RevealText";
import styles from "@/styles/FooterCTA.module.css";

export default function FooterCTA() {
  const lines = [
    "Let's build",
    "something",
    <Fragment key="last">
      that matters
      <span className={styles.square} aria-hidden="true" />
    </Fragment>,
  ];

  return (
    <a
      href={`mailto:${site.email}`}
      className={styles.cta}
      data-cursor="label"
      data-cursor-label="Write to me"
      aria-label={`Let's build something that matters. Email ${site.email}`}
    >
      <RevealText as="h2" lines={lines} className={styles.heading} each={0.1} amount={0.4} />
    </a>
  );
}
