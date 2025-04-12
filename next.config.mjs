/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Commented out experimental features that might cause chunk loading errors
  // experimental: {
  //   webpackBuildWorker: true,
  //   parallelServerBuildTraces: true,
  //   parallelServerCompiles: true,
  // },
  // Explicitly set the page extensions to help Next.js find the right files
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Allow both App Router and Pages Router to coexist
  reactStrictMode: true,
  // Increase timeout for builds
  staticPageGenerationTimeout: 180,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
}

export default nextConfig
