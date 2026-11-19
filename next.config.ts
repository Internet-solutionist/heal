import type { NextConfig } from "next";
import { siteBasePath } from "./lib/site";

const basePath = siteBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
