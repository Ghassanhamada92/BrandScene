/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'brandscene.ai', 'oaidalleapiprodscus.blob.core.windows.net', 'images.pexels.com'],
  },
};

module.exports = nextConfig;
