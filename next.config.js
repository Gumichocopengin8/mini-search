/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

module.exports = nextConfig;
