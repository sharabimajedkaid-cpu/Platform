/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: { domains: ['storage.britishce44.edu', 'avatars.britishce44.edu'] },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${process.env.API_GATEWAY_URL || 'http://localhost:3000'}/api/:path*` },
      { source: '/socket.io/:path*', destination: `${process.env.WS_URL || 'http://localhost:3002'}/socket.io/:path*` },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, '@': __dirname + '/src' };
    return config;
  },
};

module.exports = nextConfig;
