/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GIPHY_TOKEN: process.env.GIPHY_TOKEN,
  },
};

module.exports = nextConfig;
