// BigEmail: the address on one giant line. Hover scrambles it and turns it
// red; click copies it with a "Copied ✓" that floats up from the cursor.
import { useState } from "react";
import { site } from "@/data/site";
import { useSound } from "@/lib/sound/SoundProvider";
import { toast } from "@/lib/toast";
import ScrambleText from "@/components/ui/ScrambleText";
import styles from "@/styles/BigEmail.module.css";

export default function BigEmail() {
  const { play } = useSound();
  const [hovered, setHovered] = useState(0);

  const copy = async (e) => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // Clipboard blocked: the toast still confirms the address.
    }
    play("copy");
    toast("Copied ✓", { x: e.clientX, y: e.clientY });
  };

  return (
    <section className={`container ${styles.section}`} aria-label="Email">
      <button
        type="button"
        className={styles.email}
        onClick={copy}
        onMouseEnter={() => setHovered((n) => n + 1)}
        aria-label={`Copy ${site.email}`}
        data-cursor="label"
        data-cursor-label="Copy"
        data-sound="none"
        data-sound-hover="hover"
      >
        <ScrambleText text={site.email} duration={450} active={hovered} hover={false} />
      </button>
      <a className={styles.mail} href={`mailto:${site.email}`}>
        Open mail app <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
