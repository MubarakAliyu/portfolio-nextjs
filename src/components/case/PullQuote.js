// PullQuote: the Challenge / Solution statements as big SkyBoxed quotes, with
// the *starred* phrases in red, revealed word by word.
import SplitWords from "@/components/ui/SplitWords";
import { accentSegments } from "@/lib/richText";
import styles from "@/styles/PullQuote.module.css";

export default function PullQuote({ id, label, text }) {
  return (
    <section id={id} className={styles.section}>
      <p className={styles.eyebrow}>({label})</p>
      <SplitWords as="blockquote" segments={accentSegments(text)} className={styles.quote} each={0.025} amount={0.2} />
    </section>
  );
}
