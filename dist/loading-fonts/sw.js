var version = 1;
var cacheName = 'static-' + version;

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});

function isFontRequest(request) {
    return /fonts\//.test(request.url);
}

self.addEventListener('fetch', function(event) {
    // If this is a request for font file
    if (isFontRequest(event.request)) {
        caches.open(cacheName).then(function(cache) {
            // Respond with cached copy or fetch and cache
            event.respondWith(
                cache.match(event.request).then(function(response) {
                    return response || fetch(event.request).then(function(response) {
                        // Was first request for font
                        // Cache for subsquent page load
                        if (response.status == 200) {
                            cache.put(event.request, response.clone());
                        }
                        // Fail fast
                        // Return no content avaliable.
                        return new Response('', {
                            status: 204,
                            statusText: 'No cached content available.'
                        });
                    });
                })
            );
        });
    }
});
