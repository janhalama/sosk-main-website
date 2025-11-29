import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // CMS OAuth endpoints at base_url root
      {
        source: "/auth",
        destination: "/api/cms/auth",
      },
      {
        source: "/callback",
        destination: "/api/cms/callback",
      },
    ];
  },
};

export default nextConfig;
