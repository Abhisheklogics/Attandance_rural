import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  additionalManifestEntries: [
    // sabhi model files exact file names ke saath
    { url: '/models/face_recognition_model-shard1', revision: null },
    { url: '/models/face_recognition_model-weights_manifest.json', revision: null },
    { url: '/models/face_landmark_68_model-shard1', revision: null },
    { url: '/models/face_landmark_68_model-weights_manifest.json', revision: null },
    { url: '/models/tiny_face_detector_model-shard1', revision: null },
    { url: '/models/tiny_face_detector_model-weights_manifest.json', revision: null },
      { url: 'models/age_gender_model-shard1', revision: null },
        { url: 'public/models/age_gender_model-weights_manifest.json', revision: null },
        { url: 'public/models/face_expression_model-shard1', revision: null },
           { url: 'public/models/face_expression_model-weights_manifest.json', revision: null },
            { url: 'app/admin', revision: null },
           { url: 'app/studentFace', revision: null },
           { url: 'app/studentFace', revision: null },
  ],
  runtimeCaching: [
    {
      urlPattern: /^\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
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
