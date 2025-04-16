import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactive les source maps en production
  productionBrowserSourceMaps: false,

  // Configuration des images
  images: {
    // Domaines autorisés pour l'optimisation des images Next.js
    domains: [
      'res.cloudinary.com',
      'res.cloudinary.com/daxjxq9ps',
      'localhost'
    ],
    // Formats modernes
    formats: ['image/avif', 'image/webp'],
    // Tailles d'images prédéfinies
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  //Desactive les sources maps en dev
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /@prisma\/client/ }];

    // Configuration supplémentaire pour les assets
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource'
    })

    return config

  },

  // Headers de sécurité (optionnel mais recommandé)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
