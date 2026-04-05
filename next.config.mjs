/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables Turbopack optimizations internally when using --turbo
  reactStrictMode: true,
  experimental: {
    // Automatically optimizes heavy imports like framer-motion and lucide-react
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
