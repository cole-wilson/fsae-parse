// FROM https://developers.google.com/codelabs/pwa-training/pwa03--going-offline#3
//
//
//
//
//
//
const cacheName = 'cache-v1';
const precacheResources = [
	'/booklet.js',
	'/leaflet.js',
	'/index.html',
	'/images/marker-icon-2x.png',
	'/gauge.js',
	'/booklet.css',
	'/main.js',
	'/leaflet.hotline.min.js',
	'/github.js',
	'/leaflet.css',
	'/vue.js',
	'/tabulator.js',
	'/style.css',
	'/manifest.json',
	'/plotly.js',
	'/turf.js',
	'/tabulator.css'
]

self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
