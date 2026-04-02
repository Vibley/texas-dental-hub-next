import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Fix for mobile dev access
  allowedDevOrigins: ['192.168.12.64'],

  async redirects() {
    return [
      // 👉 Force HTTPS
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://texasdentalhub.com/:path*',
        permanent: true,
      },

      // 👉 Force non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.texasdentalhub.com',
          },
        ],
        destination: 'https://texasdentalhub.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;