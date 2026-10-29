import type { NextConfig } from "next";

// Static export for GitHub Pages. The site lives under /<repo>, so the deploy
// workflow sets PAGES_BASE_PATH; local dev runs at the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
