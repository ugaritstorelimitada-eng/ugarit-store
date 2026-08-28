import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
