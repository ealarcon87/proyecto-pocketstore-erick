const STATIC_CACHE = "pocketstore-autos-static-v1";
const DATA_CACHE = "pocketstore-autos-data-v1";
const IMAGE_CACHE = "pocketstore-autos-images-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const API_URL = "https://dummyjson.com/products/category/vehicle";

self.addEventListener("install", event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  const validCaches = [STATIC_CACHE, DATA_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(name => !validCaches.includes(name)).map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.url === API_URL) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (request.method === "GET") {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    if (request.mode === "navigate") return caches.match("./index.html");
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}
