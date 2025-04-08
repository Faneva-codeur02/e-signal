import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  //Desactive les sources maps en dev
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /@prisma\/client/ }];
    return config;
  },
};

export default nextConfig;
