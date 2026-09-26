import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The dev-only route indicator badge sits over the design and, in Next 16.3,
  // throws a harmless "reading 'components'" error on Pages Router hydration.
  devIndicators: false,
  // This folder sits inside other npm projects; pin the workspace root to it.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    // AVIF first, WebP for anything that can't take it.
    formats: ["image/avif", "image/webp"],
    // Optimised images are keyed by source URL + width + quality, and our
    // images only change by being replaced with a new file, so they can be
    // cached for a year. Replacing an image in place means giving it a new
    // filename (see PROJECT-MEDIA-GUIDE.md) or the old one is served until the
    // cache expires.
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        // The optimiser takes its max-age from the upstream file, so the source
        // images need the long TTL too — otherwise every visit revalidates.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
