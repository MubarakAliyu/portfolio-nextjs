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
};

export default nextConfig;
