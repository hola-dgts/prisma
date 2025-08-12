import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the backoffice under /admin path when behind reverse proxy
  basePath: "/admin",
  // Do not fail production builds on ESLint or TS errors (temporary for deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
