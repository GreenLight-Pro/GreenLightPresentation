/**
 * @type {import('next').NextConfig}
 */
const config = {
  webpack: (config, { isServer }) => {
    return config
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone'
}

module.exports = config;
