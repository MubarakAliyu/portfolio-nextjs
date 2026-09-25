// NextProject: a full-width link to the next case study. On hover the title
// turns red and the next cover fades in behind it with a slow zoom.
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { blurProps } from "@/lib/media";
import styles from "@/styles/NextProject.module.css";

export default function NextProject({ next }) {
  const locked = next.status === "confidential";
  return (
    <Link
      href={`/projects/${next.slug}`}
      scroll={false}
      className={clsx(styles.next, locked && styles.locked)}
      data-cursor="label"
      data-cursor-label="Next"
      data-sound="none"
      data-sound-hover="hover"
    >
      <span className={styles.bg} aria-hidden="true">
        <Image src={next.cover.src} alt="" fill sizes="100vw" className={styles.img} {...blurProps(next.cover)} />
      </span>
      <span className={`container ${styles.inner}`}>
        <span className={styles.label}>Next project</span>
        <span className={styles.title}>
          {next.title}
          <span className="accent">.</span>
        </span>
        <span className={styles.meta}>
          {next.category} · {next.year}
        </span>
      </span>
    </Link>
  );
}
