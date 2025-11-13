/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'maps.googleapis.com',
      'drive.google.com',
      'content.googleapis.com',
    ],
  },
};

module.exports = nextConfig;
