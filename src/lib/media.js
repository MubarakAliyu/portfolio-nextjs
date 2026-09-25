// Helpers for images described in media.generated.json / life.generated.json.
import life from "@/data/life.generated.json";

// A life photo with its real size and blur preview (for next/image + the lightbox).
export const photo = (src, extra) => ({ ...(life[src] ?? { src, width: 1200, height: 1600 }), ...extra });

// next/image props for the blur-up placeholder, when a blurDataURL exists.
export const blurProps = (img) => (img?.blurDataURL ? { placeholder: "blur", blurDataURL: img.blurDataURL } : {});

// Seeded pseudo-random number in [0, 1) so layouts stay identical on server
// and client (and lint-safe: no Math.random() during render).
export function seeded(n) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
