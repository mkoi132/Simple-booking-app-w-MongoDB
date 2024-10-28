import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/db/:path*", // Routes matching '/api/db/*'
        destination: "http://localhost:5000/:path*", // Proxy to Express backend
      },
    ];
  },
};

export default nextConfig;
