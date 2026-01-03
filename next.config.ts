// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
        pathname: '/**',
      },
      // Add other domains your app uses
    ],
  },
}

module.exports = nextConfig