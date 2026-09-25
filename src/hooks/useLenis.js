// Lenis smooth scrolling for mouse/trackpad users. Touch devices and
// reduced-motion visitors keep native scroll. getLenis() exposes the instance
// so other components can scroll to the top or pause scrolling.
import { useEffect } from "react";
import Lenis from "lenis";
import { TOUCH_QUERY } from "./useIsTouch";
import { REDUCED_MOTION_QUERY } from "./useReducedMotion";

let instance = null;

export const getLenis = () => instance;

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export default function useLenis() {
  useEffect(() => {
    const skip =
      window.matchMedia(TOUCH_QUERY).matches || window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (skip) return undefined;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: true });
    instance = lenis;
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);
}
