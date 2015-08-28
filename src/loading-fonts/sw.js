var version = 1;
var cacheName = 'static-' + version;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                'http://fonts.ft.com/serif',
                'http://fonts.ft.com/sans-serif'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    // If this is a request for font file
    if (/fonts\.ft\.com/.test(event.request)) {
      // If a match isn't found in the cache, the response
      // will look like a connection error
      event.respondWith(caches.match(event.request));
    }
});
