import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: '*.ibb.co' },
    ],
  },
}

export default nextConfig
