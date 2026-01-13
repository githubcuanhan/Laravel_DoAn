import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: 'http://127.0.0.1:8000/api',
  },
  reactCompiler: true,
};

export default nextConfig;
