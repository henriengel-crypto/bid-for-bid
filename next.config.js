/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  eslint: {
    // ESLint-advarsler stopper ikke Vercel-bygget
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
