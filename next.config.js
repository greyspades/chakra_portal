/** @type {import('next').NextConfig} */
const JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
  webpack: (config, { buildId, dev }) => {
    if (!dev) {
      config.plugins.push(new JavaScriptObfuscator ({
        rotateUnicodeArray: true
      }))
    }

    return config
  }
}

module.exports = {
  async rewrites() {
		return [
			{
				source: '/api/create',
				destination: 'http://localhost:5048/api/Candidate/create',
			},
		]
	},
}


const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  staticPageGenerationTimeout: 150,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
