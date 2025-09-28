import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 최적화 설정
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },

  // 리소스 힌트 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  async headers() {
    return [
      {
        // Vercel 도메인에 대한 CORS 헤더 설정
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://food-recipe-front.vercel.app",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};

export default nextConfig;
