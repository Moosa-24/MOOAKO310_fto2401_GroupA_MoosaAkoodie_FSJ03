/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com', // Your current domain
        port: '', // Leave this empty for default
        pathname: '/**', // Matches any path
      },
    ],
  },
};

export default nextConfig;
