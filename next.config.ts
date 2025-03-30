import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  /* config options here */
  basePath: '/my-resume',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
