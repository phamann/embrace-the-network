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
    // Always fetch response from the network
    event.respondWith(
        fetch(event.request).then(function(response) {
            caches.open(cacheName).then(function(cache) {
                // If we received an error response
                if(response.status >= 500) {
                    cache.match(event.request).then(function(response) {
                        // Return stale version from cache
                        return response;
                    }).catch(function() {
                        // No stale version in cache so return network response
                        return response;
                    });
                } else {
                    // Response was healthy so update cached version
                    cache.put(event.request, response.clone());
                    return response;
                }
            });
        })
    );
});
