/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' uniquement pour le build APK (GitHub Actions), pas sur Vercel
  ...(process.env.BUILD_TARGET === 'apk' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
