/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the hardcoded API key from here since we're using environment variables
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
