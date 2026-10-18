const CACHE_NAME = "pte-we-static-v50-sst-release";
const IMAGE_CACHE_NAME = "pte-we-images-v9";
const SST_IMAGE_ASSETS = Array.from({ length: 54 }, (_, index) => `./images/sst/S${String(index + 1).padStart(3, "0")}.webp`);
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20261009-26",
  "./practice-data.js?v=20261009-26",
  "./translations.js?v=20261009-26",
  "./learning-paths.js?v=20261009-26",
  "./wfd-data.js?v=20261009-26",
  "./app.js?v=20261009-26",
  "./reading.html",
  "./reading.css",
  "./reading-core.js",
  "./reading-data.js",
  "./reading-variants.js",
  "./reading-method-guides.js",
  "./reading-explanations.js",
  "./reading-collocations.js",
  "./reading-collocation-examples.js",
  "./reading-collocation-example-translations.js",
  "./reading-collocation-tiers.js",
  "./reading-curriculum.js",
  "./reading-study.js",
  "./reading-recognition.js",
  "./reading.js",
  "./sst.html",
  "./sst.css?v=20261018-16",
  "./sst-data.js?v=20261018-16",
  "./sst-unified-data.js?v=20261018-16",
  "./sst-vocab-data.js?v=20261018-16",
  "./sst-vocab.js?v=20261018-16",
  "./sst.js?v=20261018-16",
  ...SST_IMAGE_ASSETS
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== IMAGE_CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Audio requires HTTP byte-range support; do not intercept media requests.
  if (request.destination === "audio" || url.pathname.includes("/assets/sst/mp3/")) return;

  if (url.pathname.includes("/images/")) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME));
    return;
  }

  event.respondWith(networkFirst(request, CACHE_NAME));
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error(`No cached response for ${request.url}`);
  }
}
