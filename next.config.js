/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Disable telemetry
  telemetry: false,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // Experimental features
  experimental: {
    // Enable app directory
    appDir: true,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Custom webpack config if needed
    return config;
  },
};

module.exports = nextConfig;
