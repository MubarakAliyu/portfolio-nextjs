// SoundProvider + useSound(): the on/off preference (saved to localStorage.sound)
// and play(). Sounds are also declarative, like the cursor:
//   data-sound="pop"          plays on pointer down (every a/button gets "click")
//   data-sound-hover="hover"  plays on pointer enter (every a/button gets "hover")
//   data-sound="none"         silences an element (use when it plays its own sound)
//   data-sound-to="light"     passed to the "toggle" sound as its direction
// Nothing plays until the visitor opts in, while the tab is hidden, or as a hover on touch.
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { play as playSound, unlock } from "./engine";
import { TOUCH_QUERY } from "@/hooks/useIsTouch";

const KEY = "sound";
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], [role="radio"], summary';
const listeners = new Set();
let current = null; // null = not read yet

function read() {
  if (current === null) {
    try {
      current = localStorage.getItem(KEY) === "on";
    } catch {
      current = false;
    }
  }
  return current;
}

function write(value) {
  current = value;
  try {
    localStorage.setItem(KEY, value ? "on" : "off");
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// Has the visitor already chosen sound on or off (in any past visit)?
export function hasSoundChoice() {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

const SoundContext = createContext({ enabled: false, setEnabled: () => {}, play: () => {} });

export function SoundProvider({ children }) {
  const enabled = useSyncExternalStore(subscribe, read, () => false);

  // Turning sound on must happen inside a click so the browser lets audio start.
  const setEnabled = useCallback((value) => {
    if (value) unlock();
    write(Boolean(value));
  }, []);

  const play = useCallback((name, opts) => {
    if (!read() || document.hidden) return;
    if (name === "hover" && window.matchMedia(TOUCH_QUERY).matches) return;
    playSound(name, opts);
  }, []);

  useEffect(() => {
    // A returning visitor with sound on: start audio on their first gesture.
    const wake = () => read() && unlock();

    const onDown = (e) => {
      wake();
      const el = e.target instanceof Element ? e.target : null;
      const tagged = el?.closest("[data-sound]");
      if (tagged) {
        const name = tagged.getAttribute("data-sound");
        if (name !== "none") play(name, { to: tagged.getAttribute("data-sound-to") ?? undefined });
      } else if (el?.closest(INTERACTIVE)) {
        play("click");
      }
    };

    // pointerenter doesn't bubble, but the capture phase still sees each element entered.
    const onEnter = (e) => {
      if (e.pointerType === "touch") return;
      const el = e.target;
      if (!(el instanceof Element)) return;
      // An explicit data-sound-hover wins; otherwise interactive elements get "hover"
      // unless data-sound="none" silences them.
      const explicit = el.getAttribute("data-sound-hover");
      const name = explicit ?? (el.getAttribute("data-sound") !== "none" && el.matches(INTERACTIVE) ? "hover" : null);
      if (name && name !== "none") play(name);
    };

    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", wake, true);
    document.addEventListener("pointerenter", onEnter, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", wake, true);
      document.removeEventListener("pointerenter", onEnter, true);
    };
  }, [play]);

  const value = useMemo(() => ({ enabled, setEnabled, play }), [enabled, setEnabled, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = () => useContext(SoundContext);
