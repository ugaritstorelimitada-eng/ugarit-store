import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ESLint se ejecuta en CI, no en build de Vercel (monorepo)
  eslint: { ignoreDuringBuilds: true },
  // Alias @/ para que funcione cuando se build desde la raíz del monorepo
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
  // Permitir imágenes desde WordPress actual (migración gradual) y Medusa/R2
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ugarit.cl",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.medusajs.dev",
      },
    ],
  },
  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // Transbank SDK usa transbank-sdk-node en el backend, no acá
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
