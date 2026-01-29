import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 120,
  experimental: {
    optimizePackageImports: ["@/"],
  },
};

export default nextConfig;
