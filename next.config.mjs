import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // face-api.js models ko cache karega
      urlPattern: /^\/models\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "face-api-models",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // external images ko cache karega
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: { cacheName: "images" },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
};

export default withPWA(nextConfig);
