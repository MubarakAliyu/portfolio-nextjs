// True on touch / coarse-pointer devices. Defaults to true on the server so
// desktop-only extras (custom cursor, tilt, magnetic pull) mount after hydration.
import useMediaQuery from "./useMediaQuery";

export const TOUCH_QUERY = "(hover: none), (pointer: coarse)";

export default function useIsTouch() {
  return useMediaQuery(TOUCH_QUERY, true);
}
