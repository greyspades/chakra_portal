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


const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  staticPageGenerationTimeout: 150,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
