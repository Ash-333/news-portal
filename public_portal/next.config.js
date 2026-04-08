/** @type {import('next').NextConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
const apiHostname = process.env.NEXT_PUBLIC_API_HOSTNAME || '';

// Build-time validation for production
if (process.env.NODE_ENV === 'production' && (!siteUrl || siteUrl.includes('yoursite.com'))) {
  console.warn(
    '\x1b[33m[WARNING]\x1b[0m NEXT_PUBLIC_SITE_URL is not set or still uses "yoursite.com". ' +
    'SEO features (sitemaps, canonical URLs, JSON-LD, OpenGraph) will be misconfigured. ' +
    'Set NEXT_PUBLIC_SITE_URL to your production domain (e.g., https://yoursite.com).'
  );
}

const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      ...(apiHostname
        ? [
            {
              protocol: 'https',
              hostname: apiHostname,
              pathname: '/uploads/**',
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3000'}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
