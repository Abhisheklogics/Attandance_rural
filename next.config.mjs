import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,

  // Precache files (app shell + models)
  additionalManifestEntries: [
    { url: '/models/face_recognition_model-shard1.bin', revision: '1' },
    { url: '/models/face_recognition_model-weights_manifest.json', revision: '1' },
    { url: '/models/face_landmark_68_model-shard1.bin', revision: '1' },
    { url: '/models/face_landmark_68_model-weights_manifest.json', revision: '1' },
    { url: '/models/tiny_face_detector_model-shard1.bin', revision: '1' },
    { url: '/models/tiny_face_detector_model-weights_manifest.json', revision: '1' },
    { url: '/models/age_gender_model-shard1.bin', revision: '1' },
    { url: '/models/age_gender_model-weights_manifest.json', revision: '1' },
    { url: '/models/face_expression_model-shard1.bin', revision: '1' },
    { url: '/models/face_expression_model-weights_manifest.json', revision: '1' },
    // app shell routes
    { url: '/app/admin', revision: '1' },
    { url: '/app/studentFace', revision: '1' },
  ],

  runtimeCaching: [
    // HTML & API pages
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
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // face-api model files (bin/json)
    {
      urlPattern: /\/models\/.*\.(json|bin)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'models',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // Static images
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});




const nextConfig = {
  reactStrictMode: true,
  
  i18n: {
    locales: ["en", "hi", "pa", "ur", "ta","gu", "ks"], 
    defaultLocale: "en",
  },
};

export default withPWA(nextConfig);
