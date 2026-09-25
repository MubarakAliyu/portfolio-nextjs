// BrandPalette: colour swatches as tall strips that widen on hover to show
// their hex; click one to copy it. Typefaces are listed as simple specimens
// (no extra webfonts are loaded, so they show in a fallback face).
import { motion } from "framer-motion";
import { useSound } from "@/lib/sound/SoundProvider";
import { toast } from "@/lib/toast";
import { ease } from "@/lib/motion";
import styles from "@/styles/BrandPalette.module.css";

// Dark text on light swatches, light text on dark ones.
function inkFor(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#131315" : "#ffffff";
}

export default function BrandPalette({ palette = [], typefaces = [] }) {
  const { play } = useSound();

  const copy = async (hex, e) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Clipboard can be blocked; the toast still shows the value.
    }
    play("copy");
    toast(`Copied ${hex}`, { x: e.clientX, y: e.clientY });
  };

  return (
    <section className={styles.section} aria-label="Brand palette and type">
      <p className={styles.eyebrow}>(Palette{typefaces.length ? " & type" : ""})</p>

      {palette.length > 0 && (
        <div className={styles.swatches}>
          {palette.map((hex, i) => (
            <motion.button
              key={hex}
              type="button"
              className={styles.swatch}
              style={{ backgroundColor: hex, color: inkFor(hex) }}
              onClick={(e) => copy(hex.toUpperCase(), e)}
              aria-label={`Copy ${hex.toUpperCase()}`}
              data-sound="none"
              data-sound-hover="hover"
              data-cursor="label"
              data-cursor-label="Copy"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease, delay: i * 0.08 }}
            >
              <span className={styles.hex}>{hex.toUpperCase()}</span>
            </motion.button>
          ))}
        </div>
      )}

      {typefaces.length > 0 && (
        <ul className={styles.type}>
          {typefaces.map((face) => (
            <li key={face}>
              <span className={styles.specimen} style={{ fontFamily: `"${face}", var(--font-sans)` }}>
                Aa
              </span>
              <span className={styles.face}>{face}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
