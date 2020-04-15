// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "/offline.html",
  "/js/colorwheel.js",
  "/js/main.js",
  "/js/raphael-min.js",
  "/css/main.css",
  "/img/48.png",
  "/img/57.png",
  "/img/60.png",
  "/img/96.png",
  "/img/128.png",
  "/img/144.png",
  "/img/152.png",
  "/img/192.png",
  "/img/256.png",
  "/img/512.png",
  "/img/crea.webp",
  "/img/estudio.webp",
  "/img/nat.webp",
  "/img/romance.webp",
  "/img/sensu.webp",
  "/img/sled.webp",
  "/img/tranqui.webp"
];

self.addEventListener("install", evt => {
  //console.log("[ServiceWorker] Install");
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      //console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  //console.log("[ServiceWorker] Activate");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
           // console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", evt => {
 // console.log("[ServiceWorker] Fetch", evt.request.url);
  // CODELAB: Add fetch event handler here.
  if (evt.request.mode !== "navigate") {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match("offline.html");
      });
    })
  );
});
