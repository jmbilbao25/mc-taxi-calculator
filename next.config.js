/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  }
}

module.exports = nextConfig
