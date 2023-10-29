/**
 * @type {import('next').NextConfig}
 */
const config = {
  webpack: (config) => {
    return config;
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
};

module.exports = config;
