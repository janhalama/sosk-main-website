import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/akce",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/admin/config.yml",
        destination: "/api/admin/config",
      },
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
