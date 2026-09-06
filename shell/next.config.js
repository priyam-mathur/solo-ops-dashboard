module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/weather/:path*',
        destination: 'http://localhost:3001/weather/:path*'
      },
      {
        source: '/todo/:path*',
        destination: 'http://localhost:3002/todo/:path*'
      },
      {
        source: '/notes/:path*',
        destination: 'http://localhost:3003/notes/:path*'
      },
      {
        source: '/analytics/:path*',
        destination: 'http://localhost:3004/analytics/:path*'
      }
    ];
  }
};
