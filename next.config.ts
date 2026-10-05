import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages sets this flag; local verification uses the same export config.
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  images: {
    formats: ['image/webp'],
    unoptimized: true,
  },
};

export default nextConfig;
