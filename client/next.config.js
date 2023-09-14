/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Match any API route
        destination: "http://localhost:8000/api/:path*", // Proxy to your API server
      },
    ];
  },
};

module.exports = nextConfig;
