// Story: three paragraphs that light up word by word as you scroll, beside a
// sticky "01 / Story" label.
import ScrollWords from "@/components/ui/ScrollWords";
import { story } from "@/data/about";
import styles from "@/styles/Story.module.css";

export default function Story() {
  return (
    <section className={`container ${styles.section}`}>
      <p className={styles.label}>
        <span>01</span> / Story
      </p>
      <ScrollWords paragraphs={story.map((text) => [{ text }])} className={styles.text} offset={["start 0.8", "end 0.45"]} />
    </section>
  );
}
