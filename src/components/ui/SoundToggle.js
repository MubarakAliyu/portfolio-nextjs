// SoundToggle: 36px round button with four tiny equaliser bars. The bars
// dance while sound is on and rest as dots when it's off.
import clsx from "clsx";
import { useSound } from "@/lib/sound/SoundProvider";
import styles from "@/styles/SoundToggle.module.css";

export default function SoundToggle({ className }) {
  const { enabled, setEnabled, play } = useSound();

  // Play the toggle while sound is still on (turning off) or right after it's on.
  const toggle = () => {
    if (enabled) {
      play("toggle", { to: "off" });
      setEnabled(false);
    } else {
      setEnabled(true);
      play("toggle", { to: "on" });
    }
  };

  return (
    <button
      type="button"
      className={clsx(styles.toggle, enabled && styles.on, className)}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label="Sound"
      title={enabled ? "Sound on" : "Sound off"}
      data-sound="none"
      data-sound-hover="hover"
      data-cursor="label"
      data-cursor-label="Sound"
    >
      <span className={styles.bars} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
