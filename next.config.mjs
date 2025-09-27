import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // 🔹 Sabhi Next.js pages ko cache karega
      urlPattern: /^\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 10, // agar 10 sec me response na aaye to cache se serve kare
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // 🔹 Models cache karega (face-api etc.)
      urlPattern: /^\/models\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "face-api-models",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // 🔹 External images cache karega
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  i18n: {
    locales: ["en", "hi", "pa", "ur", "ta"], 
    defaultLocale: "en",
  },
};

export default withPWA(nextConfig);
