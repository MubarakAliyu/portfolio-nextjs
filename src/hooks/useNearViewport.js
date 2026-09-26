import { useEffect, useState } from "react";

// True once the element is within `rootMargin` of the viewport. Native lazy
// loading only fires a few hundred pixels out, which on a slow connection means
// the image is still blank when it arrives on screen; this starts it earlier.
export default function useNearViewport(ref, enabled = true, rootMargin = "1200px 0px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || near) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled, near, rootMargin]);

  return near;
}
