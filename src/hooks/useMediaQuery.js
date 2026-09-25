// Subscribes to a CSS media query. The server (and the first client render)
// use `serverValue`, so there's no hydration mismatch.
import { useCallback, useSyncExternalStore } from "react";

export default function useMediaQuery(query, serverValue = false) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}
