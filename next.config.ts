import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  env: {
    GIPHY_TOKEN: process.env.GIPHY_TOKEN,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/wikipedia',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
