/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async headers() {
    const corsAllowedOrigin =
      process.env.CORS_ALLOWED_ORIGIN?.trim() || "http://localhost:3001";

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: corsAllowedOrigin },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http", // or 'http' if needed
        hostname: "localhost",
        // Optional: be more restrictive
        // pathname: '/images/**',   // only allow specific paths
        // port: '',                // if needed
      },
      {
        protocol: "https",
        hostname: "another-domain.com",
      },
      // Add all the hostnames you were using in domains here
    ],
  },
};

module.exports = nextConfig;
