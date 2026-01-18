import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle next-mdx-remote with Turbopack
  serverExternalPackages: ['next-mdx-remote'],
};

export default nextConfig;
