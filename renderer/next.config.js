const config = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      //config.target = 'electron-renderer'
    }
    return config
  },
  images: {
    unoptimized: true,
  }
}

if (process.env.NODE_ENV === 'production') {
	config.output = 'export'
	config.distDir = '../app'
}

module.exports = config
