import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_API_BASE_URL: "http://192.168.0.70:8000"
  },
};

export default nextConfig;
