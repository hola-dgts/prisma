import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the backoffice under /admin path when behind reverse proxy
  basePath: "/admin",
};

export default nextConfig;
