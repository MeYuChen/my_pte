const CACHE_NAME = "pte-we-static-v37-sst-54";
const IMAGE_CACHE_NAME = "pte-we-images-v8";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20261005-25",
  "./practice-data.js?v=20261005-25",
  "./translations.js?v=20261005-25",
  "./learning-paths.js?v=20261005-25",
  "./wfd-data.js?v=20261005-25",
  "./app.js?v=20261005-25",
  "./reading.html",
  "./reading.css",
  "./reading-core.js",
  "./reading-data.js",
  "./reading-method-guides.js",
  "./reading-explanations.js",
  "./reading-collocations.js",
  "./reading-study.js",
  "./reading.js",
  "./sst.html",
  "./sst.css?v=20261007-2",
  "./sst-data.js?v=20261007-2",
  "./sst.js?v=20261007-2"
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
