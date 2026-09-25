// Current viewport size as { width, height }, updated on resize (client only).
import { useMemo, useSyncExternalStore } from "react";

const subscribe = (onChange) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const getSize = () => `${window.innerWidth}x${window.innerHeight}`;
const getServerSize = () => "1440x900";

export default function useViewport() {
  const size = useSyncExternalStore(subscribe, getSize, getServerSize);
  return useMemo(() => {
    const [width, height] = size.split("x").map(Number);
    return { width, height };
  }, [size]);
}
