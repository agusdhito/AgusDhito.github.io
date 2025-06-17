import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // UNCOMMENT THIS IF YOU WANT TO CREATE OUTPUT STATIC FILES
  // output: 'export',
  // distDir: 'dist',

};
module.exports = {
  images: {
    formats: ['image/webp'],
  },
}

export default nextConfig;
