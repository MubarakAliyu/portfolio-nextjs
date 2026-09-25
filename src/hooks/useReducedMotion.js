// True when the visitor asked the OS for reduced motion.
import useMediaQuery from "./useMediaQuery";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function useReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY, false);
}
