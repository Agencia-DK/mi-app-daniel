import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.GITHUB_ACTIONS ? '/mi-app-daniel' : undefined,
};

export default nextConfig;
