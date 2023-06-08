/** @type {import('next').NextConfig} */
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
