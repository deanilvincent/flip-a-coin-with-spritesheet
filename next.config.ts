import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://flipacoin.dnilvincent.net/coins/**")],
  },
};

export default nextConfig;
