/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle web workers
    config.module.rules.push({
      test: /\.ts$/,
      include: [/workers/],
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig; 