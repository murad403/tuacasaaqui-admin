import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.12.18",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.10.12.18",
        port: "7000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
