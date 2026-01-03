/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Placeholder images
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com',
        pathname: '/**',
      },
      // Example domains from your data
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      // Cloudinary other subdomains
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig