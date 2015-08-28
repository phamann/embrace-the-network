var version = 1;
var cacheName = 'stale-' + version;

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});

self.addEventListener('fetch', function(event) {
    // Get stale from cache
    event.respondWith(
        caches.open(cacheName).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                // If in cache relvalidate
                var network = fetch(event.request).then(function(response){
                    if(response.status < 400) {
                        cache.put(event.request, response.clone());
                    }
                });
                // Return stale or network if none
                return response || network;
            });
        })
    );
});
