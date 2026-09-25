// NdaMosaic: stands in for the gallery on confidential projects: a blurred
// mosaic of the brand colours with a card offering a walkthrough on a call.
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";
import { blurProps } from "@/lib/media";
import Button from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/StatusBadge";
import styles from "@/styles/NdaMosaic.module.css";

const TILES = 8;

export default function NdaMosaic({ project }) {
  const colors = project.palette?.length ? project.palette : [project.accent];
  const cover = project.media.cover;

  return (
    <section id="access" className={styles.section} aria-label="Confidential work">
      <div className={styles.mosaic} aria-hidden="true">
        {Array.from({ length: TILES }, (_, i) =>
          i % 3 === 1 ? (
            <div key={i} className={styles.tile}>
              <Image src={cover.src} alt="" fill sizes="30vw" className={styles.tileImg} {...blurProps(cover)} />
            </div>
          ) : (
            <div key={i} className={styles.tile} style={{ background: colors[i % colors.length] }} />
          )
        )}
      </div>
      <motion.div className={styles.card} variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
        <span className={styles.lock}>
          <LockIcon size={18} />
        </span>
        <p className={styles.text}>This project is under NDA. Happy to walk you through it on a call.</p>
        <Button variant="solid" href={`/contact?subject=${encodeURIComponent(project.title)}`} arrow>
          Request access
        </Button>
      </motion.div>
    </section>
  );
}
