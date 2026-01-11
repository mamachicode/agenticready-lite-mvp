/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false
  },
  webpack(config) {
    config.resolve.alias["@"] = require("path").resolve(__dirname);
    return config;
  }
};
module.exports = nextConfig;
