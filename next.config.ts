/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary with subdomains (like res.cloudinary.com)
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
      // Cloudinary without subdomain (cloudinary.com)
      {
        protocol: "https",
        hostname: "cloudinary.com",
        pathname: "/**",
      },
      // Placeholder images
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeholder.com",
        pathname: "/**",
      },
      // Example domains
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
