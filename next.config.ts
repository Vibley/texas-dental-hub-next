import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ FIX for mobile access (VERY IMPORTANT)
  allowedDevOrigins: ['192.168.12.64'],
};

export default nextConfig;